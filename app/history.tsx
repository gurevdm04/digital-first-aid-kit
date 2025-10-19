import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Medication = {
  id: string;
  name: string;
  time: string;
  icon: string;
};

const data: Medication[] = [
  { id: "1", name: "Addddd", time: "00:00", icon: "medkit-outline" },
  { id: "2", name: "Asda", time: "00:00", icon: "medkit-outline" },
];

export default function History() {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const prevWeek = () => {
    const d = new Date(currentWeek);
    d.setDate(d.getDate() - 7);
    setCurrentWeek(d);
  };

  const nextWeek = () => {
    const d = new Date(currentWeek);
    d.setDate(d.getDate() + 7);
    setCurrentWeek(d);
  };

  const formatWeek = (date: Date) => {
    const start = new Date(date);
    const end = new Date(date);
    start.setDate(start.getDate() - start.getDay()); // воскресенье
    end.setDate(start.getDate() + 6); // суббота
    return `${start.getDate()}-${end.getDate()} ${start.toLocaleString("ru-RU", {
      month: "long",
    })} ${start.getFullYear()}г.`;
  };

  const renderItem = ({ item }: { item: Medication }) => (
    <View style={styles.card}>
      <Ionicons name={item.icon as any} size={36} color="#ccc" style={styles.icon} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <Ionicons name="pencil-outline" size={20} color="#f44336" />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>История</Text>

      {/* Сменная неделя */}
      <View style={styles.weekContainer}>
        <TouchableOpacity onPress={prevWeek}>
          <Ionicons name="chevron-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.weekText}>{formatWeek(currentWeek)}</Text>
        <TouchableOpacity onPress={nextWeek}>
          <Ionicons name="chevron-forward-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Кнопка "Прием по мере необходимости" */}
      <TouchableOpacity style={styles.asNeededButton}>
        <Text style={styles.asNeededText}>+ Прием по мере необходимости</Text>
      </TouchableOpacity>

      {/* Список */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 16, paddingTop: 80 },
  header: { color: "#333", fontSize: 32, fontWeight: "bold", marginBottom: 16 },
  weekContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#e0e0e0",
    marginBottom: 16,
  },
  weekText: { color: "#333", fontSize: 16, fontWeight: "500" },
  asNeededButton: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f44336",
    marginBottom: 16,
  },
  asNeededText: { color: "#f44336", fontWeight: "600", textAlign: "center" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: { marginRight: 12, color: "#4a90e2" },
  name: { color: "#333", fontSize: 16, fontWeight: "600" },
  time: { color: "#666", fontSize: 14, marginTop: 2 },
});
