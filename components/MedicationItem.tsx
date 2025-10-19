import { ICON_MAP } from "@/constants/ICON_MAP";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

type MedicationItemProps = {
  iconId: string;
  title: string;
};

const MedicationItem = ({ iconId, title }: MedicationItemProps) => {
  const iconName = ICON_MAP[iconId] ?? "help-circle-outline";

  return (
    <View style={styles.card}>
      {/* Левая часть — иконка */}
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={28} color="#4a90e2" />
      </View>

      {/* Средняя часть — текст */}
      <View style={styles.middleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Правая часть — стрелка */}
      <View style={styles.arrowContainer}>
        <Text style={styles.arrow}>{">"}</Text>
      </View>
    </View>
  );
};

export default MedicationItem;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // распределяем элементы по краям
    padding: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e0ecff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  middleContainer: {
    flex: 1, // занимает всё оставшееся место между иконкой и стрелкой
  },
  arrowContainer: {
    marginLeft: 12,
  },
  arrow: {
    fontSize: 20,
    color: "#999",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});
