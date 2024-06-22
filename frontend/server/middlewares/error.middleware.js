export const errorMiddleware = (
    error,
    _req,
    res,
    next,
) => {
    try {
        const status = error.status || 500;
        const message = error.message || 'Something went wrong';

        return res.status(status).json({ message, statusCode: status });
    } catch (error) {
        next(error);
    }
};
