/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react"
import SocketContext from "./socketContext"
import { io } from "socket.io-client"
import AuthContext from "./authContext"

const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const { user } = useContext(AuthContext)

    useEffect(() => {
        if (user) {
            // eslint-disable-next-line no-undef
            const socket = io(process.env.VITE_API_BASE_URL, {
                query: {
                    userId: user._id,
                },
            })
            setSocket(socket)

            socket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users)
            })

            return () => socket.close()
        } else {
            if (socket) {
                socket.close()
                setSocket(null)
            }
        }
    }, [user])

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider
