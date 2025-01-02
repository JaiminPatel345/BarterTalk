import { useContext, useEffect, useState } from "react";
import FlashMessageContext from "../context/flashMessageContext";
import UseConversation from "../stores/useConversation";
import useAuthStore from "../stores/useUser.js";
import useConversation from "../stores/useConversation";

const useGetConversations = () => {
  const { setConversations } = useConversation();
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const { showErrorMessage } = useContext(FlashMessageContext);
  const { setFilteredConversations } = UseConversation();

  useEffect(() => {
    const getConversations = async () => {
      try {
        const response = await fetch(
          // eslint-disable-next-line no-undef
          `${process.env.VITE_API_BASE_URL}/api/users`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );
        const data = await response.json();
        if (!response.ok) {
          throw {
            message: data.message,
          };
        }
        setConversations(data);
        // console.log(data);
        setFilteredConversations(data);
      } catch (error) {
        showErrorMessage(error.message || "Unknown error");
        console.log(error);
      }
      setLoading(false);
    };

    getConversations();
  }, []);

  return { loading };
};

export default useGetConversations;
