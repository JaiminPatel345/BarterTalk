import { useContext, useState } from "react";
import UseConversation from "../stores/useConversation";
import FlashMessageContext from "../context/flashMessageContext";
import { sendMessage as sendMessageAPI } from "../api/message";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { selectedConversation, messages, setMessages } = UseConversation();
  const { showErrorMessage } = useContext(FlashMessageContext);

  const sendMessage = async (message) => {
    try {
      setLoading(true);
      const data = await sendMessageAPI(selectedConversation._id, message);
      setMessages([...messages, data]);
    } catch (error) {
      showErrorMessage(error.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };
  return { sendMessage, loading };
};

export default useSendMessage;
