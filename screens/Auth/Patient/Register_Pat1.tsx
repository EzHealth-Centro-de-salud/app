import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Spacing from "../../../constants/Spacing";
import FontSize from "../../../constants/FontSize";
import Colors from "../../../constants/Colors";
import Font from "../../../constants/Font";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";
import AppTextInput from "../../../components/AppTextInput";
import { useQuery } from "@apollo/client";
import Toast from "react-native-toast-message";
import useButtonTimeout from "../../../hooks/useButtonTimeout";
import { Icon } from "@rneui/themed";
import GradientWrapper from "../../../components/GradientWrapper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useUserStore } from "../../../stores/useUserStore";
import { UNIQUE_RUT } from "../../../graphql/queries";

type Props = NativeStackScreenProps<RootStackParamList, "Register_Pat1">;

const capitalizeFirstLetter = (str: string) => {
  const lowercasedStr = str.toLowerCase();
  return lowercasedStr.charAt(0).toUpperCase() + lowercasedStr.slice(1);
};

const Register_Pat1: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [rut, setRut] = useState("");
  const [birth_date, setBirth_Date] = useState<Date | null>(null);
  const [first_name, setFirst_Name] = useState("");
  const [middle_name, setMiddle_Name] = useState("");
  const [surname, setSurname] = useState("");
  const [second_surname, setSecond_Surname] = useState("");
  const [sex, setSex] = useState("");
  const { setRegRut } = useUserStore();
  const { setRegBirthDate } = useUserStore();
  const { setRegFirstName } = useUserStore();
  const { setRegMiddleName } = useUserStore();
  const { setRegSurName } = useUserStore();
  const { setRegSecondSurName } = useUserStore();
  const { setRegSex } = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [openDatePicker, setOpenDatePicker] = useState(false);
  const { data, refetch } = useQuery(UNIQUE_RUT, { skip: true });

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
        maximumDate={new Date()}
        onChange={(event, newDate) => {
          if (newDate) {
            const adjustedDate = new Date(
              newDate.getTime() + newDate.getTimezoneOffset() * 60000
            );
            setDate(adjustedDate);
            setOpen(false);
          }
        }}
      />
    );
  };

  const handleValidation = async () => {
    setIsSubmitting(true);
    if (
      rut === "" ||
      first_name === "" ||
      surname === "" ||
      sex === "" ||
      birth_date === null
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Todos los campos deben estar llenos",
        position: "bottom",
        visibilityTime: 1500, // Duration in milliseconds
        autoHide: true,
      });
    } else {
      try {
        const result = await refetch({ rut });
        setRegRut(rut);
        setRegFirstName(first_name);
        setRegMiddleName(middle_name);
        setRegSurName(surname);
        setRegSecondSurName(second_surname);
        setRegBirthDate(birth_date);
        setRegSex(sex);
        navigate("Register_Pat2");
      } catch (e) {
        setIsSubmitting(false);
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
              onPress={() => navigate("Login")}
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
              Crea tu nueva cuenta
            </Text>
          </View>
          <AppTextInput
            placeholder="RUT"
            keyboardType="default"
            value={rut}
            onChangeText={setRut}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <View style={{ flex: 1, marginRight: 10 }}>
              <AppTextInput
                placeholder="Primer Nombre"
                value={capitalizeFirstLetter(first_name)}
                onChangeText={setFirst_Name}
                maxLength={20}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <AppTextInput
                placeholder="Segundo Nombre"
                value={capitalizeFirstLetter(middle_name)}
                onChangeText={setMiddle_Name}
                maxLength={20}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <View style={{ flex: 1, marginRight: 10 }}>
              <AppTextInput
                placeholder="Apellido Paterno"
                value={capitalizeFirstLetter(surname)}
                onChangeText={setSurname}
                maxLength={20}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <AppTextInput
                placeholder="Apellido Materno"
                value={capitalizeFirstLetter(second_surname)}
                onChangeText={setSecond_Surname}
                maxLength={20}
              />
            </View>
          </View>
          <View
            style={{
              marginVertical: Spacing * 1,
            }}
          >
            <TouchableOpacity
              onPress={() => setOpenDatePicker(true)}
              style={{
                backgroundColor: Colors.lightPrimary,
                borderRadius: Spacing,
                padding: Spacing * 1,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: Font["poppins-regular"],
                  fontSize: FontSize.small,
                }}
              >
                Fecha de Nacimiento:
              </Text>
              <Text>
                {birth_date
                  ? birth_date.toISOString().split("T")[0]
                  : "Sin fecha"}
              </Text>
            </TouchableOpacity>

            {openDatePicker &&
              renderDateTimePicker(
                birth_date,
                setBirth_Date,
                openDatePicker,
                setOpenDatePicker
              )}
            <Picker
              selectedValue={sex}
              onValueChange={(itemValue, itemIndex) => setSex(itemValue)}
              style={[
                {
                  fontFamily: Font["poppins-regular"],
                  fontSize: FontSize.small,
                  backgroundColor: Colors.lightPrimary,
                  borderRadius: Spacing,
                  marginTop: Spacing * 2,
                },
              ]}
            >
              <Picker.Item label="Sexo" value="" />
              <Picker.Item label="Masculino" value="Masculino" />
              <Picker.Item label="Femenino" value="Femenino" />
            </Picker>
          </View>
          <TouchableOpacity
            onPress={handleValidation}
            disabled={isLoading || isSubmitting}
            style={{
              padding: Spacing * 2,
              backgroundColor: isSubmitting ? Colors.disabled : Colors.primary,
              marginVertical: Spacing * 1,
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
          <TouchableOpacity
            onPress={() => navigate("Login")}
            disabled={isLoading || isSubmitting}
            style={{
              padding: Spacing,
            }}
          >
            <Text
              style={{
                fontFamily: Font["poppins-bold"],
                color: Colors.text,
                textAlign: "center",
                fontSize: FontSize.medium,
              }}
            >
              Ya tengo una cuenta
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GradientWrapper>
  );
};

export default Register_Pat1;
