import { create } from "zustand";
import { persist } from "zustand/middleware";

const UseVideoCall = create(
  persist(
    (set) => ({
      isIncomingCall: null,
      setIsIncomingCall: (isIncomingCall) => set({ isIncomingCall }),

      isVideoCallConnected: false,
      setIsVideoCallConnected: (isVideoCallConnected) =>
        set({ isVideoCallConnected }),

      withVideoCall: null,
      setWithVideoCall: (withVideoCall) => set({ withVideoCall }),

      peerId: null,
      setPeerId: (peerId) => set({ peerId }),

      remotePeerId: null,
      setRemotePeerId: (remotePeerId) => set({ remotePeerId }),

      videoCallId: null,
      setVideoCallId: (videoCallId) => set({ videoCallId }),

      messageId: null,
      setMessageId: (messageId) => set({ messageId }),
    }),
    {
      name: "video call", // unique name for localStorage key
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
    },
  ),
);

export default UseVideoCall;
