import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="chat_shop" options={{ title: "shop" }} />
    </Stack>
  );
}
