import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
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

const Medicines = () => {
  const [data, setData] = useState<Item[]>([]);

  const loadMedicines = async () => {
    try {
      const saved = await AsyncStorage.getItem("medicines");
      if (saved) setData(JSON.parse(saved));
    } catch (e) {
      console.error("Ошибка при загрузке лекарств", e);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadMedicines();
    }, [])
  );

  const handlePress = (item: Item) => {
    router.push({
      pathname: "/medicines/[id]",
      params: item,
    });
  };

  const renderItem = ({ item }: { item: Item }) => {
    return (
      <TouchableOpacity onPress={() => handlePress(item)}>
        <MedicationItem iconId={item.iconId} title={item.title} color={item.color} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Лекарства</Text>
      <View style={styles.listContainer}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", padding: 20, color: "#888" }}>
              Нет добавленных лекарств
            </Text>
          }
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
    backgroundColor: "#ddd",
    width: "100%",
  },
});
