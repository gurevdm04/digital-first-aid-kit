import { ICON_MAP } from "@/constants/ICON_MAP";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

type MedicationCardProps = {
  iconId: string;
  title: string;
  time: string;
};

const MedicationCard = ({ iconId, title, time }: MedicationCardProps) => {
  const iconName = ICON_MAP[iconId] ?? "help-circle-outline";

  return (
    <View style={styles.card}>
      {/* Левая часть — иконка */}
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={28} color="#4a90e2" />
      </View>

      {/* Правая часть — текст */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
    </View>
  );
};

export default MedicationCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row", // горизонтальное выравнивание
    alignItems: "center", // выравниваем иконку и текст по центру по вертикали
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e0ecff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12, // отступ между иконкой и текстом
  },
  textContainer: {
    flex: 1, // занимает всё оставшееся место
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  time: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});
