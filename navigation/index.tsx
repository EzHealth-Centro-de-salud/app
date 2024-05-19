import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { RootStackParamList } from "../types";
import Colors from "../constants/Colors";
import Welcome from "../screens/Welcome";
import Login from "../screens/Auth/Login";
import RecoveryPass_Pat from "../screens/Auth/Patient/RecoveryPass_Pat";
import ValidateCode_Pat from "../screens/Auth/Patient/ValidateCode_Pat";
import ChangePass_Pat from "../screens/Auth/Patient/ChangePass_Pat";
import RecoveryPass_Per from "../screens/Auth/Personnel/RecoveryPass_Per";
import ValidateCode_Per from "../screens/Auth/Personnel/ValidateCode_Per";
import ChangePass_Per from "../screens/Auth/Personnel/ChangePass_Per";

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
      <Stack.Screen name="RecoveryPass_Pat" component={RecoveryPass_Pat} />
      <Stack.Screen name="ValidateCode_Pat" component={ValidateCode_Pat} />
      <Stack.Screen name="ChangePass_Pat" component={ChangePass_Pat} />
      <Stack.Screen name="RecoveryPass_Per" component={RecoveryPass_Per} />
      <Stack.Screen name="ValidateCode_Per" component={ValidateCode_Per} />
      <Stack.Screen name="ChangePass_Per" component={ChangePass_Per} />
    </Stack.Navigator>
  );
}
