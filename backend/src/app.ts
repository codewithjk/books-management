import express from "express"


import bookRouter from './routes/bookRoutes'

export function createApp() {
    const app = express();
    app.use(express.json()) // body parser
    app.use('/api/books',bookRouter)
    return app;
}