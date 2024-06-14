import React, { useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQuery } from "@apollo/client";
import { useFocusEffect } from "@react-navigation/core";
import { Icon } from "@rneui/themed";
import { useUserStore } from "../../../stores/useUserStore";
import Spacing from "../../../constants/Spacing";
import FontSize from "../../../constants/FontSize";
import Colors from "../../../constants/Colors";
import Font from "../../../constants/Font";
import GradientWrapper from "../../../components/GradientWrapper";
import { GET_PERSONNEL_APPOINTMENTS } from "../../../graphql/queries";
import { Appointment, RootStackParamList } from "../../../types";
import AppointmentLoader from "../../../components/Loaders/AppointmentLoader";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { schedule } from "../../../constants/Schedule";
import FontAwesome from "react-native-vector-icons/FontAwesome5";

type Props = NativeStackScreenProps<RootStackParamList, "My_Appointments_Per">;

const My_Appointments_Per: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { userId } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [expandedAppointmentIds, setExpandedAppointmentIds] = useState<
    string[]
  >([]);
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [filterTime, setFilterTime] = useState<string | null>(null);
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const { data: appointmentData, refetch: refetchAppointments } = useQuery(
    GET_PERSONNEL_APPOINTMENTS,
    {
      variables: { id: userId },
      skip: !userId,
    }
  );

  useFocusEffect(
    React.useCallback(() => {
      if (!userId) return;

      setIsLoading(true);

      refetchAppointments()
        .then(({ data }) => {
          const appointments = data?.getPersonnel.appointments || [];
          const sortedAppointments = appointments
            .slice()
            .sort(
              (a: Appointment, b: Appointment) =>
                new Date(`${a.date}T${a.time}`).getTime() -
                new Date(`${b.date}T${b.time}`).getTime()
            );
          setAppointments(sortedAppointments);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error al cargar las citas:", error);
          setIsLoading(false);
        });
    }, [userId, refetchAppointments])
  );

  const toggleExpanded = (id: string) => {
    setExpandedAppointmentIds((prev) =>
      prev.includes(id) ? prev.filter((appId) => appId !== id) : [...prev, id]
    );
  };

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
        onChange={(event, newDate) => {
          setFilterDate(newDate);
          setOpen(false);
        }}
      />
    );
  };

  const filteredAppointments = appointments.filter((app) => {
    const appDate = new Date(`${app.date}T${app.time}`);
    const matchesDate = filterDate
      ? appDate.toDateString() === filterDate.toDateString()
      : true;
    const matchesTime = filterTime ? app.time === filterTime : true;
    return matchesDate && matchesTime;
  });

  return (
    <GradientWrapper>
      <SafeAreaView>
        <View style={{ padding: Spacing * 2 }}>
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => navigate("Dashboard_Per")}
              disabled={isLoading}
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
              Mis Citas
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: Spacing * 2,
            }}
          >
            <TouchableOpacity
              onPress={() => setOpenDatePicker(true)}
              style={{
                backgroundColor: Colors.lightPrimary,
                borderRadius: Spacing,
                padding: Spacing,
                flex: 1,
                marginRight: Spacing,
                flexDirection: "row",
                alignItems: "baseline",
              }}
            >
              <FontAwesome
                name={"calendar-alt"}
                size={25}
                color={Colors.active}
              />
              <Text
                style={{
                  fontFamily: Font["poppins-regular"],
                  fontSize: FontSize.medium,
                  marginLeft: Spacing,
                }}
              >
                {filterDate
                  ? filterDate.toLocaleDateString("en-CA").split("T")[0]
                  : "Sin fecha"}
              </Text>
            </TouchableOpacity>

            {openDatePicker &&
              renderDateTimePicker(
                filterDate,
                setFilterDate,
                openDatePicker,
                setOpenDatePicker
              )}
            <View style={{ flex: 1 }}>
              <Picker
                style={{
                  fontFamily: Font["poppins-regular"],
                  fontSize: FontSize.small,
                  padding: Spacing * 2,
                  backgroundColor: Colors.lightPrimary,
                  borderRadius: Spacing,
                }}
                selectedValue={filterTime}
                onValueChange={(itemValue) => setFilterTime(itemValue)}
              >
                <Picker.Item label="Hora" value={null} />
                {schedule.map((time) => (
                  <Picker.Item key={time} label={time} value={time} />
                ))}
              </Picker>
            </View>
          </View>

          {isLoading ? (
            <AppointmentLoader />
          ) : (
            <ScrollView style={{ maxHeight: 520 }}>
              {filteredAppointments.length === 0 ? (
                <View
                  style={{
                    paddingHorizontal: Spacing * 2,
                    paddingTop: Spacing * 2,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ fontSize: FontSize.large, color: Colors.primary }}
                  >
                    No hay citas agendadas.
                  </Text>
                </View>
              ) : (
                filteredAppointments.map((app) => (
                  <TouchableOpacity
                    key={app.id}
                    onPress={() => toggleExpanded(app.id)}
                    style={{
                      backgroundColor: Colors.primary,
                      paddingVertical: Spacing,
                      paddingHorizontal: Spacing * 2,
                      marginVertical: Spacing / 2,
                      borderRadius: Spacing,
                      shadowColor: Colors.primary,
                      shadowOffset: { width: 0, height: Spacing },
                      shadowOpacity: 0.3,
                      shadowRadius: Spacing,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={{ justifyContent: "center" }}>
                        <Text
                          style={{
                            fontFamily: Font["poppins-bold"],
                            color: Colors.onPrimary,
                            fontSize: FontSize.medium,
                          }}
                        >
                          {app.type}
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={{
                            fontFamily: Font["poppins-bold"],
                            color: Colors.onPrimary,
                            fontSize: FontSize.medium,
                          }}
                        >
                          {app.date}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font["poppins-regular"],
                            color: Colors.onPrimary,
                            fontSize: FontSize.small,
                            textAlign: "right",
                          }}
                        >
                          {app.time}
                        </Text>
                      </View>
                    </View>
                    {expandedAppointmentIds.includes(app.id) && (
                      <View
                        style={{
                          marginTop: Spacing,
                          backgroundColor: Colors.onPrimary,
                          padding: Spacing,
                          borderRadius: Spacing,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Font["poppins-regular"],
                            color: Colors.primary,
                            fontSize: FontSize.small,
                          }}
                        >
                          Estado: {app.status}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font["poppins-regular"],
                            color: Colors.primary,
                            fontSize: FontSize.small,
                          }}
                        >
                          Paciente: {app.patient.first_name}{" "}
                          {app.patient.surname}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </GradientWrapper>
  );
};

export default My_Appointments_Per;

const styles = StyleSheet.create({});
