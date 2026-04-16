import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

const { width } = Dimensions.get("window");

export default function WelcomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleStart = () => {
    router.push("/(auth)/login");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Background Gradient */}
      <LinearGradient
        colors={[colors.primary + "10", colors.background]}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View
        style={[
          styles.content,
          {
            paddingTop: insets.top + 60,
            paddingBottom: insets.bottom + 40,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.main}>
          {/* Logo / Badge */}
          <View style={[styles.badge, { backgroundColor: colors.primary + "15" }]}>
            <Feather name="trending-up" size={24} color={colors.primary} />
          </View>

          <Text style={[styles.title, { color: colors.foreground }]}>
            Domina a tua Vida{"\n"}
            <Text style={{ color: colors.primary }}>Financeira</Text>
          </Text>

          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            A Savvy ajuda-te a controlar gastos, planear investimentos e atingir a liberdade financeira com inteligência.
          </Text>

          {/* Features highlight */}
          <View style={styles.features}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: "#10b98115" }]}>
                <Feather name="pie-chart" size={16} color="#10b981" />
              </View>
              <Text style={[styles.featureText, { color: colors.foreground }]}>Análise Inteligente</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: "#3b82f615" }]}>
                <Feather name="shield" size={16} color="#3b82f6" />
              </View>
              <Text style={[styles.featureText, { color: colors.foreground }]}>Segurança Subpabase</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: "#f59e0b15" }]}>
                <Feather name="zap" size={16} color="#f59e0b" />
              </View>
              <Text style={[styles.featureText, { color: colors.foreground }]}>Sincronização Cloud</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleStart}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Começar Agora</Text>
            <Feather name="arrow-right" size={20} color="#fff" />
          </TouchableOpacity>
          
          <Text style={[styles.version, { color: colors.mutedForeground }]}>
            Savvy Finance • v1.0
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "center",
    gap: 32,
  },
  main: {
    gap: 12,
  },
  badge: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    fontFamily: "Inter_700Bold",
    lineHeight: 44,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
    marginBottom: 16,
    opacity: 0.8,
  },
  features: {
    gap: 20,
    backgroundColor: "transparent",
    paddingVertical: 10,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    opacity: 0.9,
  },
  footer: {
    marginTop: 20,
    gap: 16,
    alignItems: "center",
  },
  button: {
    width: "100%",
    height: Platform.OS === "web" ? 64 : 60,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 15,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
  },
  version: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    opacity: 0.4,
  },
});
