import { Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  // useEffect
  useEffect(() => {
    const responseListner = Notification
  })
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="(exercise-tabs)" />
    </Stack>
  );
}
