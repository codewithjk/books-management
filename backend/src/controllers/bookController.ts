import { Request, Response } from "express";
import bookModel, { BookDocument } from "../models/book"
import { elasticClient } from "../config/elasticsearch";
import { BookPathParams } from "../types/pathParams";


// Create a new book
export const createBook = async (req: Request<{}, {}>, res: Response) => {
    try {
        console.log("reqest body ==", req.body)
        const { title, author, publicationYear, isbn, description, image_url } = req.body;
        if (!req.file) {
            res.status(400).json({ message: "Image is required." });
        } else {
            const imageUrl = `/uploads/${req.file.filename}`;
            // Save the book to MongoDB
            const newBook = new bookModel({ title, author, publicationYear, isbn, description, image_url: imageUrl });

            const savedBook: BookDocument = await newBook.save();

            console.log("new book == ", savedBook)
            // Index the book in Elasticsearch
            await elasticClient.index({
                index: 'books',
                id: savedBook._id.toString(),
                body: { title, author, publicationYear, isbn, description, image_url: imageUrl },
            });

            res.status(201).json(savedBook);
        }

    } catch (error) {
        console.error("controller error ; ", error)
        res.status(500).json({ message: 'Failed to create book', error });
    }
};

// Retrieve all books
export const getBooks = async (
    req: Request<{}, {}, {}, { page: string; limit: string }>,
    res: Response<{
        books: BookDocument[];
        message: string;
        totalBooks: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
        error?: string;
    }>
) => {
    try {
        const { page = '1', limit = '3' } = req.query;
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);

        const skip = (pageNumber - 1) * pageSize;

        // Fetch the total number of books (for calculating total pages)
        const totalBooks = await bookModel.countDocuments();

        // Fetch books with pagination using skip and limit
        const books = await bookModel.find().skip(skip).limit(pageSize);

        // Calculate total pages
        const totalPages = Math.ceil(totalBooks / pageSize);

        res.status(200).json({
            books,
            message: 'Books retrieved successfully',
            totalBooks,
            totalPages,
            currentPage: pageNumber,
            pageSize,
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to retrieve books',
            error: error.message || 'Unknown error',
            books: [],
            totalBooks: 0,
            totalPages: 0,
            currentPage: 0,
            pageSize: 0
        });
    }
};
// Retrieve a single book by ID
export const getBookById = async (req: Request<BookPathParams>, res: Response) => {
    try {
        const { id } = req.params;
        const book = await bookModel.findById(id);
        if (!book) {
            res.status(404).json({ message: 'Book not found' });
        }
        else {
            res.status(200).json(book);
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve book', error });
    }
};

// Update a book by ID
export const updateBook = async (req: Request<BookPathParams, {}, BookDocument>, res: Response) => {
    try {
        const { id } = req.params;
        const { title, author, publicationYear, isbn, description, image_url } = req.body;
        const updatedBook = await bookModel.findByIdAndUpdate(
            id,
            { title, author, publicationYear, isbn, description, image_url },
            { new: true }
        );
        if (!updatedBook) {
            res.status(404).json({ message: 'Book not found' });
        } else {
            // Update the Elasticsearch index
            await elasticClient.update({
                index: 'books',
                id,
                body: {
                    doc: { title, author, publicationYear, isbn, description, image_url },
                },
            });
            res.status(200).json(updatedBook);
        }
    } catch (error) {

        res.status(500).json({ message: 'Failed to update book', error });
    }
};

// Delete a book by ID
export const deleteBook = async (req: Request<BookPathParams>, res: Response) => {
    try {
        const { id } = req.params;
        const deletedBook = await bookModel.findByIdAndDelete(id);
        if (!deletedBook) {
            res.status(404).json({ message: 'Book not found' });
        } else {
            // Remove the book from Elasticsearch
            await elasticClient.delete({
                index: 'books',
                id,
            });

            res.status(200).json({ message: 'Book deleted successfully' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete book', error });
    }
};


// Search for books
export const searchBooks = async (req: Request<{}, {}, {}, { query: string, page: string, limit: string }>, res: Response<{
    books: BookDocument[], message: string, totalBooks: number, totalPages: number,
    currentPage: number,
    pageSize: number,
    error?: string,
}>) => {
    try {
        const { query, page = "1", limit = "3" } = req.query;

        if (!query) {
            res.status(400).json({
                message: 'Query parameter is required',
                books: [],
                totalBooks: 0,
                totalPages: 0,
                currentPage: 0,
                pageSize: 0
            });
        } else {
            const pageNumber = parseInt(page, 10);
            const pageSize = parseInt(limit, 10);

            const from = (pageNumber - 1) * pageSize;


            const result = await elasticClient.search({
                index: 'books',
                body: {
                    from,
                    size: pageSize,
                    query: {
                        multi_match: {
                            query,
                            fields: ['title', 'author', 'description'],
                        },
                    },
                },
            });

            const books = result.hits.hits.map((hit: any) => ({
                id: hit._id,
                ...hit._source,
            }));

            const totalBooks = result?.hits?.hits.length || 0;
            const totalPages = Math.ceil(totalBooks / pageSize);

            res.status(200).json({
                books,
                totalBooks,
                totalPages,
                currentPage: pageNumber,
                pageSize,
                message: "successfully fetched books"
            });
        }

    } catch (error: any) {
        res.status(500).json({
            message: 'Failed to search books', error: error?.message,
            books: [],
            totalBooks: 0,
            totalPages: 0,
            currentPage: 0,
            pageSize: 0
        });
    }
};