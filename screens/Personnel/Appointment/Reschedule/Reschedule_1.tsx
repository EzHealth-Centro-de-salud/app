import {
  ActivityIndicator,
  SafeAreaView,
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
import { Branch, Personnel, RootStackParamList } from "../../../../types";
import { useQuery } from "@apollo/client";
import Toast from "react-native-toast-message";
import useButtonTimeout from "../../../../hooks/useButtonTimeout";
import { Icon } from "@rneui/themed";
import GradientWrapper from "../../../../components/GradientWrapper";
import { Picker } from "@react-native-picker/picker";
import { useUserStore } from "../../../../stores/useUserStore";
import { CHECK_SCHEDULE, GET_ALL_BRANCHES } from "../../../../graphql/queries";
import DateTimePicker from "@react-native-community/datetimepicker";
import BookingLoader from "../../../../components/Loaders/BranchLoader";

type Props = NativeStackScreenProps<RootStackParamList, "Reschedule_1">;

const Reschedule_1: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const { setAppDate, setAppSchedule, userId, appPatient } = useUserStore();

  const { data: scheduleData, refetch: refetchSchedule } = useQuery(
    CHECK_SCHEDULE,
    { skip: true }
  );

  useButtonTimeout(
    () => {
      setIsSubmitting(false);
    },
    1500,
    isSubmitting
  );

  const renderDateTimePicker = (
    selectedDate: Date | null,
    setDate: React.Dispatch<React.SetStateAction<Date | null>>,
    isOpen: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    return (
      <DateTimePicker
        value={selectedDate || new Date()}
        mode="date"
        display="default"
        minimumDate={new Date()}
        onChange={(event, newDate) => {
          if (newDate) {
            const day = newDate.getDay();
            if (day !== 0 && day !== 6) {
              setDate(newDate);
              setOpen(false);
            } else {
              Toast.show({
                type: "error",
                text1: "Error",
                text2: "No se pueden agendar citas los fines de semana",
                position: "bottom",
                visibilityTime: 1500, // Duration in milliseconds
                autoHide: true,
              });
              setOpen(false);
            }
          }
        }}
      />
    );
  };

  const handleValidation = async () => {
    setIsSubmitting(true);
    if (!date) {
      setIsSubmitting(false);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Debes escoger una fecha para continuar",
        position: "bottom",
        visibilityTime: 1500, // Duration in milliseconds
        autoHide: true,
      });
    } else {
      try {
        setIsLoading(true);
        const result = await refetchSchedule({
          input: {
            id_personnel: userId,
            id_patient: appPatient.id,
            date: date.toLocaleDateString("en-CA").split("T")[0],
          },
        });
        const success = result.data.checkSchedule.success;
        const message = result.data.checkSchedule.message;
        if (success) {
          setAppDate(date);
          setAppSchedule(message);
          navigate("Reschedule_2");
        }
        setIsLoading(false);
      } catch (e) {
        setIsSubmitting(false);
        setIsLoading(false);
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
              onPress={() => navigate("My_Appointments_Per")}
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
              Reprograma tu cita
            </Text>
          </View>

          <View>
            <Text
              style={{
                marginTop: Spacing * 2,
                fontSize: FontSize.large,
                fontFamily: Font["poppins-bold"],
              }}
            >
              Seleccione la fecha de la cita
            </Text>
            <TouchableOpacity
              onPress={() => setOpenDatePicker(true)}
              style={{
                backgroundColor: Colors.lightPrimary,
                borderRadius: Spacing,
                padding: Spacing,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: Font["poppins-regular"],
                  fontSize: FontSize.small,
                }}
              >
                {date
                  ? date.toLocaleDateString("en-CA").split("T")[0]
                  : "Sin fecha"}
              </Text>
            </TouchableOpacity>

            {openDatePicker &&
              renderDateTimePicker(
                date,
                setDate,
                openDatePicker,
                setOpenDatePicker
              )}
            <TouchableOpacity
              onPress={handleValidation}
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
        </View>
      </SafeAreaView>
    </GradientWrapper>
  );
};

export default Reschedule_1;
