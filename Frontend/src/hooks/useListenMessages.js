import {  useEffect } from "react"
import UseConversation from "../stores/useConversation"
import NotificationSound from "../assets/sounds/notification.mp3"
import useSocket from "../stores/useSocket"

const useListenMessages = () => {
  const socket = useSocket((state) => state.socket)
  const {messages , setMessages} = UseConversation()

  useEffect(() => {
    socket?.on("newMessage" , (data) => {
      console.log(data);
      
        data.shouldShack = true
        
        const sound = new Audio(NotificationSound)
        sound.play()
        setMessages([...messages, data])
    })

    return () => socket?.off("newMessage")
  } , [socket , setMessages , messages])
}

export default useListenMessages
