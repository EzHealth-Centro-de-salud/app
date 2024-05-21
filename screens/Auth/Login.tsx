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
import { LOGIN_PATIENT, LOGIN_PERSONNEL } from "../../graphql/mutations";
import { useFocusEffect } from "@react-navigation/native";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const Login: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accountType, setAccountType] = useState("patient");
  const [rut, setRut] = useState("");
  const [password, setPassword] = useState("");
  const { setUserId } = useUserStore();
  const { setAccessToken } = useUserStore();
  const { setFirstName } = useUserStore();
  const { setRole } = useUserStore();
  const { setSpeciality } = useUserStore();
  const { removeRegData } = useUserStore();
  const [loginPatient] = useMutation(LOGIN_PATIENT);
  const [loginPersonnel] = useMutation(LOGIN_PERSONNEL);

  useButtonTimeout(
    () => {
      setIsSubmitting(false);
    },
    1000,
    isSubmitting
  );

  useFocusEffect(
    React.useCallback(() => {
      removeRegData();
      console.log("Removed registration data");
    }, [])
  );

  // -----------------------------------Methods-----------------------------------
  // -----------------------------------Login Method-----------------------------------
  const handleLogin = async (rut: string, password: string) => {
    setIsSubmitting(true);
    if (rut === "" || password === "") {
      Toast.show({
        type: "error",
        text1: "Debe llenar todos los campos",
        text2: "Intente nuevamente",
        position: "bottom",
        visibilityTime: 1000,
        autoHide: true,
      });
      setIsSubmitting(false);
    } else {
      try {
        if (accountType === "patient") {
          // -----------------------------------Login Patient-----------------------------------
          setIsLoading(true);
          const { data } = await loginPatient({
            variables: {
              input: {
                rut,
                password,
              },
            },
          });
          setIsLoading(false);
          if (data?.loginPatient) {
            console.log(data.loginPatient);
            setUserId(data.loginPatient.id);
            setFirstName(data.loginPatient.first_name);
            setAccessToken(data.loginPatient.accessToken);
            Toast.show({
              type: "success",
              text1: "Ingreso exitoso",
              text2: "Redirigiendo al dashboard",
              position: "bottom",
              visibilityTime: 1250, // Duration in milliseconds
              autoHide: true,
            });
            //navigate("Dashboard_Pat");
          }
        } else {
          // -----------------------------------Login Personnel-----------------------------------
          setIsLoading(true);
          const { data } = await loginPersonnel({
            variables: {
              input: {
                rut,
                password,
              },
            },
          });
          setIsLoading(false);
          if (data?.loginPersonnel) {
            console.log(data.loginPersonnel);
            setUserId(data.loginPersonnel.id);
            setFirstName(data.loginPersonnel.first_name);
            setRole(data.loginPersonnel.role);
            setSpeciality(data.loginPersonnel.speciality);
            setAccessToken(data.loginPersonnel.accessToken);
            Toast.show({
              type: "success",
              text1: "Ingreso exitoso",
              text2: "Redirigiendo al dashboard",
              position: "bottom",
              visibilityTime: 1250, // Duration in milliseconds
              autoHide: true,
            });
            //navigate("Dashboard_Per");
          }
        }
      } catch (e) {
        console.log(e);
        setIsSubmitting(false);
        setIsLoading(false);
        Toast.show({
          type: "error",
          text1: e.message,
          text2: "Intente nuevamente",
          position: "bottom",
          visibilityTime: 1000,
          autoHide: true,
        });
      }
    }
  };

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
                marginBottom: Spacing * 1,
                textAlign: "center",
              }}
            >
              Elige como quieres ingresar
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
            {/* -----------------------------------Personnel Button----------------------------------- */}
            <TouchableOpacity
              style={{
                flex: 1,
                padding: Spacing * 1,
                borderRadius: Spacing,
                backgroundColor:
                  accountType === "personnel"
                    ? Colors.primary
                    : Colors.disabled,
                margin: Spacing,
              }}
              onPress={() => setAccountType("personnel")}
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
                Personal
              </Text>
            </TouchableOpacity>
          </View>
          {/* -----------------------------------Login Form----------------------------------- */}
          <View
            style={{
              marginVertical: Spacing * 2,
            }}
          >
            <AppTextInput
              placeholder="RUT"
              keyboardType="default"
              value={rut}
              onChangeText={setRut}
            />
            <AppTextInput
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          {/* -----------------------------------Login Button----------------------------------- */}
          <TouchableOpacity
            onPress={() => handleLogin(rut, password)}
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
          {/* -----------------------------------Forgot Password Button----------------------------------- */}
          {accountType === "patient" && (
            <TouchableOpacity
              disabled={isLoading || isSubmitting}
              style={{
                marginVertical: Spacing,
              }}
              onPress={() => navigate("RecoveryPass_Pat")}
            >
              <Text
                style={{
                  fontFamily: Font["poppins-semiBold"],
                  fontSize: FontSize.medium,
                  color: Colors.primary,
                  textAlign: "right",
                }}
              >
                Olvidé mi contraseña
              </Text>
            </TouchableOpacity>
          )}
          {accountType === "personnel" && (
            <TouchableOpacity
              disabled={isLoading || isSubmitting}
              style={{
                marginVertical: Spacing,
              }}
              onPress={() => navigate("RecoveryPass_Per")}
            >
              <Text
                style={{
                  fontFamily: Font["poppins-semiBold"],
                  fontSize: FontSize.medium,
                  color: Colors.primary,
                  textAlign: "right",
                }}
              >
                Olvidé mi contraseña
              </Text>
            </TouchableOpacity>
          )}
          {/* -----------------------------------Register Button----------------------------------- */}
          {accountType === "patient" && (
            <Text
              style={{
                fontFamily: Font["poppins-semiBold"],
                fontSize: FontSize.medium,
                color: Colors.primary,
                marginTop: Spacing * 3,
                textAlign: "center",
              }}
            >
              ¿No tienes una cuenta?
            </Text>
          )}
          {accountType === "patient" && (
            <TouchableOpacity
              disabled={isLoading || isSubmitting}
              style={{ alignItems: "center" }}
              onPress={() => navigate("Register_Pat1")}
            >
              <Text
                style={{
                  fontFamily: Font["poppins-semiBold"],
                  fontSize: FontSize.medium,
                  color: "blue",
                }}
              >
                Regístrate
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </GradientWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({});
