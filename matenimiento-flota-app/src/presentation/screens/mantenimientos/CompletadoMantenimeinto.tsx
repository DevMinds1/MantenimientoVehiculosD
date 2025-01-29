import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
} from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
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
import AntDesign from "@expo/vector-icons/AntDesign";
import { ScrollView } from "react-native-gesture-handler";
import { Order } from "../../../interface/repairshop";
import { Image } from "expo-image";
import * as Print from "expo-print";

export const CompletadoMantenimeinto = () => {
  const { top } = useSafeAreaInsets();
  const route = useRoute();
  const { id, faults, state, order } = route.params as {
    id: string;
    faults: string[];
    state: string;
    order: Order;
  };

  const url = order.url || "";
  const fileExtension = url.split("?")[0].toLowerCase(); // Eliminar query params
  const isPdf = fileExtension.endsWith(".pdf");

  const navigation = useNavigation<NavigationProp<RootButtonParams>>();
  const [precio, setPrecio] = useState("");
  const [fallasSeleccionadas, setFallasSeleccionadas] = useState<string[]>([]);
  const [tabTaller, setTabTaller] = useState<"Mecánica" | "Concesionario">(
    "Mecánica"
  );

  const fallasConId = useMemo(() => {
    if (Array.isArray(faults)) {
      const mappedFallas = faults.map((descripcion, index) => ({
        id: String(index),
        descripcion,
      }));
      return mappedFallas;
    }

    console.log("No se encontraron fallas");
    return [];
  }, [faults]);

  useEffect(() => {
    const ids = fallasConId.map((item) => item.id);
    setFallasSeleccionadas(ids);
  }, [fallasConId]);

  const toggleFalla = (fallaId: string) => {
    setFallasSeleccionadas((prev) =>
      prev.includes(fallaId)
        ? prev.filter((id) => id !== fallaId)
        : [...prev, fallaId]
    );
  };

  const handleOpenPdf = async () => {
    if (isPdf && url) {
      await Print.printAsync({ uri: url });
    }
  };

  return (
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
      <ScrollView showsVerticalScrollIndicator={false} >
        <View >
          <View style={styles.containerImg}>
            <Image
              source={{
                uri:
                  order.vehicleImage && order.vehicleImage !== ""
                    ? order.vehicleImage
                    : "https://fotos.perfil.com/2022/11/12/como-es-la-nueva-pick-up-china-que-llegara-al-pais-1452313.jpg",
              }}
              style={{ width: "100%", height: "100%" }}
              cachePolicy="memory-disk"
              contentFit="contain"
            />
          </View>

          <View style={styles.containerInfo}>
            <Text style={styles.subtitle}>Vehículo</Text>
            <Text style={styles.textoInfo}>
              {order.vehicleMarca} ({order.vehicle})
            </Text>
            <Text style={styles.textoInfo}>Motor: {order.vehicleMotor}</Text>
            <Text style={styles.textoInfo}>
              Tipo: {order.vehicleTipo} ({order.vehicleTipoVehi}){" "}
            </Text>
            <Text style={styles.textoInfo}>
              Propiedad: {order.vehiclePropiedad}
            </Text>
            <Text style={styles.subtitle}>Encargado</Text>
            <Text style={styles.textoInfo}>Nombre: {order.mandatedName}</Text>
            <Text style={styles.textoInfo}>Email: {order.mandatedEmail}</Text>
            <Text style={styles.subtitle}>Taller</Text>
            <Text style={styles.textoInfo}>{order.repairshopName}</Text>
            <Text style={styles.textoInfo}>{order.repairshopAddress}</Text>
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
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderWidth: 2,
                        borderColor: "#F2B705", // Borde amarillo
                        backgroundColor: fallasSeleccionadas.includes(item.id)
                          ? "#F2B705"
                          : "#EEE", // Fondo amarillo si seleccionado, gris si no
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {fallasSeleccionadas.includes(item.id) && (
                        <MaterialCommunityIcons
                          name="check"
                          size={16}
                          color="#FFF"
                        />
                      )}
                    </View>

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
          {order.type == "Correctivo" && (
            <View style={styles.containerInfo}>
              <Text style={styles.subtitle}>Observaciones</Text>
              <Text style={styles.textoInfo}>{order.comments}</Text>
            </View>
          )}
          <View style={styles.containerInfo}>
            <Text style={styles.subtitle}>
              Valor Cancelado:{" "}
              <Text style={styles.textoInfo}> ${order.price}</Text>
            </Text>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={styles.textimg}>Factura</Text>
              <View style={styles.containerImg}>
                {isPdf ? (
                  <TouchableOpacity
                    onPress={handleOpenPdf}
                    style={styles.pdfContainer}
                  >
                    <AntDesign name="pdffile1" size={100} color="black" />
                    <Text style={styles.pdfText}>Archivo PDF Subido</Text>
                  </TouchableOpacity>
                ) : (
                  <Image
                    source={{ uri: order.url }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                  />
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
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
  pdfContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  pdfText: {
    fontSize: 12,
    color: "black",
    marginTop: 5,
  },
  subtitle: {
    fontFamily: "Inter",
    fontWeight: 600,
    fontSize: 18,
    color: "#004270",
  },
  containerInfo: {
    marginVertical: 5,
    width: "80%",
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
    marginTop: 20,
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
