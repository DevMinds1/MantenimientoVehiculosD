import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { globalStyles } from "../../theme/theme";

export const VerMantenimientoCompletadoScreen = () => {
  const { top } = useSafeAreaInsets();

  return (
    <View >
      <Text>VerMantenimientoCompletadoScreen</Text>
    </View>
  );
};
