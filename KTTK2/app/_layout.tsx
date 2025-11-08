import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      {/* Ẩn header ở màn hình index */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
