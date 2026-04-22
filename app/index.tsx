import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { BlurView } from "expo-blur";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSpring,
  withDelay,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { useT } from "@/hooks/useTranslations";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const FAST_SLIDE_DURATION = 3000;

const COLORS = {
  forest: "#01241c",
  deepEmerald: "#064e3b",
  neonEmerald: "#10b981",
  brightMint: "#34d399",
  white: "#ffffff",
  textMuted: "#a7f3d0",
};

export default function WelcomeScreen() {
  const [containerWidth, setContainerWidth] = useState(SCREEN_WIDTH);
  const insets = useSafeAreaInsets();
  const app = useApp();
  const t = useT();

  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Animation values
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    buttonScale.value = withRepeat(
      withTiming(1.05, { duration: 1500 }),
      -1,
      true
    );
  }, []);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  if (!app) return null;
  const { session, profile } = app;

  const handleStart = () => {
    if (session) {
      if (profile.onboardingCompleted) {
        router.push("/(tabs)");
      } else {
        router.push("/onboarding");
      }
    } else {
      router.push("/(auth)/login");
    }
  };

  const slides = [
    { id: "1", title: t.introSlide1Title, icon: "shield" },
    { id: "2", title: t.introSlide2Title, icon: "trending-down" },
    { id: "3", title: t.introSlide3Title, icon: "trending-up" },
    { id: "4", title: t.introSlide4Title, icon: "pie-chart" },
    { id: "5", title: t.introSlide5Title, icon: "zap" },
  ];

  useEffect(() => {
    if (containerWidth === 0) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % slides.length;
        flatListRef.current?.scrollToOffset({ offset: next * containerWidth, animated: true });
        return next;
      });
    }, FAST_SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [containerWidth, slides.length]);

  return (
    <View style={[styles.container, { backgroundColor: COLORS.forest }]}>
      <LinearGradient
        colors={[COLORS.forest, COLORS.deepEmerald]}
        style={StyleSheet.absoluteFill}
      />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 40) + 40 }}
      >
        {/* HERO SECTION */}
        <View style={[styles.heroSection, { paddingTop: Math.max(insets.top, 40) + 20 }]}>
          <Animated.View 
            entering={FadeInDown.delay(200).duration(800)}
            style={styles.heroImageContainer}
          >
            <Image 
              source={require("@/assets/images/hero.png")}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", COLORS.forest]}
              style={styles.heroOverlay}
            />
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(400).duration(800)} style={styles.taglineContainer}>
            <BlurView intensity={20} tint="light" style={styles.taglineBadge}>
              <Text style={styles.taglineText}>SAVVY FINANCE • O TEU FUTURO</Text>
            </BlurView>
          </Animated.View>

          <Animated.Text 
            entering={FadeInUp.delay(600).duration(1000)}
            style={styles.heroTitle}
          >
            A Liberdade Financeira Começa Aqui.
          </Animated.Text>
          
          <Animated.Text 
            entering={FadeInUp.delay(800).duration(1000)}
            style={styles.heroSubtitle}
          >
            Gere, analisa e multiplica o teu dinheiro de forma simples e intuitiva. 
            Toma o controlo total das tuas poupanças num instante.
          </Animated.Text>

          <Animated.View entering={FadeInUp.delay(1000).duration(800)}>
            <TouchableOpacity
              style={styles.ctaButtonContainer}
              onPress={handleStart}
              activeOpacity={0.85}
            >
              <Animated.View style={[styles.ctaButton, animatedButtonStyle]}>
                <Text style={styles.ctaText}>{t.startNow}</Text>
                <Feather name="arrow-right" size={22} color={COLORS.white} />
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* FEATURES CAROUSEL */}
        <Animated.View 
          entering={FadeInUp.delay(1200).duration(800)}
          style={styles.carouselSection} 
          onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        >
          {containerWidth > 0 && (
            <FlatList
              ref={flatListRef}
              data={slides}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={[styles.slide, { width: containerWidth }]}>
                  <View style={styles.slideIconWrap}>
                    <Feather name={item.icon as any} size={32} color={COLORS.neonEmerald} />
                  </View>
                  <Text style={styles.slideTitle}>{item.title}</Text>
                </View>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              scrollEnabled={false}
              bounces={false}
            />
          )}
        </Animated.View>

        {/* GRID OF FEATURES */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Tudo o que precisas num só lugar</Text>
          
          <View style={styles.featuresGrid}>
            {[
              { title: "Gestão Descomplicada", desc: "Regista facilmente as tuas receitas e despesas num clique.", icon: "edit-3", delay: 1400 },
              { title: "Análises Inteligentes", desc: "Descobre onde e como gastas o teu dinheiro com gráficos de fácil leitura.", icon: "bar-chart-2", delay: 1600 },
              { title: "Dicas Personalizadas", desc: "A nossa IA estuda o teu padrão e dá-te conselhos focados nas tuas metas.", icon: "cpu", delay: 1800 }
            ].map((feature, idx) => (
              <Animated.View 
                key={idx}
                entering={FadeInDown.delay(feature.delay).duration(800)}
                style={styles.featureCardWrap}
              >
                <BlurView intensity={10} tint="light" style={styles.featureCard}>
                   <View style={styles.featureIconBox}>
                     <Feather name={feature.icon as any} size={24} color={COLORS.neonEmerald} />
                   </View>
                   <Text style={styles.featureCardTitle}>{feature.title}</Text>
                   <Text style={styles.featureCardDesc}>{feature.desc}</Text>
                </BlurView>
              </Animated.View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Floating CTA for long scrolls */}
      <Animated.View 
        entering={FadeInUp.delay(2000).duration(800)}
        style={styles.floatingCTAContainer}
      >
        <TouchableOpacity
            style={styles.floatingCtaButton}
            onPress={handleStart}
            activeOpacity={0.9}
          >
            <Text style={styles.ctaText}>{t.startNow}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    paddingHorizontal: 24,
    alignItems: "center",
    marginBottom: 40,
  },
  heroImageContainer: {
    width: "100%",
    height: 280,
    borderRadius: 32,
    overflow: "hidden",
    marginBottom: 32,
    backgroundColor: COLORS.deepEmerald,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  taglineContainer: {
    marginBottom: 24,
  },
  taglineBadge: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(52, 211, 153, 0.2)",
  },
  taglineText: {
    color: COLORS.brightMint,
    fontSize: 11,
    fontFamily: "Outfit_700Bold",
    letterSpacing: 2,
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: 44,
    fontFamily: "Outfit_900Black",
    textAlign: "center",
    letterSpacing: -1.5,
    lineHeight: 52,
    marginBottom: 20,
  },
  heroSubtitle: {
    color: COLORS.textMuted,
    fontSize: 18,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 28,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  ctaButtonContainer: {
    shadowColor: COLORS.neonEmerald,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  ctaButton: {
    backgroundColor: COLORS.neonEmerald,
    paddingVertical: 18,
    paddingHorizontal: 36,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  ctaText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "Outfit_700Bold",
  },
  carouselSection: {
    height: 100,
    marginBottom: 30,
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  slideIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  slideTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "Outfit_700Bold",
    textAlign: "center",
  },
  featuresSection: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontFamily: "Outfit_700Bold",
    textAlign: "center",
    marginBottom: 32,
  },
  featuresGrid: {
    gap: 20,
  },
  featureCardWrap: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(52, 211, 153, 0.1)",
  },
  featureCard: {
    padding: 24,
    backgroundColor: "rgba(236, 253, 245, 0.05)",
  },
  featureIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  featureCardTitle: {
    color: COLORS.white,
    fontSize: 19,
    fontFamily: "Outfit_700Bold",
    marginBottom: 8,
  },
  featureCardDesc: {
    color: COLORS.textMuted,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
  },
  floatingCTAContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: Platform.OS === "web" ? 34 : 40,
    backgroundColor: 'transparent',
    alignItems: "center",
  },
  floatingCtaButton: {
    backgroundColor: COLORS.forest,
    paddingVertical: 16,
    paddingHorizontal: 44,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.neonEmerald,
  }
});
