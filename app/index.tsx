import MedicationCard from "@/components/MedicationCard";
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

export type Item = {
  id: string;
  iconId: string;
  title: string;
  time: string;
};

const data: Item[] = [
  { id: "1", iconId: "1", title: "Аспирин", time: "Через 1 час" },
  { id: "2", iconId: "2", title: "Пластырь", time: "Через 2 час" },
  { id: "3", iconId: "3", title: "Антибиотик", time: "Через 1 час" },
  { id: "4", iconId: "4", title: "Витамины", time: "Через 1 час" },
  { id: "5", iconId: "5", title: "Сироп", time: "Через 1 час" },
];

export default function Index() {
  const renderItem = ({ item }: { item: Item }) => (
    <MedicationCard iconId={item.iconId} title={item.title} time={item.time} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Запланировано</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 80,
    backgroundColor: "#fff",
  },
  header: {
    color: "#333",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
  },
  list: {
    paddingBottom: 20,
  },
  item: {
    padding: 16,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    marginBottom: 12,
  },
  itemText: {
    fontSize: 16,
  },
});
