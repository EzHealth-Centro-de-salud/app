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
import { useUserStore } from "../../../../stores/useUserStore";
import Spacing from "../../../../constants/Spacing";
import FontSize from "../../../../constants/FontSize";
import Colors from "../../../../constants/Colors";
import Font from "../../../../constants/Font";
import GradientWrapper from "../../../../components/GradientWrapper";
import { GET_PATIENT_APPOINTMENTS } from "../../../../graphql/queries";
import { Appointment, RootStackParamList } from "../../../../types";
import AppointmentLoader from "../../../../components/Loaders/AppointmentLoader";

const { height } = Dimensions.get("window");

type Props = NativeStackScreenProps<RootStackParamList, "My_Appointments_Pat">;

const My_Appointments_Pat: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { userId } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [expandedAppointmentIds, setExpandedAppointmentIds] = useState<
    string[]
  >([]);

  const { data: appointmentData, refetch: refetchAppointments } = useQuery(
    GET_PATIENT_APPOINTMENTS,
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
          const appointments = data?.getPatient.appointments || [];
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

  return (
    <GradientWrapper>
      <SafeAreaView>
        <View style={{ padding: Spacing * 2 }}>
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => navigate("Dashboard_Pat")}
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

          {isLoading ? (
            <AppointmentLoader />
          ) : (
            <ScrollView style={{ maxHeight: 600 }}>
              {appointments.length === 0 ? (
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
                appointments.map((app) => (
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
                          Medico: {app.personnel.first_name}{" "}
                          {app.personnel.surname}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font["poppins-regular"],
                            color: Colors.primary,
                            fontSize: FontSize.small,
                          }}
                        >
                          Especialidad: {app.personnel.speciality}
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

export default My_Appointments_Pat;

const styles = StyleSheet.create({});
