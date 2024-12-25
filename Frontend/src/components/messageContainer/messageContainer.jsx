import MessageInput from "./messageInput";
import Messages from "./messages";
import UseConversation from "../../stores/useConversation";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/authContext";
import storeOrGetAvatar from "../../utils/avatar";
import { IconVideoPlus } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import FlashMessageContext from "../../context/flashMessageContext.jsx";
import doVideoCall from "../../hooks/doVideoCall.js";
import UseVideoCall from "../../stores/useVideoCall.js";
import IncomingCall from "../incomingCall.jsx";

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation } = UseConversation();
  const [avatar, setAvatar] = useState("");
  const navigate = useNavigate();
  const { showErrorMessage } = useContext(FlashMessageContext);
  const { setWithVideoCall, isIncomingCall } = UseVideoCall();
  const [videoCallLoading, setVideoCallLoading] = useState(false);

  useEffect(() => {
    const getAvatar = async () => {
      let url = await storeOrGetAvatar(
        selectedConversation?.profileUrl,
        selectedConversation?._id,
      );
      setAvatar(url);
    };
    getAvatar();
  }, [selectedConversation]);

  const handelVideoCall = () => {
    if (videoCallLoading) return;
    setVideoCallLoading(true);
    try {
      doVideoCall(selectedConversation, showErrorMessage).then((data) => {
        setWithVideoCall(data.participants[0]);
        navigate("/video-call");
      });
    } catch (e) {
      console.log(e);
      showErrorMessage(e.message || "Failed to initiate video call");
    } finally {
      setVideoCallLoading(false);
    }
  };

  if (isIncomingCall) {
    return <IncomingCall />;
  }

  if (!selectedConversation) {
    return (
      <div
        className={`${selectedConversation ? "w-screen" : "hidden md:block h-full w-full"}`}
      >
        <NoChatSelected />
      </div>
    );
  }
  return (
    <div className="h-full w-full flex flex-col relative">
      <div className={``}>
        {/* Header */}
        <div className="bg-blue-400 px-4 py-2 m-2 rounded-lg items-center  flex gap-4 ">
          {videoCallLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="loading loading-dots loading-lg"></span>
            </div>
          )}
          <div
            className="text-white hover:bg-blue-500 rounded-full p-2 cursor-pointer"
            onClick={() => {
              setSelectedConversation(null);
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
                <img alt={`Profile`} src={avatar} />
              </div>
            </div>
            <div className="text-gray-900 font-bold">
              {selectedConversation.name}{" "}
            </div>
            <div
              className={`absolute right-32 text-white cursor-pointer bg-blue-600 rounded-full p-2`}
              onClick={handelVideoCall}
            >
              <IconVideoPlus size={24} stroke={1.5} />
            </div>
          </div>
        </div>

        <div className="flex-1 h-full overflow-y-auto">
          <Messages />
        </div>
        <div className={`absolute bottom-3 w-full`}>
          <MessageInput />
        </div>
      </div>
    </div>
  );
};
export default MessageContainer;

const NoChatSelected = () => {
  const { user } = useContext(AuthContext);
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
  );
};
