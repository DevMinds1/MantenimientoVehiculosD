import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
  TextInput,
  TouchableOpacity,
  Image,
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
import { useUser } from "../../components/userAut/userContext";

interface Props extends StackScreenProps<RootStackParams, "LoginScreen"> {}

export const LoginScreen = ({ navigation }: Props) => {
  const { setUser } = useUser();
  const { height } = useWindowDimensions();
  const [isRemembered, setIsRemembered] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ email: "", password: "" }); // Estado para errores separados
  const [isError, setIsError] = useState({ email: false, password: false });

  const handleLogin = async () => {
    // Validar campos antes de enviar la petición
    const emailError = !email.trim() ? "Por favor, ingresa un correo." : "";
    const passwordError = !password.trim()
      ? "Por favor, ingresa una contraseña."
      : "";

    if (emailError || passwordError) {
      setError({ email: emailError, password: passwordError });
      setIsError({ email: !!emailError, password: !!passwordError });
      return;
    }

    setError({ email: "", password: "" });
    setIsError({ email: false, password: false });

    try {
      const response = await axios.post(
        "https://us-central1-global-tine-447000-u6.cloudfunctions.net/users/api/authentication",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      // Aquí almacenamos los datos del usuario en el contexto global
      setUser({
        email: response.data.usuario.email,
        imageUrl: response.data.usuario.image_url,
        name: response.data.usuario.name,
        role: response.data.usuario.role,
        uid: response.data.usuario.uid,
      });

      navigation.reset({
        index: 0,
        routes: [{ name: "HomeStack" }],
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError({
            email: "Usuario o contraseña incorrectos.",
            password: "Usuario o contraseña incorrectos.",
          });
          setIsError({ email: true, password: true });
        } else {
          const generalError =
            err.response?.data?.message || "Ocurrió un error inesperado.";
          setError({ email: generalError, password: generalError });
        }
      } else if (err instanceof Error) {
        setError({ email: err.message, password: err.message });
      } else {
        setError({
          email: "Error desconocido.",
          password: "Error desconocido.",
        });
      }
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              paddingTop: height * 0.13,
              backgroundColor: "#004270",
              width: "100%",
              borderRadius: 20,
              marginBottom: 40,
            }}
          >
            <Text style={styles.title}>Bienvenido a</Text>
            <View>
              <View style={styles.logoContainer}>
                <Image
                  source={require("../../images/imagenlogin.png")}
                  style={styles.image}
                />
              </View>
            </View>
            <View style={styles.containerTitle}>
              <Text style={styles.subtitle}>UTPL</Text>
              <AntDesign
                name="car"
                size={35}
                color="#FEBE10"
                style={styles.iconStyle}
              />
            </View>
          </View>

          <View style={styles.login}>
            <Text style={styles.subtitle2}>Inicio de sesión</Text>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.rememberText}>Correo Institucional</Text>
              <View style={styles.borde}>
                <TextInput
                  placeholder="JhonDoe@dominio.com"
                  style={[styles.input, isError.email && styles.inputError]}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
                {isError.email && (
                  <Text style={styles.errorText}>{error.email}</Text>
                )}
              </View>

              <Text style={styles.rememberText}>Contraseña</Text>
              <View style={styles.borde}>
                <TextInput
                  placeholder="*****"
                  style={[styles.input, isError.password && styles.inputError]}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={true}
                />
                {isError.password && (
                  <Text style={styles.errorText}>{error.password}</Text>
                )}
              </View>
            </View>

            <View style={styles.rememberContainer}>
{/*               <View style={styles.checkboxContainer}>
                <Checkbox
                  value={isRemembered}
                  onValueChange={setIsRemembered}
                  style={styles.checkbox}
                />
                <Text style={styles.rememberText}>Recuérdame</Text>
              </View> */}

              <TouchableOpacity style={styles.forgotPasswordContainer}>
                <Text style={styles.forgotPasswordText}>
                  Recupera tu contraseña
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    fontSize: 15,
    textAlign: "center",
    color: "#ffff",
    fontWeight: 400,
    padding: 2,
    fontFamily: "Roboto",
  },
  subtitle: {
    fontSize: 40,
    textAlign: "center",
    color: "#FFFFFF",
    fontWeight: 700,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  login: {
    marginHorizontal: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: "#EDF1F3",

    paddingHorizontal: 10,
    height: 40,
    borderRadius: 5,
    shadowColor: "#E4E5E73D",
    shadowOffset: { width: 0, height: 2 },
  },

  buttonContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#004270",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: 'center',
    width: "100%",
    height: 61,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: 700,
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
    justifyContent: "flex-end",
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
    fontSize: 14,
    fontFamily: "Roboto",
    fontWeight: 400,
    color: "#000000B2",
  },
  forgotPasswordContainer: {
    justifyContent: "flex-end",
  },
  forgotPasswordText: {
    fontSize: 13,
    color: "#034872",
    fontWeight: 400,
    fontFamily: "Roboto",
    marginLeft: 10,
    textDecorationLine: 'underline'
  
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
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
  logoContainer: {
    alignItems: "center",
  },
  image: {
    width: 195,
    height: 132,
  },
  subtitle2: {
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: 30,
    color: "#004270",
    textAlign: "center",
    marginBottom: 15,
  },
  borde: {
    borderBottomColor: "#E9B40A",
    borderBottomWidth: 1,
    marginBottom: 15,
  },
});
