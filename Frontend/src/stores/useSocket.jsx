import { create } from "zustand"
import { io } from "socket.io-client"
import { useContext, useEffect } from "react"
import AuthContext from "../context/authContext"

const useSocket = create(
    (set, get) => ({
        // State
        socket: null,
        onlineUsers: [],
        unreadMessages: [],

        // Actions
        initializeSocket: (user) => {
            if (!user) {
                const currentSocket = get().socket
                if (currentSocket) {
                    currentSocket.close()
                    set({ socket: null })
                }
                return
            }

            // Initialize socket connection
            // eslint-disable-next-line no-undef
            const socket = io(process.env.VITE_API_BASE_URL, {
                query: {
                    userId: user._id,
                },
            })

            // Set up event listeners
            socket.on("getOnlineUsers", (users) => {
                set({ onlineUsers: users })
            })

            socket.on("connect_error", (error) => {
                console.error("Socket connection failed:", error)
                set({ socket: null })
            })

            // Update socket in store
            set({ socket })

            // Return cleanup function
            return () => {
                socket.close()
                set({ socket: null, onlineUsers: [], unreadMessages: [] })
            }
        },

        setUnreadMessage: (data) => {
            console.log(data)

            const idx = get().unreadMessages.findIndex(
                (e) => e.senderId === data.senderId
            )

            if (idx !== -1) {
                // Update existing message
                const updatedMessages = [...get().unreadMessages]
                updatedMessages[idx].message = data.message
                set({ unreadMessages: updatedMessages })
            } else {
                // Append new message
                set({ unreadMessages: [...get().unreadMessages, data] })
            }
            console.log(get().unreadMessages)
        },

        getUnreadMsgOfUser: (senderId) => {
            const message = get().unreadMessages.find(
                (msg) => msg.senderId === senderId
            )
            return message ? message.message : ""
        },

        clearUnreadMessage: (senderId) => {
            const messages = get().unreadMessages.filter(
                (msg) => msg.senderId !== senderId
            )
            set({ unreadMessages: messages })
        },

        // Helper methods
        closeSocket: () => {
            const { socket } = get()
            if (socket) {
                socket.close()
                set({ socket: null })
            }
        },
    }),
    {
        name: "chat-storage",
    }
)

export const useInitializeSocket = () => {
    const initializeSocket = useSocket((state) => state.initializeSocket)
    const { user } = useContext(AuthContext)

    useEffect(() => {
        const cleanup = initializeSocket(user)
        return () => cleanup && cleanup()
    }, [user, initializeSocket])
}

export default useSocket
