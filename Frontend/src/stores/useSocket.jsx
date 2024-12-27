import { create } from "zustand";
import { io } from "socket.io-client";
import { useEffect } from "react";
import useConversation from "./useConversation";
import NotificationSound from "../assets/sounds/notification.mp3";
import useVideoCall from "./useVideoCall.js";
import useAuthStore from "./useUser.js";
import useProfileStore from "./useProfile.js";
import UseConversation from "./useConversation";

// Create the socket store
const useSocket = create((set, get) => ({
  // State
  socket: null,
  onlineUsers: [],
  unreadMessages: [],

  // Actions
  initializeSocket: (user) => {
    // Close existing socket if user is not present
    if (!user) {
      const currentSocket = get().socket;
      if (currentSocket) {
        currentSocket.close();
        set({ socket: null });
      }
      return;
    }

    // Initialize socket connection
    // eslint-disable-next-line no-undef
    const socket = io(process.env.VITE_API_BASE_URL, {
      query: {
        userId: user._id,
      },
    });

    // Set up event listeners
    socket.on("getOnlineUsers", (users) => {
      set({ onlineUsers: users });
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection failed:", error);
      set({ socket: null });
    });

    socket.on("newMessage", (data) => {
      const { selectedConversation, messages, setMessages } =
        useConversation.getState();

      if (selectedConversation?._id === data.senderId) {
        setMessages([...messages, { ...data, shouldShake: true }]);
      } else {
        get().setUnreadMessage({
          senderId: data.senderId,
          message:
            data.message.length >= 20
              ? `${data.message.slice(0, 18)}...`
              : data.message,
        });
        const sound = new Audio(NotificationSound);
        sound.play();
      }
    });

    socket.on("profile-update", async (data) => {
      console.log(data);
      try {
        // Destructure needed state and methods from both stores
        const profileStore = useProfileStore.getState();
        const conversationStore = UseConversation.getState();

        // Update profile in profile store
        await profileStore.updateProfile(data._id, data.profileUrl);

        // Update conversation in conversation store
        await conversationStore.setConversations(
          conversationStore.conversations.map((conversation) =>
            conversation._id === data._id ? data : conversation,
          ),
        );

        //update filter conversesions
        await conversationStore.setFilteredConversations(
          conversationStore.conversations.map((conversation) =>
            conversation._id === data._id ? data : conversation,
          ),
        );
      } catch (error) {
        console.error("Error handling profile update:", error);
      }
    });

    socket.on("video-call", (data) => {
      const {
        setIsIncomingCall,
        setWithVideoCall,
        setRemotePeerId,
        setPeerId,
      } = useVideoCall.getState();
      setIsIncomingCall(data.fromUserId);
      setWithVideoCall(data.fromName);
      setPeerId(data.peerId); // Store the caller's peer ID
      setRemotePeerId(data.remotePeerId); // Store the caller's peer ID
      // Generate a new peer ID for the receiver
    });

    socket.on("call-rejected", () => {
      const { setIsIncomingCall, setWithVideoCall, setIsVideoCallConnected } =
        useVideoCall.getState();
      setIsIncomingCall(false);
      setWithVideoCall(null);
      setIsVideoCallConnected(false);
      console.log("call cut ");
    });

    // Update socket in store
    set({ socket });

    // Return cleanup function
    return () => {
      socket.close();
      set({ socket: null, onlineUsers: [], unreadMessages: [] });
    };
  },

  setUnreadMessage: (data) => {
    set((state) => {
      localStorage.removeItem(`unread_${data.senderId}`);
      localStorage.setItem(`unread_${data.senderId}`, data.message);

      const existingIndex = state.unreadMessages.findIndex(
        (msg) => msg.senderId === data.senderId,
      );

      if (existingIndex !== -1) {
        const updatedMessages = [...state.unreadMessages];
        updatedMessages[existingIndex] = data;
        return { unreadMessages: updatedMessages };
      }

      return { unreadMessages: [...state.unreadMessages, data] };
    });
  },

  clearUnreadMessage: (senderId) => {
    localStorage.removeItem(`unread_${senderId}`);
    set((state) => ({
      unreadMessages: state.unreadMessages.filter(
        (msg) => msg.senderId !== senderId,
      ),
    }));
  },

  closeSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.close();
      set({ socket: null });
    }
  },
}));

// Custom hook for socket initialization
export const useInitializeSocket = () => {
  const initializeSocket = useSocket((state) => state.initializeSocket);
  const { user } = useAuthStore();

  useEffect(() => {
    const cleanup = initializeSocket(user);
    return () => cleanup?.();
  }, [user, initializeSocket]);
};

export default useSocket;
