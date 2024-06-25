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
import { RootStackParamList } from "../../../types";
import { useUserStore } from "../../../stores/useUserStore";
import { Icon } from "@rneui/themed";
import GradientWrapper from "../../../components/GradientWrapper";
import FontAwesome from "react-native-vector-icons/FontAwesome5";

type Props = NativeStackScreenProps<RootStackParamList, "Medical_Record_Pat_2">;

const Medical_Record_Pat_2: React.FC<Props> = ({
  navigation: { navigate },
}) => {
  const { medicalRecord } = useUserStore();
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [showPrescription, setShowPrescription] = useState(false);

  function toggleSection(section) {
    if (section === "diagnosis") setShowDiagnosis(!showDiagnosis);
    else if (section === "prescription") setShowPrescription(!showPrescription);
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
              onPress={() => navigate("Medical_Record_Pat_1")}
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
          <TouchableOpacity
            onPress={() => toggleSection("diagnosis")}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: Spacing,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome
                name="notes-medical"
                size={20}
                color={Colors.primary}
                style={{ marginRight: 10, marginBottom: 9 }}
              />
              <Text
                style={{
                  fontSize: FontSize.large,
                  color: Colors.primary,
                  fontFamily: Font["poppins-bold"],
                }}
              >
                Diagnostico
              </Text>
            </View>
            <FontAwesome
              name={showDiagnosis ? "chevron-up" : "chevron-down"}
              size={20}
              color={Colors.primary}
            />
          </TouchableOpacity>
          {showDiagnosis && (
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
                {medicalRecord.diagnosis}
              </Text>
            </View>
          )}
          <TouchableOpacity
            onPress={() => toggleSection("prescription")}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: Spacing,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome
                name="pills"
                size={20}
                color={Colors.primary}
                style={{ marginRight: 10, marginBottom: 9 }}
              />
              <Text
                style={{
                  fontSize: FontSize.large,
                  color: Colors.primary,
                  fontFamily: Font["poppins-bold"],
                }}
              >
                Prescripción
              </Text>
            </View>
            <FontAwesome
              name={showPrescription ? "chevron-up" : "chevron-down"}
              size={20}
              color={Colors.primary}
            />
          </TouchableOpacity>
          {showPrescription && (
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
                {medicalRecord.prescription}
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </GradientWrapper>
  );
};

export default Medical_Record_Pat_2;
