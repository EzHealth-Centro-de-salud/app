import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Spacing from "../../../../constants/Spacing";
import FontSize from "../../../../constants/FontSize";
import Colors from "../../../../constants/Colors";
import Font from "../../../../constants/Font";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../types";
import AppTextInput from "../../../../components/AppTextInput";
import { useMutation, useQuery } from "@apollo/client";
import Toast from "react-native-toast-message";
import useButtonTimeout from "../../../../hooks/useButtonTimeout";
import { Icon } from "@rneui/themed";
import GradientWrapper from "../../../../components/GradientWrapper";
import { Picker } from "@react-native-picker/picker";
import { useUserStore } from "../../../../stores/useUserStore";
import { schedule } from "../../../../constants/Schedule";
import LottieView from "lottie-react-native";
import { Card } from "react-native-paper";
import { Animated } from "react-native";
import { RESCHEDULE_APPOINTMENT } from "../../../../graphql/mutations";

type Props = NativeStackScreenProps<RootStackParamList, "Confirm_Reschedule">;

const Confirm_Reschedule: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showFinishText, setShowFinishText] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const { appId, appDate, appTime, appPatient, firstName, surName } =
    useUserStore();

  const [rescheduleAppointment] = useMutation(RESCHEDULE_APPOINTMENT);

  useButtonTimeout(
    () => {
      setIsSubmitting(false);
    },
    1500,
    isSubmitting
  );

  const handleAppointment = async () => {
    setIsSubmitting(true);
    try {
      setIsLoading(true);
      const { data } = await rescheduleAppointment({
        variables: {
          input: {
            date: appDate.toLocaleDateString("en-CA").split("T")[0],
            time: appTime,
            id_appointment: appId,
          },
        },
      });
      setIsLoading(false);
      if (data?.rescheduleAppointment) {
        setShowAnimation(true);
      }
    } catch (e) {
      setIsLoading(false);
      setIsSubmitting(false);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: e.message,
        position: "bottom",
        visibilityTime: 3000, // Duration in milliseconds
        autoHide: true,
      });
    }
  };

  const handleFinishAnimation = () => {
    setShowFinishText(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      navigate("Dashboard_Per");
    }, 3000);
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
            {!showAnimation && (
              <TouchableOpacity
                onPress={() => navigate("Reschedule_2")}
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
            )}
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
              Reprograma tu cita
            </Text>
          </View>
          {!showAnimation ? (
            <View>
              <Card style={{ margin: 10 }}>
                <Card.Title title="Detalles de la cita" />
                <Card.Content>
                  <Text>
                    Fecha: {appDate.toLocaleDateString("en-CA").split("T")[0]}
                  </Text>
                  <Text>Hora: {appTime}</Text>
                  <Text>
                    Paciente: {appPatient.first_name} {appPatient.surname}
                  </Text>
                </Card.Content>
              </Card>
              <TouchableOpacity
                onPress={handleAppointment}
                disabled={isLoading || isSubmitting}
                style={{
                  padding: Spacing * 2,
                  backgroundColor: isSubmitting
                    ? Colors.disabled
                    : Colors.primary,
                  marginVertical: Spacing * 2,
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
                  <Icon
                    size={30}
                    name="arrow-forward"
                    type="Ionicons"
                    color={Colors.lightGray}
                  />
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                alignItems: "center",
              }}
            >
              <LottieView
                source={require("../../../../assets/animations/success.json")}
                style={{ width: "70%", height: "70%" }}
                autoPlay={true}
                loop={false}
                onAnimationFinish={handleFinishAnimation}
              />
              <Animated.Text
                style={{
                  fontSize: FontSize.large,
                  color: Colors.primary,
                  fontFamily: Font["poppins-bold"],
                  textAlign: "center",
                  opacity: fadeAnim,
                }}
              >
                {showFinishText ? "Cita reprogramada exitosamente" : ""}
              </Animated.Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </GradientWrapper>
  );
};

export default Confirm_Reschedule;
