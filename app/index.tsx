import MedicationCard from "@/components/MedicationCard";
import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Modal, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ICON_MAP } from "@/constants/ICON_MAP"; // если у тебя уже есть ICON_MAP

export type Item = {
  id: string;
  iconId: string;
  title: string;
  time: string;
};

const data: Item[] = [
  { id: "1", iconId: "1", title: "Аспирин", time: "Через 1 час" },
  { id: "2", iconId: "2", title: "Пластырь", time: "Через 2 часа" },
  { id: "3", iconId: "3", title: "Антибиотик", time: "Через 3 часа" },
  { id: "4", iconId: "4", title: "Витамины", time: "Через 4 часа" },
  { id: "5", iconId: "5", title: "Сироп", time: "Через 5 часов" },
];

export default function Index() {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  const openModal = (item: Item) => {
    setSelectedItem(item);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setSelectedItem(null));
  };

  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <MedicationCard iconId={item.iconId} title={item.title} time={item.time} />
    </TouchableOpacity>
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

      {/* Модальное окно */}
      <Modal transparent visible={!!selectedItem} animationType="fade">
        <Animated.View style={[styles.modalBackground, { opacity: fadeAnim }]}>
          <View style={styles.modalContainer}>
            {selectedItem && (
              <>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name={ICON_MAP[selectedItem.iconId] ?? "help-circle-outline"}
                    size={48}
                    color="#4a90e2"
                  />
                </View>
                <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                <Text style={styles.modalTime}>{selectedItem.time}</Text>

                <Text style={styles.modalDescription}>Вы приняли лекарство?</Text>

                <TouchableOpacity style={styles.acceptedButton}>
                  <Text style={styles.buttonText}>Принято</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.skippedButton}>
                  <Text style={styles.skippedText}>Пропущенно</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                  <Ionicons name={"close"} size={30} color="#ffffffff" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </Animated.View>
      </Modal>
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
  /** ========== МОДАЛКА ========== */
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    position: "relative",
  },
  iconContainer: {
    backgroundColor: "#eaf2ff",
    borderRadius: 50,
    padding: 16,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  modalTime: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    marginBottom: 20,
  },
  acceptedButton: {
    backgroundColor: "#4a90e2",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  skippedButton: {
    backgroundColor: "#4a91e200",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 5,
  },
  skippedText: {
    color: "#4a91e2",
    width: 200,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  closeButton: {
    backgroundColor: "#4a90e2",
    borderRadius: 100,
    position: "absolute",
    right: 10,
    top: 10,
  },
  buttonText: {
    width: 200,
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
