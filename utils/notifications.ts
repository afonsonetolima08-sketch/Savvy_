import { Platform } from 'react-native';

// Dynamically import notifications to avoid errors during static export/SSR
const getNotifications = () => {
  if (Platform.OS === 'web') return null;
  return require('expo-notifications');
};

const getDevice = () => {
  if (Platform.OS === 'web') return null;
  return require('expo-device');
};

// Configure how notifications are handled when the app is foregrounded
const Notifications = getNotifications();
if (Notifications) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

export async function registerForPushNotificationsAsync() {
  const Notifications = getNotifications();
  const Device = getDevice();
  
  if (!Notifications || !Device) return;

  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#01241c',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
    try {
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } catch (e) {
      console.log('Error getting expo push token', e);
    }
  }

  return token;
}

export async function scheduleDailyReminder() {
  const Notifications = getNotifications();
  if (!Notifications) return;

  // First, cancel any existing scheduled notifications to avoid duplicates
  await Notifications.cancelAllScheduledNotificationsAsync();

  const title = "Savvy";
  const body = "Não te esqueças de apontar os teus gastos ou ganhos hoje! 💚";

  // Schedule the notification
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: {
      hour: 9,
      minute: 0,
      repeats: true,
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
    } as any,
  });

  console.log("Daily reminder scheduled for 9:00 AM");
}
