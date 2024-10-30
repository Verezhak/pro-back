import { HttpError } from 'http-errors';

const errorHandlerMiddleware = (error, _, res, __) => {
    if (error instanceof HttpError) {
        const { status, message, errors } = error;
        res.status(status).json({
            status,
            message,
            data: errors || error,
        });

        return;
    }

    res.status(500).json({
        status: 500,
        message: 'Something went wrong',
        data: error.message,
    });
};


export default errorHandlerMiddleware;