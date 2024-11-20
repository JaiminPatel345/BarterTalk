import User from "../models/user.js"

const getUsers = (req, res) => {
    const loggedInUserId = req.user._id;
    User.find({
            _id: {
                $ne: loggedInUserId
            }
        })
        .then((users) => {
            if (!users) {
                throw {
                    message: "No users found"
                }
            }
            return res.json(users)
        })
        .catch((error) => {
            res.status(error.status || 500).json({
                message: error.message
            })
        })
}

export default {
    getUsers,
}