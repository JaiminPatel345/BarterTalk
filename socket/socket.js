import { Server } from "socket.io"
import http from "http"
import express from "express"

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: process.env.REACT_APP_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        exposedHeaders: ["set-cookie"],
    },
})

export const getReceiverSocketId = (receiverId) => {
return userSocketMap[receiverId]
}

const userSocketMap = {}

io.on("connection", (socket) => {
    console.log("User connected ", socket.id)

    const userId = socket.handshake.query.userId
    if (userId && userId != "undefined") {
        userSocketMap[userId] = socket.id
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", () => {
        console.log("user disconnect", socket.id)
        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

export { app, io, server }