import { create } from "zustand";

export const useUserProfile = create((set) => ({
  username: "",
  email: "",
  name: "",
  setName: (name) => set({ name }),
  setUsername: (username) => set({ username }),
  setEmail: (email) => set({ email }),
}));

export default useUserProfile;
