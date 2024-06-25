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
import { MedicalRecord, Personnel, RootStackParamList } from "../../../types";
import { useUserStore } from "../../../stores/useUserStore";
import { Icon } from "@rneui/themed";
import GradientWrapper from "../../../components/GradientWrapper";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import { useQuery } from "@apollo/client";
import { GET_PATIENT_MEDICAL_RECORDS } from "../../../graphql/queries";
import AppointmentLoader from "../../../components/Loaders/AppointmentLoader";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { schedule } from "../../../constants/Schedule";
import { useFocusEffect } from "@react-navigation/native";

type Props = NativeStackScreenProps<RootStackParamList, "Medical_Record_Pat_1">;

const Medical_Record_Pat_1: React.FC<Props> = ({
  navigation: { navigate },
}) => {
  const { userId, setMedicalRecord } = useUserStore();
  const [medical_records, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [filterTime, setFilterTime] = useState<string | null>(null);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [idPersonnel, setIdPersonnel] = useState<number | null>(null);

  const { data: MedRecData, refetch: refetchMedRec } = useQuery(
    GET_PATIENT_MEDICAL_RECORDS,
    {
      variables: { id: userId },
      skip: true,
    }
  );

  useFocusEffect(
    React.useCallback(() => {
      if (!userId) return;

      setIsLoading(true);

      refetchMedRec()
        .then(({ data }) => {
          const medRecs = data?.getPatient.medical_records || [];
          const allPersonnel = medRecs.map((medRec) => medRec.personnel);
          const uniquePersonnel = allPersonnel.reduce((acc, current) => {
            const x = acc.find((item) => item.id === current.id);
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, []);
          setPersonnel(uniquePersonnel);
          setMedicalRecords(medRecs);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error al cargar el historial médico:", error);
          setIsLoading(false);
        });
    }, [userId, refetchMedRec])
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
        onChange={(event, newDate) => {
          setFilterDate(newDate);
          setOpen(false);
        }}
      />
    );
  };

  const filteredMedRec = medical_records.filter((medRec) => {
    const medRecDate = new Date(
      `${medRec.appointment.date}T${medRec.appointment.time}`
    );
    const matchesDate = filterDate
      ? medRecDate.toDateString() === filterDate.toDateString()
      : true;
    const matchesTime = filterTime
      ? medRec.appointment.time === filterTime
      : true;
    const matchesPersonnel = idPersonnel
      ? medRec.personnel.id === idPersonnel
      : true;
    return matchesDate && matchesTime && matchesPersonnel;
  });

  const handleSelection = (medical_record: MedicalRecord) => {
    setMedicalRecord(medical_record);
    navigate("Medical_Record_Pat_2");
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
              selectedValue={idPersonnel}
              onValueChange={(itemValue) => setIdPersonnel(itemValue)}
            >
              <Picker.Item label="Médico" value={null} />
              {personnel.map((per) => (
                <Picker.Item
                  key={per.id}
                  label={
                    per.first_name + " " + per.surname + " - " + per.speciality
                  }
                  value={per.id}
                />
              ))}
            </Picker>
          </View>
          {isLoading ? (
            <AppointmentLoader />
          ) : (
            <ScrollView style={{ maxHeight: 490 }}>
              {filteredMedRec.length === 0 ? (
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
                    No posee ningun historial médico.
                  </Text>
                </View>
              ) : (
                filteredMedRec.map((record) => (
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
                          {record.personnel.first_name}{" "}
                          {record.personnel.surname}
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

export default Medical_Record_Pat_1;
