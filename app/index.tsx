import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { BlurView } from "expo-blur";
import React, { useEffect } from "react";
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
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withDelay,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { useT } from "@/hooks/useTranslations";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const COLORS = {
  forest: "#01241c",
  deepEmerald: "#064e3b",
  neonEmerald: "#10b981",
  brightMint: "#34d399",
  white: "#ffffff",
  textMuted: "#a7f3d0",
};

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const app = useApp();
  const t = useT();

  const scrollY = useSharedValue(0);

  // Background Glow Orbs Animations
  const orb1Y = useSharedValue(100);
  const orb2Y = useSharedValue(SCREEN_HEIGHT - 300);

  useEffect(() => {
    orb1Y.value = withRepeat(withTiming(300, { duration: 10000 }), -1, true);
    orb2Y.value = withRepeat(withTiming(SCREEN_HEIGHT - 600, { duration: 12000 }), -1, true);
  }, []);

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

  if (!app) return null;
  const { session, profile } = app;

  const handleStart = () => {
    if (session) {
      if (profile.onboardingCompleted) router.push("/(tabs)");
      else router.push("/onboarding");
    } else {
      router.push("/(auth)/login");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* CINEMATIC BACKGROUND MESH */}
      <View style={StyleSheet.absoluteFill}>
         <LinearGradient colors={[COLORS.forest, COLORS.deepEmerald]} style={StyleSheet.absoluteFill} />
         
         <Animated.View style={[styles.glowOrb, styles.orb1, meshOrb1Style]} />
         <Animated.View style={[styles.glowOrb, styles.orb2, meshOrb2Style]} />
         
         {Platform.OS !== "web" && (
           <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
         )}
      </View>
      
      <Animated.ScrollView 
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO SECTION WITH PARALLAX */}
        <View style={[styles.heroSection, { height: SCREEN_HEIGHT }]}>
          <Animated.View style={[StyleSheet.absoluteFill, heroImageStyle]}>
            <Image 
              source={require("@/assets/images/hero_financial.png")}
              style={styles.heroBgImage}
              resizeMode="cover"
            />
            <LinearGradient colors={["transparent", COLORS.forest]} style={styles.heroOverlay} />
          </Animated.View>

          <Animated.View style={[styles.heroContent, heroTextStyle, { paddingTop: insets.top + 80 }]}>
            <Animated.View entering={FadeInDown.springify().delay(200)} style={styles.badgeWrap}>
              <BlurView intensity={25} tint="light" style={styles.glassBadge}>
                <View style={styles.badgeDot} />
                <Text style={styles.badgeText}>SISTEMA DE ELITE SAVVY</Text>
              </BlurView>
            </Animated.View>

            <Animated.Text entering={FadeInUp.springify().delay(400)} style={styles.heroTitle}>
              O Futuro das tuas Finanças é Hoje.
            </Animated.Text>
            
            <Animated.Text entering={FadeInUp.springify().delay(600)} style={styles.heroSubtitle}>
              Sincroniza o teu património global, automatiza poupanças e deixa a nossa IA guiar cada cêntimo.
            </Animated.Text>

            <Animated.View entering={FadeInUp.springify().delay(800)}>
              <TouchableOpacity onPress={handleStart} activeOpacity={0.9} style={styles.ctaContainer}>
                <LinearGradient 
                  colors={[COLORS.neonEmerald, COLORS.brightMint]} 
                  start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                  style={styles.ctaButton}
                >
                   <Text style={styles.ctaText}>Iniciar Evolução</Text>
                   <Feather name="zap" size={24} color={COLORS.forest} />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
          
          <View style={styles.scrollTip}>
             <Text style={styles.scrollTipText}>EXPLORAR</Text>
             <Feather name="chevron-down" size={20} color="rgba(255,255,255,0.3)" />
          </View>
        </View>

        {/* FEATURES - GLASSMARPHISM 3.0 */}
        <View style={styles.benefitsSection}>
           <Text style={styles.sectionHeading}>Tecnologia que cria Liberdade</Text>
           
           <View style={styles.benefitsGrid}>
              {[
                { 
                  title: "IA Preditiva", 
                  desc: "Antecipa tendências de mercado e gastos antes de acontecerem.",
                  icon: "activity",
                  delay: 200
                },
                { 
                  title: "Ativos Globais", 
                  desc: "Consolida Crypto, Stocks e Imobiliário numa única interface premium.",
                  icon: "briefcase",
                  delay: 400
                },
                { 
                  title: "Segurança Militar", 
                  desc: "Encriptação ponta-a-ponta para que os teus dados nunca saiam das tuas mãos.",
                  icon: "lock",
                  delay: 600
                }
              ].map((b, i) => (
                <Animated.View 
                  key={i} 
                  entering={FadeInUp.delay(b.delay).springify()}
                  style={styles.premiumCardWrap}
                >
                  <BlurView intensity={15} tint="light" style={styles.premiumCard}>
                      <View style={styles.cardIconBox}>
                         <Feather name={b.icon as any} size={30} color={COLORS.brightMint} />
                      </View>
                      <Text style={styles.cardTitle}>{b.title}</Text>
                      <Text style={styles.cardDesc}>{b.desc}</Text>
                  </BlurView>
                </Animated.View>
              ))}
           </View>
        </View>

        {/* INTERACTIVE AI SPOTLIGHT */}
        <View style={styles.aiSpotlight}>
           <View style={styles.spotlightContent}>
              <View style={styles.aiVisual}>
                 <LinearGradient 
                    colors={[COLORS.neonEmerald, "transparent"]} 
                    style={styles.aiGlow} 
                 />
                 <BlurView intensity={20} tint="light" style={styles.aiBubble}>
                    <Text style={styles.aiBubbleTitle}>SAVVY AI AGENT</Text>
                    <Text style={styles.aiBubbleText}>
                       "Detectei uma oportunidade de otimização fiscal de **240€** nos teus investimentos recentes. Queres automatizar a declaração?"
                    </Text>
                 </BlurView>
              </View>
              
              <View style={styles.aiTextContainer}>
                 <Text style={styles.aiHighlightTitle}>Inteligência Proativa</Text>
                 <Text style={styles.aiHighlightDesc}>
                    Não somos apenas um tracker. Somos um agente ativo que trabalha 24/7 para encontrar dinheiro onde antes havia apenas confusão.
                 </Text>
              </View>
           </View>
        </View>

        {/* FINAL CONVERSION */}
        <View style={styles.finalSection}>
           <BlurView intensity={10} tint="light" style={styles.finalBox}>
              <Text style={styles.finalMainTitle}>Junta-te à elite financeira.</Text>
              <Text style={styles.finalSubText}>Centenas de utilizadores já automatizaram o seu futuro com a Savvy.</Text>
              
              <TouchableOpacity onPress={handleStart} activeOpacity={0.9} style={styles.finalCta}>
                 <Text style={styles.finalCtaText}>Criar Conta Agora</Text>
              </TouchableOpacity>
              
              <View style={styles.footerBranding}>
                 <Text style={styles.footerBrandName}>SAVVY</Text>
                 <Text style={styles.footerLegal}>© 2024 DESIGNED FOR FINANCIAL FREEDOM</Text>
              </View>
           </BlurView>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.forest,
  },
  glowOrb: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 200,
    opacity: 0.2,
  },
  orb1: {
    backgroundColor: COLORS.neonEmerald,
    top: 50,
    right: -150,
  },
  orb2: {
    backgroundColor: COLORS.deepEmerald,
    bottom: -100,
    left: -150,
  },
  heroSection: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  heroBgImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "110%", // A bit taller for parallax
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    paddingHorizontal: 30,
    alignItems: "center",
    zIndex: 10,
  },
  badgeWrap: {
    marginBottom: 35,
  },
  glassBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 40,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.neonEmerald,
    shadowColor: COLORS.neonEmerald,
    shadowRadius: 5,
    elevation: 3,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "Outfit_700Bold",
    letterSpacing: 3,
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: 52,
    fontFamily: "Outfit_900Black",
    textAlign: "center",
    lineHeight: 62,
    letterSpacing: -2,
    marginBottom: 20,
  },
  heroSubtitle: {
    color: COLORS.textMuted,
    fontSize: 21,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
    lineHeight: 32,
    paddingHorizontal: 15,
    marginBottom: 45,
    opacity: 0.9,
  },
  ctaContainer: {
    shadowColor: COLORS.neonEmerald,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 10,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingVertical: 22,
    paddingHorizontal: 44,
    borderRadius: 44,
  },
  ctaText: {
    color: COLORS.forest,
    fontSize: 21,
    fontFamily: "Outfit_700Bold",
  },
  scrollTip: {
    position: "absolute",
    bottom: 40,
    alignItems: "center",
    gap: 8,
  },
  scrollTipText: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 12,
    letterSpacing: 4,
    fontFamily: "Outfit_700Bold",
  },
  benefitsSection: {
    paddingVertical: 120,
    paddingHorizontal: 24,
  },
  sectionHeading: {
    color: COLORS.white,
    fontSize: 36,
    fontFamily: "Outfit_900Black",
    textAlign: "center",
    marginBottom: 70,
    letterSpacing: -1,
  },
  benefitsGrid: {
    gap: 30,
  },
  premiumCardWrap: {
    borderRadius: 35,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  premiumCard: {
    padding: 35,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  cardIconBox: {
    width: 65,
    height: 65,
    borderRadius: 22,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },
  cardTitle: {
    color: COLORS.white,
    fontSize: 24,
    fontFamily: "Outfit_700Bold",
    marginBottom: 14,
  },
  cardDesc: {
    color: COLORS.textMuted,
    fontSize: 17,
    fontFamily: "Inter_400Regular",
    lineHeight: 26,
    opacity: 0.8,
  },
  aiSpotlight: {
    paddingVertical: 120,
    paddingHorizontal: 24,
  },
  spotlightContent: {
    flexDirection: Platform.OS === "web" && SCREEN_WIDTH > 800 ? "row" : "column",
    alignItems: "center",
    gap: 60,
  },
  aiVisual: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  aiGlow: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.3,
    filter: Platform.OS === "web" ? "blur(60px)" : undefined,
  },
  aiBubble: {
    padding: 35,
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.4)",
    backgroundColor: "rgba(1, 36, 28, 0.8)",
    shadowColor: COLORS.neonEmerald,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 20,
  },
  aiBubbleTitle: {
    color: COLORS.neonEmerald,
    fontFamily: "Outfit_900Black",
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 15,
  },
  aiBubbleText: {
    color: COLORS.white,
    fontSize: 19,
    fontFamily: "Inter_500Medium",
    lineHeight: 28,
  },
  aiTextContainer: {
    flex: 1,
  },
  aiHighlightTitle: {
    color: COLORS.white,
    fontSize: 40,
    fontFamily: "Outfit_900Black",
    marginBottom: 20,
    letterSpacing: -1,
  },
  aiHighlightDesc: {
    color: COLORS.textMuted,
    fontSize: 19,
    fontFamily: "Inter_400Regular",
    lineHeight: 32,
    opacity: 0.9,
  },
  finalSection: {
    paddingBottom: 100,
    paddingHorizontal: 24,
  },
  finalBox: {
    padding: 60,
    borderRadius: 45,
    overflow: "hidden",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  finalMainTitle: {
    color: COLORS.white,
    fontSize: 44,
    fontFamily: "Outfit_900Black",
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: -2,
  },
  finalSubText: {
    color: COLORS.textMuted,
    fontSize: 19,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginBottom: 50,
  },
  finalCta: {
    backgroundColor: COLORS.white,
    paddingVertical: 22,
    paddingHorizontal: 54,
    borderRadius: 44,
  },
  finalCtaText: {
    color: COLORS.forest,
    fontSize: 21,
    fontFamily: "Outfit_700Bold",
  },
  footerBranding: {
    marginTop: 100,
    alignItems: "center",
    gap: 10,
  },
  footerBrandName: {
    color: COLORS.white,
    fontFamily: "Outfit_900Black",
    fontSize: 32,
    letterSpacing: 8,
    opacity: 0.1,
  },
  footerLegal: {
    color: "rgba(255,255,255,0.2)",
    fontSize: 10,
    letterSpacing: 2,
    fontFamily: "Outfit_700Bold",
  }
});
