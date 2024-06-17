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

type Props = NativeStackScreenProps<RootStackParamList, "Create_Appointment_1">;

const Create_Appointment_1: React.FC<Props> = ({
  navigation: { navigate },
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [type, setType] = useState("");
  const [personnel, setPersonnel] = useState<Personnel | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const { setAppType, setAppPersonnel, setAppDate, setAppSchedule, userId } =
    useUserStore();

  const { data: branchData, loading } = useQuery(GET_ALL_BRANCHES);

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
    if (!branch || type === "" || personnel === null || !date) {
      setIsSubmitting(false);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Debes completar todos los campos para continuar",
        position: "bottom",
        visibilityTime: 1500, // Duration in milliseconds
        autoHide: true,
      });
    } else {
      try {
        setIsLoading(true);
        console.log(date.toLocaleDateString("en-CA").split("T")[0]);
        const result = await refetchSchedule({
          input: {
            id_personnel: personnel.id,
            id_patient: userId,
            date: date.toLocaleDateString("en-CA").split("T")[0],
          },
        });
        const success = result.data.checkSchedule.success;
        const message = result.data.checkSchedule.message;
        if (success) {
          setAppType(type);
          setAppPersonnel(personnel);
          setAppDate(date);
          setAppSchedule(message);
          navigate("Create_Appointment_2");
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
              onPress={() => navigate("Dashboard_Pat")}
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

          {loading ? (
            <BookingLoader />
          ) : (
            <View>
              <View>
                <Text
                  style={{
                    fontSize: FontSize.large,
                    fontFamily: Font["poppins-bold"],
                  }}
                >
                  Selecciona la sucursal
                </Text>
                <Picker
                  style={{
                    fontFamily: Font["poppins-regular"],
                    fontSize: FontSize.small,
                    padding: Spacing * 2,
                    backgroundColor: Colors.lightPrimary,
                    borderRadius: Spacing,
                  }}
                  selectedValue={branch}
                  onValueChange={(itemValue, itemIndex) => setBranch(itemValue)}
                >
                  <Picker.Item label="Sucursal" value={null} />
                  {branchData?.getAllBranches.map((branch) =>
                    branch.personnel.length > 0 || branch.box_count > 0 ? (
                      <Picker.Item
                        key={branch.id}
                        label={branch.address}
                        value={branch}
                      />
                    ) : null
                  )}
                </Picker>
              </View>
              <Text
                style={{
                  marginTop: Spacing * 2,
                  fontSize: FontSize.large,
                  fontFamily: Font["poppins-bold"],
                }}
              >
                Selecciona el tipo de cita
              </Text>
              <Picker
                style={{
                  fontFamily: Font["poppins-regular"],
                  fontSize: FontSize.small,
                  padding: Spacing * 2,
                  backgroundColor: Colors.lightPrimary,
                  borderRadius: Spacing,
                }}
                selectedValue={type}
                onValueChange={(itemValue, itemIndex) => setType(itemValue)}
              >
                <Picker.Item label="Tipo de cita" value="" />
                <Picker.Item label="Consulta" value="Consulta" />
                <Picker.Item label="Control" value="Control" />
                <Picker.Item label="Procedimiento" value="Procedimiento" />
              </Picker>
              <Text
                style={{
                  marginTop: Spacing * 2,
                  fontSize: FontSize.large,
                  fontFamily: Font["poppins-bold"],
                }}
              >
                ¿Con quién deseas agendar tu cita?
              </Text>
              <Picker
                style={{
                  fontFamily: Font["poppins-regular"],
                  fontSize: FontSize.small,
                  padding: Spacing * 2,
                  backgroundColor: Colors.lightPrimary,
                  borderRadius: Spacing,
                }}
                selectedValue={personnel}
                onValueChange={(itemValue, itemIndex) =>
                  setPersonnel(itemValue)
                }
              >
                <Picker.Item label="Personal médico" value={null} />
                {branch?.personnel.map((personnel) =>
                  personnel.is_active == true ? (
                    <Picker.Item
                      key={personnel.id}
                      label={
                        personnel.first_name +
                        " " +
                        personnel.surname +
                        " - " +
                        personnel.speciality
                      }
                      value={personnel}
                    />
                  ) : null
                )}
              </Picker>
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
          )}
        </View>
      </SafeAreaView>
    </GradientWrapper>
  );
};

export default Create_Appointment_1;
