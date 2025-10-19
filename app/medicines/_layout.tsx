import { Stack } from "expo-router";

export default function MedicinesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Лекарства", headerShown: false }} />
      <Stack.Screen name="[id]" options={{ title: "Детали лекарства" }} />
      <Stack.Screen name="../AddMedication" options={{ title: "Добавить лекарство" }} />
    </Stack>
  );
}
