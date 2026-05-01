import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useApp } from "@/context/AppContext";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const COLORS = {
  forest: "#01241c",
  deepEmerald: "#064e3b",
  neonEmerald: "#10b981",
  brightMint: "#34d399",
  white: "#ffffff",
  textMuted: "#a7f3d0",
};

export default function UnifiedEntryScreen() {
  const insets = useSafeAreaInsets();
  const app = useApp();
  
  const [viewMode, setViewMode] = useState<"splash" | "tour">("splash");
  const [currentStep, setCurrentStep] = useState(0);
  const progress = useSharedValue(25);

  const splashOpacity = useSharedValue(1);
  const splashScale = useSharedValue(1);

  const steps = [
    {
      title: "O teu resumo financeiro",
      desc: "Acompanha o teu saldo do mês, ganhos, gastos e o teu Património Atual num só lugar.",
      type: "dashboard"
    },
    {
      title: "Percebe para onde vai o teu dinheiro",
      desc: "Analisa os teus gastos por mês ou por categoria e visualiza o histórico.",
      type: "analysis"
    },
    {
      title: "Define e alcança os teus objetivos",
      desc: "Cria objetivos financeiros e aloca o teu Património para os atingir.",
      type: "goals"
    },
    {
      title: "O teu assistente pessoal",
      desc: "Faz perguntas ao Savvy GPT sobre poupança e estratégias — disponível 24/7.",
      type: "ai"
    }
  ];

  useEffect(() => {
    const timer = setTimeout(async () => {
       await checkRedirection();
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (viewMode === "tour") {
      progress.value = withSpring(((currentStep + 1) / steps.length) * 100);
    }
  }, [currentStep, viewMode]);

  const checkRedirection = async () => {
    try {
      const isReturning = await AsyncStorage.getItem("savvy_returning_user");
      
      splashOpacity.value = withTiming(0, { duration: 800 });
      splashScale.value = withTiming(1.1, { duration: 800 });

      if (isReturning === "true" && app?.session) {
        handleFinalStart();
      } else {
        setViewMode("tour");
      }
    } catch (e) {
      setViewMode("tour");
    }
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentStep < steps.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      handleFinalStart();
    }
  };

  const handleFinalStart = async () => {
    try {
      await AsyncStorage.setItem("savvy_returning_user", "true");
    } catch (e) {}

    if (app?.session) {
      if (app.profile.onboardingCompleted) router.push("/(tabs)");
      else router.push("/onboarding");
    } else {
      router.push("/(auth)/login");
    }
  };

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  const splashAnimatedStyle = useAnimatedStyle(() => ({
    opacity: splashOpacity.value,
    transform: [{ scale: splashScale.value }]
  }));

  const renderMockup = (type: string) => {
    switch (type) {
      case "dashboard":
        return (
          <View style={styles.mockContainer}>
            <View style={[styles.mockCard, { backgroundColor: "#ef4444" }]}>
              <Text style={styles.mockCardLabel}>Saldo do Mês</Text>
              <Text style={styles.mockCardValue}>2.450,00 €</Text>
            </View>
            <View style={styles.mockRow}>
              <View style={styles.mockHalfCard}><Text style={styles.mockSmallLabel}>Ganhos</Text><Text style={styles.mockSmallValue}>+3.200 €</Text></View>
              <View style={styles.mockHalfCard}><Text style={styles.mockSmallLabel}>Gastos</Text><Text style={styles.mockSmallValue}>-750 €</Text></View>
            </View>
            <View style={styles.mockListCard}>
               <Text style={styles.mockSmallLabel}>Património Atual</Text>
               <Text style={styles.mockLargeValue}>12.540,80 €</Text>
               <View style={styles.mockProgressBar}><View style={[styles.mockProgressFill, { width: "65%" }]} /></View>
               <Text style={styles.mockTinyText}>65% do orçamento usado</Text>
            </View>
          </View>
        );
      case "analysis":
        return (
          <View style={styles.mockContainer}>
             <View style={styles.mockChartBox}>
                <View style={styles.mockBars}>
                   {[40, 70, 45, 90, 60, 80].map((h, i) => (
                     <View key={i} style={[styles.mockBar, { height: h }]} />
                   ))}
                </View>
             </View>
             <View style={styles.mockCategoryRow}>
                <View style={styles.mockIconCircle}><Feather name="shopping-cart" size={12} color="#fff" /></View>
                <View style={{ flex: 1 }}><View style={styles.mockLineShort} /><View style={styles.mockLineLong} /></View>
                <Text style={styles.mockPrice}>-120€</Text>
             </View>
             <View style={styles.mockCategoryRow}>
                <View style={[styles.mockIconCircle, { backgroundColor: "#3b82f6" }]}><Feather name="home" size={12} color="#fff" /></View>
                <View style={{ flex: 1 }}><View style={styles.mockLineShort} /><View style={styles.mockLineLong} /></View>
                <Text style={styles.mockPrice}>-600€</Text>
             </View>
          </View>
        );
      case "goals":
        return (
          <View style={styles.mockContainer}>
            <View style={styles.mockGoalCard}>
               <Text style={styles.mockGoalTitle}>Viagem Japão 🇯🇵</Text>
               <View style={styles.mockGoalAmounts}><Text style={styles.mockGoalCurrent}>1.200 €</Text><Text style={styles.mockGoalTarget}>de 3.000 €</Text></View>
               <View style={styles.mockGoalBar}><View style={[styles.mockGoalFill, { width: "40%" }]} /></View>
            </View>
            <View style={styles.mockGoalCard}>
               <Text style={styles.mockGoalTitle}>Reserva Emergência</Text>
               <View style={styles.mockGoalAmounts}><Text style={styles.mockGoalCurrent}>5.000 €</Text><Text style={styles.mockGoalTarget}>de 5.000 €</Text></View>
               <View style={styles.mockGoalBar}><View style={[styles.mockGoalFill, { width: "100%", backgroundColor: COLORS.neonEmerald }]} /></View>
            </View>
          </View>
        );
      case "ai":
        return (
          <View style={styles.mockContainer}>
             <View style={styles.mockAiBubble}>
                <Text style={styles.mockAiText}>"Com base nos teus gastos de lazer, podes poupar **80€** este mês se reduzires as subscrições."</Text>
             </View>
             <View style={styles.mockAiInput}><Text style={styles.mockAiPlaceholder}>Escreve a tua pergunta...</Text><Feather name="send" size={16} color={COLORS.neonEmerald} /></View>
          </View>
        );
      default: return null;
    }
  };

  if (!app) return null;

  if (viewMode === "splash") {
    return (
      <View style={styles.splashContainer}>
        <StatusBar barStyle="light-content" />
        <Animated.View style={[styles.splashBox, splashAnimatedStyle]}>
          <LinearGradient colors={[COLORS.forest, COLORS.deepEmerald]} style={StyleSheet.absoluteFill} />
          <Animated.Text entering={FadeInDown.duration(1000).springify()} style={styles.splashText}>Savvy</Animated.Text>
          <View style={styles.splashLine} />
        </Animated.View>
      </View>
    );
  }

  const stepData = steps[currentStep];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.forest, COLORS.deepEmerald]} style={StyleSheet.absoluteFill} />
      
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
         <View style={styles.progressBarContainer}>
            <Animated.View style={[styles.progressFillMain, progressStyle]} />
         </View>
      </View>

      <Animated.ScrollView key={currentStep} entering={FadeInDown.springify()} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.mockupWrapper}>
           {renderMockup(stepData.type)}
        </View>

        <View style={styles.textWrapper}>
           <Animated.Text entering={FadeInUp.delay(200).springify()} style={styles.title}>{stepData.title}</Animated.Text>
           <Animated.Text entering={FadeInUp.delay(300).springify()} style={styles.desc}>{stepData.desc}</Animated.Text>
        </View>

        <TouchableOpacity onPress={handleNext} style={styles.nextBtnContainer} activeOpacity={0.9}>
          <LinearGradient colors={[COLORS.neonEmerald, COLORS.brightMint]} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.nextBtn}>
            <Text style={styles.nextBtnText}>{currentStep === steps.length - 1 ? "Começar" : "Próximo"}</Text>
            <Feather name={currentStep === steps.length - 1 ? "zap" : "chevron-right"} size={22} color={COLORS.forest} />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  splashContainer: { flex: 1, backgroundColor: COLORS.forest },
  splashBox: { flex: 1, justifyContent: "center", alignItems: "center" },
  splashText: { color: "#fff", fontSize: 60, fontFamily: "Outfit_900Black", letterSpacing: -2 },
  splashLine: { width: 40, height: 4, backgroundColor: COLORS.neonEmerald, marginTop: 10, borderRadius: 2 },
  header: { paddingHorizontal: 30, paddingBottom: 20 },
  progressBarContainer: { height: 6, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" },
  progressFillMain: { height: "100%", backgroundColor: COLORS.neonEmerald, borderRadius: 3 },
  content: { alignItems: "center", paddingHorizontal: 30, paddingTop: 20 },
  mockupWrapper: { width: SCREEN_WIDTH - 60, height: 320, backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 32, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", justifyContent: "center", alignItems: "center", padding: 20, marginBottom: 40, overflow: "hidden" },
  mockContainer: { width: "100%", gap: 12 },
  mockCard: { padding: 16, borderRadius: 16, gap: 4 },
  mockCardLabel: { color: "rgba(255,255,255,0.8)", fontSize: 10, fontFamily: "Outfit_700Bold" },
  mockCardValue: { color: "#fff", fontSize: 24, fontFamily: "Outfit_900Black" },
  mockRow: { flexDirection: "row", gap: 10 },
  mockHalfCard: { flex: 1, backgroundColor: "rgba(255,255,255,0.05)", padding: 12, borderRadius: 14 },
  mockSmallLabel: { color: "rgba(255,255,255,0.5)", fontSize: 9, fontFamily: "Inter_600SemiBold" },
  mockSmallValue: { color: "#fff", fontSize: 14, fontFamily: "Outfit_700Bold", marginTop: 2 },
  mockListCard: { backgroundColor: "rgba(255,255,255,0.05)", padding: 16, borderRadius: 16 },
  mockLargeValue: { color: "#fff", fontSize: 20, fontFamily: "Outfit_700Bold", marginTop: 4, marginBottom: 10 },
  mockProgressBar: { height: 4, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 2, overflow: "hidden" },
  mockProgressFill: { height: "100%", backgroundColor: COLORS.neonEmerald },
  mockTinyText: { color: "rgba(255,255,255,0.4)", fontSize: 9, marginTop: 6 },
  mockChartBox: { height: 120, justifyContent: "flex-end", marginBottom: 10 },
  mockBars: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-around", gap: 10 },
  mockBar: { width: 15, backgroundColor: COLORS.neonEmerald, borderRadius: 4, opacity: 0.8 },
  mockCategoryRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.05)" },
  mockIconCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: "#ef4444", justifyContent: "center", alignItems: "center" },
  mockLineShort: { width: 60, height: 6, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 3, marginBottom: 4 },
  mockLineLong: { width: 100, height: 4, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 2 },
  mockPrice: { color: "#fff", fontSize: 14, fontFamily: "Outfit_700Bold" },
  mockGoalCard: { backgroundColor: "rgba(255,255,255,0.05)", padding: 16, borderRadius: 16, marginBottom: 8 },
  mockGoalTitle: { color: "#fff", fontSize: 14, fontFamily: "Inter_700Bold" },
  mockGoalAmounts: { flexDirection: "row", justifyContent: "space-between", marginTop: 8, marginBottom: 8 },
  mockGoalCurrent: { color: COLORS.neonEmerald, fontSize: 14, fontFamily: "Outfit_700Bold" },
  mockGoalTarget: { color: "rgba(255,255,255,0.4)", fontSize: 12 },
  mockGoalBar: { height: 6, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" },
  mockGoalFill: { height: "100%", backgroundColor: COLORS.neonEmerald },
  mockAiBubble: { backgroundColor: "rgba(255,255,255,0.1)", padding: 16, borderRadius: 16, borderBottomLeftRadius: 4 },
  mockAiText: { color: "#fff", fontSize: 13, fontFamily: "Inter_500Medium", lineHeight: 20 },
  mockAiInput: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(255,255,255,0.05)", padding: 14, borderRadius: 20, marginTop: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  mockAiPlaceholder: { color: "rgba(255,255,255,0.3)", fontSize: 12 },
  textWrapper: { alignItems: "center", marginBottom: 50 },
  title: { color: "#fff", fontSize: 32, fontFamily: "Outfit_900Black", textAlign: "center", marginBottom: 15 },
  desc: { color: COLORS.textMuted, fontSize: 18, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 28, opacity: 0.8 },
  nextBtnContainer: { width: "100%", shadowColor: COLORS.neonEmerald, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.4, shadowRadius: 20 },
  nextBtn: { height: 64, borderRadius: 24, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12 },
  nextBtnText: { color: COLORS.forest, fontSize: 20, fontFamily: "Outfit_700Bold" },
});
