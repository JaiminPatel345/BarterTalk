/* eslint-disable react/prop-types */
import { useContext } from "react"
import UseConversation from "../../stores/useConversation"
import AuthContext from '../../context/authContext';
import { extractTime } from "../../utils/extractTime";

const Message = ({message}) => {
    const {selectedConversation} = UseConversation()
    const {user} = useContext(AuthContext)
    const isSendByMe = message?.receiverId?.toString() === selectedConversation._id?.toString()

    return (
        <>
            <div className={`chat ${isSendByMe ? "chat-end" : "chat-start"}`}>
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img
                            alt="Display Picture"
                            src={`${
                                isSendByMe
                                    ? user?.profileUrl
                                    : selectedConversation?.profileUrl
                            }`}
                        />
                    </div>
                </div>
                <div className="chat-header">
                    {isSendByMe ? user.name : selectedConversation.name}
                </div>
                <div className="chat-bubble">{message.message}</div>
                <div className="chat-footer text-xs opacity-50">
                    {extractTime(message.createdAt)}
                </div>
            </div>
        </>
    )
}

export default Message
