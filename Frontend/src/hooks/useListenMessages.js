import { useEffect } from "react"
import UseConversation from "../stores/useConversation"
import NotificationSound from "../assets/sounds/notification.mp3"
import useSocket from "../stores/useSocket"

const useListenMessages = () => {
    const { socket, setUnreadMessage } = useSocket()
    const { messages, setMessages, selectedConversation } = UseConversation()

    useEffect(() => {
        socket?.on("newMessage", (data) => {

            if (selectedConversation?._id === data.senderId) {
                setMessages([...messages, data])
                data.shouldShack = true
            } else {
                console.log("sound")

                //set green tic

                setUnreadMessage({
                    senderId: data.senderId,
                    message:
                        data.message.length >= 10
                            ? data.message.slice(0, 8) + "..."
                            : data.message,
                })

                //If not selected then only play
                const sound = new Audio(NotificationSound)
                sound.play()
            }
        })

        return () => socket?.off("newMessage")
    }, [socket,  messages])
}

export default useListenMessages
