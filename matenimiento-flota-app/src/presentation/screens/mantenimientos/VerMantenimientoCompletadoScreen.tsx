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
import { useFocusEffect } from "@react-navigation/native";

interface Order {
  vehicle: string;
  repairshop: string;
  mandated: string;
  faults: string;
  state: string;
  comments: string;
  type: string;
  delivery_date: string;
  entry_date: string;
  id: string;
}
export const VerMantenimientoCompletadoScreen = () => {
  const { top } = useSafeAreaInsets();

  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingOrders = async () => {
    try {
      const response = await fetch(
        "https://us-central1-global-tine-447000-u6.cloudfunctions.net/orders/api/get_completed_orders"
      );
      const data = await response.json();
      setPendingOrders(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener órdenes pendientes:", error);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPendingOrders();
    }, [])
  );

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
          data={pendingOrders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/*   <SimpleLineIcons name="eye" size={24} color="black" /> */}
              <Text style={styles.title}>Mantenimiento {item.type}</Text>
              <Text style={styles.label}>
                Fecha Ingreso:{" "}
                <Text style={styles.value}>{item.entry_date}</Text>
              </Text>
              <Text style={styles.label}>
                Fecha Entrega:{" "}
                <Text style={styles.value}>{item.delivery_date}</Text>{" "}
              </Text>

              <Text style={styles.label}>
                Tipo Mantenimiento:{" "}
                <Text style={styles.value}>
                  Reparación en Sistema de frenos
                </Text>
              </Text>
              <Text style={styles.label}>
                Vehículo: <Text style={styles.value}>{item.vehicle}</Text>
              </Text>
              <Text style={styles.label}>
                Valor Cancelado:{" "}
                <Text style={styles.value}>$60</Text>{" "}
              </Text>
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
          <View style={[styles.circle, { backgroundColor: "#CFEBD7" }]} />
          <Text style={styles.text}>Completado</Text>
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
    backgroundColor: "#CFEBD7",
    marginHorizontal: 15,
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    shadowOpacity: 0.2,
    shadowRadius: 3,
    height: 160,
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
    borderRadius: 5, // Hace que el View sea redondeado
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: 400,
    fontFamily: "Inter",
    color: "#6A6A6A",
  },
});
