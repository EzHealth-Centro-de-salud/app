import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMutation, useQuery } from "@apollo/client";
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
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";
import {
  CANCEL_APPOINTMENT,
  CONFIRM_APPOINTMENT,
} from "../../../graphql/mutations";

type Props = NativeStackScreenProps<RootStackParamList, "My_Appointments_Per">;

const My_Appointments_Per: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { userId, setAppId, setAppPatient } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [expandedAppointmentIds, setExpandedAppointmentIds] = useState<
    string[]
  >([]);
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [filterTime, setFilterTime] = useState<string | null>(null);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>("Pendiente");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const { data: appointmentData, refetch: refetchAppointments } = useQuery(
    GET_PERSONNEL_APPOINTMENTS,
    {
      variables: { id: userId },
      skip: !userId,
    }
  );

  const [confirmAppointment] = useMutation(CONFIRM_APPOINTMENT);
  const [cancelAppointment] = useMutation(CANCEL_APPOINTMENT);

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

  const handleOpenModal = (action, app) => {
    setSelectedAction(action);
    setSelectedAppointment(app);
    setModalVisible(true);
  };

  const handleAction = () => {
    switch (selectedAction) {
      case "confirm":
        handleConfirm();
        break;
      case "reschedule":
        setAppId(parseInt(selectedAppointment.id));
        setAppPatient(selectedAppointment.patient);
        setModalVisible(false);
        navigate("Reschedule_1");
        break;
      case "cancel":
        handleCancel();
        break;
      default:
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Ha ocurrido un error inesperado",
          position: "bottom",
          visibilityTime: 3000, // Duration in milliseconds
          autoHide: true,
        });
        break;
    }
  };

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      const { data } = await confirmAppointment({
        variables: {
          input: {
            id_appointment: selectedAppointment.id,
            id_personnel: userId,
          },
        },
      });
      if (data?.confirmAppointment) {
        Toast.show({
          type: "success",
          text1: "Éxito",
          text2: data.confirmAppointment.message,
          position: "bottom",
          visibilityTime: 3000, // Duration in milliseconds
          autoHide: true,
        });
        setModalVisible(false);
        setIsLoading(false);
        refetchAppointments().then(({ data }) => {
          const appointments = data?.getPersonnel.appointments || [];
          const sortedAppointments = appointments
            .slice()
            .sort(
              (a: Appointment, b: Appointment) =>
                new Date(`${a.date}T${a.time}`).getTime() -
                new Date(`${b.date}T${b.time}`).getTime()
            );
          setAppointments(sortedAppointments);
          toggleExpanded(selectedAppointment.id);
          setIsLoading(false);
        });
      }
    } catch (e) {
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
  };

  const handleCancel = async () => {
    try {
      setIsLoading(true);
      const { data } = await cancelAppointment({
        variables: {
          input: {
            id_appointment: selectedAppointment.id,
            id_personnel: userId,
          },
        },
      });
      if (data?.cancelAppointment) {
        Toast.show({
          type: "success",
          text1: "Éxito",
          text2: data.cancelAppointment.message,
          position: "bottom",
          visibilityTime: 3000, // Duration in milliseconds
          autoHide: true,
        });
        setModalVisible(false);
        setIsLoading(false);
        refetchAppointments().then(({ data }) => {
          const appointments = data?.getPersonnel.appointments || [];
          const sortedAppointments = appointments
            .slice()
            .sort(
              (a: Appointment, b: Appointment) =>
                new Date(`${a.date}T${a.time}`).getTime() -
                new Date(`${b.date}T${b.time}`).getTime()
            );
          setAppointments(sortedAppointments);
          toggleExpanded(selectedAppointment.id);
          setIsLoading(false);
        });
      }
    } catch (e) {
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
    const matchesStatus = filterStatus ? app.status === filterStatus : true;
    return matchesDate && matchesTime && matchesStatus;
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
              marginBottom: Spacing,
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
          <View style={{ marginBottom: Spacing }}>
            <Picker
              style={{
                fontFamily: Font["poppins-regular"],
                fontSize: FontSize.small,
                padding: Spacing * 2,
                backgroundColor: Colors.lightPrimary,
                borderRadius: Spacing,
              }}
              selectedValue={filterStatus}
              onValueChange={(itemValue) => setFilterStatus(itemValue)}
            >
              <Picker.Item label="Estado" value={null} />
              <Picker.Item label="Pendiente" value="Pendiente" />
              <Picker.Item label="Confirmada" value="Confirmada" />
              <Picker.Item label="Cancelada" value="Cancelada" />
              <Picker.Item label="Completada" value="Completada" />
            </Picker>
          </View>

          {isLoading ? (
            <AppointmentLoader />
          ) : (
            <ScrollView style={{ maxHeight: 480 }}>
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
                    disabled={
                      app.status === "Cancelada" || app.status === "Completada"
                    }
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
                      <View>
                        <Text
                          style={{
                            fontFamily: Font["poppins-bold"],
                            color: Colors.onPrimary,
                            fontSize: FontSize.medium,
                          }}
                        >
                          {app.type}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font["poppins-regular"],
                            color: Colors.onPrimary,
                            fontSize: FontSize.small,
                            textAlign: "left",
                          }}
                        >
                          {app.status}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font["poppins-bold"],
                            color: Colors.onPrimary,
                            fontSize: FontSize.medium,
                          }}
                        >
                          {app.patient.first_name} {app.patient.surname}
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
                        {app.status === "Pendiente" && (
                          <View>
                            <View
                              style={{
                                flexDirection: "row",
                                marginTop: Spacing,
                                justifyContent: "center",
                              }}
                            >
                              <TouchableOpacity
                                style={{
                                  backgroundColor: Colors.success,
                                  padding: Spacing,
                                  borderRadius: Spacing,
                                  alignItems: "center",
                                  marginHorizontal: Spacing / 2,
                                }}
                                onPress={() => handleOpenModal("confirm", app)}
                              >
                                <Text
                                  style={{
                                    color: Colors.onPrimary,
                                    fontFamily: Font["poppins-bold"],
                                    fontSize: FontSize.small,
                                  }}
                                >
                                  Confirmar
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={{
                                  backgroundColor: "#ffad04",
                                  padding: Spacing,
                                  borderRadius: Spacing,
                                  alignItems: "center",
                                  marginHorizontal: Spacing / 2,
                                }}
                                onPress={() =>
                                  handleOpenModal("reschedule", app)
                                }
                              >
                                <Text
                                  style={{
                                    color: Colors.onPrimary,
                                    fontFamily: Font["poppins-bold"],
                                    fontSize: FontSize.small,
                                  }}
                                >
                                  Reprogramar
                                </Text>
                              </TouchableOpacity>
                            </View>
                            <View
                              style={{
                                marginTop: Spacing,
                                alignItems: "center", // Center the button horizontally
                              }}
                            >
                              <TouchableOpacity
                                style={{
                                  backgroundColor: Colors.error,
                                  padding: Spacing,
                                  borderRadius: Spacing,
                                  width: "50%",
                                  alignItems: "center",
                                }}
                                onPress={() => handleOpenModal("cancel", app)}
                              >
                                <Text
                                  style={{
                                    color: Colors.onPrimary,
                                    fontFamily: Font["poppins-bold"],
                                    fontSize: FontSize.small,
                                  }}
                                >
                                  Cancelar
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        )}
                        {app.status === "Confirmada" && (
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "center",
                            }}
                          >
                            <TouchableOpacity
                              style={{
                                backgroundColor: "#ffad04",
                                padding: Spacing,
                                borderRadius: Spacing,
                                alignItems: "center",
                                marginHorizontal: Spacing / 2,
                              }}
                              onPress={() => handleOpenModal("reschedule", app)}
                            >
                              <Text
                                style={{
                                  color: Colors.onPrimary,
                                  fontFamily: Font["poppins-bold"],
                                  fontSize: FontSize.small,
                                }}
                              >
                                Reprogramar
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{
                                backgroundColor: Colors.error,
                                padding: Spacing,
                                borderRadius: Spacing,
                                width: "50%",
                                alignItems: "center",
                              }}
                              onPress={() => handleOpenModal("cancel", app)}
                            >
                              <Text
                                style={{
                                  color: Colors.onPrimary,
                                  fontFamily: Font["poppins-bold"],
                                  fontSize: FontSize.small,
                                }}
                              >
                                Cancelar
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          )}
        </View>
        <Modal
          isVisible={modalVisible}
          onBackdropPress={() => setModalVisible(false)}
        >
          <View style={{ backgroundColor: "white", padding: 20 }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: Font["poppins-bold"],
                marginBottom: 20,
              }}
            >
              {selectedAction === "confirm" &&
                "¿Estás seguro de que quieres confirmar esta cita?"}
              {selectedAction === "reschedule" &&
                "¿Estás seguro de que quieres reprogramar esta cita?"}
              {selectedAction === "cancel" &&
                "¿Estás seguro de que quieres cancelar esta cita?"}
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              <TouchableOpacity
                disabled={isLoading}
                onPress={() => handleAction()}
                style={{
                  backgroundColor:
                    selectedAction === "confirm"
                      ? Colors.success
                      : selectedAction === "reschedule"
                      ? "#ffad04"
                      : Colors.error,
                  padding: Spacing * 1,
                  borderRadius: Spacing,
                  shadowColor:
                    selectedAction === "confirm"
                      ? Colors.success
                      : selectedAction === "reschedule"
                      ? "#ffad04"
                      : Colors.error,
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
                  }}
                >
                  {selectedAction === "confirm" && "Confirmar"}
                  {selectedAction === "reschedule" && "Reprogramar"}
                  {selectedAction === "cancel" && "Cancelar"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={isLoading}
                onPress={() => setModalVisible(false)}
                style={{
                  backgroundColor: Colors.primary,
                  padding: Spacing * 1,
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
                  }}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </GradientWrapper>
  );
};

export default My_Appointments_Per;
