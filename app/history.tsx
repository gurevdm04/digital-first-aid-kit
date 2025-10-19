import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Medication = {
  id: string;
  name: string;
  time: string;
  icon: string;
};

const data: Medication[] = [
  { id: "1", name: "Аспирин", time: "08:00", icon: "medkit-outline" },
  { id: "2", name: "Витамины", time: "12:00", icon: "medkit-outline" },
  { id: "3", name: "Антибиотик", time: "20:00", icon: "medkit-outline" },
];

export default function History() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [asNeededModalVisible, setAsNeededModalVisible] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);

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

  const openEditModal = (med: Medication) => {
    setSelectedMedication(med);
    setModalVisible(true);
  };

  const openAsNeededModal = () => {
    setAsNeededModalVisible(true);
  };

  const selectMedication = (med: Medication) => {
    console.log("Выбрано лекарство по мере необходимости:", med.name);
    setAsNeededModalVisible(false);
  };

  const renderItem = ({ item }: { item: Medication }) => (
    <TouchableOpacity style={styles.card} onPress={() => openEditModal(item)}>
      <Ionicons name={item.icon as any} size={36} color="#4a90e2" style={styles.icon} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <Ionicons name="pencil-outline" size={20} color="#f44336" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>История</Text>

      {/* Смена недели */}
      <View style={styles.weekContainer}>
        <TouchableOpacity onPress={prevWeek}>
          <Ionicons name="chevron-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.weekText}>{formatWeek(currentWeek)}</Text>
        <TouchableOpacity onPress={nextWeek}>
          <Ionicons name="chevron-forward-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* "+ Прием по мере необходимости" */}
      <TouchableOpacity style={styles.asNeededButton} onPress={openAsNeededModal}>
        <Text style={styles.asNeededText}>+ Прием по мере необходимости</Text>
      </TouchableOpacity>

      {/* Список */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Модальное окно редактирования */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>{selectedMedication?.name}</Text>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#4caf50" }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Принято</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#f44336" }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Пропущено</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#ccc" }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.modalButtonText, { color: "#333" }]}>Отмена</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Модальное окно "Прием по мере необходимости" */}
      <Modal
        visible={asNeededModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAsNeededModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, { maxHeight: "70%" }]}>
            <Text style={styles.modalHeader}>Выберите лекарство</Text>
            <FlatList
              data={data}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.medSelectItem}
                  onPress={() => selectMedication(item)}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={28}
                    color="#4a90e2"
                    style={{ marginRight: 12 }}
                  />
                  <Text style={styles.name}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#ccc", marginTop: 12 }]}
              onPress={() => setAsNeededModalVisible(false)}
            >
              <Text style={[styles.modalButtonText, { color: "#333" }]}>Отмена</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  icon: { marginRight: 12 },
  name: { color: "#333", fontSize: 16, fontWeight: "600" },
  time: { color: "#666", fontSize: 14, marginTop: 2 },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  modalButton: { paddingVertical: 12, borderRadius: 8, marginBottom: 12, alignItems: "center" },
  modalButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  medSelectItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
});
