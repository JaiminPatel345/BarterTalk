import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    username: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true

    },
    gender: {
        type: String,
        require: true,
        enum: ["male", "female", "others"]

    },
    profileUrl: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/020/765/399/large_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
    }

})

const User = mongoose.model("User", userSchema);
export default User;