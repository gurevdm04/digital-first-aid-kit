import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import MedicationCard from "@/components/MedicationCard";
import { ICON_MAP } from "@/constants/ICON_MAP";

type RepeatType = "none" | "day" | "hour"; // тип повтора

type Medication = {
  id: string;
  title: string;
  dose?: string;
  startDate: string;
  days?: string;
  interval?: string;
  color?: string;
  iconId: string;
  repeatInterval?: RepeatType; // новый параметр
  status?: "pending" | "taken" | "missed";
  notificationId?: string;
};

export default function Index() {
  const [data, setData] = useState<Medication[]>([]);
  const [selectedItem, setSelectedItem] = useState<Medication | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  /** ======== Настройка уведомлений ======== */
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Разрешите уведомления", "Чтобы получать напоминания о приёме лекарств");
      }

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
    })();
  }, []);

  /** ======== Планирование уведомлений ======== */
  /** === Планирование уведомления === */
  const scheduleMedicineNotification = async (med: Medication) => {
    try {
      const triggerDate = new Date(med.startDate);
      if (triggerDate < new Date()) return;

      let trigger: Notifications.NotificationTriggerInput;

      // Ежедневное повторение
      if (med.repeatInterval === "day") {
        trigger = {
          type: "daily",
          hour: triggerDate.getHours(),
          minute: triggerDate.getMinutes(),
        };
      }
      // Повтор каждый час
      else if (med.repeatInterval === "hour") {
        trigger = {
          type: "timeInterval",
          seconds: 60 * 60,
          repeats: true,
        };
      }
      // Один раз
      else {
        trigger = {
          type: "date",
          date: triggerDate,
          repeats: false,
        };
      }

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "💊 Время принять лекарство",
          body: `Пора принять: ${med.title}`,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger,
      });

      med.notificationId = id;
      return id;
    } catch (e) {
      console.error("Ошибка уведомления:", e);
    }
  };

  /** ======== Загрузка данных ======== */
  const loadMedicines = async () => {
    try {
      const saved = await AsyncStorage.getItem("medicines");
      if (!saved) return;
      const meds: Medication[] = JSON.parse(saved);

      const now = new Date();
      const todayMeds = meds.filter((med) => {
        const medDate = new Date(med.startDate);
        return (
          medDate.getDate() === now.getDate() &&
          medDate.getMonth() === now.getMonth() &&
          medDate.getFullYear() === now.getFullYear()
        );
      });

      const updated = await Promise.all(
        todayMeds.map(async (m) => {
          const medTime = new Date(m.startDate);
          if (m.status === "taken") return m;
          if (medTime < now && m.status !== "taken") return { ...m, status: "missed" };
          if (!m.notificationId) {
            const id = await scheduleMedicineNotification(m);
            return { ...m, notificationId: id, status: "pending" };
          }
          return { ...m, status: "pending" };
        })
      );

      setData(updated);
      await AsyncStorage.setItem("medicines", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  /** ======== Перерендер при возврате ======== */
  useFocusEffect(
    useCallback(() => {
      loadMedicines();
    }, [])
  );

  /** ======== Метки времени ======== */
  const getTimeLabel = (startDate: string, status?: string) => {
    const now = new Date();
    const medTime = new Date(startDate);
    if (status === "taken") return "Принято";
    if (status === "missed") return "Пропущено";
    const diffMs = medTime.getTime() - now.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    if (diffMinutes <= 0) return "Пропущено";
    if (diffMinutes < 60) return `Через ${diffMinutes} мин`;
    const hours = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;
    return `Через ${hours} ч ${mins} мин`;
  };

  /** ======== Модалка ======== */
  const openModal = (item: Medication) => {
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

  /** ======== Обновление статуса ======== */
  const updateStatus = async (status: "taken" | "missed") => {
    if (!selectedItem) return;
    try {
      const saved = await AsyncStorage.getItem("medicines");
      if (!saved) return;
      const meds: Medication[] = JSON.parse(saved);
      const updated = meds.map((m) => (m.id === selectedItem.id ? { ...m, status } : m));

      // Если повторное лекарство — уведомление не удаляем
      if (status === "taken" && selectedItem.repeatInterval === "none") {
        if (selectedItem.notificationId) {
          await Notifications.cancelScheduledNotificationAsync(selectedItem.notificationId);
        }
      }

      await AsyncStorage.setItem("medicines", JSON.stringify(updated));
      Alert.alert("✅", `Лекарство отмечено как "${status === "taken" ? "Принято" : "Пропущено"}"`);
      closeModal();
      loadMedicines();
    } catch (e) {
      console.error(e);
    }
  };

  /** ======== Отображение ======== */
  const renderItem = ({ item }: { item: Medication }) => {
    const timeLabel = getTimeLabel(item.startDate, item.status);
    return (
      <TouchableOpacity onPress={() => openModal(item)}>
        <MedicationCard
          iconId={item.iconId}
          title={item.title}
          time={timeLabel}
          color={item.color || "#4a90e2"}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Запланировано</Text>

      {data.length === 0 ? (
        <Text style={styles.emptyText}>Нет лекарств на сегодня</Text>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      {/* ======== Модальное окно ======== */}
      <Modal transparent visible={!!selectedItem} animationType="fade">
        <Animated.View style={[styles.modalBackground, { opacity: fadeAnim }]}>
          <View style={styles.modalContainer}>
            {selectedItem && (
              <>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name={ICON_MAP[selectedItem.iconId] ?? "help-circle-outline"}
                    size={48}
                    color={selectedItem.color || "#4a90e2"}
                  />
                </View>
                <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                <Text style={styles.modalTime}>
                  {getTimeLabel(selectedItem.startDate, selectedItem.status)}
                </Text>

                <Text style={styles.modalDescription}>Изменить статус лекарства:</Text>

                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    selectedItem.status === "taken" && styles.activeTaken,
                  ]}
                  onPress={() => updateStatus("taken")}
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      selectedItem.status === "taken" && styles.activeText,
                    ]}
                  >
                    Принято
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    selectedItem.status === "missed" && styles.activeMissed,
                  ]}
                  onPress={() => updateStatus("missed")}
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      selectedItem.status === "missed" && styles.activeText,
                    ]}
                  >
                    Пропущено
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                  <Ionicons name="close" size={30} color="#fff" />
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
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 80, backgroundColor: "#fff" },
  header: { color: "#333", fontSize: 32, fontWeight: "bold", marginBottom: 16 },
  list: { paddingBottom: 20 },
  emptyText: { textAlign: "center", color: "#777", marginTop: 100, fontSize: 18 },
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
    position: "relative",
  },
  iconContainer: { backgroundColor: "#eaf2ff", borderRadius: 50, padding: 16, marginBottom: 12 },
  modalTitle: { fontSize: 22, fontWeight: "bold", color: "#333", marginBottom: 6 },
  modalTime: { fontSize: 16, color: "#666", marginBottom: 12 },
  modalDescription: { fontSize: 14, color: "#444", textAlign: "center", marginBottom: 20 },
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
  closeButton: {
    backgroundColor: "#4a90e2",
    borderRadius: 100,
    position: "absolute",
    right: 10,
    top: 10,
    padding: 5,
  },
});
