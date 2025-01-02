/* eslint-disable react/prop-types */
import UseConversation from "../../stores/useConversation";
import { extractTime } from "../../utils/extractTime";
import useAuthStore from "../../stores/useUser.js";
import { useEffect, useState } from "react";
import { IconClock, IconVideo, IconVideoOff } from "@tabler/icons-react";

const Message = ({ message }) => {
  const { selectedConversation } = UseConversation();
  const { user } = useAuthStore();
  const isSendByMe =
    message?.receiverId?.toString() === selectedConversation._id?.toString();
  const shakeClass = message.shouldShake ? "shake" : "";
  const [avatar, setAvatar] = useState();

  useEffect(() => {
    setAvatar(isSendByMe ? user?.profileUrl : selectedConversation.profileUrl);
  }, []);

  if (message.isVideoCall)
    return <VideoCallMessage message={message} isSendByMe={isSendByMe} />;

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

const VideoCallMessage = ({ message, isSendByMe }) => {
  const videoCallInfo = JSON.parse(message.message);
  const time = new Date(videoCallInfo.createdAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const { messages } = UseConversation();
  const [isPickUp, setIsPickUp] = useState(videoCallInfo.isAnswer);

  useEffect(() => {
    setIsPickUp(videoCallInfo.isAnswer);
  }, [messages]);

  return (
    <div
      className={`flex ${isSendByMe ? "justify-end" : "justify-start"} my-2 w-full`}
    >
      <div
        className={`
        flex items-center gap-2 px-4 py-2 rounded-lg
        ${
          isSendByMe
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-100 text-gray-800 rounded-bl-none"
        }
        max-w-[80%] shadow-sm hover:shadow-md transition-shadow
      `}
      >
        <div className="rounded-full p-2 bg-opacity-20 bg-white">
          {isPickUp ? (
            <IconVideo
              className={`w-5 h-5 ${isSendByMe ? "text-white" : "text-blue-500"}`}
              stroke={2}
            />
          ) : (
            <IconVideoOff
              className={`w-5 h-5 ${isSendByMe ? "text-white" : "text-red-500"}`}
              stroke={2}
            />
          )}
        </div>

        <div className="flex flex-col">
          <span className="font-medium">
            {isPickUp ? "Video Call" : "Miss  Call"}
          </span>

          <div className="flex items-center gap-2 text-sm opacity-90">
            <IconClock className="w-4 h-4" stroke={2} />
            <span>{time}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
