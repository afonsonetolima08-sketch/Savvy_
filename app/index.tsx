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
  StatusBar,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { useT } from "@/hooks/useTranslations";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const FAST_SLIDE_DURATION = 2800; // Slightly slower for better readability of magnetic copy

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

  // CTA Glow Pulse Animation
  const glowOpacity = useSharedValue(0.4);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    glowOpacity.value = withRepeat(withTiming(0.8, { duration: 2000 }), -1, true);
    buttonScale.value = withRepeat(withTiming(1.04, { duration: 2000 }), -1, true);
  }, []);

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: buttonScale.value * 1.1 }],
  }));

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

  const slides = [
    { 
      id: "1", 
      title: t.introSlide1Title, 
      desc: t.introSlide1Desc,
      icon: "zap",
      image: require("@/assets/images/hero_financial.png")
    },
    { 
      id: "2", 
      title: t.introSlide2Title, 
      desc: t.introSlide2Desc,
      icon: "cpu",
      image: require("@/assets/images/hero_financial.png")
    },
    { 
      id: "3", 
      title: t.introSlide3Title, 
      desc: t.introSlide3Desc,
      icon: "shield",
      image: require("@/assets/images/hero_financial.png")
    },
    { 
      id: "4", 
      title: t.introSlide4Title, 
      desc: t.introSlide4Desc,
      icon: "bar-chart-2",
      image: require("@/assets/images/hero_financial.png")
    },
    { 
      id: "5", 
      title: t.introSlide5Title, 
      desc: t.introSlide5Desc,
      icon: "award",
      image: require("@/assets/images/hero_financial.png")
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

  const renderItem = ({ item }: { item: typeof slides[0] }) => (
    <View style={styles.slide}>
      <View style={styles.centerContent}>
        <Animated.View 
          entering={FadeInDown.springify().damping(15).delay(200)}
          style={styles.imageContainer}
        >
          <Image source={item.image} style={styles.image} resizeMode="cover" />
          <LinearGradient colors={["transparent", COLORS.forest]} style={styles.imageOverlay} />
        </Animated.View>

        <View style={styles.textStack}>
          <Animated.View 
            entering={FadeInUp.springify().damping(15).delay(400)}
            style={styles.badgeWrapper}
          >
            <BlurView intensity={40} tint="light" style={styles.glassBadge}>
              <Feather name={item.icon as any} size={14} color={COLORS.brightMint} />
              <Text style={styles.badgeText}>SAVVY PREMIUM • {item.title.split(" ")[0].toUpperCase()}</Text>
            </BlurView>
          </Animated.View>

          <Animated.Text 
            entering={FadeInUp.springify().damping(12).delay(600)}
            style={styles.heroTitle}
          >
            {item.title}
          </Animated.Text>
          
          <Animated.Text 
            entering={FadeInUp.springify().damping(15).delay(800)}
            style={styles.heroSubtitle}
          >
            {item.desc}
          </Animated.Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient 
        colors={[COLORS.forest, COLORS.deepEmerald, COLORS.forest]} 
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
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />

      {/* SENIOR UX OVERLAY */}
      <View style={[styles.uiOverlay, { bottom: Math.max(insets.bottom, 40) }]}>
         {/* DASH PROGRESS (Modern alternative to dots) */}
         <View style={styles.progressTracker}>
            {slides.map((_, i) => (
              <View 
                key={i} 
                style={[
                  styles.progressDash, 
                  { 
                    backgroundColor: activeIndex === i ? COLORS.neonEmerald : "rgba(255,255,255,0.15)",
                    width: activeIndex === i ? 32 : 12,
                    opacity: activeIndex === i ? 1 : 0.5
                  }
                ]} 
              />
            ))}
         </View>

         {/* GLOW SURFACE CTA */}
         <TouchableOpacity 
            onPress={handleStart} 
            activeOpacity={0.9}
            style={styles.ctaTouchTarget}
         >
            <Animated.View style={[styles.buttonGlow, animatedGlowStyle]} />
            <Animated.View style={[styles.ctaMainButton, animatedButtonStyle]}>
               <Text style={styles.ctaLabel}>{t.startNow}</Text>
               <Feather name="chevron-right" size={24} color={COLORS.white} />
            </Animated.View>
         </TouchableOpacity>
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
    justifyContent: "center",
  },
  centerContent: {
    alignItems: "center",
    paddingHorizontal: 28,
    transform: [{ translateY: -30 }],
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1.1,
    borderRadius: 45,
    overflow: "hidden",
    backgroundColor: COLORS.deepEmerald,
    marginBottom: 45,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.15)",
    // Layered Shadow for Depth
    shadowColor: COLORS.neonEmerald,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 12,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  textStack: {
    alignItems: "center",
    width: "100%",
  },
  badgeWrapper: {
    marginBottom: 28,
  },
  glassBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 35,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },
  badgeText: {
    color: COLORS.brightMint,
    fontSize: 11,
    fontFamily: "Outfit_700Bold",
    letterSpacing: 3,
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: 46,
    fontFamily: "Outfit_900Black",
    textAlign: "center",
    lineHeight: 54,
    letterSpacing: -2,
    marginBottom: 20,
    // Text Elevation
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  heroSubtitle: {
    color: COLORS.textMuted,
    fontSize: 19,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
    lineHeight: 30,
    paddingHorizontal: 12,
    opacity: 0.85,
  },
  uiOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    gap: 35,
  },
  progressTracker: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  progressDash: {
    height: 4,
    borderRadius: 2,
  },
  ctaTouchTarget: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  buttonGlow: {
    position: "absolute",
    width: 280,
    height: 70,
    backgroundColor: COLORS.neonEmerald,
    borderRadius: 40,
    filter: Platform.OS === "web" ? "blur(25px)" : undefined, // Blurred glow for web
  },
  ctaMainButton: {
    backgroundColor: COLORS.neonEmerald,
    width: "100%",
    maxWidth: 340,
    paddingVertical: 22,
    borderRadius: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    zIndex: 1,
    // Premium shadow
    shadowColor: COLORS.neonEmerald,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 15,
  },
  ctaLabel: {
    color: COLORS.white,
    fontSize: 21,
    fontFamily: "Outfit_700Bold",
    letterSpacing: -0.5,
  }
});
