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

      myPeerId: null,
      setMyPeerId: (myPeerId) => set({ myPeerId }),

      anotherPeerId: null,
      setAnotherPeerId: (anotherPeerId) => set({ anotherPeerId }),

      //A call _id in which video call save
      videoCallId: null,
      setVideoCallId: (videoCallId) => set({ videoCallId }),

      //A message id in which this video call save
      messageId: null,
      setMessageId: (messageId) => set({ messageId }),

      resetAll: () => {
        set({ isIncomingCall: false });
        set({ isVideoCallConnected: false });
        set({ withVideoCall: null });
        set({ myPeerId: null });
        set({ anotherPeerId: null });
      },
    }),
    {
      name: "video call", // unique name for localStorage key
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
    },
  ),
);

export default UseVideoCall;
