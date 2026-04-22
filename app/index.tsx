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
  interpolate,
  Extrapolate,
  interpolateColor,
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
  const scrollX = useSharedValue(0);

  // Animation for the button
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    buttonScale.value = withRepeat(withTiming(1.06, { duration: 1500 }), -1, true);
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

  const slides = [
    { 
      id: "1", 
      title: t.introSlide1Title, 
      desc: t.introSlide1Desc,
      icon: "zap",
      color: "#10b981",
      image: require("@/assets/images/hero_financial.png")
    },
    { 
      id: "2", 
      title: t.introSlide2Title, 
      desc: t.introSlide2Desc,
      icon: "cpu",
      color: "#34d399",
      image: require("@/assets/images/hero_financial.png")
    },
    { 
      id: "3", 
      title: t.introSlide3Title, 
      desc: t.introSlide3Desc,
      icon: "shield",
      color: "#059669",
      image: require("@/assets/images/hero_financial.png")
    },
    { 
      id: "4", 
      title: t.introSlide4Title, 
      desc: t.introSlide4Desc,
      icon: "bar-chart-2",
      color: "#10b981",
      image: require("@/assets/images/hero_financial.png")
    },
    { 
      id: "5", 
      title: t.introSlide5Title, 
      desc: t.introSlide5Desc,
      icon: "globe",
      color: "#34d399",
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

  const onScroll = (event: any) => {
    scrollX.value = event.nativeEvent.contentOffset.x;
  };

  const renderItem = ({ item, index }: { item: typeof slides[0], index: number }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.slideContent}>
           <Animated.View 
              entering={FadeInDown.delay(200).duration(1000)}
              style={styles.imageWrap}
            >
              <Image source={item.image} style={styles.image} resizeMode="cover" />
              <LinearGradient colors={["transparent", COLORS.forest]} style={styles.overlay} />
           </Animated.View>

           <View style={styles.textWrap}>
              <Animated.View 
                entering={FadeInUp.delay(400).duration(800)}
                style={styles.badgeContainer}
              >
                <BlurView intensity={25} tint="light" style={styles.badge}>
                    <Feather name={item.icon as any} size={14} color={COLORS.brightMint} />
                    <Text style={styles.badgeText}>SAVVY • {item.title.split(" ")[0].toUpperCase()}</Text>
                </BlurView>
              </Animated.View>

              <Animated.Text entering={FadeInUp.delay(600).duration(1000)} style={styles.title}>
                {item.title}
              </Animated.Text>
              
              <Animated.Text entering={FadeInUp.delay(800).duration(1000)} style={styles.subtitle}>
                {item.desc}
              </Animated.Text>
           </View>
        </View>
      </View>
    );
  };

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
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setActiveIndex(index);
        }}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />

      <View style={[styles.staticOverlay, { bottom: Math.max(insets.bottom, 40) }]}>
         <View style={styles.dotsRow}>
            {slides.map((_, i) => (
              <View 
                key={i} 
                style={[
                  styles.dot, 
                  { 
                    backgroundColor: activeIndex === i ? COLORS.neonEmerald : "rgba(255,255,255,0.2)",
                    width: activeIndex === i ? 24 : 8 
                  }
                ]} 
              />
            ))}
         </View>

         <TouchableOpacity 
            onPress={handleStart} 
            activeOpacity={0.8}
            style={styles.ctaWrapper}
         >
            <Animated.View style={[styles.ctaButton, animatedButtonStyle]}>
               <Text style={styles.ctaText}>{t.startNow}</Text>
               <Feather name="arrow-right" size={22} color={COLORS.white} />
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
  },
  slideContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  imageWrap: {
    width: "100%",
    height: SCREEN_HEIGHT * 0.42,
    borderRadius: 40,
    backgroundColor: COLORS.deepEmerald,
    overflow: "hidden",
    marginBottom: 40,
    marginTop: -20,
    shadowColor: COLORS.neonEmerald,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  textWrap: {
    alignItems: "center",
    width: "100%",
  },
  badgeContainer: {
    marginBottom: 24,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  badgeText: {
    color: COLORS.brightMint,
    fontSize: 11,
    fontFamily: "Outfit_700Bold",
    letterSpacing: 2.5,
  },
  title: {
    color: COLORS.white,
    fontSize: 44,
    fontFamily: "Outfit_900Black",
    textAlign: "center",
    lineHeight: 52,
    letterSpacing: -1.5,
    marginBottom: 20,
    textShadowColor: "rgba(16, 185, 129, 0.4)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 15,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 19,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 28,
    paddingHorizontal: 15,
    opacity: 0.95,
  },
  staticOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    gap: 32,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  dot: {
    height: 8,
    borderRadius: 4,
    transition: "all 0.3s ease",
  },
  ctaWrapper: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  ctaButton: {
    backgroundColor: COLORS.neonEmerald,
    width: "100%",
    maxWidth: 320,
    paddingVertical: 22,
    borderRadius: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    shadowColor: COLORS.neonEmerald,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  ctaText: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: "Outfit_700Bold",
  }
});
