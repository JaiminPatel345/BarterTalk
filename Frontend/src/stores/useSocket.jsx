import { create } from "zustand";
import { io } from "socket.io-client";
import { useEffect } from "react";
import useConversation from "./useConversation";
import NotificationSound from "../assets/sounds/notification.mp3";
import useVideoCall from "./useVideoCall.js";
import useAuthStore from "./useUser.js";
import UseConversation from "./useConversation";
import { useNavigate } from "react-router-dom";

// Create the socket store
const useSocket = create((set, get) => ({
  socket: null,
  onlineUsers: [],
  unreadMessages: [],
  navigationFunction: null, // Store the navigation function

  setNavigationFunction: (navFunc) => {
    set({ navigationFunction: navFunc });
  },

  initializeSocket: (user) => {
    if (!user) {
      const currentSocket = get().socket;
      if (currentSocket) {
        currentSocket.close();
        set({ socket: null });
      }
      return;
    }

    // eslint-disable-next-line no-undef
    const socket = io(process.env.VITE_API_BASE_URL, {
      query: {
        userId: user._id,
      },
    });

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
      try {
        const conversationStore = UseConversation.getState();

        await conversationStore.setConversations(
          conversationStore.conversations.map((conversation) =>
            conversation._id === data._id ? data : conversation,
          ),
        );

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
        setAnotherPeerId,
        setMyPeerId,
        setVideoCallId,
        setMessageId,
      } = useVideoCall.getState();
      setIsIncomingCall(data.fromUserId);
      setWithVideoCall(data.fromName);
      setMyPeerId(data.peerId);
      setAnotherPeerId(data.remotePeerId);
      setVideoCallId(data.callId);
      setMessageId(data.messageId);
    });

    socket.on("call-rejected", () => {
      const { resetAll } = useVideoCall.getState();
      const navigationFunction = get().navigationFunction;

      resetAll();
      console.log("call cut ");

      if (navigationFunction) {
        navigationFunction("/");
      }
    });

    socket.on("call-end", (data) => {
      const navigationFunction = get().navigationFunction;

      const {
        setIsIncomingCall,
        setWithVideoCall,
        setAnotherPeerId,
        setMyPeerId,
        setVideoCallId,
        setMessageId,
      } = useVideoCall.getState();
      setIsIncomingCall(data.fromUserId);
      setWithVideoCall(data.fromName);
      setMyPeerId(data.peerId);
      setAnotherPeerId(data.remotePeerId);
      setVideoCallId(data.callId);
      setMessageId(data.messageId);

      if (navigationFunction) {
        navigationFunction("/");
      }
    });

    set({ socket });

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
  const setNavigationFunction = useSocket(
    (state) => state.setNavigationFunction,
  );
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    setNavigationFunction(navigate);
    const cleanup = initializeSocket(user);
    return () => cleanup?.();
  }, [user, initializeSocket, setNavigationFunction, navigate]);
};

export default useSocket;
