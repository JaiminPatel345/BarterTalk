import { useContext, useEffect, useState } from "react";
import FlashMessageContext from "../context/flashMessageContext";
import UseConversation from "../stores/useConversation";

const useGetConversations = () => {
    const [conversations, setConversations] =
        useState([])
    const [loading, setLoading] = useState(true);
    const {showErrorMessage} = useContext(FlashMessageContext)
    const {setFilteredConversations} = UseConversation()

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
                    }
                )
                const data = await response.json();
                if(!response.ok){
                    throw {
                        message:data.message
                    }
                }
                setConversations(data)
                setFilteredConversations(data)
                
            } catch (error) {
                showErrorMessage(error.message || "Unknown error")
                console.log(error);
                
            }
            setLoading(false);
        }

        getConversations()
    }, [])
    
    return { loading ,conversations }
}

export default useGetConversations;