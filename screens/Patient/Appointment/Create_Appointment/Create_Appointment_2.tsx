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
import { useQuery } from "@apollo/client";
import Toast from "react-native-toast-message";
import useButtonTimeout from "../../../../hooks/useButtonTimeout";
import { Icon } from "@rneui/themed";
import GradientWrapper from "../../../../components/GradientWrapper";
import { Picker } from "@react-native-picker/picker";
import { useUserStore } from "../../../../stores/useUserStore";
import { schedule } from "../../../../constants/Schedule";

type Props = NativeStackScreenProps<RootStackParamList, "Create_Appointment_2">;

const Create_Appointment_2: React.FC<Props> = ({
  navigation: { navigate },
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { appSchedule, setAppTime } = useUserStore();
  const [selTime, setSelTime] = useState("");

  useButtonTimeout(
    () => {
      setIsSubmitting(false);
    },
    1500,
    isSubmitting
  );

  const handleValidation = async () => {
    setIsSubmitting(true);
    if (selTime === "") {
      setIsSubmitting(false);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Debes seleccionar una hora para tu cita",
        position: "bottom",
        visibilityTime: 1500, // Duration in milliseconds
        autoHide: true,
      });
    } else {
      try {
        setAppTime(selTime);
        navigate("Confirm_Details");
      } catch (e) {
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
              onPress={() => navigate("Create_Appointment_1")}
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
              Agenda tu cita
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontSize: FontSize.large,
                fontFamily: Font["poppins-bold"],
                marginBottom: Spacing,
                textAlign: "center",
              }}
            >
              Seleccione la hora de su cita
            </Text>
            <ScrollView style={{ maxHeight: 480 }}>
              {schedule.map((time) => {
                const isDisabled = !appSchedule.includes(time);
                const isSelected = time === selTime;

                return (
                  <View
                    key={time}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: Spacing,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: FontSize.medium,
                        fontFamily: Font["poppins-bold"],
                        marginRight: Spacing,
                      }}
                    >
                      {time}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setSelTime(time);
                      }}
                      disabled={isDisabled || isSelected}
                      style={{
                        flex: 1,
                        padding: Spacing * 2,
                        backgroundColor: isSelected
                          ? Colors.selected
                          : isDisabled
                          ? Colors.disabled
                          : Colors.lightGray,
                        borderRadius: Spacing,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: FontSize.medium,
                          fontFamily: Font["poppins-bold"],
                          textAlign: "center",
                        }}
                      >
                        {isDisabled ? "No disponible" : "Reservar"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
            <TouchableOpacity
              onPress={handleValidation}
              disabled={isLoading || isSubmitting}
              style={{
                padding: Spacing * 2,
                backgroundColor: isSubmitting
                  ? Colors.disabled
                  : Colors.primary,
                marginTop: Spacing * 2,
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
        </View>
      </SafeAreaView>
    </GradientWrapper>
  );
};

export default Create_Appointment_2;
