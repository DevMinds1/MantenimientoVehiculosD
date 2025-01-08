import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { globalStyles } from "../../theme/theme";

export const VerMantenimientoPendienteScreen = () => {
  const { top } = useSafeAreaInsets();

  return (
    <View style= {{ backgroundColor:'white', flex:1}}>
      <Text>VerMantenimientoPendienteScreen</Text>
    </View>
  );
}
