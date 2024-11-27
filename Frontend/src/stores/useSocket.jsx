import { create } from "zustand"
import { io } from "socket.io-client"
import { useContext, useEffect } from "react"
import AuthContext from "../context/authContext"

const useSocket = create((set, get) => ({
    // State
    socket: null,
    onlineUsers: [],

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

        // Update socket in store
        set({ socket })

        // Return cleanup function
        return () => {
            socket.close()
            set({ socket: null })
        }
    },

    // Helper methods
    closeSocket: () => {
        const { socket } = get()
        if (socket) {
            socket.close()
            set({ socket: null })
        }
    },
}))

export const useInitializeSocket = () => {
    const initializeSocket = useSocket((state) => state.initializeSocket)
    const { user } = useContext(AuthContext)

    useEffect(() => {
        const cleanup = initializeSocket(user)
        return () => cleanup && cleanup()
    }, [user, initializeSocket])
}

export default useSocket
