import { Ionicons } from "@expo/vector-icons";
import { Stack, Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Запланировано",
          tabBarIcon: ({ color, size }) => <Ionicons name="file-tray" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="medicines"
        options={{
          title: "Лекарства",
          tabBarIcon: ({ color, size }) => <Ionicons name="medkit" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "История",
          tabBarIcon: ({ color, size }) => <Ionicons name="folder" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="AddMedication"
        options={{
          title: "Настройки",
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" color={color} size={size} />,
          tabBarLabel: () => null,
        }}
      />
    </Tabs>
  );
}
