import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,

      setUser: (user) => set({ user }),

      setLogInUser: (user) => {
        const userInfo = {
          name: user.name,
          username: user.username,
          profileUrl: user.profileUrl,
          _id: user._id,
          expires: new Date().getTime() + 24 * 60 * 60 * 1000,
        };
        set({ user: userInfo });
      },

      logout: () => set({ user: null }),
    }),
    {
      name: "user-info", // name of the item in the storage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),

      // Custom filter to handle expired sessions
      onRehydrateStorage: () => (state) => {
        if (state?.user?.expires && state.user.expires < new Date().getTime()) {
          state.logout();
        }
      },
    },
  ),
);

export default useAuthStore;
