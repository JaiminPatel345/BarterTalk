/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react"
import UseConversation from "../../stores/useConversation"
import SocketContext from "../../context/socketContext"
import storeOrGetAvatar from "../../utils/avatar"
const Conversation = ({ conversation, lastIndex }) => {
    const { selectedConversation, setSelectedConversation } = UseConversation()
    const isSelected = selectedConversation?._id === conversation._id
    const {onlineUsers} = useContext(SocketContext)
    const isOnline = onlineUsers.includes(conversation._id)
    const [avatar, setAvatar] = useState("")

    useEffect(() => {
        const getAvatar = async () => {
            let url = await storeOrGetAvatar(
                conversation.profileUrl,
                conversation._id
            )
            setAvatar(url)
        }
        getAvatar()
    }, [conversation])
    return (
        <>
            <div
                className={`flex justify-center items-center gap-2 p-3 cursor-pointer hover:bg-gray-700 rounded-lg ${
                    isSelected ? "!bg-blue-400" : ""
                }`}
                onClick={() => setSelectedConversation(conversation)}
            >
                <div className={`avatar ${isOnline ? "online" : "offline"} w-12 rounded-full`}>
                    <div>
                        <img
                            src={avatar}
                            className=""
                            alt={conversation.username}
                        />
                    </div>
                </div>
                <div className="flex flex-1">
                    <div>
                        <p className="font-bold text-gray-200 ">
                            {conversation.name}
                        </p>
                    </div>
                </div>
            </div>
            {!lastIndex && <div className="divider my-0 py-0 h-1"></div>}
        </>
    )
}

export default Conversation
