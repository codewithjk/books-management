import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface BookDocument extends Document {
    _id: ObjectId;
    title: string;
    author: string;
    publicationYear: number;
    isbn: string;
    description: string;
}

const BookSchema = new Schema<BookDocument>({
    title: { type: String, required: true },
    author: { type: String, required: true },
    publicationYear: { type: Number, required: true },
    isbn: { type: String, required: true },
    description: { type: String, required: true },
});

export default mongoose.model<BookDocument>('Book', BookSchema);
