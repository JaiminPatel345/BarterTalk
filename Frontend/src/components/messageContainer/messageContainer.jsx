import { useContext, useEffect, useState } from "react";
import { IconVideoPlus } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import FlashMessageContext from "../../context/flashMessageContext.jsx";
import doVideoCall from "../../hooks/doVideoCall.js";
import UseVideoCall from "../../stores/useVideoCall.js";
import IncomingCall from "../incomingCall.jsx";
import useAuthStore from "../../stores/useUser.js";
import UseConversation from "../../stores/useConversation";
import Messages from "./messages";
import { MoonLoader } from "react-spinners";
import MessageInput from "./messageInput.jsx";

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation } = UseConversation();
  const navigate = useNavigate();
  const { showErrorMessage } = useContext(FlashMessageContext);
  const { setWithVideoCall, isIncomingCall, setMyPeerId, setAnotherPeerId } =
    UseVideoCall();
  const [videoCallLoading, setVideoCallLoading] = useState(false);

  const scrollToEnd = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToEnd();
  }, []);

  const handleVideoCall = async () => {
    if (videoCallLoading) return;
    setVideoCallLoading(true);
    try {
      const data = await doVideoCall(selectedConversation, showErrorMessage);
      setMyPeerId(data.peerId);
      setAnotherPeerId(data.remotePeerId);
      const DbMessage = JSON.parse(data.dbCallMessage.message);
      setWithVideoCall(DbMessage.participants[0]);
      navigate("/video-call");
    } catch (e) {
      showErrorMessage(e.message || "Failed to initiate video call");
    } finally {
      setVideoCallLoading(false);
    }
  };

  if (isIncomingCall) return <IncomingCall />;
  if (!selectedConversation) return <NoChatSelected />;

  return (
    <div className="max-h-screen h-full flex flex-col bg-black/40">
      {/* Header */}
      <div className="sticky top-0 border-b border-[#FF5317]/20 px-4 py-3">
        {videoCallLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <MoonLoader size={40} color="#FF5317" />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="p-2 hover:bg-[#24140e] rounded-lg transition-colors"
              onClick={() => setSelectedConversation(null)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke="#FF5317"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 6l-6 6l6 6" />
              </svg>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg ring-2 ring-[#FF5317] overflow-hidden">
                <img
                  alt={`${selectedConversation.name}'s profile`}
                  src={selectedConversation.profileUrl}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="text-white font-medium">
                {selectedConversation.name}
              </span>
            </div>
          </div>

          <button
            className="p-2.5 bg-[#24140e] hover:bg-[#2a1810] rounded-lg transition-colors disabled:opacity-50"
            onClick={handleVideoCall}
            disabled={videoCallLoading}
          >
            <IconVideoPlus size={24} className="text-[#FF5317]" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto px-4 py-4">
          <Messages />
        </div>
      </div>

      {/* Input */}
      <div className="border-t mt-auto border-[#FF5317]/20">
        <MessageInput />
      </div>
    </div>
  );
};

const NoChatSelected = () => {
  const { user } = useAuthStore();
  return (
    <div className="flex items-center justify-center w-full h-full bg-black">
      <div className="text-center flex flex-col items-center gap-6 p-6">
        <div className="space-y-3">
          <p className="text-2xl font-semibold text-white">
            Welcome, {user.name} 👋
          </p>
          <p className="text-gray-400">Select a chat to start messaging</p>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="120"
          height="120"
          viewBox="0 0 24 24"
          stroke="#FF5317"
          fill="none"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-80"
        >
          <path d="M16.5 10c3.038 0 5.5 2.015 5.5 4.5c0 1.397 -.778 2.645 -2 3.47l0 2.03l-1.964 -1.178a6.649 6.649 0 0 1 -1.536 .178c-3.038 0 -5.5 -2.015 -5.5 -4.5s2.462 -4.5 5.5 -4.5z" />
          <path d="M11.197 15.698c-.69 .196 -1.43 .302 -2.197 .302a8.008 8.008 0 0 1 -2.612 -.432l-2.388 1.432v-2.801c-1.237 -1.082 -2 -2.564 -2 -4.199c0 -3.314 3.134 -6 7 -6c3.782 0 6.863 2.57 7 5.785l0 .233" />
          <path d="M10 8h.01" />
          <path d="M7 8h.01" />
          <path d="M15 14h.01" />
          <path d="M18 14h.01" />
        </svg>
      </div>
    </div>
  );
};

export default MessageContainer;
