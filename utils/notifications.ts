import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure how notifications are handled when the app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
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
    // We don't necessarily need the token for local notifications, but it's good to have the setup
    try {
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } catch (e) {
      console.log('Error getting expo push token', e);
    }
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}

export async function scheduleDailyReminder() {
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
    } as any, // Cast to any because of some type issues with Expo DAILY trigger in some versions
  });

  console.log("Daily reminder scheduled for 9:00 AM");
}
