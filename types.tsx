import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register_Pat1: undefined;
  Register_Pat2: undefined;
  RecoveryPass_Pat: undefined;
  ValidateCode_Pat: undefined;
  ChangePass_Pat: undefined;
  RecoveryPass_Per: undefined;
  ValidateCode_Per: undefined;
  ChangePass_Per: undefined;
  Dashboard_Pat: undefined;
  My_Appointments_Pat: undefined;
  Create_Appointment_1: undefined;
  Create_Appointment_2: undefined;
  Confirm_Details: undefined;
  Dashboard_Per: undefined;
  My_Appointments_Per: undefined;
  Reschedule_1: undefined;
  Reschedule_2: undefined;
  Confirm_Reschedule: undefined;
  Medical_Record_Pat_1: undefined;
  Medical_Record_Pat_2: undefined;
  Patients_List: undefined;
  Patient_Profile: undefined;
  Medical_Record_Per_1: undefined;
  Medical_Record_Per_2: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export interface Patient {
  id: number;
  access_token: string;
  fcmToken: string;
  recovery_code: number;
  rut: string;
  password: string;
  birthdate: string;
  first_name: string;
  middle_name: string;
  surname: string;
  second_surname: string;
  sex: string;
  address: string;
  region: string;
  commune: string;
  email: string;
  phone: string;
  appointments: Appointment[];
  medical_records: MedicalRecord[];
  is_active: boolean;
}

export interface Personnel {
  id: number;
  access_token: string;
  fcmToken: string;
  recovery_code: number;
  rut: string;
  password: string;
  first_name: string;
  middle_name: string;
  surname: string;
  second_surname: string;
  email: string;
  role: string;
  speciality: string;
  branch: Branch;
  appointments: Appointment[];
  medical_records: MedicalRecord[];
  availability: Availability[];
  is_active: boolean;
}

export interface Branch {
  id: string;
  address: string;
  personnel: Personnel[];
  is_active: boolean;
}

export interface Box {
  id: string;
  box: number;
  branch: Branch;
  appointments: Appointment[];
  is_active: boolean;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  type: string;
  status: string;
  box: Box;
  patient: Patient;
  personnel: Personnel;
}

export interface MedicalRecord {
  id: number;
  diagnosis: string;
  prescription: string;
  date_time: string;
  patient: Patient;
  personnel: Personnel;
  appointment: Appointment;
}

export interface Availability {
  id: number;
  day: string;
  turn: string;
  personnel: Personnel;
}
