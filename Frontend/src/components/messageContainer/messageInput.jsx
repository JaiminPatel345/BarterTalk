import { useContext, useState } from "react"
import FlashMessageContext from "../../context/flashMessageContext"
import useSendMessage from "../../hooks/useSendMessages"
import  {MoonLoader} from "react-spinners"

const MessageInput = () => {
    const {showErrorMessage} = useContext(FlashMessageContext)
    const {sendMessage, loading} = useSendMessage()
    const [message , setMessage] = useState("")
    
    const handelSendMessage = async(e) => {
        e.preventDefault()
        if(!message || message.length == 0){
            showErrorMessage("Message can't be empty ")
            return
        }
        await sendMessage(message)
        setMessage("")

    }
    return (
        <form className=" bottom-4 px-4 my-3 ">
            <div className=" flex gap-5  w-full">
                <input
                    type="text"
                    value={message}
                    id="typedMessage"
                    className="border text-sm rounded-lg block w-full p-2.5  bg-[#24140e] border-[#be694a] text-white"
                    placeholder="Send a message"
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button
                    type="submit"
                    onClick={handelSendMessage}
                    className=" inset-y-0 end-0 flex items-center pe-3"
                >
                    {loading ? (
                        <MoonLoader size={20} color={"#be694a"} />
                    ) : (
                        <div className="text-[#FF5317]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className=""
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4" />
                        </svg>
                    </div>
                    )}
                </button>
            </div>
        </form>
    )
}
export default MessageInput
