import express from "express"
const app = express()
const PORT = process.env.PORT || 3000
import "dotenv/config"
import connectDB from "./utilities/db.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import session from "express-session"
// import redisStore from "./utilities/redis.js"

connectDB()
app.use(express.json())
app.set("trust proxy", 1)
app.use(cookieParser())

app.use(
    cors({
        origin: process.env.REACT_APP_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        exposedHeaders: ["set-cookie"],
    })
)

// app.use(
//     session({
//         // store: redisStore,
//         resave: false,
//         saveUninitialized: false,
//         secret: process.env.SECRET_KEY,
//         name: "sessionId", // Custom name instead of 'connect.sid'
//         proxy: true,
//         cookie: {
//             secure: process.env.NODE_ENV === "production" ,
//             maxAge: 1000 * 3600 * 24 * 1, //1 D
//             sameSite: (process.env.NODE_ENV && (process.env.NODE_ENV === "production")) ? "none" : "strict",
//             httpOnly: true, // Added security
//         },
//     })
// )

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
    console.log("Jaimin", error)
    res.status(error.status || 500).json({
        message: error.message || "Unknown error",
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
