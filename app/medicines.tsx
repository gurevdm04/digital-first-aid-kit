import MedicationItem from "@/components/MedicationItem";
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

export type Item = {
  id: string;
  iconId: string;
  title: string;
};

const data: Item[] = [
  { id: "1", iconId: "1", title: "Аспирин" },
  { id: "2", iconId: "2", title: "Пластырь" },
  { id: "3", iconId: "3", title: "Антибиотик" },
  { id: "4", iconId: "4", title: "Витамины" },
  { id: "5", iconId: "5", title: "Сироп" },
];

const Medicines = () => {
  const renderItem = ({ item }: { item: Item }) => (
    <MedicationItem iconId={item.iconId} title={item.title} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Лекарства</Text>

      <View style={styles.listContainer}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </View>
  );
};

export default Medicines;

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
  listContainer: {
    backgroundColor: "#f1f1f1",
    borderRadius: 12,
    overflow: "hidden",
  },
  separator: {
    height: 1,
    backgroundColor: "#554c4cff", // цвет разделителя
    width: "100%", // на всю ширину
  },
});
