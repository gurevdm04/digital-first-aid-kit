import { router } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import MedicationItem from "@/components/MedicationItem";

export type Item = {
  id: string;
  iconId: string;
  title: string;
  dose?: string;
  startDate?: string;
  days?: string;
  interval?: string;
  color?: string;
};

const data: Item[] = [
  { id: "1", iconId: "1", title: "Аспирин", dose: "100мг", startDate: "2025-10-20" },
  { id: "2", iconId: "2", title: "Пластырь", dose: "1 шт", startDate: "2025-10-21" },
];

const Medicines = () => {
  const handlePress = (item: Item) => {
    router.push({
      pathname: "/medicines/[id]", // ✅ именно имя файла
      params: {
        id: item.id,
        title: item.title,
        dose: item.dose ?? "",
        startDate: item.startDate ?? "",
        days: item.days ?? "",
        interval: item.interval ?? "",
        color: item.color ?? "#4a90e2",
        iconId: item.iconId ?? "",
      },
    });
  };

  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity onPress={() => handlePress(item)}>
      <MedicationItem iconId={item.iconId} title={item.title} />
    </TouchableOpacity>
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
    backgroundColor: "#554c4c",
    width: "100%",
  },
});