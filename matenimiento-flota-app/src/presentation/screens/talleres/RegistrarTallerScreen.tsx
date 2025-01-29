import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { globalStyles } from "../../theme/theme";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Checkbox from "expo-checkbox";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootButtonParams } from "../../routes/ButtonTabsNavigator";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../../firebaseConfig";
// Define los tipos del formulario
type FormData = {
  name: string;
  address: string;
  phone: string;
  contact: string;
  ruc: string;
  type: string;
  image: string;
};

export const RegistrarTallerScreen = () => {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<RootButtonParams>>();
  const [mechanic, setMechanic] = useState(false);
  const [dealership, setDealership] = useState(false);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [contact, setContact] = useState("");
  const [ruc, setRuc] = useState("");
  const [imagen, setimagen] = useState("");
  const [rucError, setRucError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handleMechanicChange = (value: boolean) => {
    setMechanic(value);
    if (value) setDealership(false);
  };

  const handleDealershipChange = (value: boolean) => {
    setDealership(value);
    if (value) setMechanic(false);
  };

  //BottomSheet
  const sheetRef = useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = useState(false);
  const snapPoints = ["20%"];

  const openSheet = () => {
    sheetRef.current?.snapToIndex(0);
  };

  const closeSheet = () => {
    sheetRef.current?.close();
  };

  const handleOverlayPress = () => {
    if (isOpen) closeSheet();
  };

  const handleSheetChange = (index: number) => {
    setIsOpen(index !== -1);
  };

  //Camara-------------------------------------------------------------
  //Galeria
  const changeImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled) {
      setimagen(result.assets[0].uri);
      setIsOpen(false);
      closeSheet();
    } else {
      console.log("Image selection was canceled");
    }
  };

  //Camara
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraOpen, setCameraOpen] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);

  const checkPermissions = useCallback(async () => {
    if (!permission) {
      await requestPermission();
    }
  }, [permission, requestPermission]);

  const handleSnapPress = useCallback(async () => {
    const { granted } = await requestPermission();
    if (!granted) {
      alert("Se requieren permisos para acceder a la cámara.");
      return;
    }
    sheetRef.current?.snapToIndex(0);
    setIsOpen(true);
  }, [requestPermission]);

  const cancelCamera = () => {
    setCameraOpen(false);
    setIsOpen(false);
    closeSheet(); // Cierra la cámara
  };

  const openCamera = () => {
    setCameraOpen(true);
    setIsOpen(false);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo) {
          setimagen(photo.uri);
          setCameraOpen(false);
          closeSheet();
        } else {
          console.log("No photo captured");
        }
      } catch (error) {
        console.error("Error capturing photo:", error);
      }
    }
  };

  //---------------------------------------

  // Define los tipos de las funciones
  const uploadImageToFirebase = async (imageUri: string): Promise<string> => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const imageName = imageUri.substring(imageUri.lastIndexOf("/") + 1);
      const storageRef = ref(storage, `repairshops/${imageName}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image to Firebase:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (
      !name ||
      !address ||
      !phone ||
      !contact ||
      !ruc ||
      (!mechanic && !dealership) ||
      !imagen
    ) {
      alert("Por favor, complete todos los campos, son obligatorios.");
      return;
    }

    try {
      // Sube la imagen a Firebase
      const imageURL = await uploadImageToFirebase(imagen);

      // Prepara los datos del formulario
      const formData: FormData = {
        name,
        address,
        phone,
        contact,
        ruc,
        type: mechanic ? "Mecánica" : "Concesionario",
        image: imageURL,
      };

      // Envía los datos al servidor
      const response = await fetch(
        "https://us-central1-global-tine-447000-u6.cloudfunctions.net/repairshops/api/register_repairshop",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
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
      console.error("Error al registrar el taller:", error);
      alert("Error al conectar con el servidor.");
    }
  };
  const resetFields = () => {
    setName("");
    setContact("");
    setRuc("");
    setPhone("");
    setAddress("");
    setMechanic(false);
    setDealership(false);
    setimagen("");
  };

  const validateRuc = (text: string) => {
    if (!/^\d{13}$/.test(text)) {
      setRucError("El RUC debe contener 13 dígitos numéricos");
    } else {
      setRucError("");
    }
    setRuc(text);
  };

  const validatePhone = (text: string) => {
    if (!/^\d{7,10}$/.test(text)) {
      setPhoneError(
        "Ingrese un número válido (celular: 10 dígitos, convencional: 7-9 dígitos)"
      );
    } else {
      setPhoneError("");
    }
    setPhone(text);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={globalStyles(top).container}>
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={styles.textimg}>Agregar imagen</Text>
            <View style={styles.contanierimg}>
              {imagen ? (
                <TouchableOpacity
                  style={styles.image}
                  onPress={() => handleSnapPress()}
                >
                  <Image source={{ uri: imagen }} style={styles.image} />
                </TouchableOpacity>
              ) : (
                <MaterialCommunityIcons
                  name="file-image-plus-outline"
                  size={90}
                  color="black"
                  style={styles.iconStyleimg}
                  onPress={() => handleSnapPress()}
                />
              )}
            </View>
          </View>

          <View style={styles.formContainer}>
            {/* Form Inputs */}
            <View style={styles.inputRowModelo}>
              <Text style={styles.label}>Ruc:</Text>
              <TextInput
                style={[styles.input, rucError ? styles.inputError : null]}
                placeholder="Ingrese Ruc"
                value={ruc}
                onChangeText={validateRuc}
                keyboardType="numeric"
                maxLength={13}
              />
            </View>
            {rucError ? <Text style={styles.errorText}>{rucError}</Text> : null}
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
            <View style={styles.inputRowModelo}>
              <Text style={styles.label}>Teléfono:</Text>
              <TextInput
                style={[styles.input, phoneError ? styles.inputError : null]}
                placeholder="Ingrese teléfono"
                value={phone}
                onChangeText={validatePhone}
                keyboardType="numeric"
                maxLength={10}      
              />
            </View>
            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
            <View style={styles.inputRowModelo}>
              <Text style={styles.label}>Contacto:</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingrese Nombre del Contacto"
                value={contact}
                onChangeText={setContact}
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
      {isOpen && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={handleOverlayPress}
          activeOpacity={1}
        />
      )}

      {isOpen && (
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onClose={closeSheet}
          onChange={handleSheetChange}
        >
          <BottomSheetView>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginVertical: 15,
              }}
            >
              <TouchableOpacity
                style={styles.buttonShetContainer}
                onPress={() => openCamera()}
              >
                <Feather name="camera" size={20} color="#2A2A2A" />
                <Text style={styles.buttonShetText}>Tomar una foto</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonShetContainer}
                onPress={() => changeImage()}
              >
                <MaterialIcons name="photo-library" size={20} color="#2A2A2A" />
                <Text style={styles.buttonShetText}>Subir de Galeria</Text>
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        </BottomSheet>
      )}
      {cameraOpen && (
        <View style={styles.containerCamera}>
          <CameraView style={styles.camera} ref={cameraRef}>
            <View style={styles.buttonContainerCamera}>
              <TouchableOpacity
                style={styles.buttonCamera}
                onPress={cancelCamera}
              >
                <MaterialCommunityIcons name="cancel" size={24} color="white" />
                <Text style={styles.textCamera}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonCamera}
                onPress={takePicture}
              >
                <Feather name="camera" size={24} color="white" />
                <Text style={styles.textCamera}>Tomar Foto</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      )}
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
    width: "47%",
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
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },

  containerCamera: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  messageCamera: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
    height: "100%",
    paddingVertical: 20,
  },
  buttonContainerCamera: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    zIndex: 1,
  },
  buttonCamera: {
    flex: 1,
    flexDirection: "row",
    borderColor: "#C1C1C1",
    borderWidth: 1,
    marginBottom: 10,
    alignItems: "center",
    height: 40,
    width: "40%",
    justifyContent: "center",
    borderRadius: 8,
    margin: 10,
  },
  textCamera: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    justifyContent: "center",
    marginLeft: 10,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 0,
  },
  buttonShetContainer: {
    backgroundColor: "#fff",
    borderColor: "#C1C1C1",
    borderWidth: 1,
    marginBottom: 10,
    alignItems: "center",
    height: 80,
    width: "40%",
    justifyContent: "center",
    borderRadius: 8,
    margin: 10,
  },
  buttonShetText: {
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: 14,
    marginTop: 10,
    color: "#6A6A6A",
  },
  inputError: {
    borderWidth: 1,
    paddingHorizontal: 10,
    height: 40,
    width: "100%",
    borderRadius: 5,
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 10,
  },
});
