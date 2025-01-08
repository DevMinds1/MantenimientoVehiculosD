import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import Checkbox from "expo-checkbox";
import AntDesign from "@expo/vector-icons/AntDesign";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParams } from "../../routes/StackNavigator";
import axios from "axios";

interface Props extends StackScreenProps<RootStackParams, "LoginScreen"> {}

export const LoginScreen = ({ navigation }: Props) => {
  const { height } = useWindowDimensions();
  const [isRemembered, setIsRemembered] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      console.error("Por favor, ingresa un correo y una contraseña.");
      return;
    }

    console.log("Email:", email, "Password:", password);

    try {
      const response = await axios.post(
        "https://us-central1-global-tine-447000-u6.cloudfunctions.net/users/api/authentication",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      navigation.navigate("HomeStack");
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Ocurrió un error desconocido:", error);
      }
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ScrollView style={styles.login} showsVerticalScrollIndicator={false}>
          <View style={{ paddingTop: height * 0.28 }}>
            <Text style={styles.title}>Login</Text>
            <View style={styles.containerTitle}>
              <Text style={styles.subtitle}>UTPL</Text>

              <AntDesign
                name="car"
                size={32}
                color="#FEBE10"
                style={styles.iconStyle}
              />
            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.rememberText}>Correo</Text>
            <TextInput
              placeholder="JhonDoe@dominio.com"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextInput
              placeholder="*****"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />
          </View>

          <View style={styles.rememberContainer}>
            <View style={styles.checkboxContainer}>
              <Checkbox
                value={isRemembered}
                onValueChange={setIsRemembered}
                style={styles.checkbox}
              />
              <Text style={styles.rememberText}>Recuerdame</Text>
            </View>

            <TouchableOpacity style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>
                ¿ Olvidaste tu contraseña ?
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Iniciar Sesion</Text>
            </TouchableOpacity>

{/*             <TouchableOpacity
              style={{ marginTop: 10, backgroundColor: "#004270" }}
              onPress={() => navigation.navigate("HomeStack")}
            >
              <Text style={styles.buttonText}>IngresoPrueba</Text>
            </TouchableOpacity> */}
          </View>

{/*           <View style={styles.additionalTextContainer}>
            <Text style={styles.rememberText}>¿No tienes una cuenta aún?</Text>
            <Text style={styles.forgotPasswordText}>Registrarse</Text>
          </View> */}
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    textAlign: "center",
    color: "#004270",
    fontWeight: 700,
    padding: 2,
    fontFamily: "Inter",
  },
  subtitle: {
    fontSize: 50,
    textAlign: "center",
    color: "#004270",
    fontWeight: 700,
    paddingHorizontal: 10,
  },
  login: {
    marginHorizontal: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: "#EDF1F3",
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 5,
    shadowColor: "#E4E5E73D",
    shadowOffset: { width: 0, height: 2 },
  },

  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#004270",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: "center",
    width: "100%",
    height: 48,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "Inter",
  },

  additionalTextContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20,
    justifyContent: "center",
    width: "100%",
  },

  rememberContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    marginRight: 10,
  },
  rememberText: {
    fontSize: 12,
    fontFamily: "Inter",
    fontWeight: 500,
    color: "#6C7278",
  },
  forgotPasswordContainer: {
    justifyContent: "flex-end",
  },
  forgotPasswordText: {
    fontSize: 12,
    color: "#4D81E7",
    fontWeight: 600,
    fontFamily: "Inter",
    marginLeft: 10,
  },

  containerTitle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  iconStyle: {
    marginLeft: 10,
    marginRight: 10,
  },
});
