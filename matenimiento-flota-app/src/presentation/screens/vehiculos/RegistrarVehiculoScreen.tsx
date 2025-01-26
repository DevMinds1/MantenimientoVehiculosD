import React, { act, useCallback, useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Button,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { globalStyles } from "../../theme/theme";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Checkbox from "expo-checkbox";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { RootButtonParams } from "../../routes/ButtonTabsNavigator";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../../firebaseConfig";

interface Encargado {
  uid: string;
  image_url: string;
  name: string;
  role: string;
  email: string;
}

type FormData = {
  actividadUbicacion: string;
  anio: string;
  chasis: string;
  color: string;
  combustible: string;
  detalle: string;
  marca: string;
  modeloAnio: string;
  motor: string;
  num: string;
  placa: string;
  propiedad: string;
  responsable: string;
  tipo: string;
  imagen: string;
  tipoVehiculo: "LIVIANO" | "PESADO";
};

export const RegistrarVehiculoScreen = () => {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<RootButtonParams>>();
  const [light, setLight] = useState(false);
  const [heavy, setHeavy] = useState(false);
  const [encargados, setEncargados] = useState<Encargado[]>([]);
  const [searchQueryEncargado, setSearchQueryEncargado] = useState("");
  const [encargadoSeleccionado, setEncargadoSeleccionado] =
    useState<Encargado | null>(null);

  // Estados para los nuevos campos
  const [actividadUbicacion, setActividadUbicacion] = useState("");
  const [anio, setAnio] = useState("");
  const [chasis, setChasis] = useState("");
  const [color, setColor] = useState("");
  const [combustible, setCombustible] = useState("");
  const [detalle, setDetalle] = useState("");
  const [marca, setMarca] = useState("");
  const [modeloAnio, setModeloAnio] = useState("");
  const [motor, setMotor] = useState("");
  const [num, setNum] = useState("");
  const [placa, setPlaca] = useState("");
  const [propiedad, setPropiedad] = useState("");
  const [responsable, setResponsable] = useState("");
  const [tipo, setTipo] = useState("");
  const [tipoVehiculo, setTipoVehiculo] = useState("");
  const [imagen, setimagen] = useState("");

  const sheetRef = useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = useState(false);
  const snapPoints = ["20%"];

  const handleLightChange = (value: boolean) => {
    setLight(value);
    if (value) setHeavy(false);
  };

  const handleHeavyChange = (value: boolean) => {
    setHeavy(value);
    if (value) setLight(false);
  };

  //BottomSheet

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

  // Apis
  const obtenerDatos = async () => {
    try {
      const [responseEncargado] = await Promise.all([
        fetch(
          "https://us-central1-global-tine-447000-u6.cloudfunctions.net/users/api/get_mandated_users"
        ),
      ]);
      const encargado = await responseEncargado.json();
      setEncargados([...encargado]);
    } catch (error) {
      console.error("Error al obtener los Datos:", error);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      obtenerDatos();
    }, [])
  );

  //Encargado
  const handleSearchEncargado = (query: string) => {
    setSearchQueryEncargado(query);
  };

  const filteredEncargado = encargados.filter((encargado) => {
    const queryLower2 = searchQueryEncargado.toLowerCase();
    return encargado.name.toLowerCase().includes(queryLower2);
  });

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
    setIsOpen(false); // Cierra la cámara
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
        } else {
          console.log("No photo captured");
        }
      } catch (error) {
        console.error("Error capturing photo:", error);
      }
    }
  };

  //---------------------------------------

  const uploadImageToFirebase = async (imageUri: string): Promise<string> => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const imageName = imageUri.substring(imageUri.lastIndexOf("/") + 1);
      const storageRef = ref(storage, `vehicles/${imageName}`);
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
      !actividadUbicacion ||
      !anio ||
      !chasis ||
      !color ||
      !combustible ||
      !detalle ||
      !marca ||
      !modeloAnio ||
      !motor ||
      !num ||
      !placa ||
      !propiedad ||
      !encargadoSeleccionado ||
      !tipo ||
      (!light && !heavy) ||
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
        actividadUbicacion,
        anio,
        chasis,
        color,
        combustible,
        detalle,
        marca,
        modeloAnio,
        motor,
        num,
        placa,
        propiedad,
        responsable: encargadoSeleccionado?.uid || "",
        tipo,
        imagen,
        tipoVehiculo: light ? "LIVIANO" : "PESADO"
      };

      console.log("Datos del formulario:", formData);
      // Envía los datos al servidor
      const response = await fetch(
        "https://us-central1-global-tine-447000-u6.cloudfunctions.net/vehicles/api/register_vehicle",
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
        navigation.navigate("Vehiculos", { screen: "VehiculosLivianos" });
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
    setActividadUbicacion("");
    setAnio("");
    setChasis("");
    setColor("");
    setCombustible("");
    setDetalle("");
    setMarca("");
    setModeloAnio("");
    setMotor("");
    setNum("");
    setPlaca("");
    setPropiedad("");
    setResponsable("");
    setTipo("");
    setTipoVehiculo("");
    setLight(false);
    setHeavy(false);
    setimagen("");
  };

  return (
    <GestureHandlerRootView style={globalStyles(top).container}>
      <View style={styles.containerTitle}>
        <SimpleLineIcons
          name="arrow-left"
          size={19}
          color="#004270"
          style={styles.iconStyle}
          onPress={() => navigation.navigate("HomeTab", { screen: "Home" })}
        />
        <Text style={styles.title}>Registro de Vehículo</Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
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
          <View style={styles.inputRow}>
            <Text style={styles.label}>Placa:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese la placa del vehículo"
              value={placa}
              onChangeText={setPlaca}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Actividad o Ubicación:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese la Actividad o Ubicación"
              value={actividadUbicacion}
              onChangeText={setActividadUbicacion}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Año:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese Año"
              value={anio}
              onChangeText={setAnio}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Chasis:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese el número de chasis"
              value={chasis}
              onChangeText={setChasis}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Color:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese color de vehículo"
              value={color}
              onChangeText={setColor}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Combustible:</Text>
            <TextInput
              style={styles.inputModelo}
              placeholder="Ingrese el tipo de combustible"
              value={combustible}
              onChangeText={setCombustible}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Detalle:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese una descripción sobre el vehículo"
              value={detalle}
              onChangeText={setDetalle}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Marca:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese la marca del vehículo"
              value={marca}
              onChangeText={setMarca}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Modelo o Año del modelo:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese el modelo o año del modelo"
              value={modeloAnio}
              onChangeText={setModeloAnio}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Motor:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese el número o identificación del motor"
              value={motor}
              onChangeText={setMotor}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Número:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese el número del vehículo"
              value={num}
              onChangeText={setNum}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Propiedad:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese la propiedad del vehículo"
              value={propiedad}
              onChangeText={setPropiedad}
            />
          </View>

          {/* Encargados */}
          <View style={styles.section}>
            <Text style={styles.checkboxLabel}>Encargado</Text>
            <View style={styles.buscar}>
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar Encargado"
                value={searchQueryEncargado}
                onChangeText={handleSearchEncargado}
              />
              <Ionicons
                name="filter"
                size={24}
                color="gray"
                style={styles.iconStyle}
              />
            </View>
            <ScrollView
              style={styles.scrollContainerEncargado}
              nestedScrollEnabled={true}
            >
              {filteredEncargado.map((item) => (
                <TouchableOpacity
                  key={item.uid ? item.uid : Math.random()}
                  onPress={() => setEncargadoSeleccionado(item)}
                >
                  <View
                    style={[
                      styles.card,
                      encargadoSeleccionado?.uid === item.uid &&
                        styles.selectedCard,
                    ]}
                  >
                    <View style={styles.containerItem}>
                      <View style={styles.containerImgEncar}>
                        <Image
                          source={{
                            uri: item.image_url,
                          }}
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: 50,
                          }}
                        />
                      </View>
                      <View style={styles.containerInfo}>
                        <Text
                          style={styles.nameEncargado}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {item.name}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Tipo:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese la categoría o tipo de vehículo"
              value={tipo}
              onChangeText={setTipo}
            />
          </View>
        </View>
        <View style={styles.containerCheckbox}>
          <View style={styles.checkboxContainer}>
            <Checkbox
              value={light}
              onValueChange={handleLightChange}
              color="#D3D3D3"
            />
            <Text style={styles.checkboxLabel}>Liviano</Text>
          </View>
          <View style={styles.checkboxContainer}>
            <Checkbox
              value={heavy}
              onValueChange={handleHeavyChange}
              color="#D3D3D3"
            />
            <Text style={styles.checkboxLabel}>Pesado</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Aceptar</Text>
        </TouchableOpacity>
      </ScrollView>

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
                <Text style={styles.buttonShetText}>Subir Archivo</Text>
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
    marginBottom: 12,
    width: "95%",
    marginHorizontal: "auto",
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
    marginBottom: 20,
    marginHorizontal: 2,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginRight: "31%",
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
  iconosFotos: {
    marginTop: 10,
    backgroundColor: "green",
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
  section: {
    marginBottom: 10,
    marginTop: 10,
  },
  buscar: {
    flexDirection: "row",
    marginTop: 12,
    marginBottom: 12,
    width: "100%",
    alignItems: "center",
  },
  searchInput: {
    borderWidth: 0.5,
    borderColor: "#BDBDBD",
    paddingHorizontal: 10,
    height: 40,
    width: "90%",
    borderRadius: 30,
  },
  containerImgEncar: {
    height: 38,
    width: 38,
    margin: 5,
    borderRadius: 100,
  },
  nameEncargado: {
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: 16,
    color: "#6A6A6A",
  },

  scrollContainerEncargado: {
    height: 150,
  },
  selectedCard: {
    backgroundColor: "#F7F7F7",
    borderColor: "#1890ff",
  },
  containerItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 1,
  },
  containerInfo: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
    overflow: "hidden",
  },
  card: {
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
