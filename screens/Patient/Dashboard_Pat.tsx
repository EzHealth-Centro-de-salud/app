import React, { useEffect } from "react";
import {
  BackHandler,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import Spacing from "../../constants/Spacing";
import FontSize from "../../constants/FontSize";
import Colors from "../../constants/Colors";
import Font from "../../constants/Font";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { useUserStore } from "../../stores/useUserStore";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Icon } from "@rneui/themed";
import GradientWrapper from "../../components/GradientWrapper";

type Props = NativeStackScreenProps<RootStackParamList, "Dashboard_Pat">;

const Dashboard_Pat: React.FC<Props> = ({ navigation: { navigate } }) => {
  const { removeLoginData, removeAppData, firstName } = useUserStore();
  const isFocused = useIsFocused();

  const logout = async () => {
    await removeLoginData();
    Toast.show({
      type: "success",
      text1: "Sesión cerrada exitosamente",
      text2: "Regresando a la pantalla de bienvenida",
      position: "bottom",
      visibilityTime: 1500, // Duration in milliseconds
      autoHide: true,
    });
    navigate("Welcome");
  };

  const buttons = [
    {
      label: "Agendar Cita",
      icon: "plus",
      onPress: () => navigate("Create_Appointment_1"),
    },
    {
      label: "Mis Citas",
      icon: "list",
      onPress: () => navigate("My_Appointments_Pat"),
    },
    {
      label: "Cerrar Sesion",
      icon: "sign-out-alt",
      onPress: () => logout(),
    },
  ];

  const buttonColors = {
    "Agendar Cita": "royalblue",
    "Mis Citas": "dodgerblue",
    "Cerrar Sesion": "red",
  };

  useEffect(() => {
    const backAction = () => {
      if (isFocused) {
        logout();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [isFocused]);

  useFocusEffect(
    React.useCallback(() => {
      removeAppData();
    }, [])
  );

  return (
    <GradientWrapper>
      <SafeAreaView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <View
          style={{
            padding: Spacing * 2,
          }}
        >
          <View
            style={{
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: FontSize.xxLarge,
                color: Colors.primary,
                fontFamily: Font["poppins-bold"],
                textAlign: "center",
              }}
            >
              Bienvenido
            </Text>
            <Text
              style={{
                fontSize: FontSize.large,
                fontFamily: Font["poppins-bold"],
                textAlign: "center",
              }}
            >
              {firstName}
            </Text>
            <Text
              style={{
                marginTop: Spacing * 5,
                fontSize: FontSize.large,
                fontFamily: Font["poppins-bold"],
                textAlign: "center",
              }}
            >
              ¿Qué deseas hacer hoy?
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              paddingTop: Spacing * 2,
            }}
          >
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                onPress={button.onPress}
                style={{
                  width: 160,
                  height: 120,
                  margin: Spacing / 2,
                  backgroundColor: buttonColors[button.label],
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: Colors.primary,
                  shadowOffset: {
                    width: 0,
                    height: Spacing,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: Spacing,
                }}
              >
                <FontAwesome
                  name={button.icon}
                  size={50}
                  color={Colors.onPrimary}
                />
                <Text
                  style={{
                    color: Colors.onPrimary,
                    fontFamily: Font["poppins-bold"],
                    textAlign: "center",
                  }}
                >
                  {button.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </GradientWrapper>
  );
};

export default Dashboard_Pat;

const styles = StyleSheet.create({});
