import express from "express"
import cors from 'cors';

import bookRouter from './routes/bookRoutes'


export function createApp() {
    const app = express();
    app.use(cors());
    app.use(express.json()) // body parser
    app.use('/api/books', bookRouter)
    return app;
}