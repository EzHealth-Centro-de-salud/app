import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Spacing from "../constants/Spacing";
import FontSize from "../constants/FontSize";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
const { height } = Dimensions.get("window");
import GradientWrapper from "../components/GradientWrapper";
import { useFocusEffect } from "@react-navigation/native";
import { useUserStore } from "../stores/useUserStore";

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

const Welcome: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { userId, speciality } = useUserStore();

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      if (userId && speciality) {
        navigate("Dashboard_Per");
      } else {
        if (userId) {
          navigate("Dashboard_Pat");
        }
      }
      setIsLoading(false);
    }, [])
  );

  return (
    <GradientWrapper>
      <SafeAreaView>
        <View
          style={{
            marginVertical: Spacing * 1,
            padding: Spacing * 2,
          }}
        >
          <ImageBackground
            style={{
              height: height / 2.5,
            }}
            resizeMode="contain"
            source={require("../assets/images/welcome-img.png")}
          />
          <View
            style={{
              paddingHorizontal: Spacing * 4,
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
              Bienvenido a EzHealth
            </Text>

            <Text
              style={{
                fontSize: FontSize.medium,
                color: Colors.text,
                fontFamily: Font["poppins-regular"],
                textAlign: "center",
                marginTop: Spacing * 2,
              }}
            >
              Vive mejor, vive fácil con EzHealth.
            </Text>
          </View>
          <View
            style={{
              marginVertical: Spacing * 1,
              padding: Spacing * 2,
            }}
          >
            <TouchableOpacity
              disabled={isLoading}
              onPress={() => navigate("Login")}
              style={{
                padding: Spacing * 2,
                backgroundColor: Colors.primary,
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
              <Text
                style={{
                  fontFamily: Font["poppins-bold"],
                  color: Colors.onPrimary,
                  fontSize: FontSize.large,
                  textAlign: "center",
                }}
              >
                Ingresar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </GradientWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({});
