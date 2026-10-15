import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;

const verifyAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Authentication token required',
        });
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, jwtSecret);
        req.user = payload;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }
        return res.status(403).json({ message: 'Invalid token' });
    }
};

export { verifyAuth }