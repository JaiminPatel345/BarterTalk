import express from "express"
const app = express()
const PORT = process.env.PORT || 3000
import 'dotenv/config'
import connectDB from './utilities/db.js';
import cookieParser from "cookie-parser";


connectDB()
app.use(express.json())
app.use(cookieParser())
//Routes
import authRoute from "./routes/auth.js"
import messageRoute from "./routes/message.js"
import userRoute from "./routes/user.js"



app.use("/api/message", messageRoute)
app.use("/api/", authRoute)
app.use("/api/", userRoute)

app.get("/", (req, res) => {
    res.send("Hello World")
})


app.use((error, req, res, next) => {

    console.log("Jaimin", error);
    res.status(error.status || 500).json({
        message: error.message || "Unknown error"
    })

})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})