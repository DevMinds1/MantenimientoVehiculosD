import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen } from "../screens/login/LoginScreen";
import { HomeScreen } from "../screens/home/HomeScreen";
import { SideMenuNavigator } from "./SaveMenuNavigator";
import { RegistrarVehiculoScreen } from "../screens/vehiculos/RegistrarVehiculoScreen";
import { MisVehiculoScreen } from "../screens/vehiculos/MisVehiculosPesadosScreen";
import { ButtonTabNavigator } from "./ButtonTabsNavigator";
import { useUser } from "../components/userAut/userContext";

export type RootStackParams = {
  HomeStack: undefined;
  LoginScreen: undefined;
};

const Stack = createStackNavigator<RootStackParams>();

export const StackNavigator = () => {
  const { user } = useUser();  
  return (
    <Stack.Navigator
    initialRouteName={user ? "HomeStack" : "LoginScreen"}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeStack" component={ButtonTabNavigator} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
    </Stack.Navigator>
  );
};
