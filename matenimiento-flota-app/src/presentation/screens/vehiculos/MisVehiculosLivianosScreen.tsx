import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { globalStyles } from "../../theme/theme";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { RootButtonParams } from "../../routes/ButtonTabsNavigator";

interface Vehicle {
  plate: string;
  brand: string;
  year: number;
  mileage: number;
  model: string;
  fuel_type: string;
  oil: string;
  type: string;
}

export const MisVehiculosLivianosScreen = () => {
  const navigation = useNavigation<NavigationProp<RootButtonParams>>();
  const { top } = useSafeAreaInsets();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);

  const fetchLightVehicles = async () => {
    try {
      const response = await fetch(
        "http://192.168.1.12:5001/api/get_light_vehicles"
      );
      const data: Vehicle[] = await response.json();
      setVehicles(data);
      setFilteredVehicles(data);
    } catch (error) {
      console.error("Error fetching light vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchLightVehicles();
    }, [])
  );

  useEffect(() => {
    if (searchQuery) {
      const filtered = vehicles.filter(
        (vehicle) =>
          vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vehicle.plate.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredVehicles(filtered);
    } else {
      setFilteredVehicles(vehicles);
    }
  }, [searchQuery, vehicles]);

  if (loading) {
    return (
      <View style={globalStyles(top).container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={globalStyles(top).container}>
      <View style={styles.containerTitle}>
        <SimpleLineIcons
          name="arrow-left"
          size={19}
          color="#004270"
          style={styles.iconStyle}
          onPress={() => navigation.navigate("HomeTab", { screen: "" })}
        />
        <Text style={styles.title}>Vehículos</Text>
      </View>

      <View style={styles.buscar}>
        {/*       <Ionicons
            name="search-outline"
            size={18}
            color="#004270"
            style={styles.iconStyle}
          /> */}
        <TextInput
          placeholder="Buscar..."
          style={styles.input}
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        ></TextInput>
        <Ionicons
          name="filter"
          size={24}
          color="black"
          style={styles.iconStyle}
        />
      </View>

      <View style={styles.containerButton}>
        <TouchableOpacity style={styles.button}>
          <View style={styles.containerButtonIcon}>
            <AntDesign
              name="car"
              size={33}
              color="#004270"
              style={styles.iconStyle2}
            />
          </View>
          <Text style={styles.buttonText}>Vehículos Livianos</Text>
          <View
            style={{
              height: 3,
              backgroundColor: "#FEBE10",
              marginVertical: 2,
              width: "73%",
            }}
          ></View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("Vehiculos", { screen: "MisVehiculos" })
          }
        >
          <View style={styles.containerButtonIcon}>
            <Ionicons
              name="bus-outline"
              size={33}
              color="#004270"
              style={styles.iconStyle2}
            />
          </View>
          <Text style={styles.buttonText}>Vehículos Pesados</Text>
        </TouchableOpacity>
      </View>

      <Text
        style={styles.subtitle}
      >{`${filteredVehicles.length} Vehículos disponibles`}</Text>

      <FlatList
        data={filteredVehicles}
        keyExtractor={(item, index) => index.toString()}
        style={styles.containerList}
        showsVerticalScrollIndicator={true}
        renderItem={({ item }) => (
          <View>
            <View style={styles.containerItem}>
              <View style={styles.containerImg}>
                <Image
                  source={{
                    uri: "https://github.com/JonathanCoronel/uploadimg/blob/main/Imagenes%20Arquitectura/Hilux00-removebg-preview%201.png?raw=true",
                  }}
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
                <Text style={styles.listItemTextPlaca}>{item.plate}</Text>
              </View>
            </View>
            <View
              style={{
                height: 2,
                backgroundColor: "#E0E0E0",
                marginVertical: 2,
                width: "100%",
              }}
            ></View>
          </View>
        )}
      />

      <View style={styles.containerAgregar}>
        <TouchableOpacity
          style={styles.agregar}
          onPress={() =>
            navigation.navigate("HomeTab", { screen: "RegistrarVehiculo" })
          }
        >
          <Text style={styles.textAgregar}>+ Agregar Vehiculo</Text>
        </TouchableOpacity>
      </View>
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

  containerButton: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    backgroundColor: "#004270",
    borderRadius: 20,
  },

  containerButtonIcon: {
    width: 123,
    height: 52,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 1,
  },

  iconStyle2: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.2 }],
  },

  button: {
    padding: 10,
    borderRadius: 5,
    flex: 1,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    marginTop: 2,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: 400,
    fontFamily: "Inter",
  },

  subtitle: {
    fontFamily: "Inter",
    fontWeight: 600,
    fontSize: 18,
    color: "#004270",
  },
  containerList: {
    backgroundColor: "white",
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

  containerAgregar: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    padding: 1,
    marginBottom: 10,
  },

  agregar: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 10,
    width: 165,
    height: 33,
    borderColor: "#004270",
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  textAgregar: {
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: 14,
    color: "#004270",
  },
  input: {
    borderWidth: 0.5,
    borderColor: "#BDBDBD",
    paddingHorizontal: 10,
    height: 40,
    width: "90%",
    borderRadius: 30,
  },
  buscar: {
    flexDirection: "row",

    marginTop: 12,
    marginBottom: 12,
    width: "100%",
    alignItems: "center",
  },
});
