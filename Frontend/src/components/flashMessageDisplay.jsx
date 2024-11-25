import  { useContext, useEffect } from "react"
import FlashMessageContext  from "../context/flashMessageContext"
import toast from "react-hot-toast"

const FlashMessageDisplay = () => {
    const { flashMessage, clearFlashMessage } = useContext(FlashMessageContext)

    useEffect(() => {
        if (flashMessage) {
            toast.dismiss()
            const { message, type } = flashMessage
            if (type === "success") {
                toast.success(message, {
                    onClose: clearFlashMessage,
                })
            } else if (type === "error") {
                toast.error(message, {
                    onClose: clearFlashMessage,
                })
            } else if (type === "warning") {
                
                toast(() => (
                    <span>
                        <b>{message} </b>
                        <br />
                    </span>
                ))
            }
        }
    }, [flashMessage, clearFlashMessage])

    return null
}

export default FlashMessageDisplay
