import { create } from "zustand"
import { persist } from "zustand/middleware"


const UseConversation = create(
    persist(
        (set) => ({
            selectedConversation: null,
            setSelectedConversation: (selectedConversation) =>
                set({ selectedConversation }),

            filteredConversations: null,
            setFilteredConversations: (filteredConversations) =>
                set({ filteredConversations }),

            messages: [],
            setMessages: (messages) => set({ messages }),
        }),
        {
            name: "Barter talk", // unique name for localStorage key
            getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
        }
    )
)

export default UseConversation
