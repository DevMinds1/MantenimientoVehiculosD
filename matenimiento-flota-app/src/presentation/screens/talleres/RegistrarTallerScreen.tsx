import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { globalStyles } from "../../theme/theme";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Checkbox from "expo-checkbox";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootButtonParams } from "../../routes/ButtonTabsNavigator";

export const RegistrarTallerScreen = () => {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<RootButtonParams>>();
  const [mechanic, setMechanic] = useState(false);
  const [dealership, setDealership] = useState(false);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  const handleMechanicChange = (value: boolean) => {
    setMechanic(value);
    if (value) setDealership(false);
  };

  const handleDealershipChange = (value: boolean) => {
    setDealership(value);
    if (value) setMechanic(false);
  };

  const handleSubmit = async () => {
    if (!name || !address || !phone || !city || (!mechanic && !dealership)) {
      alert("Por favor, complete todos los campos, son obligatorios.");
      return;
    }

    const TallerData = {
      name,
      address,
      phone,
      city,
      type: mechanic ? "Mecánica" : "Concesionario",
    };

    try {
      const response = await fetch(
        "https://us-central1-global-tine-447000-u6.cloudfunctions.net/repairshops/api/register_repairshop",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(TallerData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(data.message);

        navigation.navigate("HomeTab", { screen: "MiMecanicaScreen" });

        resetFields();
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error al registrar el vehículo:", error);
      alert("Error al conectar con el servidor.");
    }
  };
  const resetFields = () => {
    setName("");
    setCity("");
    setPhone("");
    setAddress("");
    setMechanic(false);
    setDealership(false);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={globalStyles(top).container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.containerTitle}>
            <SimpleLineIcons
              name="arrow-left"
              size={19}
              color="#004270"
              style={styles.iconStyle}
              onPress={() => navigation.navigate("HomeTab", { screen: "Home" })}
            />
            <Text style={styles.title}>Registro de Taller</Text>
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={styles.textimg}>Agregar imagen</Text>
            <View style={styles.contanierimg}>
              <MaterialCommunityIcons
                name="file-image-plus-outline"
                size={90}
                color="black"
                style={styles.iconStyleimg}
              />
            </View>
          </View>

          <View style={styles.formContainer}>
            {/* Form Inputs */}
            <View style={styles.inputRowModelo}>
              <Text style={styles.label}>Nombre:</Text>
              <TextInput
                style={styles.inputModelo}
                placeholder="Ingrese Nombre"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputRowModelo}>
              <Text style={styles.label}>Dirección:</Text>
              <TextInput
                style={styles.inputModelo}
                placeholder="Ingrese Dirección"
                value={address}
                onChangeText={setAddress}
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.label}>Teléfono:</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingrese teléfono"
                value={phone}
                onChangeText={setPhone}
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.label}>Ciudad:</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingrese Ciudad"
                value={city}
                onChangeText={setCity}
              />
            </View>
          </View>
          <View style={styles.containerCheckbox}>
            <View style={styles.checkboxContainer}>
              <Checkbox
                value={mechanic}
                onValueChange={handleMechanicChange}
                color="#D3D3D3"
              />
              <Text style={styles.checkboxLabel}>Mecánica</Text>
            </View>
            <View style={styles.checkboxContainer}>
              <Checkbox
                value={dealership}
                onValueChange={handleDealershipChange}
                color="#D3D3D3"
              />
              <Text style={styles.checkboxLabel}>Concesionario</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Aceptar</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    color: "#004270",
    fontWeight: 600,
    fontFamily: "Inter",
  },
  containerTitle: {
    marginTop: 15,
    flexDirection: "row",

    alignItems: "center",
    width: "100%",
  },
  iconStyle: {
    marginLeft: 5,
    marginRight: 10,
    transform: [{ scaleX: 1.2 }],
  },
  iconStyleimg: {
    marginRight: 0,
  },
  textimg: {
    fontSize: 14,
    textAlign: "center",
    color: "#004270",
    fontWeight: 400,
    paddingHorizontal: 10,
  },

  contanierimg: {
    backgroundColor: "#BAC8D9D9",
    height: 167.32,
    width: 169.29,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    /*  marginBottom: 10, */
    borderRadius: 10,
  },

  subtitle: {
    fontSize: 50,
    textAlign: "center",
    color: "#004270",
    fontWeight: 700,
    paddingHorizontal: 10,
  },

  formContainer: {
    marginTop: 20,
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
  },

  inputRow: {
    width: "47.1%",
    marginBottom: 12,
    marginRight: 10,
  },

  label: {
    marginLeft: 5,
    fontSize: 18,
    fontWeight: 600,
    fontFamily: "Inter",
    color: "#004270",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E3E3E3",
    paddingHorizontal: 10,
    height: 40,

    width: "100%",
    borderRadius: 5,
  },

  inputModelo: {
    borderWidth: 1,
    borderColor: "#EDF1F3",
    paddingHorizontal: 10,
    height: 40,
    marginRight: 10,
    width: "100%",
    borderRadius: 5,
  },

  inputRowModelo: {
    marginBottom: 12,
    width: "97%",
  },

  containerCheckbox: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 60,
    marginHorizontal: 2,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginRight: "21%",
    alignItems: "center",
  },
  checkboxLabel: {
    fontSize: 18,
    color: "#004270",
    marginLeft: 5,
    fontWeight: 600,
    fontFamily: "Inter",
  },
  button: {
    backgroundColor: "#004270",
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    marginHorizontal: 20,
    height: 61,
    justifyContent: "center",
  },
  buttonText: {
    paddingHorizontal: 32,
    paddingVertical: 8,
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter",
  },
});
