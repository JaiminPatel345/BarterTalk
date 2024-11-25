/* eslint-disable react/prop-types */
import UseConversation from "../../stores/useConversation"
const Conversation = ({ conversation, lastIndex }) => {
    const { selectedConversation, setSelectedConversation } = UseConversation()
    const isSelected = selectedConversation?._id === conversation._id
    return (
        <>
            <div
                className={`flex justify-center items-center gap-2 p-3 cursor-pointer hover:bg-gray-700 rounded-lg ${
                    isSelected ? "!bg-blue-400" : ""
                }`}
                onClick={() => setSelectedConversation(conversation)}
            >
                <div className="avatar online w-12 rounded-full">
                    <div>
                        <img
                            src={conversation.profileUrl}
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
