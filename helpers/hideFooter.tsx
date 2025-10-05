import { useNavigation } from "@react-navigation/native";
import React from "react";

export function useRemoveFooter(addFooterOnUnmount: boolean) {
  const navigation = useNavigation();
  React.useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: "none" },
    });
    if (!addFooterOnUnmount) {
      return;
    }
    return () =>
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          display: "flex",
          height: 54,
          marginBottom: 0,
          paddingBottom: 0,
        },
      });
  }, []);
}
