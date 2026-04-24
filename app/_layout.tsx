import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_900Black,
  useFonts,
} from "@expo-google-fonts/inter";
import {
  Outfit_400Regular,
  Outfit_700Bold,
  Outfit_900Black,
} from "@expo-google-fonts/outfit";
import {
  Caveat_400Regular,
  Caveat_700Bold,
} from "@expo-google-fonts/caveat";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, router, useSegments } from "expo-router";
import Head from "expo-router/head";

import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { useWindowDimensions, View, Platform, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppProvider, useApp } from "@/context/AppContext";
import { Analytics } from "@vercel/analytics/react";

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
    Inter_900Black,
    Outfit_400Regular,
    Outfit_700Bold,
    Outfit_900Black,
    Caveat_400Regular,
    Caveat_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  return (
    <SafeAreaProvider>
      {Platform.OS === "web" && (
        <Head>
          <title>Savvy • Elite Financial Intelligence</title>
          <meta name="description" content="Master your wealth with Savvy. Intelligent management, proactive AI, and global sync." />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://savvy-expand.vercel.app/" />
          <meta property="og:title" content="Savvy • Elite Financial Intelligence" />
          <meta property="og:description" content="Master your wealth with Savvy. Intelligent management, proactive AI, and global sync for your financial freedom." />
          <meta property="og:image" content="https://savvy-expand.vercel.app/og-image.png" />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:url" content="https://savvy-expand.vercel.app/" />
          <meta name="twitter:title" content="Savvy • Elite Financial Intelligence" />
          <meta name="twitter:description" content="Master your wealth with Savvy. Intelligent management, proactive AI, and global sync." />
          <meta name="twitter:image" content="https://savvy-expand.vercel.app/og-image.png" />
          
          <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%2301241c'/%3E%3Ccircle cx='30' cy='30' r='18' fill='white'/%3E%3Ctext x='30' y='38' text-anchor='middle' font-family='sans-serif' font-weight='900' font-size='22' fill='%2301241c'%3E$%3C/text%3E%3Ctext x='50' y='80' text-anchor='middle' font-family='serif' font-weight='900' font-size='60' fill='white'%3ES%3C/text%3E%3C/svg%3E" />
        </Head>
      )}

      {(!fontsLoaded && !fontError) ? null : (
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <AppProvider>
              <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#f8faf8" }}>
                <View style={styles.webContainer}>
                  <RootLayoutNav />
                </View>
              </GestureHandlerRootView>
            </AppProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      )}
      {Platform.OS === "web" && <Analytics />}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    width: "100%",
    maxWidth: Platform.OS === "web" ? 1000 : "100%",
    marginHorizontal: "auto",
    backgroundColor: "#fff",
  }
});
