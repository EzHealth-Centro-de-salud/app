import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Spacing from "../../../constants/Spacing";
import FontSize from "../../../constants/FontSize";
import Colors from "../../../constants/Colors";
import Font from "../../../constants/Font";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";
import AppTextInput from "../../../components/AppTextInput";
import { useMutation, useQuery } from "@apollo/client";
import Toast from "react-native-toast-message";
import useButtonTimeout from "../../../hooks/useButtonTimeout";
import { Icon } from "@rneui/themed";
import GradientWrapper from "../../../components/GradientWrapper";
import { CREATE_PATIENT } from "../../../graphql/mutations";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useUserStore } from "../../../stores/useUserStore";

type Props = NativeStackScreenProps<RootStackParamList, "Register_Pat2">;

const capitalizeFirstLetter = (str: string) => {
  const lowercasedStr = str.toLowerCase();
  return lowercasedStr.charAt(0).toUpperCase() + lowercasedStr.slice(1);
};

const Register_Pat2: React.FC<Props> = ({ navigation: { navigate } }) => {
  const {
    reg_rut,
    reg_firstName,
    reg_middleName,
    reg_surName,
    reg_secondSurName,
    reg_sex,
    reg_birthDate,
  } = useUserStore();
  const [address, setAddress] = useState("");
  const [region, setRegion] = useState("");
  const [commune, setCommune] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [createPatient] = useMutation(CREATE_PATIENT);

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
            setDate(newDate);
            setOpen(false);
          }
        }}
      />
    );
  };

  const handleRegister = async () => {
    setIsSubmitting(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      reg_rut === "" ||
      reg_firstName === "" ||
      reg_surName === "" ||
      reg_birthDate === null ||
      reg_sex === "" ||
      address === "" ||
      region === "" ||
      commune === "" ||
      phone === "" ||
      email === "" ||
      password === ""
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
      if (!emailRegex.test(email)) {
        Toast.show({
          type: "error",
          text1: "Correo electrónico no válido",
          text2: "Intente nuevamente",
          position: "bottom",
          visibilityTime: 1500,
          autoHide: true,
        });
        setIsSubmitting(false);
        return;
      }
      try {
        setIsLoading(true);
        const { data } = await createPatient({
          variables: {
            input: {
              rut: reg_rut,
              birthdate: reg_birthDate,
              first_name: capitalizeFirstLetter(reg_firstName),
              middle_name: capitalizeFirstLetter(reg_middleName),
              surname: capitalizeFirstLetter(reg_surName),
              second_surname: capitalizeFirstLetter(reg_secondSurName),
              sex: reg_sex,
              address,
              region,
              commune,
              phone,
              email: email.toLowerCase(),
              password,
            },
          },
        });
        setIsLoading(false);
        if (data?.createPatient) {
          Toast.show({
            type: "success",
            text1: "Registro exitoso",
            text2: "Ahora puede iniciar sesión",
            position: "bottom",
            visibilityTime: 3000, // Duration in milliseconds
            autoHide: true,
          });
          navigate("Login");
        }
      } catch (e) {
        setIsSubmitting(false);
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
              onPress={() => navigate("Register_Pat1")}
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
            placeholder="Correo"
            keyboardType="email-address"
            autoComplete="email"
            value={email.toLowerCase()}
            onChangeText={setEmail}
            maxLength={40}
          />
          <AppTextInput
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            maxLength={20}
          />
          <AppTextInput
            placeholder="Número de teléfono"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            maxLength={9}
          />
          <Picker
            selectedValue={region}
            onValueChange={(itemValue, itemIndex) => setRegion(itemValue)}
            style={[
              {
                fontFamily: Font["poppins-regular"],
                fontSize: FontSize.small,
                backgroundColor: Colors.lightPrimary,
                borderRadius: Spacing,
                marginVertical: Spacing * 1,
              },
            ]}
          >
            <Picker.Item label="Región" value="" />
            <Picker.Item
              label="Arica y Parinacota"
              value="Arica y Parinacota"
            />
            <Picker.Item label="Tarapacá" value="Tarapacá" />
            <Picker.Item label="Antofagasta" value="Antofagasta" />
            <Picker.Item label="Atacama" value="Atacama" />
            <Picker.Item label="Coquimbo" value="Coquimbo" />
            <Picker.Item label="Valparaíso" value="Valparaíso" />
            <Picker.Item label="Metropolitana" value="Metropolitana" />
            <Picker.Item label="O'Higgins" value="O'Higgins" />
            <Picker.Item label="Maule" value="Maule" />
            <Picker.Item label="Ñuble" value="Ñuble" />
            <Picker.Item label="Biobío" value="Biobío" />
            <Picker.Item label="Araucanía" value="Araucanía" />
            <Picker.Item label="Los Ríos" value="Los Ríos" />
            <Picker.Item label="Los Lagos" value="Los Lagos" />
            <Picker.Item label="Aysén" value="Aysén" />
            <Picker.Item label="Magallanes" value="Magallanes" />
          </Picker>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <View style={{ flex: 1, marginRight: 10 }}>
              <AppTextInput
                placeholder="Dirección"
                value={address}
                onChangeText={setAddress}
                maxLength={100}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <AppTextInput
                placeholder="Comuna"
                value={commune}
                onChangeText={setCommune}
                maxLength={60}
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={handleRegister}
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
              <Text
                style={{
                  fontFamily: Font["poppins-bold"],
                  color: Colors.onPrimary,
                  textAlign: "center",
                  fontSize: FontSize.large,
                }}
              >
                Crear Cuenta
              </Text>
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

export default Register_Pat2;
