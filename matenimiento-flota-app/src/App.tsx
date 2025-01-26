import "react-native-gesture-handler";

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SideMenuNavigator } from "./presentation/routes/SaveMenuNavigator";
import { ButtonTabNavigator } from "./presentation/routes/ButtonTabsNavigator";
import { LoginScreen } from "./presentation/screens/login/LoginScreen";
import { StackNavigator } from "./presentation/routes/StackNavigator";
import { UserProvider } from "./presentation/components/userAut/userContext";

export const App = () => {
  return (
    <UserProvider>
      <NavigationContainer>
        <StackNavigator />
        {/*       <SideMenuNavigator /> */}
      </NavigationContainer>
    </UserProvider>
  );
};
