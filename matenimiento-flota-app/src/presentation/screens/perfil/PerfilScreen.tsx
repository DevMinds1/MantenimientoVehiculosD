import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { globalStyles } from "../../theme/theme";

export const PerfilScreen = ()  =>{
  const { top } = useSafeAreaInsets();

  return (
    <View style={globalStyles(top).container}>
      <Text>PerfilScreen</Text>
    </View>
  );
}
