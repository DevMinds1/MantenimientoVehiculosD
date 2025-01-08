import "react-native-gesture-handler";

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SideMenuNavigator } from "./presentation/routes/SaveMenuNavigator";
import { ButtonTabNavigator } from "./presentation/routes/ButtonTabsNavigator";
import { LoginScreen } from "./presentation/screens/login/LoginScreen";
import { StackNavigator } from "./presentation/routes/StackNavigator";

export const App = () => {
  return (
    <NavigationContainer>
      <StackNavigator />
{/*       <SideMenuNavigator /> */}
    </NavigationContainer>
  );
};
