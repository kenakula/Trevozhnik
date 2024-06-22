export const cookieParser = (req, res, next) => {
    const cookie = req.headers.cookie;

    if (cookie) {
        req.cookies = cookie.split(';').reduce((obj, c) => {
            const n = c.split('=');
            obj[n[0].trim()] = n[1].trim();

            return obj;
        }, {});
    }

    next();
};
