import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Button,
  TextInput,
  Image,
} from "react-native";
import Checkbox from "expo-checkbox";
import { globalStyles } from "../../theme/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { RootButtonParams } from "../../routes/ButtonTabsNavigator";
import Calender from "../../components/calender/calender";

interface Vehiculo {
  brand: string;
  fuel_type: string;
  mileage: string;
  model: string;
  oil: string;
  plate: string;
  type: string;
  year: string;
}

interface Taller {
  id: string;
  address: string;
  city: string;
  name: string;
  phone: string;
  type: string;
}

interface Falla {
  id: number;
  descripcion: string;
}

interface Encargado {
  id: number;
  nombre: string;
  img: string;
}

const timeZone = 'America/Guayaquil';

export const MantenimientoPreventivoScreen = () => {
  const { top } = useSafeAreaInsets();
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [talleres, setTalleres] = useState<Taller[]>([]);
  const [fallas, setFallas] = useState<Falla[]>([]);
  const [encargados, setEncargados] = useState<Encargado[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const handleDateSelection = (date: string) => {
    const selectedDate = new Date(date);
    selectedDate.setMinutes(selectedDate.getMinutes() - selectedDate.getTimezoneOffset());
  
    selectedDate.setDate(selectedDate.getDate() + 1);
  
    console.log('Fecha seleccionada:', selectedDate);
    setFechaSeleccionada(selectedDate);
  };
  
  const [searchQueryVehiculo, setSearchQueryVehiculo] = useState("");
  const [searchQueryTaller, setSearchQueryTaller] = useState("");
  const [searchQueryEncargado, setSearchQueryEncargado] = useState("");
  const navigation = useNavigation<NavigationProp<RootButtonParams>>();

  const [tabVehiculo, setTabVehiculo] = useState<"Liviano" | "Pesado">(
    "Liviano"
  );
  const [vehiculoSeleccionado, setVehiculoSeleccionado] =
    useState<Vehiculo | null>(null);

  const [tabTaller, setTabTaller] = useState<"Mecánica" | "Concesionario">(
    "Mecánica"
  );
  const [tallerSeleccionado, setTallerSeleccionado] = useState<Taller | null>(
    null
  );
  const [fallasSeleccionadas, setFallasSeleccionadas] = useState<number[]>([]);
  const [encargadoSeleccionado, setEncargadoSeleccionado] =
    useState<Encargado | null>(null);

  const generarOrden = async () => {
    if (!vehiculoSeleccionado || !tallerSeleccionado) {
      alert("Por favor selecciona un vehículo y un taller.");
      return;
    }

    const fallasDescripcion = fallas
      .filter((falla) => fallasSeleccionadas.includes(falla.id))
      .map((falla) => falla.descripcion);

    const orderData = {
      vehicle: vehiculoSeleccionado.plate,
      repairshop: tallerSeleccionado.id,
      mandated: encargadoSeleccionado?.nombre,
      faults: fallasDescripcion,
      state: "Pendiente",
      type: "Preventivo",
      date: fechaSeleccionada!.getTime(),
    };

    try {
      const response = await fetch(
        "https://us-central1-global-tine-447000-u6.cloudfunctions.net/orders/api/register_preventive_order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert(result.message);

        navigation.navigate("Mantenimientos");

        resetFields();
      } else {
        const error = await response.json();
        alert(error.error || "Error al registrar la orden.");
      }
    } catch (err) {
      console.error("Error al enviar la orden:", err);
      alert("Hubo un problema al registrar la orden.");
    }
  };

  const resetFields = () => {
    setVehiculoSeleccionado(null);
    setTallerSeleccionado(null);
    setFallasSeleccionadas([]);
    setEncargadoSeleccionado(null);
    setFechaSeleccionada(null);
  };

  const obtenerDatos = async () => {
    try {
      const [
        responseLivianos,
        responsePesados,
        responseConcesionario,
        responseMecanica,
      ] = await Promise.all([
        fetch(
          "https://us-central1-global-tine-447000-u6.cloudfunctions.net/vehicles/api/get_light_vehicles"
        ),
        fetch(
          "https://us-central1-global-tine-447000-u6.cloudfunctions.net/vehicles/api/get_heavy_vehicles"
        ),
        fetch(
          "https://us-central1-global-tine-447000-u6.cloudfunctions.net/repairshops/api/get_dealership_repairshops"
        ),
        fetch(
          "https://us-central1-global-tine-447000-u6.cloudfunctions.net/repairshops/api/get_mechanic_repairshops"
        ),
      ]);

      const vehiculosLivianos = await responseLivianos.json();
      const vehiculosPesados = await responsePesados.json();
      const consecionario = await responseConcesionario.json();
      const mecanica = await responseMecanica.json();

      setVehiculos([...vehiculosLivianos, ...vehiculosPesados]);
      setTalleres([...consecionario, ...mecanica]);
    } catch (error) {
      console.error("Error al obtener los Datos:", error);
    }
  };

  // Simula llamadas a APIs
  useEffect(() => {
    const fallasAPI: Falla[] = [
      { id: 1, descripcion: "Neumáticos" },
      { id: 2, descripcion: "Sistema de Escape" },
      { id: 3, descripcion: "Sistema de Frenos" },
      { id: 4, descripcion: "Sistema Eléctrico" },
      { id: 5, descripcion: "Sistema de Dirección" },
      { id: 6, descripcion: "Climatización" },
      { id: 7, descripcion: "Sistema de Suspensión" },
      { id: 8, descripcion: "Nivel de Líquidos" },
      { id: 9, descripcion: "Motor" },
      { id: 10, descripcion: "Chasis" },
    ];
    const encargadosAPI: Encargado[] = [
      {
        id: 1,
        nombre: "Irma Elizabeth Cadme Samaniego",
        img: "https://www.utpl.edu.ec/carreras/sites/default/files/Irma%20Cadme.jpg",
      },
      {
        id: 2,
        nombre: "Jorge Marcos Cordero Zambrano",
        img: "https://www.utpl.edu.ec/carreras/sites/default/files/Jorge%20Cordero.jpg",
      },
      {
        id: 3,
        nombre: "René Rolando Elizalde Solano",
        img: "https://www.utpl.edu.ec/carreras/sites/default/files/Jorge%20Cordero.jpg",
      },
      {
        id: 4,
        nombre: "Ángel Eduardo Encalada Encalada",
        img: "https://www.utpl.edu.ec/carreras/sites/default/files/Angel%20Encalada_0.jpg",
      },
      {
        id: 5,
        nombre: "Franco Olivio Guamán Bastidas",
        img: "https://www.utpl.edu.ec/carreras/sites/default/files/Franco%20Guaman_0.jpg",
      },
      {
        id: 6,
        nombre: "Jorge Afranio López Vargas",
        img: "https://www.utpl.edu.ec/carreras/sites/default/files/Jorge%20Lopez_1.jpg",
      },
      {
        id: 7,
        nombre: "Patricia Jeanneth Ludeña González",
        img: "https://www.utpl.edu.ec/carreras/sites/default/files/Patricia%20Lude%C3%B1a.jpg",
      },
      {
        id: 8,
        nombre: "Ruth Maria Reategui Rojas",
        img: "https://www.utpl.edu.ec/carreras/sites/default/files/Ruth%20Reategui.jpg",
      },
    ];
    obtenerDatos();
    setFallas(fallasAPI);
    setEncargados(encargadosAPI);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      obtenerDatos();
    }, [])
  );

  const toggleFalla = (id: number) => {
    setFallasSeleccionadas((prev) =>
      prev.includes(id)
        ? prev.filter((fallaId) => fallaId !== id)
        : [...prev, id]
    );
  };

  const handleSearchVehiculo = (query: string) => {
    setSearchQueryVehiculo(query);
  };

  const handleSearchTaller = (query: string) => {
    setSearchQueryTaller(query);
  };

  const handleSearchEncargado = (query: string) => {
    setSearchQueryEncargado(query);
  };

  const filteredVehiculos = vehiculos.filter((vehiculo) => {
    const queryLower = searchQueryVehiculo.toLowerCase();
    return (
      vehiculo.type === tabVehiculo &&
      (vehiculo.plate.toLowerCase().includes(queryLower) ||
        vehiculo.brand.toLowerCase().includes(queryLower) ||
        vehiculo.model.toLowerCase().includes(queryLower) ||
        vehiculo.year.includes(queryLower))
    );
  });

  const filteredTaller = talleres.filter((taller) => {
    const queryLower1 = searchQueryTaller.toLowerCase();
    return (
      taller.type === tabTaller &&
      (taller.name.toLowerCase().includes(queryLower1) ||
        taller.address.toLowerCase().includes(queryLower1) ||
        taller.city.toLowerCase().includes(queryLower1) ||
        taller.phone.includes(queryLower1))
    );
  });

  const filteredEncargado = encargados.filter((encargado) => {
    const queryLower2 = searchQueryEncargado.toLowerCase();
    return encargado.nombre.toLowerCase().includes(queryLower2);
  });

  return (
    <GestureHandlerRootView style={globalStyles(top).container}>
      <View style={styles.containerTitle}>
        <SimpleLineIcons
          name="arrow-left"
          size={19}
          color="#004270"
          style={styles.iconStyle2}
          onPress={() => navigation.navigate("HomeTab", { screen: "Home" })}
        />
        <Text style={styles.title}>Mantenimiento Preventivo</Text>
      </View>
      <ScrollView>
        <View>
          {/* Vehículos */}
          <View style={styles.section}>
            <Text style={styles.subtitle}>Selecciona tu vehículo</Text>
            <View style={styles.buscar}>
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar Vehículo"
                value={searchQueryVehiculo}
                onChangeText={handleSearchVehiculo}
              />
              <Ionicons
                name="filter"
                size={24}
                color="gray"
                style={styles.iconStyle}
              />
            </View>

            <View style={styles.tabs}>
              <TouchableOpacity onPress={() => setTabVehiculo("Liviano")}>
                <Text
                  style={
                    tabVehiculo === "Liviano"
                      ? styles.activeTab
                      : styles.inactiveTab
                  }
                >
                  Livianos
                </Text>
                {tabVehiculo === "Liviano" && (
                  <View
                    style={{
                      height: 3,
                      backgroundColor: "#FEBE10",
                      marginVertical: 2,
                      width: "140%",
                      marginLeft: -12,
                    }}
                  ></View>
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setTabVehiculo("Pesado")}>
                <Text
                  style={
                    tabVehiculo === "Pesado"
                      ? styles.activeTab
                      : styles.inactiveTab
                  }
                >
                  Pesados
                </Text>
                {tabVehiculo === "Pesado" && (
                  <View
                    style={{
                      height: 3,
                      backgroundColor: "#FEBE10",
                      marginVertical: 2,
                      width: "140%",
                      marginLeft: -12,
                    }}
                  ></View>
                )}
              </TouchableOpacity>
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
            <ScrollView style={styles.scrollContainer}>
              {filteredVehiculos.length > 0 ? (
                filteredVehiculos.map((item) => (
                  <TouchableOpacity
                    key={item.plate}
                    onPress={() => setVehiculoSeleccionado(item)}
                  >
                    <View
                      style={[
                        styles.card,
                        vehiculoSeleccionado?.plate === item.plate &&
                          styles.selectedCard,
                      ]}
                    >
                      <View style={styles.containerItem}>
                        <View style={styles.checkboxContainer}>
                          <Checkbox
                            value={vehiculoSeleccionado?.plate === item.plate}
                            onValueChange={() => setVehiculoSeleccionado(item)}
                            color={
                              vehiculoSeleccionado?.plate === item.plate
                                ? "#F2B705"
                                : "#CCC"
                            }
                          />
                        </View>
                        <View style={styles.containerImg}>
                          <Image
                            source={{
                              uri: "https://github.com/JonathanCoronel/uploadimg/blob/main/Imagenes%20Arquitectura/Hilux00-removebg-preview%201.png?raw=true",
                            }}
                            resizeMode="contain"
                            style={{ width: "100%", height: "100%" }}
                          />
                        </View>
                        <View style={styles.containerInfo}>
                          <Text
                            style={styles.listItemTextModelo}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {item.model}
                          </Text>
                          <Text style={styles.listItemTextPlaca}>
                            {item.plate}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text>No se encontraron vehículos</Text>
              )}
            </ScrollView>
          </View>

          {/* Talleres */}
          <View style={styles.section}>
            <Text style={styles.subtitle}>Selecciona tu taller</Text>
            <View style={styles.buscar}>
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar Taller"
                value={searchQueryTaller}
                onChangeText={handleSearchTaller}
              />
              <Ionicons
                name="filter"
                size={24}
                color="gray"
                style={styles.iconStyle}
              />
            </View>
            <View style={styles.tabs}>
              <TouchableOpacity onPress={() => setTabTaller("Mecánica")}>
                <Text
                  style={
                    tabTaller === "Mecánica"
                      ? styles.activeTab
                      : styles.inactiveTab
                  }
                >
                  Mecánica
                </Text>
                {tabTaller === "Mecánica" && (
                  <View
                    style={{
                      height: 3,
                      backgroundColor: "#FEBE10",
                      marginVertical: 2,
                      width: "140%",
                      marginLeft: -12,
                    }}
                  ></View>
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setTabTaller("Concesionario")}>
                <Text
                  style={
                    tabTaller === "Concesionario"
                      ? styles.activeTab
                      : styles.inactiveTab
                  }
                >
                  Concesionario
                </Text>
                {tabTaller === "Concesionario" && (
                  <View
                    style={{
                      height: 3,
                      backgroundColor: "#FEBE10",
                      marginVertical: 2,
                      width: "140%",
                      marginLeft: -12,
                    }}
                  ></View>
                )}
              </TouchableOpacity>
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

            <ScrollView style={styles.scrollContainer}>
              {filteredTaller.length > 0 ? (
                filteredTaller.map((item) => (
                  <TouchableOpacity
                    key={item.name}
                    onPress={() => setTallerSeleccionado(item)}
                  >
                    <View
                      style={[
                        styles.card,
                        tallerSeleccionado?.name === item.name &&
                          styles.selectedCard,
                      ]}
                    >
                      <View style={styles.containerItem}>
                        <View style={styles.checkboxContainer}>
                          <Checkbox
                            value={tallerSeleccionado?.name === item.name}
                            onValueChange={() => setTallerSeleccionado(item)}
                            color={
                              tallerSeleccionado?.name === item.name
                                ? "#F2B705"
                                : "#CCC"
                            }
                          />
                        </View>
                        <View style={styles.containerImg}>
                          <Image
                            source={{
                              uri: "https://github.com/JonathanCoronel/uploadimg/blob/main/Imagenes%20Arquitectura/images-removebg-preview(1)%202.png?raw=true",
                            }}
                            resizeMode="contain"
                            style={{ width: "100%", height: "100%" }}
                          />
                        </View>
                        <View style={styles.containerInfo}>
                          <Text
                            style={styles.listItemTextModelo}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {item.name}
                          </Text>
                          <Text style={styles.listItemTextPlaca}>
                            {item.address}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text>No se encontraron Talleres</Text>
              )}
            </ScrollView>
          </View>

          {/* Fecha */}
          <View style={styles.section}>
            <Text style={styles.subtitle}>Fecha</Text>
               <Calender onSelectDate={handleDateSelection} />
          </View>

          {/* Fallas */}
          <View style={styles.section}>
            <Text style={styles.subtitle}>Verificaciones</Text>
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
              {fallas.map((item) => (
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
              ))}
            </View>
          </View>

          {/* Encargados */}
          <View style={styles.section}>
            <Text style={styles.subtitle}>Encargado</Text>
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
            <ScrollView style={styles.scrollContainerEncargado}>
              {filteredEncargado.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => setEncargadoSeleccionado(item)}
                >
                  <View
                    style={[
                      styles.card,
                      encargadoSeleccionado?.id === item.id &&
                        styles.selectedCard,
                    ]}
                  >
                    <View style={styles.containerItem}>
                      <View style={styles.containerImgEncar}>
                        <Image
                          source={{
                            uri: item.img,
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
                          {item.nombre}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Resumen y Generar Orden */}
          <View style={styles.summary}>
            {/* <Text>Vehículo: {vehiculoSeleccionado?.plate || "Ninguno"}</Text>
            <Text>Taller: {tallerSeleccionado?.name || "Ninguno"}</Text>
            <Text>Fecha: {fechaSeleccionada ? fechaSeleccionada.toLocaleString() : 'Fecha no disponible'}
            </Text>
            <Text>
              Fallas:{" "}
              {fallasSeleccionadas
                .map((id) => fallas.find((f) => f.id === id)?.descripcion)
                .join(", ") || "Ninguna"}
            </Text>
            <Text>Encargado: {encargadoSeleccionado?.nombre || "Ninguno"}</Text> */}
            
            <TouchableOpacity
              onPress={generarOrden}
              style={styles.button}
              disabled={
                !vehiculoSeleccionado ||
                !tallerSeleccionado ||
                fallasSeleccionadas.length === 0 ||
                !encargadoSeleccionado
              }
            >
              <Text style={{ color: "white" }}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  iconStyle2: {
    marginRight: 10,
    transform: [{ scaleX: 1.2 }],
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
  subtitle: {
    fontSize: 18,
    color: "#004270",
    fontWeight: 600,
    fontFamily: "Inter",
    marginBottom: 5,
  },
  searchInput: {
    borderWidth: 0.5,
    borderColor: "#BDBDBD",
    paddingHorizontal: 10,
    height: 40,
    width: "90%",
    borderRadius: 30,
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 10,
    marginHorizontal: 50,
    justifyContent: "space-between",
  },
  inactiveTab: {
    color: "gray",
    fontWeight: 600,
    fontSize: 18,
    fontFamily: "Inter",
  },
  activeTab: {
    fontWeight: 600,
    fontSize: 18,
    color: "#004270",
    fontFamily: "Inter",
  },
  card: {
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  containerItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 1,
  },

  containerImg: {
    height: 73,
    width: 96,
    margin: 10,
  },
  containerInfo: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
    overflow: "hidden",
  },

  listItemTextModelo: {
    fontSize: 18,
    fontWeight: 600,
    fontFamily: "Inter",
    color: "#6A6A6A",
  },
  listItemTextPlaca: {
    fontSize: 14,
    fontWeight: 400,
    fontFamily: "Inter",
    color: "#6A6A6A",
  },
  scrollContainer: {
    height: 170,
  },

  containerFallas: {
    height: 171,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  selectedCard: {
    backgroundColor: "#F7F7F7",
    borderColor: "#1890ff",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  ObservationInput: {
    borderWidth: 0.7,
    borderColor: "#BDBDBD",
    height: 40,
    width: "100%",
    borderRadius: 10,
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
  button: {
    backgroundColor: "#004270",
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    marginHorizontal: 20,
    height: 61,
    marginTop: 10,
    justifyContent: "center",
  },
  summary: { marginTop: 20 },
});
