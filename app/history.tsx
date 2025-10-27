import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

type Medication = {
  id: string;
  title: string;
  startDate: string;
  iconId: string;
  status?: "pending" | "taken" | "missed";
};

export default function History() {
  const [data, setData] = useState<Medication[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  /** ======== Загрузка истории ======== */
  const loadHistory = async () => {
    try {
      const saved = await AsyncStorage.getItem("medicines");
      if (!saved) return;
      const meds: Medication[] = JSON.parse(saved);

      // Отбираем только принятые лекарства
      const takenMeds = meds.filter((m) => m.status === "taken");

      // Сортируем по дате
      takenMeds.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

      setData(takenMeds);
    } catch (err) {
      console.error(err);
    }
  };

  // Перерендер при возврате на экран
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  /** ======== Модальное окно ======== */
  const openModal = (med: Medication) => {
    setSelectedMedication(med);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  /** ======== Изменение статуса ======== */
  const updateStatus = async (status: "taken" | "missed") => {
    if (!selectedMedication) return;

    try {
      const saved = await AsyncStorage.getItem("medicines");
      if (!saved) return;
      const meds: Medication[] = JSON.parse(saved);

      const updated = meds.map((m) =>
        m.id === selectedMedication.id ? { ...m, status } : m
      );

      await AsyncStorage.setItem("medicines", JSON.stringify(updated));
      Alert.alert("✅", `Статус изменен на "${status === "taken" ? "Принято" : "Пропущено"}"`);

      setSelectedMedication({ ...selectedMedication, status });
      loadHistory();
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  /** ======== Рендер лекарства ======== */
  const renderItem = ({ item }: { item: Medication }) => {
    return (
      <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
        <Ionicons name="medkit-outline" size={36} color="#4caf50" style={styles.icon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.title}</Text>
          <Text style={styles.time}>{new Date(item.startDate).toLocaleTimeString()}</Text>
        </View>
        <Text style={{ color: "#4caf50", fontWeight: "600" }}>Принято</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>История</Text>

      {data.length === 0 ? (
        <Text style={styles.empty}>Нет принятых лекарств</Text>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {/* Модальное окно */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={closeModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedMedication?.title}</Text>
            <Text style={styles.modalSubtitle}>Изменить статус:</Text>

            <TouchableOpacity
              style={[
                styles.statusButton,
                selectedMedication?.status === "taken" && styles.activeTaken,
              ]}
              onPress={() => updateStatus("taken")}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  selectedMedication?.status === "taken" && styles.activeText,
                ]}
              >
                Принято
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.statusButton,
                selectedMedication?.status === "missed" && styles.activeMissed,
              ]}
              onPress={() => updateStatus("missed")}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  selectedMedication?.status === "missed" && styles.activeText,
                ]}
              >
                Пропущено
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={closeModal} style={{ marginTop: 20 }}>
              <Text style={{ color: "#4a90e2" }}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/** ======== Стили ======== */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 80, backgroundColor: "#f9f9f9" },
  header: { fontSize: 32, fontWeight: "bold", marginBottom: 16 },
  empty: { textAlign: "center", marginTop: 100, color: "#777", fontSize: 18 },
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
  icon: { marginRight: 12 },
  name: { fontSize: 16, fontWeight: "600", color: "#333" },
  time: { fontSize: 14, color: "#666", marginTop: 2 },
  modalBackground: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContainer: { width: "85%", backgroundColor: "#fff", borderRadius: 16, padding: 20, alignItems: "center" },
  modalTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  modalSubtitle: { fontSize: 16, marginBottom: 20 },
  statusButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 8,
    width: 200,
    alignItems: "center",
  },
  statusButtonText: { fontSize: 16, fontWeight: "600", color: "#333" },
  activeTaken: { backgroundColor: "#4caf50" },
  activeMissed: { backgroundColor: "#f44336" },
  activeText: { color: "#fff" },
});