import
jwt
from 'jsonwebtoken';

const generateTokenAndSetCookies = (userId , name , username, res) => {
    const token = jwt.sign({
        userId , 
    }, process.env.SECRET_KEY, {
        expiresIn: '1d'
    });

    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "node" : "strict"
    })
}

export default generateTokenAndSetCookies;