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
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;
