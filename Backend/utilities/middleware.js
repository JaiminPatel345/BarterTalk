import jwt from 'jsonwebtoken';
import User from '../models/user.js';


export const protectRoute = (req, res, next) => {
    const token = req.cookies?.token
    if (!token) {
        return res.status(401).json({
            message: "Unauthorize , need to log in "
        })
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY)

    if (!decode) {
        return res.status(401).json({
            message: "Unauthorize - invalid token"
        })
    }

    User.findById(decode.userId)
        .then((user) => {
            if (!user) {
                throw ({
                    status: 401,
                    message: "Unauthorize - invalid or deleted user "
                })
            }
            req.user = user
            next()
        })

        .catch((error) => {
            res.status(error.status || 500).json({
                message: error.message || "Internal server error"
            })
        })



}