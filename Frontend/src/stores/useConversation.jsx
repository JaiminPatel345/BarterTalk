import { create } from "zustand"

const UseConversation = create((set) => ({
    selectedConversation: null,
    setSelectedConversation: (selectedConversation) =>
        set({ selectedConversation }),

    filteredConversations: null,
    setFilteredConversations: (filteredConversations) =>
        set({ filteredConversations }),
    
    messages: [],
    setMessages: (messages) => set({ messages }),
}))

export default UseConversation
