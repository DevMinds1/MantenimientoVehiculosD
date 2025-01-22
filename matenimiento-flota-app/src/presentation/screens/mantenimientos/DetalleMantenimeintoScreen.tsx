import React, { useState, useMemo, useRef, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { globalStyles } from "../../theme/theme";
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Checkbox from "expo-checkbox";
import { RootButtonParams } from "../../routes/ButtonTabsNavigator";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { CameraView, useCameraPermissions } from "expo-camera";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ScrollView } from "react-native-gesture-handler";

export const DetalleMantenimeintoScreen = () => {
  const { top } = useSafeAreaInsets();
  const route = useRoute();
  const { id, faults } = route.params as {
    id: string;
    faults: string[];
  };

  const navigation = useNavigation<NavigationProp<RootButtonParams>>();
  const [precio, setPrecio] = useState("");
  const [fallasSeleccionadas, setFallasSeleccionadas] = useState<string[]>([]);
  const [tabTaller, setTabTaller] = useState<"Mecánica" | "Concesionario">(
    "Mecánica"
  );
  const [showFallas, setShowFallas] = useState(false);
  const [imagen, setimagen] = useState("");

  const fallasConId = useMemo(() => {
    if (Array.isArray(faults)) {
      const mappedFallas = faults.map((descripcion, index) => ({
        id: String(index),
        descripcion,
      }));
      return mappedFallas;
    }

    console.log("No se encontraron fallas o fallas no es un arreglo válido.");
    return [];
  }, [faults]);

  const toggleFalla = (fallaId: string) => {
    setFallasSeleccionadas((prev) =>
      prev.includes(fallaId)
        ? prev.filter((id) => id !== fallaId)
        : [...prev, fallaId]
    );
  };

  const handleButtonPress = (buttonType: string) => {
    if (buttonType === "VehiculoEnTaller") {
      setShowFallas(true);
    } else if (buttonType === "MantenimientoCorrecto") {
      setShowFallas(false);
    }
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

  return (
    <ScrollView>
      <View style={globalStyles(top).container}>
        <View style={styles.containerTitle}>
          <SimpleLineIcons
            name="arrow-left"
            size={19}
            color="#004270"
            style={styles.iconStyle}
            onPress={() => navigation.navigate("Mantenimientos")}
          />
          <Text style={styles.title}>Detalle Mantenimiento</Text>
        </View>

        <View style={styles.containerImg}>
          <Image
            source={{
              uri: "https://fotos.perfil.com/2022/11/12/como-es-la-nueva-pick-up-china-que-llegara-al-pais-1452313.jpg",
            }}
            style={{ width: "100%", height: "100%" }}
          />
        </View>

        <View style={styles.containerInfo}>
          <Text style={styles.subtitle}>Vehículo</Text>
          <Text style={styles.textoInfo}>
            Mercedes Benz Sprinter (LBA-9091)
          </Text>
          <Text style={styles.textoInfo}>Motor: 377989U0861011</Text>
          <Text style={styles.textoInfo}>Responsable: GERMAN VIVANCO</Text>
          <Text style={styles.textoInfo}>Propiedad: UTPL</Text>
          <Text style={styles.subtitle}>Taller</Text>
          <Text style={styles.textoInfo}>Concesionaria Grupo Mavesa</Text>
          <Text style={styles.textoInfo}>0988168795</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.tabs}>
            <View style={{ width: "100%", alignItems: "center" }}>
              <Text style={styles.activeTab}>Fallas</Text>
              {tabTaller === "Mecánica" && (
                <View
                  style={{
                    height: 4,
                    backgroundColor: "#FEBE10",
                    marginVertical: 2,
                    width: "30%",
                  }}
                ></View>
              )}
            </View>
          </View>
          <View
            style={{
              height: 2,
              backgroundColor: "#E0E0E0",
              marginTop: -16,
              width: "100%",
              marginBottom: 10,
            }}
          ></View>
          <View style={styles.containerFallas}>
            {fallasConId.length > 0 ? (
              fallasConId.map((item) => (
                <View key={item.id} style={styles.checkboxContainerFallas}>
                  <Checkbox
                    value={fallasSeleccionadas.includes(item.id)}
                    onValueChange={() => toggleFalla(item.id)}
                    color={
                      fallasSeleccionadas.includes(item.id) ? "#F2B705" : "#CCC"
                    }
                  />
                  <Text style={styles.descriptionCheck}>
                    {item.descripcion}
                  </Text>
                </View>
              ))
            ) : (
              <Text>No hay fallas disponibles</Text>
            )}
          </View>
        </View>
        {showFallas ? (
          <View>
            <View style={styles.inputRow}>
              <Text style={styles.label}>Valor a cancelar:</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingrese el valor a cancelar"
                value={precio}
                onChangeText={setPrecio}
              />
            </View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={styles.textimg}>Subir Factura</Text>
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
            <View style={styles.sectionBottom}>
              <TouchableOpacity style={styles.button3}>
                <Text style={styles.textbutton2}>Informar Fallas</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Mantenimientos")}
              >
                <Text style={styles.textbutton}>Mantenimiento Correcto</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.sectionBottom}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleButtonPress("VehiculoEnTaller")}
            >
              <Text style={styles.textbutton}>Vehiculo En Taller</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button2}>
              <Text style={styles.textbutton}>Mantenimiento Correcto</Text>
            </TouchableOpacity>
          </View>
        )}
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
            onClose={closeSheet} // Cambia el estado a cerrado
            onChange={handleSheetChange} // Cambia `isOpen` según el índice actual
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
                  <Text style={styles.buttonShetText}>Tomar Foto</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonShetContainer}>
                  <MaterialIcons
                    name="photo-library"
                    size={20}
                    color="#2A2A2A"
                  />
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
                  <MaterialCommunityIcons
                    name="cancel"
                    size={24}
                    color="white"
                  />
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
      </View>
    </ScrollView>
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
  containerImg: {
    marginVertical: 10,
    marginHorizontal: "auto",
    width: "80%",
    height: 188,
  },
  subtitle: {
    fontFamily: "Inter",
    fontWeight: 600,
    fontSize: 18,
    color: "#004270",
  },
  containerInfo: {
    marginVertical: 5,

    width: "70%",
    marginHorizontal: "auto",
  },
  textoInfo: {
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: 400,
    color: "#6A6A6A",
  },
  section: {
    marginBottom: 10,
    marginTop: 10,
  },
  activeTab: {
    fontWeight: 600,
    fontSize: 18,
    color: "#004270",
    fontFamily: "Inter",
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 10,
    marginHorizontal: 50,
    justifyContent: "space-between",
  },
  containerFallas: {
    maxHeight: 171,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  checkboxContainerFallas: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "48%",
  },
  descriptionCheck: {
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: 14,
    marginLeft: 5,
    color: "#6A6A6A",
  },
  sectionBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    marginVertical: 8,
  },
  button: {
    backgroundColor: "#004270",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 2,
    width: "47%",
    justifyContent: "center",
    alignItems: "center",
  },
  button2: {
    backgroundColor: "#6A6A6A",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 2,
    width: "47%",
    justifyContent: "center",
    alignItems: "center",
  },
  button3: {
    backgroundColor: "#FE101026",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 2,
    width: "47%",
    justifyContent: "center",
    alignItems: "center",
  },
  textbutton: {
    fontFamily: "Inter",
    fontWeight: 500,
    fontSize: 12,
    color: "#FFFFFF",
  },
  textbutton2: {
    fontFamily: "Inter",
    fontWeight: 500,
    fontSize: 12,
    color: "#6A6A6A",
  },
  inputRow: {
    width: "95%",
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
    backgroundColor: "white",
    height: 167.32,
    width: 169.29,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    /*  marginBottom: 10, */
    borderRadius: 10,
    borderBlockColor: "#C1C1C1",
    borderWidth: 0.5,
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
});
