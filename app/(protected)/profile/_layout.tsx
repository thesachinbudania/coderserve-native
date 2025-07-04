import { Stack } from "expo-router";
import { PortalProvider } from "@gorhom/portal";

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
