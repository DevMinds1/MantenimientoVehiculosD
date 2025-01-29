import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { RootButtonParams } from "../../routes/ButtonTabsNavigator";
import { Timestamp } from "firebase/firestore";
import { Order } from "../../../interface/repairshop";
import { useUser } from "../../components/userAut/userContext";

export const VerMantenimientoEnTaller = () => {
  const { top } = useSafeAreaInsets();
  const { user } = useUser();
  const navigation = useNavigation<NavigationProp<RootButtonParams>>();

  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingOrders = async () => {
    try {
      const pendingResponse = await fetch(
        "https://us-central1-global-tine-447000-u6.cloudfunctions.net/orders/api/get_repairshop_orders"
      );
      const pendingData = await pendingResponse.json();

      const repairshopIds = [
        ...new Set(pendingData.map((order: any) => order.repairshop)),
      ];

      const repairshopPromises = repairshopIds.map((id) =>
        fetch(
          `https://us-central1-global-tine-447000-u6.cloudfunctions.net/repairshops/api/get_repairshop_by_id?id=${id}`
        ).then((res) => res.json())
      );

      const mandatedIds = [
        ...new Set(pendingData.map((order: any) => order.mandated)),
      ];

      const mandatedPromises = mandatedIds.map((id) =>
        fetch(
          `https://us-central1-global-tine-447000-u6.cloudfunctions.net/users/api/get_user_by_id?uid=${id}`
        ).then((res) => res.json())
      );

      const vehicleIds = [
        ...new Set(pendingData.map((order: any) => order.vehicle)),
      ];

      const vehiclePromises = vehicleIds.map((id) =>
        fetch(
          `https://us-central1-global-tine-447000-u6.cloudfunctions.net/vehicles/api/get_vehicle_by_plate?PLACA=${id}`
        ).then((res) => res.json())
      );

      const [repairshopData, mandatedData, vehicleData] = await Promise.all([
        Promise.all(repairshopPromises),
        Promise.all(mandatedPromises),
        Promise.all(vehiclePromises),
      ]);

      // Crear diccionarios para un acceso rápido
      const repairshopMap: Record<string, any> = repairshopData.reduce(
        (map, shop) => {
          map[shop.id] = { name: shop.name, address: shop.address };
          return map;
        },
        {}
      );

      const mandatedMap: Record<string, any> = mandatedData.reduce(
        (map, mandated) => {
          map[mandated.uid] = { name: mandated.name, correo: mandated.email };
          return map;
        },
        {}
      );

      const vehicleMap: Record<string, any> = vehicleData.reduce(
        (map, vehicle) => {
          map[vehicle.PLACA] = {
            marca: vehicle.MARCA,
            motor: vehicle.MOTOR,
            tipo: vehicle.TIPO,
            tipo_vehicle: vehicle.TIPO_VEHICULO,
            propiedad: vehicle.PROPIEDAD,
            image: vehicle.IMAGE_URL,
          };
          return map;
        },
        {}
      );

      let orders = pendingData.map((order: any) => ({
        ...order,
        entry_date: order.entry_date ? new Date(order.entry_date) : null,
        repairshopName:
          repairshopMap[order.repairshop]?.name || "Taller desconocido",
        repairshopAddress:
          repairshopMap[order.repairshop]?.address || "Dirección desconocida",
        mandatedName:
          mandatedMap[order.mandated]?.name || "Encargado desconocido",
        mandatedEmail:
          mandatedMap[order.mandated]?.correo || "Email desconocido",
        vehicleMarca: vehicleMap[order.vehicle]?.marca || "Marca desconocida",
        vehicleMotor: vehicleMap[order.vehicle]?.motor || "Motor desconocida",
        vehicleTipo: vehicleMap[order.vehicle]?.tipo || "Tipo desconocida",
        vehicleTipoVehi:
          vehicleMap[order.vehicle]?.tipo_vehicle ||
          "Tipo Vehiculo desconocida",
        vehiclePropiedad:
          vehicleMap[order.vehicle]?.propiedad || "Propiedad desconocida",
        vehicleImage:
          vehicleMap[order.vehicle]?.image || "Propiedad desconocida",
      }));

      if (user?.role === "mandated") {
        orders = orders.filter(
          (order: { mandated: string }) => order.mandated === user.uid
        );
      }

      setPendingOrders(orders);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener órdenes:", error);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPendingOrders();
    }, [])
  );

  const formatDate = (date: Date | null): string => {
    if (!date) return "Fecha no disponible";
    return date.toLocaleString("es-ES", { timeZone: "America/Bogota" });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <View style={{ height: "95%" }}>
        <FlatList
          data={pendingOrders.sort((a, b) => {
            // Primero coloca los que tienen el estado "En Taller"
            if (a.state === "En Taller" && b.state !== "En Taller") return -1;
            if (a.state !== "En Taller" && b.state === "En Taller") return 1;
            return 0; // Si ambos son iguales, no se cambia el orden
          })}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.card,
                {
                  backgroundColor:
                    item.state === "En Taller" ? "#FFD85659" : "#E0E0E0",
                },
              ]}
            >
              {/*   <SimpleLineIcons name="eye" size={24} color="black" /> */}
              <Text style={styles.title}>Mantenimiento {item.type}</Text>
              <Text style={styles.label}>
                Fecha Ingreso:{" "}
                <Text style={styles.value}>{formatDate(item.entry_date)}</Text>
              </Text>
              <Text style={styles.label}>Fecha Entrega: </Text>
              <Text style={styles.label}>
                Taller: <Text style={styles.value}>{item.repairshopName}</Text>
              </Text>
              <Text style={styles.label}>
                Vehículo: <Text style={styles.value}>{item.vehicle}</Text>
              </Text>
              <Text style={styles.label}>
                Encargado: <Text style={styles.value}>{item.mandatedName}</Text>{" "}
              </Text>
              <Text style={styles.label}>Valor Cancelado: </Text>
              <View style={styles.buttonCont}>
                <TouchableOpacity
                  style={styles.statusButton}
                  onPress={() =>
                    navigation.navigate("HomeTab", {
                      screen: "DetalleMantenimeinto",
                      params: {
                        id: item.id,
                        faults: item.faults,
                        state: item.state,
                        order: item,
                      },
                    })
                  }
                >
                  <Text style={styles.statusText}>Aceptado</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
      <View
        style={{
          height: 1,
          backgroundColor: "#E0E0E0",
          width: "100%",
          marginTop: 3,
        }}
      ></View>
      <View style={styles.containerfoot}>
        <View style={styles.statusItem}>
          <View style={[styles.circle, { backgroundColor: "#FFD85659" }]} />
          <Text style={styles.text}>Vehículo en taller</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 15,
    color: "#333",
  },
  card: {
    marginHorizontal: 15,
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    shadowOpacity: 0.2,
    shadowRadius: 3,
    height: 200,
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    color: "#004270",
    fontFamily: "Inter",
  },
  label: {
    fontSize: 14,
    color: "#004270",
    marginVertical: 2,
    fontWeight: 400,
    fontFamily: "Inter",
  },
  value: {
    fontWeight: 400,
    fontFamily: "Inter",
    fontSize: 14,
    color: "#000000",
  },
  statusButton: {
    marginTop: 10,
    backgroundColor: "#004270",
    alignSelf: "flex-start",
    paddingVertical: 1,
    paddingHorizontal: 15,
    width: 100,
    height: 30,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: "auto",
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: 500,
    textAlign: "center",
    fontFamily: "Inter",
  },
  buttonCont: {
    width: "100%",
    alignContent: "center",
    justifyContent: "center",
  },
  containerfoot: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginVertical: 8,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: 400,
    fontFamily: "Inter",
    color: "#6A6A6A",
  },
});
