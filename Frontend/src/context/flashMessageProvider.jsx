/* eslint-disable react/prop-types */
import  {  useState } from "react"
import FlashMessageContext from "./flashMessageContext"


const  FlashMessageProvider = ({ children }) => {
    const [flashMessage, setFlashMessage] = useState(null)

    const showSuccessMessage = (message) => {
        setFlashMessage({ type: "success", message })
    }

    const showErrorMessage = (message) => {
        setFlashMessage({ type: "error", message })
    }

    const showWarningMessage = (message) => {
        setFlashMessage({ type: "warning", message })
    }

    const clearFlashMessage = () => {
        setFlashMessage(null)
    }

    return (
        <FlashMessageContext.Provider
            value={{
                flashMessage,
                showSuccessMessage,
                showErrorMessage,
                showWarningMessage,
                clearFlashMessage,
            }}
        >
            {children}
        </FlashMessageContext.Provider>
    )
}

export default FlashMessageProvider