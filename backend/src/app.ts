import express from "express"
import cors from 'cors';
import path from "path";

import bookRouter from './routes/bookRoutes'


export function createApp() {
    const app = express();
    app.use(cors());
    app.use(express.json()) // body parser
    // Serve static files from the "public" directory
    app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));
    app.use('/api/books', bookRouter)
    return app;
}