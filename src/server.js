import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';
import router from './routers/index.js';
import notFoundMiddleware from './middlewares/notFound.js';
import errorHandlerMiddleware from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import { UPLOAD_DIR } from './constants/index.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

const PORT = env('PORT', '3000');

export const setupServer = () => {
    const app = express();

    app.use(express.json());
    app.use(
        pino({
            transport: {
                target: 'pino-pretty',
            },
        }),
    );
    app.use(cors());
    app.use(cookieParser());

    app.use(router);

    app.use('/uploads', express.static(UPLOAD_DIR));

    app.use('/api-docs', swaggerDocs());

    app.use(notFoundMiddleware);

    app.use(errorHandlerMiddleware);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};


