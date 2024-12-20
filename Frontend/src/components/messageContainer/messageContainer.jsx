import MessageInput from "./messageInput"
import Messages from "./messages"
import UseConversation from "../../stores/useConversation"
import { useContext, useEffect, useState } from "react"
import AuthContext from "../../context/authContext"
import storeOrGetAvatar from "../../utils/avatar"

const MessageContainer = () => {
    const { selectedConversation, setSelectedConversation } = UseConversation()
    const [avatar, setAvatar] = useState("")

    useEffect(() => {
        const getAvatar = async () => {
            let url = await storeOrGetAvatar(
                selectedConversation?.profileUrl,
                selectedConversation?._id
            )
            setAvatar(url)
        }
        getAvatar()
    }, [selectedConversation])

    if (!selectedConversation) {
        return (
            <div className={`${selectedConversation ? "w-screen" : "hidden md:block h-full w-full"}`}>
                <NoChatSelected />
            </div>
        )
    }
    return (
        <div className="h-full w-full flex flex-col ">
            <>
                {/* Header */}
                <div className="bg-blue-400 px-4 py-2 m-2 rounded-lg items-center  flex gap-4">
                    <div
                        className="text-white hover:bg-blue-500 rounded-full p-2 cursor-pointer"
                        onClick={() => {
                            setSelectedConversation(null)
                        }}
                    >
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
                            className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M15 6l-6 6l6 6" />
                        </svg>
                    </div>
                    <div className="flex items-center  gap-2">
                        <div className="avatar">
                            <div className="w-10 rounded-full">
                                <img src={avatar} />
                            </div>
                        </div>
                        <div className="text-gray-900 font-bold">
                            {selectedConversation.name}{" "}
                        </div>
                    </div>
                </div>

                <div className="flex-1 h-full overflow-y-auto">
                    <Messages />
                </div>
                <MessageInput />
            </>
        </div>
    )
}
export default MessageContainer

const NoChatSelected = () => {
    const { user } = useContext(AuthContext)
    return (
        <div className="flex items-center justify-center w-full h-full">
            <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
                <p>Welcome 👋 {user.name} </p>
                <p>Select a chat to start messaging</p>
                <div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100"
                        height="100"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M16.5 10c3.038 0 5.5 2.015 5.5 4.5c0 1.397 -.778 2.645 -2 3.47l0 2.03l-1.964 -1.178a6.649 6.649 0 0 1 -1.536 .178c-3.038 0 -5.5 -2.015 -5.5 -4.5s2.462 -4.5 5.5 -4.5z" />
                        <path d="M11.197 15.698c-.69 .196 -1.43 .302 -2.197 .302a8.008 8.008 0 0 1 -2.612 -.432l-2.388 1.432v-2.801c-1.237 -1.082 -2 -2.564 -2 -4.199c0 -3.314 3.134 -6 7 -6c3.782 0 6.863 2.57 7 5.785l0 .233" />
                        <path d="M10 8h.01" />
                        <path d="M7 8h.01" />
                        <path d="M15 14h.01" />
                        <path d="M18 14h.01" />
                    </svg>
                </div>
            </div>
        </div>
    )
}
