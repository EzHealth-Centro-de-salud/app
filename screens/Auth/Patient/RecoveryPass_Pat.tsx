import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Spacing from "../../../constants/Spacing";
import FontSize from "../../../constants/FontSize";
import Colors from "../../../constants/Colors";
import Font from "../../../constants/Font";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";
import AppTextInput from "../../../components/AppTextInput";
import { useMutation } from "@apollo/client";
import { Icon } from "@rneui/themed";
import Toast from "react-native-toast-message";
import useButtonTimeout from "../../../hooks/useButtonTimeout";
import GradientWrapper from "../../../components/GradientWrapper";
import { RECOVERY_PATIENT } from "../../../graphql/mutations";
import { useUserStore } from "../../../stores/useUserStore";

type Props = NativeStackScreenProps<RootStackParamList, "RecoveryPass_Pat">;

const RecoveryPass_Pat: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [userRut, setUserRut] = useState("");
  const { rut, setRut } = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [recoveryPatient] = useMutation(RECOVERY_PATIENT);

  useButtonTimeout(
    () => {
      setIsSubmitting(false);
    },
    1500,
    isSubmitting
  );

  const handleRecovery = async (rut: string) => {
    setIsSubmitting(true);
    if (rut === "") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Todos los campos deben estar llenos",
        position: "bottom",
        visibilityTime: 1500, // Duration in milliseconds
        autoHide: true,
      });
    } else {
      try {
        setIsLoading(true);
        const { data } = await recoveryPatient({
          variables: {
            input: {
              rut: userRut,
            },
          },
        });
        setIsLoading(false);
        if (data?.recoveryPatient) {
          setRut(userRut);
          navigate("ValidateCode_Pat");
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
          <View
            style={{
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => navigate("Login")}
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
              Recuperar{"\n"}Contraseña
            </Text>
            <Text
              style={{
                fontFamily: Font["poppins-semiBold"],
                fontSize: FontSize.large,
                textAlign: "center",
              }}
            >
              Ingresa el rut asociado a tu cuenta
            </Text>
          </View>
          <View
            style={{
              marginVertical: Spacing * 2,
            }}
          >
            <AppTextInput
              placeholder="RUT"
              keyboardType="default"
              value={userRut}
              onChangeText={setUserRut}
            />
          </View>

          <TouchableOpacity
            onPress={() => handleRecovery(userRut)}
            disabled={isSubmitting || isLoading}
            style={{
              padding: Spacing * 2,
              backgroundColor: isSubmitting ? Colors.disabled : Colors.primary,
              marginVertical: Spacing * 3,
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
                Recuperar contraseña
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GradientWrapper>
  );
};

export default RecoveryPass_Pat;

const styles = StyleSheet.create({});
