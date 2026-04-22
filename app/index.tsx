import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { BlurView } from "expo-blur";
import React, { useEffect, useRef } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
  ScrollView,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
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

  // CTA Glow Pulse Animation
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    buttonScale.value = withRepeat(withTiming(1.04, { duration: 2000 }), -1, true);
  }, []);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
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
      <LinearGradient 
        colors={[COLORS.forest, COLORS.deepEmerald, COLORS.forest]} 
        style={StyleSheet.absoluteFill} 
      />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 0 }}
      >
        {/* SECTION 1: HERO (High Impact) */}
        <View style={[styles.heroSection, { minHeight: SCREEN_HEIGHT }]}>
          <Image 
            source={require("@/assets/images/hero_financial.png")}
            style={styles.heroBgImage}
            resizeMode="cover"
          />
          <LinearGradient colors={["transparent", COLORS.forest]} style={styles.heroOverlay} />

          <View style={[styles.heroContent, { paddingTop: insets.top + 60 }]}>
            <Animated.View 
              entering={FadeInDown.duration(1000).delay(200)}
              style={styles.heroBadgeWrapper}
            >
              <BlurView intensity={30} tint="light" style={styles.glassBadge}>
                <Feather name="shield" size={14} color={COLORS.brightMint} />
                <Text style={styles.badgeText}>SAVVY FINANCE • INTELIGÊNCIA REAL</Text>
              </BlurView>
            </Animated.View>

            <Animated.Text 
              entering={FadeInUp.duration(1000).delay(400)}
              style={styles.heroTitle}
            >
              O Teu Dinheiro sob Nova Inteligência.
            </Animated.Text>
            
            <Animated.Text 
              entering={FadeInUp.duration(1000).delay(600)}
              style={styles.heroSubtitle}
            >
              A Savvy automatiza a gestão do teu património com IA, dando-te clareza total e liberdade para viveres o que importa.
            </Animated.Text>

            <Animated.View entering={FadeInUp.duration(1000).delay(800)}>
              <TouchableOpacity 
                onPress={handleStart} 
                activeOpacity={0.9}
                style={styles.ctaWrapper}
              >
                <Animated.View style={[styles.ctaButton, animatedButtonStyle]}>
                   <Text style={styles.ctaText}>Começar Agora</Text>
                   <Feather name="chevron-right" size={24} color={COLORS.white} />
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>
          </View>
          
          <Animated.View 
             entering={FadeInUp.delay(1200)}
             style={styles.scrollIndicator}
          >
             <Feather name="chevron-down" size={24} color="rgba(255,255,255,0.4)" />
          </Animated.View>
        </View>

        {/* SECTION 2: FEATURES GRID */}
        <View style={styles.featuresSection}>
          <Animated.Text 
             entering={FadeInUp.duration(800)}
             style={styles.sectionTitle}
          >
            Três razões para seres Savvy
          </Animated.Text>
          
          <View style={styles.featuresGrid}>
            {[
              { 
                title: "Automação Total", 
                desc: "Esquece o registo manual. A nossa IA entende os teus hábitos e faz o trabalho por ti.",
                icon: "cpu"
              },
              { 
                title: "Património 360º", 
                desc: "Consolida os teus ativos, investimentos e dívidas numa visão estratégica unificada.",
                icon: "pie-chart"
              },
              { 
                title: "Sincronização Cloud", 
                desc: "Dados seguros, encriptados e acessíveis em qualquer dispositivo, em tempo real.",
                icon: "cloud"
              }
            ].map((f, i) => (
              <Animated.View 
                key={i}
                entering={FadeInUp.delay(i * 200).duration(800)}
                style={styles.featureCardWrap}
              >
                <BlurView intensity={10} tint="light" style={styles.featureCard}>
                   <View style={styles.featureIconBox}>
                      <Feather name={f.icon as any} size={28} color={COLORS.neonEmerald} />
                   </View>
                   <Text style={styles.featureCardTitle}>{f.title}</Text>
                   <Text style={styles.featureCardDesc}>{f.desc}</Text>
                </BlurView>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* SECTION 3: AI SHOWCASE */}
        <View style={styles.aiShowcaseSection}>
           <LinearGradient
              colors={["rgba(16, 185, 129, 0.1)", "transparent"]}
              style={StyleSheet.absoluteFill}
           />
           <View style={styles.aiContent}>
              <View style={styles.aiLeft}>
                 <Text style={styles.aiBadge}>ASSISTENTE IA</Text>
                 <Text style={styles.aiTitle}>Um consultor financeiro no teu bolso.</Text>
                 <Text style={styles.aiDesc}>
                    Recebe dicas em tempo real baseadas na tua taxa de poupança atual e objetivos de vida. 
                    A Savvy não apenas regista; ela ensina-te a poupar.
                 </Text>
              </View>
              <View style={styles.aiRight}>
                 <BlurView intensity={20} tint="light" style={styles.aiMessageMockup}>
                    <Feather name="message-circle" size={20} color={COLORS.brightMint} style={{ marginBottom: 10 }} />
                    <Text style={styles.aiMessageText}>
                       "Notei que podes poupar **50€** este mês se reduzires as subscrições que não usas há 3 meses. Queres ver os detalhes?"
                    </Text>
                 </BlurView>
              </View>
           </View>
        </View>

        {/* SECTION 4: FINAL CTA */}
        <View style={styles.finalCTASection}>
           <Animated.Text 
             entering={FadeInDown.duration(800)}
             style={styles.finalTitle}
           >
              A tua liberdade financeira começa aqui.
           </Animated.Text>
           <TouchableOpacity 
              onPress={handleStart} 
              activeOpacity={0.9}
              style={styles.finalButtonContainer}
           >
              <LinearGradient 
                 colors={[COLORS.neonEmerald, COLORS.brightMint]} 
                 start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                 style={styles.finalButton}
              >
                 <Text style={[styles.ctaText, { color: COLORS.forest }]}>Criar Conta Grátis</Text>
                 <Feather name="arrow-right" size={24} color={COLORS.forest} />
              </LinearGradient>
           </TouchableOpacity>
           <Text style={styles.footerText}>© 2024 Savvy Finance. Todos os direitos reservados.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.forest,
  },
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  heroBgImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    opacity: 0.6,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    paddingHorizontal: 30,
    alignItems: "center",
  },
  heroBadgeWrapper: {
    marginBottom: 30,
  },
  glassBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  badgeText: {
    color: COLORS.brightMint,
    fontSize: 11,
    fontFamily: "Outfit_700Bold",
    letterSpacing: 2,
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: 48,
    fontFamily: "Outfit_900Black",
    textAlign: "center",
    lineHeight: 56,
    letterSpacing: -1.5,
    marginBottom: 20,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  heroSubtitle: {
    color: COLORS.textMuted,
    fontSize: 20,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
    lineHeight: 30,
    paddingHorizontal: 10,
    marginBottom: 40,
    opacity: 0.9,
  },
  ctaWrapper: {
    shadowColor: COLORS.neonEmerald,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  ctaButton: {
    backgroundColor: COLORS.neonEmerald,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  ctaText: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: "Outfit_700Bold",
  },
  scrollIndicator: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
  },
  featuresSection: {
    paddingVertical: 100,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 32,
    fontFamily: "Outfit_900Black",
    textAlign: "center",
    marginBottom: 60,
  },
  featuresGrid: {
    gap: 24,
  },
  featureCardWrap: {
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.1)",
  },
  featureCard: {
    padding: 30,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  featureIconBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  featureCardTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontFamily: "Outfit_700Bold",
    marginBottom: 12,
  },
  featureCardDesc: {
    color: COLORS.textMuted,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
    opacity: 0.8,
  },
  aiShowcaseSection: {
    paddingVertical: 100,
    paddingHorizontal: 24,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  aiContent: {
    flexDirection: Platform.OS === "web" && SCREEN_WIDTH > 800 ? "row" : "column",
    gap: 40,
    alignItems: "center",
  },
  aiLeft: {
    flex: 1,
  },
  aiBadge: {
    color: COLORS.neonEmerald,
    fontFamily: "Outfit_700Bold",
    fontSize: 14,
    letterSpacing: 2,
    marginBottom: 16,
  },
  aiTitle: {
    color: COLORS.white,
    fontSize: 36,
    fontFamily: "Outfit_900Black",
    lineHeight: 44,
    marginBottom: 20,
  },
  aiDesc: {
    color: COLORS.textMuted,
    fontSize: 18,
    fontFamily: "Inter_400Regular",
    lineHeight: 28,
  },
  aiRight: {
    flex: 1,
    width: "100%",
  },
  aiMessageMockup: {
    padding: 30,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(16, 185, 129, 0.05)",
  },
  aiMessageText: {
    color: COLORS.white,
    fontSize: 17,
    fontFamily: "Inter_400Regular",
    lineHeight: 26,
  },
  finalCTASection: {
    paddingVertical: 120,
    paddingHorizontal: 30,
    alignItems: "center",
  },
  finalTitle: {
    color: COLORS.white,
    fontSize: 32,
    fontFamily: "Outfit_900Black",
    textAlign: "center",
    marginBottom: 40,
  },
  finalButtonContainer: {
    width: "100%",
    maxWidth: 400,
    shadowColor: COLORS.neonEmerald,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.5,
    shadowRadius: 25,
    elevation: 15,
  },
  finalButton: {
    paddingVertical: 22,
    paddingHorizontal: 40,
    borderRadius: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.3)",
    fontSize: 12,
    marginTop: 80,
    textAlign: "center",
  },
});
