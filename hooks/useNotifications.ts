import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Platform, Alert } from "react-native";

/**
 * Настройка уведомлений
 * Работает даже если приложение не открыто
 */
export function useSetupNotifications() {
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Разрешите уведомления",
          "Чтобы получать напоминания о приёме лекарств, нужно разрешить уведомления."
        );
      }

      // Настройка поведения уведомлений
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
}

/**
 * Планирование уведомления (работает в фоне)
 */
export async function scheduleMedicineNotification(
  title: string,
  startDate: string,
  repeatInterval?: "none" | "day" | "hour"
) {
  try {
    const triggerDate = new Date(startDate);
    if (triggerDate < new Date()) return;

    let trigger: Notifications.NotificationTriggerInput;

    if (repeatInterval === "day") {
      trigger = {
        type: "daily",
        hour: triggerDate.getHours(),
        minute: triggerDate.getMinutes(),
      };
    } else if (repeatInterval === "hour") {
      trigger = {
        type: "timeInterval",
        seconds: 60 * 60,
        repeats: true,
      };
    } else {
      trigger = {
        type: "date",
        date: triggerDate,
        repeats: false,
      };
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "💊 Время принять лекарство",
        body: `Пора принять: ${title}`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger,
    });
  } catch (error) {
    console.error("Ошибка при создании уведомления:", error);
  }
}