import { useContext, useState } from "react";
import UseConversation from "../stores/useConversation";
import FlashMessageContext from "../context/flashMessageContext";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { selectedConversation, messages, setMessages } = UseConversation();
  const { showErrorMessage } = useContext(FlashMessageContext);

  const sendMessage = async (message) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/message/send/${selectedConversation._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
          credentials: "include",
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw {
          message: data.message,
        };
      }

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
