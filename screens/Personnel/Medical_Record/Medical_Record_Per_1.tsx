import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Spacing from "../../../constants/Spacing";
import FontSize from "../../../constants/FontSize";
import Colors from "../../../constants/Colors";
import Font from "../../../constants/Font";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MedicalRecord, RootStackParamList } from "../../../types";
import { useUserStore } from "../../../stores/useUserStore";
import { Icon } from "@rneui/themed";
import GradientWrapper from "../../../components/GradientWrapper";
import FontAwesome from "react-native-vector-icons/FontAwesome5";

type Props = NativeStackScreenProps<RootStackParamList, "Medical_Record_Per_1">;

const Medical_Record_Per_1: React.FC<Props> = ({
  navigation: { navigate },
}) => {
  const { patient, setMedicalRecord } = useUserStore();

  const handleSelection = (medical_record: MedicalRecord) => {
    setMedicalRecord(medical_record);
    navigate("Medical_Record_Per_2");
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
              onPress={() => navigate("Patient_Profile")}
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
              Historial Médico
            </Text>
          </View>
          <ScrollView style={{ maxHeight: 610 }}>
            {patient.medical_records.length === 0 ? (
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
                  No hay ningun historial médico para este paciente.
                </Text>
              </View>
            ) : (
              patient.medical_records.map((record) => (
                <TouchableOpacity
                  key={record.id}
                  onPress={() => handleSelection(record)}
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
                        {record.appointment.date} - {record.appointment.time}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font["poppins-bold"],
                          color: Colors.onPrimary,
                          fontSize: FontSize.medium,
                        }}
                      >
                        {record.personnel.first_name} {record.personnel.surname}
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
        </View>
      </SafeAreaView>
    </GradientWrapper>
  );
};

export default Medical_Record_Per_1;
