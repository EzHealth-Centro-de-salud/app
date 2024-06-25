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
import { unregisterIndieDevice } from "native-notify";
import { GET_PERSONNEL_APPOINTMENTS } from "../../graphql/queries";
import { useQuery } from "@apollo/client";

type Props = NativeStackScreenProps<RootStackParamList, "Dashboard_Per">;

const Dashboard_Per: React.FC<Props> = ({ navigation: { navigate } }) => {
  const { removeLoginData, firstName, userId, notifId } = useUserStore();
  const isFocused = useIsFocused();

  const { data } = useQuery(GET_PERSONNEL_APPOINTMENTS, {
    variables: { id: userId },
    skip: !userId,
  });

  const logout = async () => {
    await removeLoginData();
    unregisterIndieDevice(
      notifId,
      process.env.EXPO_PUBLIC_NOTIF_ID,
      process.env.EXPO_PUBLIC_NOTIF_TOKEN
    );
    Toast.show({
      type: "success",
      text1: "Sesión cerrada exitosamente",
      text2: "Regresando a la pantalla de bienvenida",
      position: "bottom",
      visibilityTime: 1500, // Duration in milliseconds
      autoHide: true,
    });
    navigate("Login");
  };

  const buttons = [
    {
      label: "Mis Citas",
      icon: "list",
      onPress: () => navigate("My_Appointments_Per"),
    },
    {
      label: "Lista de Pacientes",
      icon: "hospital-user",
      onPress: () => navigate("Patients_List"),
    },
    {
      label: "Cerrar Sesion",
      icon: "sign-out-alt",
      onPress: () => logout(),
    },
  ];

  const buttonColors = {
    "Mis Citas": "dodgerblue",
    "Lista de Pacientes": "green",
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
      if (data) {
        const app = data.getPersonnel.appointments;
        const pendingApp = app.filter(
          (appointment) => appointment.status === "Pendiente"
        );
        if (pendingApp.length > 0) {
          Toast.show({
            type: "info",
            text1: "Tienes citas sin confirmar",
            text2: "Revisa la sección de Mis Citas",
            position: "bottom",
            visibilityTime: 3000, // Duration in milliseconds
            autoHide: true,
          });
        }
      }
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

export default Dashboard_Per;
