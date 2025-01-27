import express from 'express';
import { createBook, deleteBook, getBookById, getBooks, searchBooks, updateBook } from '../controllers/bookController';
import { upload } from '../config/multer.config';

const router = express.Router();

router.post('/', upload.single("image"), createBook);
router.get('/', getBooks).get('/search', searchBooks);;
router.get('/:id', getBookById); // GET book by ID
router.put("/:id", updateBook);  // Update book
router.delete("/:id", deleteBook); // Delete book




export default router;
