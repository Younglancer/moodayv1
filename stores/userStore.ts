import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
  displayName: string;
  avatar: string | null;
  hasCompletedOnboarding: boolean;
  setDisplayName: (name: string) => void;
  setAvatar: (avatar: string | null) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      displayName: '',
      avatar: null,
      hasCompletedOnboarding: false,
      setDisplayName: (name) => set({ displayName: name }),
      setAvatar: (avatar) => set({ avatar }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      resetOnboarding: () => set({ hasCompletedOnboarding: false }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);