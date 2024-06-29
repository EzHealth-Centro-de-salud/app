import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
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
import { GET_ALL_PATIENTS } from "../../../graphql/queries";
import { Patient, RootStackParamList } from "../../../types";
import AppointmentLoader from "../../../components/Loaders/AppointmentLoader";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import AppTextInput from "../../../components/AppTextInput";

type Props = NativeStackScreenProps<RootStackParamList, "Patients_List">;

const Patients_List: React.FC<Props> = ({ navigation: { navigate } }) => {
  const { setPatient } = useUserStore();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rut, setRut] = useState<string>("");
  const [name, setName] = useState<string>("");

  const { data: patientsData, refetch: refetchPatients } = useQuery(
    GET_ALL_PATIENTS,
    {
      skip: true,
    }
  );

  function formatRut(rut) {
    const rutStr = rut.toString();
    let formattedRut = rutStr.slice(0, -1) + "-" + rutStr.slice(-1);
    return formattedRut.replace(/\B(?=(\d{3})+(?!\d)\-)/g, ".");
  }

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);

      refetchPatients()
        .then(({ data }) => {
          const patients = data?.getAllPatients || [];
          setPatients(patients);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error al cargar el listado de pacientes:", error);
          setIsLoading(false);
        });
    }, [refetchPatients])
  );

  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.first_name} ${patient.middle_name} ${patient.surname} ${patient.second_surname}`;
    const normalizedInputRut = rut.replace(/\./g, "").replace(/-/g, "");

    return (
      fullName.toLowerCase().includes(name.toLowerCase()) &&
      patient.rut.includes(normalizedInputRut)
    );
  });

  const handleSelection = async (patient: Patient) => {
    setIsLoading(true);
    setPatient(patient);
    setIsLoading(false);
    navigate("Patient_Profile");
  };

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
              Lista de Pacientes
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <View style={{ flex: 1, marginRight: 10 }}>
              <AppTextInput
                placeholder="Nombre"
                value={name}
                onChangeText={setName}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <AppTextInput
                placeholder="RUT"
                keyboardType="numeric"
                value={rut}
                onChangeText={setRut}
              />
            </View>
          </View>

          {isLoading ? (
            <AppointmentLoader />
          ) : (
            <ScrollView style={{ maxHeight: 520 }}>
              {filteredPatients.length === 0 ? (
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
                    No hay pacientes registrados.
                  </Text>
                </View>
              ) : (
                filteredPatients.map((pat) => (
                  <TouchableOpacity
                    key={pat.id}
                    onPress={() => handleSelection(pat)}
                    disabled={pat.medical_records.length === 0}
                    style={{
                      backgroundColor:
                        pat.medical_records.length === 0
                          ? Colors.disabled
                          : Colors.primary,
                      paddingVertical: Spacing,
                      paddingHorizontal: Spacing * 2,
                      marginVertical: Spacing / 2,
                      borderRadius: Spacing,
                      shadowColor:
                        pat.medical_records.length === 0
                          ? Colors.disabled
                          : Colors.primary,
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
                          {pat.first_name} {pat.middle_name} {pat.surname}{" "}
                          {pat.second_surname}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font["poppins-light"],
                            color: Colors.onPrimary,
                            fontSize: FontSize.medium,
                          }}
                        >
                          {pat.region}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font["poppins-light"],
                            color: Colors.onPrimary,
                            fontSize: FontSize.medium,
                          }}
                        >
                          {formatRut(pat.rut)}
                        </Text>
                      </View>
                      <FontAwesome
                        name="chevron-right"
                        size={20}
                        color={Colors.onPrimary}
                        style={{ alignSelf: "center" }}
                      />
                    </View>
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

export default Patients_List;
