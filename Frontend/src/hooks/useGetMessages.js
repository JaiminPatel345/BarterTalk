import { useContext, useState } from "react"
import UseConversation from "../stores/useConversation"
import FlashMessageContext from "../context/flashMessageContext"
import { getMessages as getMessagesAPI } from "../api/message"

const useGetMessages = () => {
    const [loading, setLoading] = useState(false)
    const { selectedConversation,  setMessages } = UseConversation()
    const { showErrorMessage } = useContext(FlashMessageContext)

    const getMessage = async () => {
        try {
            setLoading(true)
            const data = await getMessagesAPI(selectedConversation._id)
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
