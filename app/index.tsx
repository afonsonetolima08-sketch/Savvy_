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
  FadeOut,
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  Extrapolate
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useApp } from "@/context/AppContext";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const COLORS = {
  forest: "#011612",
  deepEmerald: "#01241c",
  neonEmerald: "#10b981",
  brightMint: "#34d399",
  gold: "#fbbf24",
  white: "#ffffff",
  textMuted: "rgba(167, 243, 208, 0.6)",
};

export default function PremiumEntryScreen() {
  const insets = useSafeAreaInsets();
  const app = useApp();
  
  const [viewMode, setViewMode] = useState<"splash" | "tour">("splash");
  const [currentStep, setCurrentStep] = useState(0);

  const splashOpacity = useSharedValue(1);
  const splashScale = useSharedValue(0.9);
  const bgRotation = useSharedValue(0);

  const steps = [
    {
      title: "Resumo de Elite",
      desc: "Domina o teu património global com uma visão consolidada e inteligente.",
      type: "dashboard"
    },
    {
      title: "Análise Preditiva",
      desc: "Descobre padrões ocultos nos teus gastos com gráficos de alta precisão.",
      type: "analysis"
    },
    {
      title: "Metas Estratégicas",
      desc: "Aloca capital para os teus sonhos e acompanha o progresso em tempo real.",
      type: "goals"
    },
    {
      title: "Inteligência Artificial",
      desc: "O teu co-piloto financeiro disponível 24/7 para otimizar cada decisão.",
      type: "ai"
    }
  ];

  useEffect(() => {
    bgRotation.value = withRepeat(withTiming(360, { duration: 20000 }), -1, false);
    
    const timer = setTimeout(async () => {
       await checkRedirection();
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const checkRedirection = async () => {
    try {
      const isReturning = await AsyncStorage.getItem("savvy_returning_user");
      
      splashOpacity.value = withTiming(0, { duration: 1000 });
      splashScale.value = withTiming(1.2, { duration: 1000 });

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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

  const splashAnimatedStyle = useAnimatedStyle(() => ({
    opacity: splashOpacity.value,
    transform: [{ scale: splashScale.value }]
  }));

  const bgAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${bgRotation.value}deg` }]
  }));

  const renderMockup = (type: string) => {
    return (
      <Animated.View key={type} entering={FadeInDown.springify()} exiting={FadeOut} style={styles.mockDevice}>
        <LinearGradient colors={["rgba(255,255,255,0.05)", "transparent"]} style={styles.mockOverlay} />
        {type === "dashboard" && (
          <View style={styles.mockContent}>
            <View style={[styles.mockRealCard, { backgroundColor: "#ef4444" }]}>
              <Text style={styles.mockRealLabel}>SALDO DO MÊS</Text>
              <Text style={styles.mockRealValue}>2.450,00 €</Text>
              <View style={styles.mockRealTag}><Text style={styles.mockRealTagText}>+12.4% vs mês ant.</Text></View>
            </View>
            <View style={styles.mockRealRow}>
              <View style={styles.mockRealMini}><Text style={styles.mockRealMiniLabel}>GANHOS</Text><Text style={styles.mockRealMiniValue}>+3.2k</Text></View>
              <View style={styles.mockRealMini}><Text style={styles.mockRealMiniLabel}>GASTOS</Text><Text style={styles.mockRealMiniValue}>-750</Text></View>
            </View>
            <View style={styles.mockRealSection}>
               <Text style={styles.mockRealSectionTitle}>PATRIMÓNIO ATUAL</Text>
               <Text style={styles.mockRealTotal}>12.540,80 €</Text>
               <View style={styles.mockRealBar}><View style={[styles.mockRealFill, { width: "65%" }]} /></View>
            </View>
          </View>
        )}
        {type === "analysis" && (
          <View style={styles.mockContent}>
             <View style={styles.mockRealChart}>
                <View style={styles.mockBarsContainer}>
                   {[30, 50, 40, 80, 60, 95].map((h, i) => (
                     <View key={i} style={[styles.mockBarReal, { height: h, opacity: i === 5 ? 1 : 0.4 }]} />
                   ))}
                </View>
             </View>
             <View style={styles.mockRealCat}>
                <View style={styles.mockCatIcon}><Feather name="shopping-bag" size={14} color={COLORS.brightMint} /></View>
                <View style={{ flex: 1 }}><View style={styles.mockCatLine1} /><View style={styles.mockCatLine2} /></View>
                <Text style={styles.mockCatPrice}>-240€</Text>
             </View>
             <View style={styles.mockRealCat}>
                <View style={[styles.mockCatIcon, { backgroundColor: "rgba(59, 130, 246, 0.2)" }]}><Feather name="coffee" size={14} color="#3b82f6" /></View>
                <View style={{ flex: 1 }}><View style={styles.mockCatLine1} /><View style={styles.mockCatLine2} /></View>
                <Text style={styles.mockCatPrice}>-45€</Text>
             </View>
          </View>
        )}
        {type === "goals" && (
          <View style={styles.mockContent}>
            <View style={styles.mockRealGoal}>
               <View style={styles.mockGoalHead}><Text style={styles.mockGoalName}>Viagem Japão</Text><Text style={styles.mockGoalPerc}>40%</Text></View>
               <View style={styles.mockGoalBarWrap}><View style={[styles.mockGoalBarFill, { width: "40%" }]} /></View>
               <Text style={styles.mockGoalDetail}>Faltam 1.800 €</Text>
            </View>
            <View style={styles.mockRealGoal}>
               <View style={styles.mockGoalHead}><Text style={styles.mockGoalName}>Nova Casa</Text><Text style={styles.mockGoalPerc}>12%</Text></View>
               <View style={styles.mockGoalBarWrap}><View style={[styles.mockGoalBarFill, { width: "12%", backgroundColor: COLORS.gold }]} /></View>
               <Text style={styles.mockGoalDetail}>Faltam 44k €</Text>
            </View>
          </View>
        )}
        {type === "ai" && (
          <View style={styles.mockContent}>
             <View style={styles.mockAiMsg}>
                <View style={styles.mockAiIconSmall}><Feather name="cpu" size={12} color={COLORS.forest} /></View>
                <Text style={styles.mockAiTextReal}>Detectei um excesso de gastos em **Subscrições**. Podes poupar **45€/mês** se cancelares os serviços que não usas há 3 meses.</Text>
             </View>
             <View style={styles.mockAiInputReal}>
                <Text style={styles.mockAiPlaceholderReal}>Como posso investir 500€?</Text>
                <View style={styles.mockAiSend}><Feather name="arrow-up" size={14} color={COLORS.forest} /></View>
             </View>
          </View>
        )}
      </Animated.View>
    );
  };

  if (!app) return null;

  if (viewMode === "splash") {
    return (
      <View style={styles.splashContainer}>
        <StatusBar barStyle="light-content" />
        <LinearGradient colors={[COLORS.forest, COLORS.deepEmerald]} style={StyleSheet.absoluteFill} />
        <Animated.View style={[styles.splashBox, splashAnimatedStyle]}>
          <Text style={styles.splashText}>Savvy</Text>
          <View style={styles.splashIndicator} />
        </Animated.View>
      </View>
    );
  }

  const stepData = steps[currentStep];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.forest, COLORS.deepEmerald]} style={StyleSheet.absoluteFill} />
      
      {/* BACKGROUND PARTICLES */}
      <Animated.View style={[styles.bgParticles, bgAnimatedStyle]}>
         <View style={[styles.particle, { top: "10%", left: "20%" }]} />
         <View style={[styles.particle, { top: "40%", right: "15%", width: 100, height: 100 }]} />
         <View style={[styles.particle, { bottom: "15%", left: "10%", opacity: 0.1 }]} />
      </Animated.View>

      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
         <View style={styles.stepDots}>
            {steps.map((_, i) => (
              <View key={i} style={[styles.dot, currentStep === i && styles.dotActive]} />
            ))}
         </View>
         <TouchableOpacity onPress={handleFinalStart}><Text style={styles.skipText}>SALTAR</Text></TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.mockWrapper}>
           {renderMockup(stepData.type)}
        </View>

        <View style={styles.textWrapper}>
           <Animated.Text key={`t-${currentStep}`} entering={FadeInDown.springify()} style={styles.title}>{stepData.title}</Animated.Text>
           <Animated.Text key={`d-${currentStep}`} entering={FadeInDown.delay(100).springify()} style={styles.desc}>{stepData.desc}</Animated.Text>
        </View>

        <TouchableOpacity onPress={handleNext} activeOpacity={0.9} style={styles.nextBtn}>
          <LinearGradient colors={[COLORS.neonEmerald, COLORS.brightMint]} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.btnGradient}>
             <Text style={styles.btnText}>{currentStep === steps.length - 1 ? "COMEÇAR AGORA" : "PRÓXIMO"}</Text>
             <Feather name="arrow-right" size={20} color={COLORS.forest} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.forest },
  splashContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  splashBox: { alignItems: "center" },
  splashText: { color: "#fff", fontSize: 72, fontFamily: "Outfit_900Black", letterSpacing: -3 },
  splashIndicator: { width: 50, height: 4, backgroundColor: COLORS.neonEmerald, borderRadius: 2, marginTop: 15 },
  bgParticles: { ...StyleSheet.absoluteFillObject, opacity: 0.4 },
  particle: { position: "absolute", width: 150, height: 150, borderRadius: 75, backgroundColor: COLORS.neonEmerald, opacity: 0.15 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 30 },
  stepDots: { flexDirection: "row", gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.2)" },
  dotActive: { width: 24, backgroundColor: COLORS.neonEmerald },
  skipText: { color: COLORS.textMuted, fontSize: 12, fontFamily: "Outfit_700Bold", letterSpacing: 1 },
  mainContent: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 30 },
  mockWrapper: { width: "100%", height: 380, justifyContent: "center", alignItems: "center", marginBottom: 30 },
  mockDevice: { width: 260, height: 360, backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 40, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", padding: 20, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.5, shadowRadius: 30, elevation: 10 },
  mockOverlay: { ...StyleSheet.absoluteFillObject },
  mockContent: { flex: 1, gap: 15 },
  mockRealCard: { padding: 15, borderRadius: 20, gap: 5 },
  mockRealLabel: { color: "rgba(255,255,255,0.6)", fontSize: 8, fontFamily: "Outfit_700Bold" },
  mockRealValue: { color: "#fff", fontSize: 22, fontFamily: "Outfit_900Black" },
  mockRealTag: { backgroundColor: "rgba(0,0,0,0.2)", alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  mockRealTagText: { color: "#fff", fontSize: 8, fontFamily: "Inter_600SemiBold" },
  mockRealRow: { flexDirection: "row", gap: 10 },
  mockRealMini: { flex: 1, backgroundColor: "rgba(255,255,255,0.05)", padding: 12, borderRadius: 15 },
  mockRealMiniLabel: { color: "rgba(255,255,255,0.4)", fontSize: 7, fontFamily: "Inter_700Bold" },
  mockRealMiniValue: { color: "#fff", fontSize: 14, fontFamily: "Outfit_700Bold", marginTop: 2 },
  mockRealSection: { backgroundColor: "rgba(255,255,255,0.03)", padding: 15, borderRadius: 20 },
  mockRealSectionTitle: { color: "rgba(255,255,255,0.4)", fontSize: 8, fontFamily: "Inter_700Bold", marginBottom: 5 },
  mockRealTotal: { color: "#fff", fontSize: 18, fontFamily: "Outfit_700Bold" },
  mockRealBar: { height: 4, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 2, marginTop: 10 },
  mockRealFill: { height: "100%", backgroundColor: COLORS.neonEmerald, borderRadius: 2 },

  mockRealChart: { height: 100, justifyContent: "flex-end", marginBottom: 10 },
  mockBarsContainer: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-around", gap: 8 },
  mockBarReal: { width: 12, backgroundColor: COLORS.neonEmerald, borderRadius: 3 },
  mockRealCat: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.05)" },
  mockCatIcon: { width: 28, height: 28, borderRadius: 10, backgroundColor: "rgba(16, 185, 129, 0.2)", justifyContent: "center", alignItems: "center" },
  mockCatLine1: { width: 40, height: 6, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 3, marginBottom: 4 },
  mockCatLine2: { width: 80, height: 4, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 2 },
  mockCatPrice: { color: "#fff", fontSize: 12, fontFamily: "Outfit_700Bold" },

  mockRealGoal: { backgroundColor: "rgba(255,255,255,0.05)", padding: 15, borderRadius: 20, marginBottom: 10 },
  mockGoalHead: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  mockGoalName: { color: "#fff", fontSize: 12, fontFamily: "Inter_700Bold" },
  mockGoalPerc: { color: COLORS.neonEmerald, fontSize: 12, fontFamily: "Outfit_700Bold" },
  mockGoalBarWrap: { height: 5, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" },
  mockGoalBarFill: { height: "100%", backgroundColor: COLORS.neonEmerald },
  mockGoalDetail: { color: "rgba(255,255,255,0.4)", fontSize: 8, marginTop: 5 },

  mockAiMsg: { backgroundColor: COLORS.white, padding: 15, borderRadius: 20, borderBottomLeftRadius: 5 },
  mockAiIconSmall: { width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.brightMint, justifyContent: "center", alignItems: "center", marginBottom: 8 },
  mockAiTextReal: { color: COLORS.forest, fontSize: 11, fontFamily: "Inter_600SemiBold", lineHeight: 16 },
  mockAiInputReal: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(255,255,255,0.05)", padding: 12, borderRadius: 25, marginTop: 25, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  mockAiPlaceholderReal: { color: "rgba(255,255,255,0.3)", fontSize: 10 },
  mockAiSend: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.brightMint, justifyContent: "center", alignItems: "center" },

  textWrapper: { alignItems: "center", marginBottom: 40 },
  title: { color: "#fff", fontSize: 36, fontFamily: "Outfit_900Black", textAlign: "center", marginBottom: 15, letterSpacing: -1 },
  desc: { color: COLORS.textMuted, fontSize: 18, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 28 },
  nextBtn: { width: "100%", height: 64, borderRadius: 24, overflow: "hidden" },
  btnGradient: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12 },
  btnText: { color: COLORS.forest, fontSize: 18, fontFamily: "Outfit_900Black", letterSpacing: 1 },
});
