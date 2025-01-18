import { Request, Response } from "express";
import bookModel, { BookDocument } from "../models/book"
import { deleteBookPathParams, getBookPathParams, updateBookPathParams } from "../types/pathParams";
import { elasticClient } from "../config/elasticsearch";

// Create a new book
export const createBook = async (req: Request<{}, {}, BookDocument>, res: Response) => {
    try {
        const { title, author, publicationYear, isbn, description } = req.body;

        // Save the book to MongoDB
        const newBook = new bookModel({ title, author, publicationYear, isbn, description });
        const savedBook: BookDocument = await newBook.save();

        // Index the book in Elasticsearch
        await elasticClient.index({
            index: 'books',
            id: savedBook._id.toString(),
            body: { title, author, publicationYear, isbn, description },
        });

        res.status(201).json(savedBook);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to create book', error });
    }
};

// Retrieve all books
export const getBooks = async (req: Request, res: Response) => {
    try {
        const books = await bookModel.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve books', error });
    }
};

// Retrieve a single book by ID
export const getBookById = async (req: Request<getBookPathParams>, res: Response) => {
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
export const updateBook = async (req: Request<updateBookPathParams, {}, BookDocument>, res: Response) => {
    try {
        const { id } = req.params;
        const { title, author, publicationYear, isbn, description } = req.body;
        const updatedBook = await bookModel.findByIdAndUpdate(
            id,
            { title, author, publicationYear, isbn, description },
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
                    doc: { title, author, publicationYear, isbn, description },
                },
            });
            res.status(200).json(updatedBook);
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update book', error });
    }
};

// Delete a book by ID
export const deleteBook = async (req: Request<deleteBookPathParams>, res: Response) => {
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
export const searchBooks = async (req: Request<{}, {}, {}, { query: string }>, res: Response) => {
    try {
        const { query } = req.query;
        if (!query) {
            res.status(400).json({ message: 'Query parameter is required' });
        } else {

            const result = await elasticClient.search({
                index: 'books',
                body: {
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

            res.status(200).json(books);
        }

    } catch (error) {
        res.status(500).json({ message: 'Failed to search books', error });
    }
};