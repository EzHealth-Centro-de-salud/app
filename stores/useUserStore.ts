import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type UseUserStoreT = {
  accessToken?: string;
  userId?: number;
  firstName?: string;
  role?: string;
  speciality?: string;
  setAccessToken: (accessToken: string) => void;
  setUserId: (userId: number) => void;
  setFirstName: (firstName: string) => void;
  setRole: (role: string) => void;
  setSpeciality: (speciality: string) => void;
};

export const useUserStore = create<UseUserStoreT>()(
  devtools(
    persist(
      (set, get) => ({
        accessToken: undefined,
        userId: undefined,
        firstName: undefined,
        role: undefined,
        speciality: undefined,
        setAccessToken: (accessToken: string) => set({ accessToken }),
        setUserId: (userId: number) => set({ userId }),
        setFirstName: (firstName: string) => set({ firstName }),
        setRole: (role: string) => set({ role }),
        setSpeciality: (speciality: string) => set({ speciality }),
      }),
      {
        name: "user-storage",
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )
);
