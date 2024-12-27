import { create } from "zustand";
import { persist } from "zustand/middleware";

// Helper functions for image handling
const imageToBase64 = async (url) => {
  if (!url) return null;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch image");

    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to base64:", error);
    return null;
  }
};

const useProfileStore = create(
  persist(
    (set, get) => ({
      profiles: [],

      addProfile: async (userId, profileUrl) => {
        if (!userId) return;

        const imageData = await imageToBase64(profileUrl);
        set((state) => ({
          profiles: [
            ...state.profiles.filter((p) => p.userId !== userId), // Remove if exists
            {
              userId,
              profileUrl,
              imageData,
            },
          ],
        }));
      },

      initializeAllProfiles: async (data) => {
        if (!Array.isArray(data)) return;

        try {
          const promises = data.map((profile) =>
            imageToBase64(profile.profileUrl).then((imageData) => ({
              userId: profile._id,
              profileUrl: profile.profileUrl,
              imageData,
            })),
          );

          const profiles = await Promise.all(promises);
          set({ profiles: profiles.filter((profile) => profile.userId) });
        } catch (error) {
          console.error("Error initializing profiles:", error);
          // Keep existing profiles in case of error
          return false;
        }
      },

      updateProfile: async (userId, profileUrl) => {
        if (!userId || !profileUrl) return;

        const imageData = await imageToBase64(profileUrl);
        set((state) => ({
          profiles: state.profiles.map((profile) =>
            profile.userId === userId
              ? {
                  ...profile,
                  profileUrl,
                  imageData,
                }
              : profile,
          ),
        }));
      },

      getProfile: (userId) => {
        if (!userId) return null;
        return get().profiles.find((profile) => profile.userId === userId)
          ?.imageData;
      },
    }),
    {
      name: "profile-storage",

      serialize: (state) => {
        try {
          return JSON.stringify(state);
        } catch (err) {
          console.error("Error serializing state:", err);
          return JSON.stringify({ profiles: [] });
        }
      },

      deserialize: (str) => {
        try {
          return JSON.parse(str);
        } catch (err) {
          console.error("Error deserializing state:", err);
          return { profiles: [] };
        }
      },

      partialize: (state) => ({
        profiles: state.profiles,
      }),
    },
  ),
);

export default useProfileStore;
