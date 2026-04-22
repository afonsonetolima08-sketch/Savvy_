import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { BlurView } from "expo-blur";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
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
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { useT } from "@/hooks/useTranslations";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const FAST_SLIDE_DURATION = 2500;

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

  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Animation values
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    buttonScale.value = withRepeat(
      withTiming(1.05, { duration: 1200 }),
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
    { 
      id: "1", 
      title: t.introSlide1Title, 
      desc: t.introSlide1Desc,
      icon: "cpu",
      image: require("@/assets/images/hero.png")
    },
    { 
      id: "2", 
      title: t.introSlide2Title, 
      desc: t.introSlide2Desc,
      icon: "message-square",
      image: require("@/assets/images/hero.png")
    },
    { 
      id: "3", 
      title: t.introSlide3Title, 
      desc: t.introSlide3Desc,
      icon: "globe",
      image: require("@/assets/images/hero.png")
    },
    { 
      id: "4", 
      title: t.introSlide4Title, 
      desc: t.introSlide4Desc,
      icon: "bar-chart-2",
      image: require("@/assets/images/hero.png")
    },
    { 
      id: "5", 
      title: t.introSlide5Title, 
      desc: t.introSlide5Desc,
      icon: "cloud",
      image: require("@/assets/images/hero.png")
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % slides.length;
        flatListRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, FAST_SLIDE_DURATION);
    
    return () => clearInterval(timer);
  }, [slides.length]);

  const renderItem = ({ item, index }: { item: typeof slides[0], index: number }) => (
    <View style={styles.slide}>
      <View style={[styles.heroImageContainer, { marginTop: insets.top + 20 }]}>
        <Image 
          source={item.image}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", COLORS.forest]}
          style={styles.heroOverlay}
        />
      </View>

      <View style={styles.contentWrap}>
        <View style={styles.taglineContainer}>
          <BlurView intensity={20} tint="light" style={styles.taglineBadge}>
            <View style={styles.taglineRow}>
              <Feather name={item.icon as any} size={14} color={COLORS.brightMint} />
              <Text style={styles.taglineText}>SAVVY FINANCE • {item.title.toUpperCase()}</Text>
            </View>
          </BlurView>
        </View>

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.desc}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.forest, COLORS.deepEmerald]}
        style={StyleSheet.absoluteFill}
      />
      
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        onIndexChanged={(index) => setActiveIndex(index)}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />

      {/* PERSISTENT CTA BUTTON */}
      <Animated.View 
        entering={FadeInUp.delay(1000).duration(800)}
        style={[styles.floatingCTAContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}
      >
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

      {/* DOT INDICATORS */}
      <View style={[styles.dotsContainer, { bottom: Math.max(insets.bottom, 24) + 80 }]}>
        {slides.map((_, i) => (
          <View 
            key={i} 
            style={[
              styles.dot, 
              { backgroundColor: i === activeIndex ? COLORS.neonEmerald : "rgba(255,255,255,0.2)" }
            ]} 
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.forest,
  },
  slide: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    paddingHorizontal: 24,
  },
  heroImageContainer: {
    width: "100%",
    height: SCREEN_HEIGHT * 0.4,
    borderRadius: 32,
    overflow: "hidden",
    backgroundColor: COLORS.deepEmerald,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  contentWrap: {
    alignItems: "center",
    marginTop: 32,
  },
  taglineContainer: {
    marginBottom: 20,
  },
  taglineBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(52, 211, 153, 0.2)",
  },
  taglineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  taglineText: {
    color: COLORS.brightMint,
    fontSize: 10,
    fontFamily: "Outfit_700Bold",
    letterSpacing: 1.5,
  },
  title: {
    color: COLORS.white,
    fontSize: 38,
    fontFamily: "Outfit_900Black",
    textAlign: "center",
    letterSpacing: -1,
    lineHeight: 44,
    marginBottom: 16,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 17,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  floatingCTAContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  ctaButtonContainer: {
    shadowColor: COLORS.neonEmerald,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  ctaButton: {
    backgroundColor: COLORS.neonEmerald,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 35,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minWidth: 240,
    justifyContent: "center",
  },
  ctaText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "Outfit_700Bold",
  },
  dotsContainer: {
    position: "absolute",
    flexDirection: "row",
    gap: 8,
    alignSelf: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
