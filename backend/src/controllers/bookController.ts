import { Request, Response } from "express-serve-static-core";
import bookModel, { BookDocument } from "../models/book"

// Create a new book
export const createBook = async (req: Request<{}, {}, BookDocument>, res: Response) => {
    try {
        console.log(req.body)
      const { title, author, publicationYear, isbn, description } = req.body;
  
      // Save the book to MongoDB
      const newBook = new bookModel({ title, author, publicationYear, isbn, description });
      const savedBook = await newBook.save();
      
      res.status(201).json(savedBook);
    } catch (error) {
        console.log(error)
      res.status(500).json({ message: 'Failed to create book', error });
    }
};