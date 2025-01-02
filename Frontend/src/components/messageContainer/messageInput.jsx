import { useContext, useEffect, useState } from "react";
import FlashMessageContext from "../../context/flashMessageContext";
import useSendMessage from "../../hooks/useSendMessages";
import { MoonLoader } from "react-spinners";

const MessageInput = () => {
  const { showErrorMessage } = useContext(FlashMessageContext);
  const { sendMessage, loading } = useSendMessage();
  const [message, setMessage] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      showErrorMessage("Message can't be empty");
      return;
    }
    await sendMessage(message);
    setMessage("");
  };

  return (
    <form className="mt-auto px-4 py-3 sticky bottom-0 bg-black">
      <div className="flex items-center gap-3 max-w-3xl mx-auto">
        <input
          type="text"
          value={message}
          className="flex-1 border border-[#FF5317] rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
          placeholder="Type your message..."
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          onClick={handleSendMessage}
          className="p-2.5 rounded-lg bg-[#24140e] hover:bg-[#2a1810] transition-colors disabled:opacity-50 flex-shrink-0"
          disabled={loading}
        >
          {loading ? (
            <MoonLoader size={20} color="#FF5317" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FF5317"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4" />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
