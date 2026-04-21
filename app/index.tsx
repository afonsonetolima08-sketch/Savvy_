import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { useT } from "@/hooks/useTranslations";

const FAST_SLIDE_DURATION = 2500;

const COLORS = {
  darkBg: "#022c22", // Fundo principal (verde muito escuro)
  darkAccent: "#064e3b", // Acentos escuros
  mediumGreen: "#10b981", // Botões e botões interativos
  lightGreen: "#ecfdf5", // Cartões verde muito claro
  white: "#ffffff",
  textDark: "#022c22", // Texto para fundos claros
  textMuted: "#a7f3d0", // Texto secundário sobre fundo escuro
};

export default function WelcomeScreen() {
  const [containerWidth, setContainerWidth] = useState(0);
  const insets = useSafeAreaInsets();
  const app = useApp();
  const t = useT();

  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

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

  // Auto-advance rápido do carrossel
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

  const renderCarouselItem = ({ item }: { item: any }) => {
    return (
      <View style={[styles.slide, { width: containerWidth }]}>
        <View style={styles.slideIconWrap}>
          <Feather name={item.icon as any} size={42} color={COLORS.mediumGreen} />
        </View>
        <Text style={styles.slideTitle}>{item.title}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.darkBg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 40) + 20 }}
      >
        {/* HERO SECTION */}
        <View style={[styles.heroSection, { paddingTop: Math.max(insets.top, 40) + 20 }]}>
          <View style={styles.taglineBadge}>
            <Text style={styles.taglineText}>SAVVY FINANCE • O TEU FUTURO</Text>
          </View>

          <Text style={styles.heroTitle}>A Liberdade Financeira Começa Aqui.</Text>
          <Text style={styles.heroSubtitle}>
            Gere, analisa e multiplica o teu dinheiro de forma simples e intuitiva. 
            Toma o controlo total das tuas poupanças num instante.
          </Text>

          {/* Call to Action - Bem visível */}
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={handleStart}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaText}>{t.startNow}</Text>
            <Feather name="arrow-right" size={22} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* FAST CAROUSEL sem barras de navegação */}
        <View style={styles.carouselSection} onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
          {containerWidth > 0 && (
            <FlatList
              ref={flatListRef}
              data={slides}
              keyExtractor={(item) => item.id}
              renderItem={renderCarouselItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              scrollEnabled={false} // Desativar scroll manual para não interferir na rapidez
              bounces={false}
            />
          )}
        </View>

        {/* FUNCIONALIDADES PRINCIPAIS */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Tudo o que precisas num só lugar</Text>
          
          <View style={styles.featuresGrid}>
             <View style={styles.featureCard}>
                <View style={styles.featureIconBox}>
                  <Feather name="edit-3" size={24} color={COLORS.darkAccent} />
                </View>
                <Text style={styles.featureCardTitle}>Gestão Descomplicada</Text>
                <Text style={styles.featureCardDesc}>Regista facilmente as tuas receitas e despesas num clique.</Text>
             </View>

             <View style={styles.featureCard}>
                <View style={styles.featureIconBox}>
                  <Feather name="bar-chart-2" size={24} color={COLORS.darkAccent} />
                </View>
                <Text style={styles.featureCardTitle}>Análises Inteligentes</Text>
                <Text style={styles.featureCardDesc}>Descobre onde e como gastas o teu dinheiro com gráficos de fácil leitura.</Text>
             </View>

             <View style={styles.featureCard}>
                <View style={styles.featureIconBox}>
                  <Feather name="cpu" size={24} color={COLORS.darkAccent} />
                </View>
                <Text style={styles.featureCardTitle}>Dicas Personalizadas</Text>
                <Text style={styles.featureCardDesc}>A nossa IA estuda o teu padrão e dá-te conselhos focados nas tuas metas.</Text>
             </View>
          </View>
        </View>

      </ScrollView>

      {/* Floating CTA for long scrolls */}
      <View style={styles.floatingCTAContainer}>
        <TouchableOpacity
            style={styles.floatingCtaButton}
            onPress={handleStart}
            activeOpacity={0.9}
          >
            <Text style={styles.ctaText}>{t.startNow}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    paddingHorizontal: 28,
    alignItems: "center",
    marginBottom: 40,
  },
  taglineBadge: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: "rgba(16, 185, 129, 0.15)", // medium green highly transparent
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
    marginBottom: 24,
  },
  taglineText: {
    color: COLORS.mediumGreen,
    fontSize: 12,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1.5,
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: 42,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    letterSpacing: -1,
    lineHeight: 48,
    marginBottom: 20,
  },
  heroSubtitle: {
    color: COLORS.textMuted,
    fontSize: 18,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 28,
    marginBottom: 36,
  },
  ctaButton: {
    backgroundColor: COLORS.mediumGreen,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: COLORS.mediumGreen,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  ctaText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  carouselSection: {
    height: 120,
    marginBottom: 20,
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  slideIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  slideTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  featuresSection: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 100,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
    marginBottom: 28,
  },
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: COLORS.lightGreen,
    padding: 24,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  featureIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(16, 185, 129, 0.2)", // medium green alpha
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  featureCardTitle: {
    color: COLORS.textDark,
    fontSize: 19,
    fontFamily: "Inter_700Bold",
    marginBottom: 8,
  },
  featureCardDesc: {
    color: COLORS.darkAccent,
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    lineHeight: 24,
  },
  floatingCTAContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: Platform.OS === "web" ? 34 : 40, // Avoid safe area issues
    backgroundColor: 'transparent',
    alignItems: "center",
  },
  floatingCtaButton: {
    backgroundColor: COLORS.darkAccent,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.mediumGreen,
  }
});
