import { Stack } from "expo-router";
import { PortalProvider } from "@gorhom/portal";
import React from "react";

export default function Layout() {

  return (
    <PortalProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "white" },
        }}
      >
      </Stack>
    </PortalProvider>
  );
}
