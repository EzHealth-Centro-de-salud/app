import React, { useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import Spacing from "../../../constants/Spacing";
import FontSize from "../../../constants/FontSize";
import Colors from "../../../constants/Colors";
import Font from "../../../constants/Font";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";
import { useUserStore } from "../../../stores/useUserStore";
import { Icon } from "@rneui/themed";
import GradientWrapper from "../../../components/GradientWrapper";
import FontAwesome from "react-native-vector-icons/FontAwesome5";

type Props = NativeStackScreenProps<RootStackParamList, "Patient_Profile">;

const Patient_Profile: React.FC<Props> = ({ navigation: { navigate } }) => {
  const { patient } = useUserStore();
  const [showPersonalInfo, setShowPersonalInfo] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [showLocation, setShowLocation] = useState(false);

  function toggleSection(section) {
    if (section === "personalInfo") setShowPersonalInfo(!showPersonalInfo);
    else if (section === "contact") setShowContact(!showContact);
    else if (section === "location") setShowLocation(!showLocation);
  }

  function formatRut(rut) {
    const rutStr = rut.toString();
    let formattedRut = rutStr.slice(0, -1) + "-" + rutStr.slice(-1);
    return formattedRut.replace(/\B(?=(\d{3})+(?!\d)\-)/g, ".");
  }

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
              onPress={() => navigate("Patients_List")}
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
                marginBottom: Spacing,
                textAlign: "center",
              }}
            >
              Perfil de Paciente
            </Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => toggleSection("personalInfo")}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: Spacing,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome
                  name="address-card"
                  size={20}
                  color={Colors.primary}
                  style={{ marginRight: 10 }}
                />
                <Text
                  style={{
                    fontSize: FontSize.large,
                    color: Colors.primary,
                    fontFamily: Font["poppins-bold"],
                  }}
                >
                  Información Personal
                </Text>
              </View>
              <FontAwesome
                name={showPersonalInfo ? "chevron-up" : "chevron-down"}
                size={20}
                color={Colors.primary}
              />
            </TouchableOpacity>
            {showPersonalInfo && (
              <View>
                <Text
                  style={{
                    fontSize: FontSize.medium,
                    color: Colors.primary,
                    fontFamily: Font["poppins-regular"],
                    marginBottom: Spacing,
                    textAlign: "left",
                  }}
                >
                  RUT: {formatRut(patient.rut)}
                </Text>
                <Text
                  style={{
                    fontSize: FontSize.medium,
                    color: Colors.primary,
                    fontFamily: Font["poppins-regular"],
                    marginBottom: Spacing,
                    textAlign: "left",
                  }}
                >
                  Nombres: {patient.first_name} {patient.middle_name}
                </Text>
                <Text
                  style={{
                    fontSize: FontSize.medium,
                    color: Colors.primary,
                    fontFamily: Font["poppins-regular"],
                    marginBottom: Spacing,
                    textAlign: "left",
                  }}
                >
                  Apellidos: {patient.surname} {patient.second_surname}
                </Text>
                <Text
                  style={{
                    fontSize: FontSize.medium,
                    color: Colors.primary,
                    fontFamily: Font["poppins-regular"],
                    marginBottom: Spacing,
                    textAlign: "left",
                  }}
                >
                  Fecha de Nacimiento:{" "}
                  {new Date(patient.birthdate).toLocaleDateString()}
                </Text>
                <Text
                  style={{
                    fontSize: FontSize.medium,
                    color: Colors.primary,
                    fontFamily: Font["poppins-regular"],
                    marginBottom: Spacing,
                    textAlign: "left",
                  }}
                >
                  Sexo: {patient.sex}
                </Text>
              </View>
            )}

            <TouchableOpacity
              onPress={() => toggleSection("contact")}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: Spacing,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome
                  name="envelope"
                  size={20}
                  color={Colors.primary}
                  style={{ marginRight: 10 }}
                />
                <Text
                  style={{
                    fontSize: FontSize.large,
                    color: Colors.primary,
                    fontFamily: Font["poppins-bold"],
                  }}
                >
                  Contacto
                </Text>
              </View>
              <FontAwesome
                name={showContact ? "chevron-up" : "chevron-down"}
                size={20}
                color={Colors.primary}
              />
            </TouchableOpacity>
            {showContact && (
              <View>
                <Text
                  style={{
                    fontSize: FontSize.medium,
                    color: Colors.primary,
                    fontFamily: Font["poppins-regular"],
                    marginBottom: Spacing,
                    textAlign: "left",
                  }}
                >
                  Correo: {patient.email}
                </Text>
                <Text
                  style={{
                    fontSize: FontSize.medium,
                    color: Colors.primary,
                    fontFamily: Font["poppins-regular"],
                    marginBottom: Spacing,
                    textAlign: "left",
                  }}
                >
                  Teléfono: {patient.phone}
                </Text>
              </View>
            )}
            <TouchableOpacity
              onPress={() => toggleSection("location")}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: Spacing,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome
                  name="map-marker-alt"
                  size={20}
                  color={Colors.primary}
                  style={{ marginRight: 10 }}
                />
                <Text
                  style={{
                    fontSize: FontSize.large,
                    color: Colors.primary,
                    fontFamily: Font["poppins-bold"],
                  }}
                >
                  Ubicación
                </Text>
              </View>
              <FontAwesome
                name={showLocation ? "chevron-up" : "chevron-down"}
                size={20}
                color={Colors.primary}
              />
            </TouchableOpacity>
            {showLocation && (
              <View>
                <Text
                  style={{
                    fontSize: FontSize.medium,
                    color: Colors.primary,
                    fontFamily: Font["poppins-regular"],
                    marginBottom: Spacing,
                    textAlign: "left",
                  }}
                >
                  Región: {patient.region}
                </Text>
                <Text
                  style={{
                    fontSize: FontSize.medium,
                    color: Colors.primary,
                    fontFamily: Font["poppins-regular"],
                    marginBottom: Spacing,
                    textAlign: "left",
                  }}
                >
                  Comuna: {patient.commune}
                </Text>
                <Text
                  style={{
                    fontSize: FontSize.medium,
                    color: Colors.primary,
                    fontFamily: Font["poppins-regular"],
                    marginBottom: Spacing,
                    textAlign: "left",
                  }}
                >
                  Dirección: {patient.address}
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            onPress={() => navigate("Medical_Record_Per_1")}
            style={{
              padding: Spacing * 2,
              backgroundColor: Colors.primary,
              marginVertical: Spacing,
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
                fontSize: FontSize.large,
                color: Colors.onPrimary,
                fontFamily: Font["poppins-bold"],
                textAlign: "center",
              }}
            >
              Ver Historial Médico
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GradientWrapper>
  );
};

export default Patient_Profile;
