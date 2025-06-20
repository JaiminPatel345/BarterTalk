import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const protectRoute = (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized, need to log in "
        });
    }
    try {
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        if (!decode) {
            return res.status(401).json({
                message: "Unauthorized - invalid token"
            });
        }
        User.findById(decode.userId)
            .then((user) => {
                if (!user) {
                    throw ({
                        status: 401,
                        message: "Unauthorized - invalid or deleted user "
                    });
                }
                req.user = user;
                next();
            })
            .catch((error) => {
                res.status(error.status || 500).json({
                    message: error.message || "Internal server error"
                });
            });
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized - invalid token"
        });
    }
}