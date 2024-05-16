import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type UseUserStoreT = {};

export const useUserStore = create<UseUserStoreT>()(
  devtools(
    persist((set, get) => ({}), {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
    })
  )
);
