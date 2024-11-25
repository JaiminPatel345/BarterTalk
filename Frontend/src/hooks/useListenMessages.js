import { useContext, useEffect } from "react"
import SocketContext from "../context/socketContext"
import UseConversation from "../stores/useConversation"
import NotificationSound from "../assets/sounds/notification.mp3"

const useListenMessages = () => {
  const {socket} = useContext(SocketContext)
  const {messages , setMessages} = UseConversation()

  useEffect(() => {
    socket?.on("newMessage" , (newMsg) => {
        newMsg.shouldShack = true
        const sound = new Audio(NotificationSound)
        sound.play()
        setMessages([...messages , newMsg])
    })

    return () => socket?.off("newMessage")
  } , [socket , setMessages , messages])
}

export default useListenMessages