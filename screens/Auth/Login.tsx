import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Spacing from "../../constants/Spacing";
import FontSize from "../../constants/FontSize";
import Colors from "../../constants/Colors";
import Font from "../../constants/Font";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import AppTextInput from "../../components/AppTextInput";
import { useMutation } from "@apollo/client";
import { useUserStore } from "../../stores/useUserStore";
import Toast from "react-native-toast-message";
import useButtonTimeout from "../../hooks/useButtonTimeout";
import { Icon } from "@rneui/themed";
import GradientWrapper from "../../components/GradientWrapper";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const LoginScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accountType, setAccountType] = useState("patient");

  return (
    <GradientWrapper>
      <SafeAreaView>
        <View
          style={{
            padding: Spacing * 2,
          }}
        >
          {/* -----------------------------------Back Button----------------------------------- */}
          <View
            style={{
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => navigate("Welcome")}
              disabled={isLoading || isSubmitting}
              style={{
                position: "absolute",
                top: Spacing * 1.5,
                left: -Spacing,
                zIndex: 1,
              }}
            >
              <Icon
                size={30}
                name="arrow-back"
                type="Ionicons"
                color={Colors.primary}
              />
            </TouchableOpacity>
            {/* -----------------------------------Main Title----------------------------------- */}
            <Text
              style={{
                fontSize: FontSize.xLarge,
                color: Colors.primary,
                fontFamily: Font["poppins-bold"],
                marginTop: Spacing * 5,
                marginBottom: Spacing * 2,
                textAlign: "center",
              }}
            >
              Elegir tipo de cuenta
            </Text>
          </View>
          {/* -----------------------------------Account Type Buttons----------------------------------- */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            {/* -----------------------------------Patient Button----------------------------------- */}
            <TouchableOpacity
              style={{
                flex: 1,
                padding: Spacing * 1,
                borderRadius: Spacing,
                backgroundColor:
                  accountType === "patient" ? Colors.primary : Colors.disabled,
                margin: Spacing,
              }}
              onPress={() => setAccountType("patient")}
            >
              <Icon
                size={60}
                name="person"
                type="Ionicons"
                color={Colors.onPrimary}
              />
              <Text
                style={{
                  fontFamily: Font["poppins-bold"],
                  color: Colors.onPrimary,
                  textAlign: "center",
                  fontSize: FontSize.large,
                }}
              >
                Paciente
              </Text>
            </TouchableOpacity>
            {/* -----------------------------------Doctor Button----------------------------------- */}
            <TouchableOpacity
              style={{
                flex: 1,
                padding: Spacing * 1,
                borderRadius: Spacing,
                backgroundColor:
                  accountType === "doctor" ? Colors.primary : Colors.disabled,
                margin: Spacing,
              }}
              onPress={() => setAccountType("doctor")} // Cambia el tipo de cuenta a 'doctor' cuando se presiona el botón
            >
              <Icon
                size={60}
                name="doctor"
                type="material-community"
                color={Colors.onPrimary}
              />
              <Text
                style={{
                  fontFamily: Font["poppins-bold"],
                  color: Colors.onPrimary,
                  textAlign: "center",
                  fontSize: FontSize.large,
                }}
              >
                Médico
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginTop: Spacing * 2,
              marginBottom: Spacing * 2,
            }}
          >
            <AppTextInput
              placeholder="Correo"
              keyboardType="email-address"
              autoComplete="email"
            />
            <AppTextInput placeholder="Contraseña" secureTextEntry />
          </View>
          <TouchableOpacity
            disabled={isLoading || isSubmitting}
            style={{
              padding: Spacing * 2,
              backgroundColor: isSubmitting ? Colors.disabled : Colors.primary,
              marginVertical: Spacing * 1,
              borderRadius: Spacing,
              shadowColor: Colors.primary,
              shadowOffset: {
                width: 0,
                height: Spacing,
              },
              shadowOpacity: 0.3,
              shadowRadius: Spacing,
            }}
          >
            {isLoading || isSubmitting ? (
              <ActivityIndicator size="large" color={Colors.primary} />
            ) : (
              <Text
                style={{
                  fontFamily: Font["poppins-bold"],
                  color: Colors.onPrimary,
                  textAlign: "center",
                  fontSize: FontSize.large,
                }}
              >
                Iniciar Sesión
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity disabled={isLoading || isSubmitting}>
            <Text
              style={{
                fontFamily: Font["poppins-semiBold"],
                fontSize: FontSize.small,
                color: Colors.primary,
                alignSelf: "flex-end",
              }}
            >
              Olvidé mi contraseña
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GradientWrapper>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
