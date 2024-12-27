/* eslint-disable react/prop-types */
import UseConversation from "../../stores/useConversation";
import { extractTime } from "../../utils/extractTime";
import useAuthStore from "../../stores/useUser.js";
import UseProfile from "../../stores/useProfile.js";
import { useEffect, useState } from "react";

const Message = ({ message }) => {
  const { selectedConversation } = UseConversation();
  const { user } = useAuthStore();
  const isSendByMe =
    message?.receiverId?.toString() === selectedConversation._id?.toString();
  const shakeClass = message.shouldShake ? "shake" : "";
  const { getProfile } = UseProfile();
  const [avatar, setAvatar] = useState();

  useEffect(() => {
    setAvatar(getProfile(isSendByMe ? user?._id : selectedConversation._id));
  });

  return (
    <>
      <div className={`chat ${isSendByMe ? "chat-end" : "chat-start"}`}>
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img alt="Display Picture" src={avatar} />
          </div>
        </div>
        <div className="chat-header">
          {isSendByMe ? user.name : selectedConversation.name}
        </div>
        <div className={`chat-bubble ${shakeClass}`}>{message.message}</div>
        <div className="chat-footer text-xs opacity-50">
          {extractTime(message.createdAt)}
        </div>
      </div>
    </>
  );
};

export default Message;
