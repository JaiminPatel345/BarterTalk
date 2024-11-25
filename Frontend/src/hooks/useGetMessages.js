import { useContext, useState } from "react"
import UseConversation from "../stores/useConversation"
import FlashMessageContext from "../context/flashMessageContext"

const useGetMessages = () => {
    const [loading, setLoading] = useState(false)
    const { selectedConversation,  setMessages } = UseConversation()
    const { showErrorMessage } = useContext(FlashMessageContext)

    const getMessage = async () => {
        try {
            
            setLoading(true)
            const response = await fetch(
                // eslint-disable-next-line no-undef
                `${process.env.VITE_API_BASE_URL}/api/message/${selectedConversation._id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                }
            )
            const data = await response.json()
            if (!response.ok) {
                throw {
                    message: data.message,
                }
            }
            
            setMessages(data.messages)
        } catch (error) {
            showErrorMessage(error.message || "Unknown error")
        } finally {
            setLoading(false)
        }
    }
    return { getMessage, loading }
}

export default useGetMessages
