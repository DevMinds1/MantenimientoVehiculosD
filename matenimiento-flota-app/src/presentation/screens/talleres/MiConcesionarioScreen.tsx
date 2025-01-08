import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { globalStyles } from "../../theme/theme";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { RootButtonParams } from "../../routes/ButtonTabsNavigator";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface Repairshop {
  name: string;
  address: string;
  phone: number;
  city: number;
  type: string;
}

export const MiConsecionarioScreen = () => {
  const navigation = useNavigation<NavigationProp<RootButtonParams>>();
  const { top } = useSafeAreaInsets();
  const [repairshops, setRepairshops] = useState<Repairshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRepairshops, setFilteredRepairshops] = useState<Repairshop[]>(
    []
  );

  const fetchDealership = async () => {
    try {
      const response = await fetch(
        "https://us-central1-global-tine-447000-u6.cloudfunctions.net/repairshops/api/get_dealership_repairshops"
      );
      const data: Repairshop[] = await response.json();
      setRepairshops(data);
      setFilteredRepairshops(data);
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchDealership();
    }, [])
  );

  useEffect(() => {
    if (searchQuery) {
      const filtered = repairshops.filter(
        (repairshop) =>
          repairshop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          repairshop.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRepairshops(filtered);
    } else {
      setFilteredRepairshops(repairshops);
    }
  }, [searchQuery, repairshops]);

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
          onPress={() => navigation.navigate("HomeTab", { screen: "Home" })}
        />
        <Text style={styles.title}>Talleres</Text>
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
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("HomeTab", { screen: "MiMecanicaScreen" })
          }
        >
          <View style={styles.containerButtonIcon}>
            <MaterialCommunityIcons
              name="car-wrench"
              size={33}
              color="#004270"
              style={styles.iconStyle2}
            />
          </View>
          <Text style={styles.buttonText}>Mecánica</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <View style={styles.containerButtonIcon}>
            <MaterialIcons
              name="car-repair"
              size={33}
              color="#004270"
              style={styles.iconStyle2}
            />
          </View>
          <Text style={styles.buttonText}>Consecionario</Text>
          <View
            style={{
              height: 3,
              backgroundColor: "#FEBE10",
              marginVertical: 2,
              width: "73%",
            }}
          ></View>
        </TouchableOpacity>
      </View>

      <Text
        style={styles.subtitle}
      >{`${filteredRepairshops.length} Mecanicas disponibles`}</Text>

      <FlatList
        data={filteredRepairshops}
        keyExtractor={(item, index) => index.toString()}
        style={styles.containerList}
        showsVerticalScrollIndicator={true}
        renderItem={({ item }) => (
          <View>
            <View style={styles.containerItem}>
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
                <Text style={styles.listItemTextPlaca}>{item.address}</Text>
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
          onPress={() => navigation.navigate("HomeTab", { screen: "Talleres" })}
        >
          <Text style={styles.textAgregar}>+ Agregar Taller</Text>
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
