import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { RootStackParamList } from "../types";
import Colors from "../constants/Colors";
import Welcome from "../screens/Welcome";
import Login from "../screens/Auth/Login";
import Register_Pat1 from "../screens/Auth/Patient/Register_Pat1";
import Register_Pat2 from "../screens/Auth/Patient/Register_Pat2";
import RecoveryPass_Pat from "../screens/Auth/Patient/RecoveryPass_Pat";
import ValidateCode_Pat from "../screens/Auth/Patient/ValidateCode_Pat";
import ChangePass_Pat from "../screens/Auth/Patient/ChangePass_Pat";
import RecoveryPass_Per from "../screens/Auth/Personnel/RecoveryPass_Per";
import ValidateCode_Per from "../screens/Auth/Personnel/ValidateCode_Per";
import ChangePass_Per from "../screens/Auth/Personnel/ChangePass_Per";
import Dashboard_Pat from "../screens/Patient/Dashboard_Pat";
import My_Appointments_Pat from "../screens/Patient/Appointment/View_Appointment/My_Appointments_Pat";
import Create_Appointment_1 from "../screens/Patient/Appointment/Create_Appointment/Create_Appointment_1";
import Create_Appointment_2 from "../screens/Patient/Appointment/Create_Appointment/Create_Appointment_2";
import Confirm_Details from "../screens/Patient/Appointment/Create_Appointment/Confirm_Details";
import Dashboard_Per from "../screens/Personnel/Dashboard_Per";
import My_Appointments_Per from "../screens/Personnel/Appointment/My_Appointments_Per";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.background,
  },
};

export default function Navigation() {
  return (
    <NavigationContainer theme={theme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register_Pat1" component={Register_Pat1} />
      <Stack.Screen name="Register_Pat2" component={Register_Pat2} />
      <Stack.Screen name="RecoveryPass_Pat" component={RecoveryPass_Pat} />
      <Stack.Screen name="ValidateCode_Pat" component={ValidateCode_Pat} />
      <Stack.Screen name="ChangePass_Pat" component={ChangePass_Pat} />
      <Stack.Screen name="RecoveryPass_Per" component={RecoveryPass_Per} />
      <Stack.Screen name="ValidateCode_Per" component={ValidateCode_Per} />
      <Stack.Screen name="ChangePass_Per" component={ChangePass_Per} />
      <Stack.Screen name="Dashboard_Pat" component={Dashboard_Pat} />
      <Stack.Screen
        name="My_Appointments_Pat"
        component={My_Appointments_Pat}
      />
      <Stack.Screen
        name="Create_Appointment_1"
        component={Create_Appointment_1}
      />
      <Stack.Screen
        name="Create_Appointment_2"
        component={Create_Appointment_2}
      />
      <Stack.Screen name="Confirm_Details" component={Confirm_Details} />
      <Stack.Screen name="Dashboard_Per" component={Dashboard_Per} />
      <Stack.Screen
        name="My_Appointments_Per"
        component={My_Appointments_Per}
      />
    </Stack.Navigator>
  );
}
