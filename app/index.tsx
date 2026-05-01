import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useApp } from "@/context/AppContext";
import { useT } from "@/hooks/useTranslations";
import { BrandLogo } from "@/components/BrandLogo";

const isServer = typeof window === "undefined";
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = isServer 
  ? { width: 1280, height: 800 } 
  : Dimensions.get("window");

const COLORS = {
  forest: "#01241c",
  deepEmerald: "#064e3b",
  neonEmerald: "#10b981",
  brightMint: "#34d399",
  white: "#ffffff",
  textMuted: "#a7f3d0",
};

export default function EntryScreen() {
  const insets = useSafeAreaInsets();
  const app = useApp();
  const t = useT();

  const [viewMode, setViewMode] = useState<"splash" | "landing">("splash");
  const [hasSession, setHasSession] = useState(false);
  const scrollY = useSharedValue(0);

  // Background Glow Orbs Animations
  const orb1Y = useSharedValue(100);
  const orb2Y = useSharedValue(SCREEN_HEIGHT - 300);

  // Splash Animations
  const splashOpacity = useSharedValue(1);
  const splashScale = useSharedValue(1);
  const splashTextY = useSharedValue(0);

  useEffect(() => {
    orb1Y.value = withRepeat(withTiming(300, { duration: 10000 }), -1, true);
    orb2Y.value = withRepeat(withTiming(SCREEN_HEIGHT - 600, { duration: 12000 }), -1, true);
    
    // Splash sequence
    const timer = setTimeout(async () => {
       await checkRedirection();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const checkRedirection = async () => {
    try {
      const isReturning = await AsyncStorage.getItem("savvy_returning_user");
      
      // Animate out splash
      splashOpacity.value = withTiming(0, { duration: 800 });
      splashScale.value = withTiming(1.1, { duration: 800 });

      if (isReturning === "true" && app?.session) {
        // Direct to main if returning and logged in
        handleStart();
      } else {
        // Show landing if new or not logged in
        setViewMode("landing");
      }
    } catch (e) {
      setViewMode("landing");
    }
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Parallax styles
  const heroImageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scrollY.value, [0, SCREEN_HEIGHT], [0, 200], Extrapolate.CLAMP) },
      { scale: interpolate(scrollY.value, [-100, 0, SCREEN_HEIGHT], [1.2, 1, 1.1], Extrapolate.CLAMP) }
    ],
    opacity: interpolate(scrollY.value, [0, SCREEN_HEIGHT * 0.7], [0.6, 0.2], Extrapolate.CLAMP)
  }));

  const heroTextStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scrollY.value, [0, 500], [0, -50], Extrapolate.CLAMP) }
    ],
    opacity: interpolate(scrollY.value, [0, 400], [1, 0], Extrapolate.CLAMP)
  }));

  const meshOrb1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: orb1Y.value }],
  }));

  const meshOrb2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: orb2Y.value }],
  }));

  const splashAnimatedStyle = useAnimatedStyle(() => ({
    opacity: splashOpacity.value,
    transform: [{ scale: splashScale.value }]
  }));

  if (!app) return null;
  const { session, profile } = app;

  const handleStart = async () => {
    try {
      await AsyncStorage.setItem("savvy_returning_user", "true");
    } catch (e) {}

    if (session) {
      if (profile.onboardingCompleted) router.push("/(tabs)");
      else router.push("/onboarding");
    } else {
      router.push("/(auth)/login");
    }
  };

  if (viewMode === "splash") {
    return (
      <View style={styles.splashContainer}>
        <StatusBar barStyle="light-content" />
        <Animated.View style={[styles.splashBox, splashAnimatedStyle]}>
          <LinearGradient colors={[COLORS.forest, COLORS.deepEmerald]} style={StyleSheet.absoluteFill} />
          <Animated.Text entering={FadeInDown.duration(1000).springify()} style={styles.splashText}>
            Savvy
          </Animated.Text>
          <Animated.View 
            entering={FadeInUp.delay(500).duration(1000)}
            style={styles.splashLine}
          />
        </Animated.View>
      </View>
    );
  }

  return (
    <Animated.View entering={FadeInDown.duration(800)} style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* CINEMATIC BACKGROUND MESH */}
      <View style={StyleSheet.absoluteFill}>
         <LinearGradient colors={[COLORS.forest, COLORS.deepEmerald]} style={StyleSheet.absoluteFill} />
         <Animated.View style={[styles.glowOrb, styles.orb1, meshOrb1Style]} />
         <Animated.View style={[styles.glowOrb, styles.orb2, meshOrb2Style]} />
      </View>
      
      <Animated.ScrollView 
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO SECTION */}
        <View style={[styles.heroSection, { height: SCREEN_HEIGHT }]}>
          <Animated.View style={[StyleSheet.absoluteFill, heroImageStyle]}>
            <Image source={require("@/assets/images/hero_financial.png")} style={styles.heroBgImage} resizeMode="cover" />
            <LinearGradient colors={["transparent", COLORS.forest]} style={styles.heroOverlay} />
          </Animated.View>

          <Animated.View style={[styles.heroContent, heroTextStyle, { paddingTop: insets.top + 80 }]}>
            <View style={styles.badgeWrap}>
              <BlurView intensity={25} tint="light" style={styles.glassBadge}>
                <View style={styles.badgeDot} /><Text style={styles.badgeText}>SISTEMA DE ELITE SAVVY</Text>
              </BlurView>
            </View>
            <Text style={styles.heroTitle}>O Futuro das tuas Finanças começa hoje.</Text>
            <Text style={styles.heroSubtitle}>Sincroniza o teu património global, automatiza as tuas poupanças e deixa a nossa IA guiar cada cêntimo.</Text>
            <TouchableOpacity onPress={handleStart} activeOpacity={0.9} style={styles.ctaContainer}>
                <LinearGradient colors={[COLORS.neonEmerald, COLORS.brightMint]} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.ctaButton}>
                   <Text style={styles.ctaText}>Iniciar Evolução</Text><Feather name="zap" size={24} color={COLORS.forest} />
                </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* BENEFITS */}
        <View style={styles.benefitsSection}>
           <Text style={styles.sectionHeading}>Tecnologia que cria Liberdade</Text>
           <View style={styles.benefitsGrid}>
              {[
                { title: "IA Preditiva", desc: "Antecipa tendências de mercado.", icon: "activity", delay: 200 },
                { title: "Ativos Globais", desc: "Consolida Crypto e Stocks.", icon: "briefcase", delay: 400 },
                { title: "Segurança de Elite", desc: "Encriptação ponta-a-ponta.", icon: "lock", delay: 600 }
              ].map((b, i) => (
                <View key={i} style={styles.premiumCardWrap}>
                  <BlurView intensity={15} tint="light" style={styles.premiumCard}>
                      <View style={styles.cardIconBox}><Feather name={b.icon as any} size={30} color={COLORS.brightMint} /></View>
                      <Text style={styles.cardTitle}>{b.title}</Text>
                      <Text style={styles.cardDesc}>{b.desc}</Text>
                  </BlurView>
                </View>
              ))}
           </View>
        </View>

        {/* FINAL CONVERSION */}
        <View style={styles.finalSection}>
            <BlurView intensity={10} tint="light" style={styles.finalBox}>
              <Text style={styles.finalMainTitle}>Junta-te à elite financeira.</Text>
              <TouchableOpacity onPress={handleStart} activeOpacity={0.9} style={styles.finalCta}>
                 <Text style={styles.finalCtaText}>Criar Conta Agora</Text>
              </TouchableOpacity>
              <View style={styles.footerBranding}>
                 <BrandLogo style={styles.footerLogo} />
                 <Text style={styles.footerLegal}>© 2024 DESIGNED FOR FINANCIAL FREEDOM</Text>
              </View>
           </BlurView>
        </View>
      </Animated.ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.forest },
  splashContainer: { flex: 1, backgroundColor: COLORS.forest },
  splashBox: { flex: 1, justifyContent: "center", alignItems: "center" },
  splashText: { color: "#fff", fontSize: 60, fontFamily: "Outfit_900Black", letterSpacing: -2 },
  splashLine: { width: 40, height: 4, backgroundColor: COLORS.neonEmerald, marginTop: 10, borderRadius: 2 },
  glowOrb: { position: "absolute", width: 400, height: 400, borderRadius: 200, opacity: 0.2 },
  orb1: { backgroundColor: COLORS.neonEmerald, top: 50, right: -150 },
  orb2: { backgroundColor: COLORS.deepEmerald, bottom: -100, left: -150 },
  heroSection: { width: "100%", justifyContent: "center", alignItems: "center", overflow: "hidden" },
  heroBgImage: { ...StyleSheet.absoluteFillObject, width: "100%", height: "110%" },
  heroOverlay: { ...StyleSheet.absoluteFillObject },
  heroContent: { paddingHorizontal: 30, alignItems: "center", zIndex: 10 },
  badgeWrap: { marginBottom: 35 },
  glassBadge: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14, paddingHorizontal: 24, borderRadius: 40, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.15)" },
  badgeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.neonEmerald },
  badgeText: { color: COLORS.white, fontSize: 12, fontFamily: "Outfit_700Bold", letterSpacing: 3 },
  heroTitle: { color: COLORS.white, fontSize: 52, fontFamily: "Outfit_900Black", textAlign: "center", lineHeight: 62, letterSpacing: -2, marginBottom: 20 },
  heroSubtitle: { color: COLORS.textMuted, fontSize: 21, fontFamily: "Inter_500Medium", textAlign: "center", lineHeight: 32, paddingHorizontal: 15, marginBottom: 45, opacity: 0.9 },
  ctaContainer: { shadowColor: COLORS.neonEmerald, shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.6, shadowRadius: 30, elevation: 10 },
  ctaButton: { flexDirection: "row", alignItems: "center", gap: 15, paddingVertical: 22, paddingHorizontal: 44, borderRadius: 44 },
  ctaText: { color: COLORS.forest, fontSize: 21, fontFamily: "Outfit_700Bold" },
  benefitsSection: { paddingVertical: 120, paddingHorizontal: 24 },
  sectionHeading: { color: COLORS.white, fontSize: 36, fontFamily: "Outfit_900Black", textAlign: "center", marginBottom: 70 },
  benefitsGrid: { gap: 30 },
  premiumCardWrap: { borderRadius: 35, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.08)" },
  premiumCard: { padding: 35, backgroundColor: "rgba(255, 255, 255, 0.03)" },
  cardIconBox: { width: 65, height: 65, borderRadius: 22, backgroundColor: "rgba(16, 185, 129, 0.1)", alignItems: "center", justifyContent: "center", marginBottom: 25 },
  cardTitle: { color: COLORS.white, fontSize: 24, fontFamily: "Outfit_700Bold", marginBottom: 14 },
  cardDesc: { color: COLORS.textMuted, fontSize: 17, fontFamily: "Inter_400Regular", lineHeight: 26, opacity: 0.8 },
  finalSection: { paddingBottom: 100, paddingHorizontal: 24 },
  finalBox: { padding: 60, borderRadius: 45, overflow: "hidden", alignItems: "center", borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.08)" },
  finalMainTitle: { color: COLORS.white, fontSize: 44, fontFamily: "Outfit_900Black", textAlign: "center", marginBottom: 20 },
  finalCta: { backgroundColor: COLORS.white, paddingVertical: 22, paddingHorizontal: 54, borderRadius: 44 },
  finalCtaText: { color: COLORS.forest, fontSize: 21, fontFamily: "Outfit_700Bold" },
  footerBranding: { marginTop: 100, alignItems: "center", gap: 10 },
  footerLogo: { width: 140, height: 60, opacity: 0.8 },
  footerLegal: { color: "rgba(255,255,255,0.2)", fontSize: 10, letterSpacing: 2, fontFamily: "Outfit_700Bold" }
});
