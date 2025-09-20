import { Stack } from "expo-router";

export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="chat"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="chatshop"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="explore"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
