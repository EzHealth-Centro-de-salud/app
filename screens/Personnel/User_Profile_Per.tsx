import React, { useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import Spacing from "../../constants/Spacing";
import FontSize from "../../constants/FontSize";
import Colors from "../../constants/Colors";
import Font from "../../constants/Font";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Personnel, RootStackParamList } from "../../types";
import { useUserStore } from "../../stores/useUserStore";
import { Icon } from "@rneui/themed";
import GradientWrapper from "../../components/GradientWrapper";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import { useQuery } from "@apollo/client";
import { GET_PERSONNEL } from "../../graphql/queries";
import { useFocusEffect } from "@react-navigation/native";
import AppointmentLoader from "../../components/Loaders/AppointmentLoader";

type Props = NativeStackScreenProps<RootStackParamList, "User_Profile_Per">;

const User_Profile_Per: React.FC<Props> = ({ navigation: { navigate } }) => {
  const { userId } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showPersonalInfo, setShowPersonalInfo] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [showSpeciality, setShowSpeciality] = useState(false);
  const [personnel, setPersonnel] = useState<Personnel | null>(null);

  const { data: personnelData, refetch: refetchPersonnel } = useQuery(
    GET_PERSONNEL,
    {
      variables: { id: userId },
      skip: !userId,
    }
  );

  useFocusEffect(
    React.useCallback(() => {
      if (!userId) return;

      setIsLoading(true);
      refetchPersonnel()
        .then(({ data }) => {
          const personnel = data?.getPersonnel || [];
          setPersonnel(personnel);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error al cargar la información del usuario:", error);
          setIsLoading(false);
        });
    }, [userId, refetchPersonnel])
  );

  function toggleSection(section) {
    if (section === "personalInfo") setShowPersonalInfo(!showPersonalInfo);
    else if (section === "contact") setShowContact(!showContact);
    else if (section === "speciality") setShowSpeciality(!showSpeciality);
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
              onPress={() => navigate("Dashboard_Per")}
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
              Mi Perfil
            </Text>
          </View>
          {isLoading ? (
            <AppointmentLoader />
          ) : (
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
                    RUT: {formatRut(personnel?.rut)}
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
                    Nombres: {personnel?.first_name} {personnel.middle_name}
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
                    Apellidos: {personnel?.surname} {personnel.second_surname}
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
                    Correo: {personnel?.email}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                onPress={() => toggleSection("speciality")}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: Spacing,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesome
                    name="user-md"
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
                    Especialidad
                  </Text>
                </View>
                <FontAwesome
                  name={showSpeciality ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={Colors.primary}
                />
              </TouchableOpacity>
              {showSpeciality && (
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
                    Especialidad: {personnel?.speciality}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </SafeAreaView>
    </GradientWrapper>
  );
};

export default User_Profile_Per;
