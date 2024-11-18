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



app.use("/api/", authRoute)
app.use("/api/message", messageRoute)

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})