import mongoose from "mongoose";

const connectDB = () => {
    mongoose.connect(process.env.MONGO_URL)
        .then(() => {
            console.log("successfully connect to DB")
        })
        .catch((error) => {
            console.log("Error to connect DB : ", error.message);

        })
}
export default connectDB