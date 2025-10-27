import { ICON_MAP } from "@/constants/ICON_MAP";
import { INTERVAL_OPTIONS } from "@/constants/INTERVAL_OPTIONS";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ICON_OPTIONS = Object.values(ICON_MAP);
const COLOR_OPTIONS = ["#4a90e2", "#f5a623", "#50e3c2", "#e94e77", "#9013fe"];

export default function MedicineDetails() {
  const params = useLocalSearchParams<{
    id: string;
    title: string;
    dose: string;
    startDate: string;
    days: string;
    interval: string;
    color: string;
    iconId: string;
  }>();
  const router = useRouter();

  const [title, setTitle] = useState(params.title);
  const [dose, setDose] = useState(params.dose);
  const [days, setDays] = useState(params.days);
  const [interval, setIntervalValue] = useState(Number(params.interval));
  const [selectedColor, setSelectedColor] = useState(params.color);
  const [selectedIcon, setSelectedIcon] = useState(params.iconId);

  const [startDate, setStartDate] = useState(new Date(params.startDate));
  const [tempDate, setTempDate] = useState(new Date(params.startDate));
  const [showDateModal, setShowDateModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const openDateTimePicker = () => {
    if (Platform.OS === "ios") {
      setTempDate(startDate);
      setShowDateModal(true);
    } else {
      setShowDatePicker(true);
    }
  };

  const onChangeDate = (event: DateTimePickerEvent, selected?: Date) => {
    setShowDatePicker(false);
    if (selected) {
      setStartDate(selected);
      setShowTimePicker(true);
    }
  };

  const onChangeTime = (event: DateTimePickerEvent, selected?: Date) => {
    setShowTimePicker(false);
    if (selected) {
      const newDate = new Date(startDate);
      newDate.setHours(selected.getHours(), selected.getMinutes());
      setStartDate(newDate);
    }
  };

  const confirmDateIOS = () => {
    setStartDate(tempDate);
    setShowDateModal(false);
  };
  const cancelDateIOS = () => setShowDateModal(false);

  /** ======== Сохранение изменений ======== */
  const saveMedicine = async () => {
    try {
      const saved = await AsyncStorage.getItem("medicines");
      const meds: any[] = saved ? JSON.parse(saved) : [];

      const updated = meds.map((m) =>
        m.id === params.id
          ? {
              ...m,
              title,
              dose,
              startDate: startDate.toISOString(),
              days,
              interval: interval.toString(),
              color: selectedColor,
              iconId: selectedIcon,
            }
          : m
      );

      await AsyncStorage.setItem("medicines", JSON.stringify(updated));
      Alert.alert("✅ Изменения сохранены");
      router.back();
    } catch (e) {
      console.error(e);
    }
  };

  /** ======== Удаление лекарства ======== */
  const deleteMedicine = async () => {
    Alert.alert("Удаление", "Вы уверены, что хотите удалить это лекарство?", [
      { text: "Отмена", style: "cancel" },
      {
        text: "Удалить",
        style: "destructive",
        onPress: async () => {
          try {
            const saved = await AsyncStorage.getItem("medicines");
            if (!saved) return;

            const meds: any[] = JSON.parse(saved);
            const filtered = meds.filter((m) => m.id !== params.id);

            await AsyncStorage.setItem("medicines", JSON.stringify(filtered));
            Alert.alert("✅ Лекарство удалено");
            router.back();
          } catch (e) {
            console.error(e);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: selectedColor + "15" }]}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Иконка */}
      <View style={[styles.iconWrapper, { backgroundColor: selectedColor + "33" }]}>
        <Ionicons name={selectedIcon as any} size={64} color={selectedColor} />
      </View>

      {/* Выбор иконки */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconSelector}>
        {ICON_OPTIONS.map((icon) => (
          <TouchableOpacity
            key={icon}
            style={[
              styles.iconBox,
              selectedIcon === icon && { borderColor: selectedColor, borderWidth: 2 },
            ]}
            onPress={() => setSelectedIcon(icon)}
          >
            <Ionicons
              name={icon as any}
              size={32}
              color={selectedIcon === icon ? selectedColor : "#555"}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Название */}
      <Text style={styles.label}>Название</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      {/* Дозировка */}
      <Text style={styles.label}>Дозировка</Text>
      <TextInput style={styles.input} value={dose} onChangeText={setDose} />

      {/* Дата и время начала */}
      <Text style={styles.label}>Дата и время начала</Text>
      <TouchableOpacity style={styles.input} onPress={openDateTimePicker}>
        <Text>{startDate.toLocaleString()}</Text>
      </TouchableOpacity>

      {/* iOS */}
      {Platform.OS === "ios" && showDateModal && (
        <Modal transparent animationType="slide">
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <DateTimePicker
                value={tempDate}
                mode="datetime"
                display="spinner"
                onChange={(e, date) => date && setTempDate(date)}
                is24Hour
                themeVariant="light"
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={cancelDateIOS}
                >
                  <Text style={styles.cancelButtonText}>Отмена</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={confirmDateIOS}
                >
                  <Text style={styles.confirmButtonText}>Подтвердить</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Android */}
      {Platform.OS === "android" && showDatePicker && (
        <DateTimePicker value={startDate} mode="date" display="calendar" onChange={onChangeDate} />
      )}
      {Platform.OS === "android" && showTimePicker && (
        <DateTimePicker value={startDate} mode="time" display="clock" onChange={onChangeTime} />
      )}

      {/* Кол-во дней */}
      <Text style={styles.label}>Кол-во дней</Text>
      <TextInput style={styles.input} value={days} onChangeText={setDays} keyboardType="numeric" />

      {/* Интервал */}
      <Text style={styles.label}>Интервал (часы)</Text>
      <View style={styles.intervalContainer}>
        {INTERVAL_OPTIONS.map((i) => (
          <TouchableOpacity
            key={i}
            style={[styles.intervalButton, interval === i && { backgroundColor: selectedColor }]}
            onPress={() => setIntervalValue(i)}
          >
            <Text style={[styles.intervalText, interval === i && { color: "#fff" }]}>{i} ч</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Цвет */}
      <Text style={styles.label}>Цвет</Text>
      <View style={styles.colorContainer}>
        {COLOR_OPTIONS.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorCircle,
              { backgroundColor: color },
              selectedColor === color && { borderWidth: 2, borderColor: "#333" },
            ]}
            onPress={() => setSelectedColor(color)}
          />
        ))}
      </View>

      {/* Кнопки */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: selectedColor }]}
        onPress={saveMedicine}
      >
        <Text style={styles.buttonText}>Сохранить</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#f44336", marginTop: 12, marginBottom: 20 }]}
        onPress={deleteMedicine}
      >
        <Text style={[styles.buttonText, { color: "#fff" }]}>Удалить лекарство</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#ccc", marginBottom: 80 }]}
        onPress={() => router.back()}
      >
        <Text style={[styles.buttonText, { color: "#333" }]}>Отмена</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 80 },
  iconWrapper: {
    alignSelf: "center",
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  iconSelector: { flexDirection: "row", marginBottom: 24 },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "#fff",
  },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fafafa",
    marginBottom: 16,
  },
  intervalContainer: { flexDirection: "row", marginBottom: 16 },
  intervalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 12,
  },
  intervalText: { fontSize: 16, color: "#333" },
  colorContainer: { flexDirection: "row", marginBottom: 24 },
  colorCircle: { width: 36, height: 36, borderRadius: 18, marginRight: 12 },
  button: { paddingVertical: 14, borderRadius: 12, alignItems: "center", marginBottom: 5 },
  buttonText: { fontSize: 16, fontWeight: "600", color: "#fff" },
  modalBackground: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  confirmButton: { backgroundColor: "#4a90e2" },
  cancelButton: { backgroundColor: "#ccc" },
  confirmButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  cancelButtonText: { color: "#333", fontWeight: "600", fontSize: 16 },
});