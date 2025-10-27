import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
  Animated,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { INTERVAL_OPTIONS } from "@/constants/INTERVAL_OPTIONS";

const ICON_OPTIONS = [
  "medkit-outline",
  "bandage-outline",
  "flask-outline",
  "pill-outline",
  "heart-outline",
];
const COLOR_OPTIONS = ["#4a90e2", "#f5a623", "#50e3c2", "#e94e77", "#9013fe"];

export default function AddMedication() {
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [tempDate, setTempDate] = useState(new Date());
  const [showDateModal, setShowDateModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [days, setDays] = useState("");
  const [interval, setInterval] = useState<number>(INTERVAL_OPTIONS[0]);
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [selectedIcon, setSelectedIcon] = useState(ICON_OPTIONS[0]);

  const scaleAnim = useRef<Animated.Value[]>(ICON_OPTIONS.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    ICON_OPTIONS.forEach((_, index) => {
      Animated.spring(scaleAnim[index], {
        toValue: selectedIcon === ICON_OPTIONS[index] ? 1.2 : 1,
        useNativeDriver: true,
        friction: 5,
      }).start();
    });
  }, [selectedIcon]);

  /** ======== Добавление лекарства ======== */
  const saveMedication = async () => {
    if (!name.trim()) {
      Alert.alert("Ошибка", "Введите название лекарства");
      return;
    }

    const newMedication = {
      id: Date.now().toString(),
      title: name,
      dose,
      startDate: startDate.toISOString(),
      days,
      interval: String(interval),
      color: selectedColor,
      iconId: selectedIcon,
    };

    try {
      const existingData = await AsyncStorage.getItem("medicines");
      const meds = existingData ? JSON.parse(existingData) : [];
      meds.push(newMedication);
      await AsyncStorage.setItem("medicines", JSON.stringify(meds));

      Alert.alert("✅ Успешно", "Лекарство добавлено");

      // ✅ Очистка всех полей
      setName("");
      setDose("");
      setDays("");
      setInterval(INTERVAL_OPTIONS[0]);
      setSelectedColor(COLOR_OPTIONS[0]);
      setSelectedIcon(ICON_OPTIONS[0]);
      setStartDate(new Date());

      router.push("/medicines");
    } catch (e) {
      Alert.alert("Ошибка", "Не удалось сохранить лекарство");
      console.error(e);
    }
  };

  /** ======== Работа с датой ======== */
  const openDateTimePicker = () => {
    if (Platform.OS === "ios") {
      setTempDate(startDate);
      setShowDateModal(true);
    } else {
      setShowDatePicker(true);
    }
  };

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      setShowTimePicker(true);
    }
  };

  const onChangeTime = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(startDate);
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setStartDate(newDate);
    }
  };

  const confirmDateIOS = () => {
    setStartDate(tempDate);
    setShowDateModal(false);
  };

  const cancelDateIOS = () => {
    setShowDateModal(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.header}>Добавить лекарство</Text>

      {/* Иконка */}
      <Text style={styles.label}>Иконка</Text>
      <View style={styles.iconContainer}>
        {ICON_OPTIONS.map((icon, index) => (
          <Animated.View key={icon} style={{ transform: [{ scale: scaleAnim[index] }] }}>
            <TouchableOpacity
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: selectedIcon === icon ? selectedColor : "#ddd",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 12,
                backgroundColor: selectedIcon === icon ? selectedColor : "#fff",
              }}
              onPress={() => setSelectedIcon(icon)}
            >
              <Ionicons
                name={icon as any}
                size={28}
                color={selectedIcon === icon ? "#fff" : "gray"}
              />
            </TouchableOpacity>
          </Animated.View>
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
              selectedColor === color && styles.selectedColor,
            ]}
            onPress={() => setSelectedColor(color)}
          />
        ))}
      </View>

      {/* Название */}
      <Text style={styles.label}>Название</Text>
      <TextInput
        style={styles.input}
        placeholder="Введите название лекарства"
        value={name}
        onChangeText={setName}
      />

      {/* Дозировка */}
      <Text style={styles.label}>Дозировка</Text>
      <TextInput
        style={styles.input}
        placeholder="Введите дозировку"
        value={dose}
        onChangeText={setDose}
      />

      {/* Дата */}
      <Text style={styles.label}>Дата и время начала</Text>
      <TouchableOpacity style={styles.input} onPress={openDateTimePicker}>
        <Text>{startDate.toLocaleString()}</Text>
      </TouchableOpacity>

      {/* iOS модалка */}
      {Platform.OS === "ios" && showDateModal && (
        <Modal transparent animationType="slide">
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <DateTimePicker
                value={tempDate}
                mode="datetime"
                display="spinner"
                onChange={(e, date) => date && setTempDate(date)}
                is24Hour={true}
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

      {/* Android Pickers */}
      {Platform.OS === "android" && showDatePicker && (
        <DateTimePicker value={startDate} mode="date" display="calendar" onChange={onChangeDate} />
      )}
      {Platform.OS === "android" && showTimePicker && (
        <DateTimePicker value={startDate} mode="time" display="clock" onChange={onChangeTime} />
      )}

      {/* Кол-во дней */}
      <Text style={styles.label}>Количество дней</Text>
      <TextInput
        style={styles.input}
        placeholder="Введите количество дней"
        value={days}
        onChangeText={setDays}
        keyboardType="numeric"
      />

      {/* Интервал */}
      <Text style={styles.label}>Интервал (в часах)</Text>
      <View style={styles.intervalContainer}>
        {INTERVAL_OPTIONS.map((value) => (
          <TouchableOpacity
            key={value}
            style={[
              styles.intervalButton,
              interval === value && { backgroundColor: selectedColor },
            ]}
            onPress={() => setInterval(value)}
          >
            <Text style={[styles.intervalText, interval === value && { color: "#fff" }]}>
              {value} ч
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Сохранить */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: selectedColor }]}
        onPress={saveMedication}
      >
        <Text style={styles.buttonText}>Сохранить</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: "#fff", paddingTop: 80 },
  header: { color: "#333", fontSize: 32, fontWeight: "bold", marginBottom: 16 },
  label: { fontSize: 16, fontWeight: "600", marginTop: 16, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  colorContainer: { flexDirection: "row", marginTop: 8 },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedColor: { borderColor: "#333" },
  iconContainer: { flexDirection: "row", marginTop: 8 },
  intervalContainer: { flexDirection: "row", marginTop: 8 },
  intervalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 12,
  },
  intervalText: { fontSize: 16, color: "#333" },
  button: {
    marginTop: 32,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 80,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
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
