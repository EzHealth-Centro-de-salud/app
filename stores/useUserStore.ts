import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type UseUserStoreT = {
  // -----------------------------------Login Data-----------------------------------
  accessToken?: string;
  userId?: number;
  firstName?: string;
  role?: string;
  speciality?: string;
  rut?: string;
  setAccessToken: (accessToken: string) => void;
  setUserId: (userId: number) => void;
  setFirstName: (firstName: string) => void;
  setRole: (role: string) => void;
  setSpeciality: (speciality: string) => void;
  setRut: (rut: string) => void;
  removeLoginData: () => void;
  // -----------------------------------Register Data-----------------------------------
  reg_rut?: string;
  reg_firstName?: string;
  reg_middleName?: string;
  reg_surName?: string;
  reg_secondSurName?: string;
  reg_sex?: string;
  reg_birthDate?: Date;
  reg_address?: string;
  reg_region?: string;
  reg_commune?: string;
  reg_email?: string;
  reg_phone?: string;
  reg_password?: string;
  setRegRut: (reg_rut: string) => void;
  setRegFirstName: (reg_firstName: string) => void;
  setRegMiddleName: (reg_middleName: string) => void;
  setRegSurName: (reg_surName: string) => void;
  setRegSecondSurName: (reg_secondSurName: string) => void;
  setRegSex: (reg_sex: string) => void;
  setRegBirthDate: (reg_birthDate: Date) => void;
  setRegAddress: (reg_address: string) => void;
  setRegRegion: (reg_region: string) => void;
  setRegCommune: (reg_commune: string) => void;
  setRegEmail: (reg_email: string) => void;
  setRegPhone: (reg_phone: string) => void;
  setRegPassword: (reg_password: string) => void;
  removeRegData: () => void;
};

export const useUserStore = create<UseUserStoreT>()(
  devtools(
    persist(
      (set, get) => ({
        // -----------------------------------Login Data-----------------------------------
        accessToken: undefined,
        userId: undefined,
        firstName: undefined,
        role: undefined,
        speciality: undefined,
        rut: undefined,
        setAccessToken: (accessToken: string) => set({ accessToken }),
        setUserId: (userId: number) => set({ userId }),
        setFirstName: (firstName: string) => set({ firstName }),
        setRole: (role: string) => set({ role }),
        setSpeciality: (speciality: string) => set({ speciality }),
        setRut: (rut: string) => set({ rut }),
        removeLoginData: () =>
          set({
            accessToken: undefined,
            userId: undefined,
            firstName: undefined,
            role: undefined,
            speciality: undefined,
            rut: undefined,
          }),
        // -----------------------------------Register Data-----------------------------------
        reg_rut: undefined,
        reg_firstName: undefined,
        reg_middleName: undefined,
        reg_surName: undefined,
        reg_secondSurName: undefined,
        reg_sex: undefined,
        reg_birthDate: undefined,
        reg_address: undefined,
        reg_region: undefined,
        reg_commune: undefined,
        reg_email: undefined,
        reg_phone: undefined,
        reg_password: undefined,
        setRegRut: (reg_rut: string) => set({ reg_rut }),
        setRegFirstName: (reg_firstName: string) => set({ reg_firstName }),
        setRegMiddleName: (reg_middleName: string) => set({ reg_middleName }),
        setRegSurName: (reg_surName: string) => set({ reg_surName }),
        setRegSecondSurName: (reg_secondSurName: string) =>
          set({ reg_secondSurName }),
        setRegSex: (reg_sex: string) => set({ reg_sex }),
        setRegBirthDate: (reg_birthDate: Date) => set({ reg_birthDate }),
        setRegAddress: (reg_address: string) => set({ reg_address }),
        setRegRegion: (reg_region: string) => set({ reg_region }),
        setRegCommune: (reg_commune: string) => set({ reg_commune }),
        setRegEmail: (reg_email: string) => set({ reg_email }),
        setRegPhone: (reg_phone: string) => set({ reg_phone }),
        setRegPassword: (reg_password: string) => set({ reg_password }),
        removeRegData: () =>
          set({
            reg_rut: undefined,
            reg_firstName: undefined,
            reg_middleName: undefined,
            reg_surName: undefined,
            reg_secondSurName: undefined,
            reg_sex: undefined,
            reg_birthDate: undefined,
            reg_address: undefined,
            reg_region: undefined,
            reg_commune: undefined,
            reg_email: undefined,
            reg_phone: undefined,
            reg_password: undefined,
          }),
      }),
      {
        name: "user-storage",
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )
);
