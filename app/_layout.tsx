import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import {
  Caveat_400Regular,
  Caveat_700Bold,
} from "@expo-google-fonts/caveat";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, router, useSegments } from "expo-router";

import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { useWindowDimensions, View, Platform, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppProvider, useApp } from "@/context/AppContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { session, profile, isLoading } = useApp();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const isLandingPage = segments.length === 0 || (segments.length === 1 && segments[0] === '');

    // Se o user não tem sessão e não está no grupo de auth nem na landing page
    if (!isLoading && !session && !inAuthGroup && !isLandingPage) {
      router.replace("/");
    } 
    // Se o user tem sessão e NÃO está na landing page
    else if (session && !isLandingPage) {
      const isResetPassword = segments[0] === "(auth)" && segments[1] === "reset-password";
      
      if (!isResetPassword) {
        if (!profile.onboardingCompleted && segments[0] !== 'onboarding') {
          router.replace("/onboarding");
        } else if (profile.onboardingCompleted && segments[0] !== '(tabs)') {
          router.replace("/(tabs)");
        }
      }
    }
  }, [isLoading, session, profile.onboardingCompleted, segments]);

  if (isLoading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false, animation: "fade" }} />
      <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const { width } = useWindowDimensions();
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Caveat_400Regular,
    Caveat_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  // On Web, we center the app in a column if the screen is large (Desktop)
  const isDesktop = Platform.OS === "web" && width > 1000;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#f8faf8" }}>
              <View 
                style={[
                  styles.webContainer, 
                  isDesktop ? styles.desktopStyles : styles.mobileStyles
                ]}
              >
                <RootLayoutNav />
              </View>
            </GestureHandlerRootView>
          </AppProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    marginHorizontal: "auto",
    backgroundColor: "#fff",
  },
  desktopStyles: {
    width: "100%",
    maxWidth: 1000,
    // Removidas as margens verticais que estavam a cortar a app
  },
  mobileStyles: {
    width: "100%",
    maxWidth: "100%",
  }
});
