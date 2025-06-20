import { useContext, useEffect, useState } from "react";
import FlashMessageContext from "../context/flashMessageContext";
import UseConversation from "../stores/useConversation";
import useAuthStore from "../stores/useUser.js";
import useConversation from "../stores/useConversation";
import { getUsers } from "../api/user";

const useGetConversations = () => {
  const { setConversations } = useConversation();
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const { showErrorMessage } = useContext(FlashMessageContext);
  const { setFilteredConversations } = UseConversation();

  useEffect(() => {
    const getConversations = async () => {
      try {
        const data = await getUsers();
        setConversations(data);
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
