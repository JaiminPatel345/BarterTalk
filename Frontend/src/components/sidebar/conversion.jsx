/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import UseConversation from "../../stores/useConversation";
import storeOrGetAvatar from "../../utils/avatar";
import useSocket from "../../stores/useSocket";
const Conversation = ({ conversation, lastIndex }) => {
  const { selectedConversation, setSelectedConversation } = UseConversation();
  const { unreadMessages, clearUnreadMessage } = useSocket();
  const isSelected = selectedConversation?._id === conversation._id;
  const onlineUsers = useSocket((state) => state.onlineUsers);
  const isOnline = onlineUsers.includes(conversation._id);
  const [avatar, setAvatar] = useState("");
  const [unreadMsg, setUnreadMsg] = useState("");

  useEffect(() => {
    const getAvatar = async () => {
      let url = await storeOrGetAvatar(
        conversation.profileUrl,
        conversation._id,
      );
      setAvatar(url);
    };
    getAvatar();
  }, [conversation]);

  // useEffect(() => {
  //     const msg = unreadMessages.find(
  //         (msg) => msg.senderId === conversation._id
  //     )
  //     setUnreadMsg(msg?.message)
  // }, [unreadMessages, conversation._id])

  useEffect(() => {
    const newMsg = localStorage.getItem(`unread_${conversation._id}`);
    setUnreadMsg(newMsg || "");
  }, [unreadMessages]);

  const handleConversationClick = () => {
    setSelectedConversation(conversation);
    clearUnreadMessage(conversation._id);
    setUnreadMsg("");
  };

  return (
    <>
      <div
        className={`flex justify-center items-center gap-2 p-3 cursor-pointer hover:bg-gray-700 rounded-lg ${
          isSelected ? "!bg-blue-400" : ""
        }`}
        onClick={handleConversationClick}
      >
        <div
          className={`avatar  ${
            isOnline ? "online" : "offline"
          } w-12 rounded-full`}
        >
          <div className={`rounded-full`}>
            <img src={avatar} className="" alt={conversation.username} />
          </div>
        </div>
        <div className="flex flex-1 relative h-full">
          <p className="font-bold text-gray-200 ">{conversation.name}</p>
          <p className="absolute text-sm text-gray-200 bottom-1">{unreadMsg}</p>
        </div>
        {unreadMsg && (
          <div
            className="h-4 w-4 bg-green-500 rounded-full tooltip"
            data-tip="New "
          ></div>
        )}
      </div>
      {!lastIndex && <div className="divider my-0 py-0 h-1"></div>}
    </>
  );
};

export default Conversation;
