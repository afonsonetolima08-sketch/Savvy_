import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { useT } from "@/hooks/useTranslations";

const SLIDE_DURATION = 4000;

const COLORS = {
  bg1: "#0f172a", // slate 900
  bg2: "#31121d", // deep pink/rose
  bg3: "#06221c", // deep emerald
  bg4: "#0f142e", // deep blue/indigo
  bg5: "#281504", // deep amber/orange
  accent1: "#38bdf8", // light blue
  accent2: "#f43f5e", // rose
  accent3: "#10b981", // emerald
  accent4: "#6366f1", // indigo
  accent5: "#f59e0b", // amber
};

export default function WelcomeScreen() {
  const [containerWidth, setContainerWidth] = useState(0);
  const insets = useSafeAreaInsets();
  const app = useApp();
  const t = useT();

  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const [activeIndex, setActiveIndex] = useState(0);
  const manualSwipeActive = useRef(false);

  if (!app) return null;
  const { session, profile } = app;

  const slides = [
    {
      id: "1",
      title: t.introSlide1Title,
      description: t.introSlide1Desc,
      icon: "shield",
      bgColor: COLORS.bg1,
      accentColor: COLORS.accent1,
    },
    {
      id: "2",
      title: t.introSlide2Title,
      description: t.introSlide2Desc,
      icon: "trending-down",
      bgColor: COLORS.bg2,
      accentColor: COLORS.accent2,
    },
    {
      id: "3",
      title: t.introSlide3Title,
      description: t.introSlide3Desc,
      icon: "trending-up",
      bgColor: COLORS.bg3,
      accentColor: COLORS.accent3,
    },
    {
      id: "4",
      title: t.introSlide4Title,
      description: t.introSlide4Desc,
      icon: "pie-chart",
      bgColor: COLORS.bg4,
      accentColor: COLORS.accent4,
    },
    {
      id: "5",
      title: t.introSlide5Title,
      description: t.introSlide5Desc,
      icon: "zap",
      bgColor: COLORS.bg5,
      accentColor: COLORS.accent5,
    },
  ];

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

  // Run the story progress bar animation
  useEffect(() => {
    if (containerWidth === 0) return;

    progressAnim.setValue(0);
    
    // Stop auto-advancing on the last slide
    if (activeIndex === slides.length - 1) {
      progressAnim.setValue(1);
      return;
    }

    const anim = Animated.timing(progressAnim, {
      toValue: 1,
      duration: SLIDE_DURATION,
      useNativeDriver: false,
    });

    anim.start(({ finished }) => {
      // If animation completed fully (wasn't interrupted by swipe)
      if (finished && activeIndex < slides.length - 1) {
        const nextIndex = activeIndex + 1;
        flatListRef.current?.scrollToOffset({ offset: nextIndex * containerWidth, animated: true });
        setActiveIndex(nextIndex);
      }
    });

    return () => anim.stop();
  }, [activeIndex, containerWidth, progressAnim]);

  // Read manual scroll to update index gracefully
  const handleMomentumScrollEnd = (e: any) => {
    manualSwipeActive.current = false;
    if (containerWidth > 0) {
      const offsetX = e.nativeEvent.contentOffset.x;
      const newIndex = Math.round(offsetX / containerWidth);
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    }
  };

  const handleScrollBeginDrag = () => {
    progressAnim.stopAnimation();
    manualSwipeActive.current = true;
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const inputRange = [(index - 1) * containerWidth, index * containerWidth, (index + 1) * containerWidth];

    // Extreme, dynamic transitions!
    const slideY = scrollX.interpolate({
      inputRange,
      outputRange: [150, 0, -150],
      extrapolate: "clamp",
    });

    const slideX = scrollX.interpolate({
      inputRange,
      outputRange: [100, 0, -100],
      extrapolate: "clamp",
    });

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.3, 1, 0.3],
      extrapolate: "clamp",
    });

    const rotate = scrollX.interpolate({
      inputRange,
      outputRange: ["-45deg", "0deg", "45deg"],
      extrapolate: "clamp",
    });
    
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [-0.5, 1, -0.5],
      extrapolate: "clamp",
    });

    return (
      <View style={[styles.slide, { width: containerWidth }]}>
        <Animated.View
          style={[
            styles.slideContent,
            {
              opacity,
              transform: [{ translateY: slideY }, { translateX: slideX }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.iconContainer,
              {
                backgroundColor: item.accentColor + "20",
                borderColor: item.accentColor + "50",
                transform: [{ scale }, { rotate }],
                shadowColor: item.accentColor,
              },
            ]}
          >
            <Feather name={item.icon as any} size={70} color={item.accentColor} />
            
            {/* Absolute positioning of intense glow */}
            <View style={[styles.glow, { backgroundColor: item.accentColor }]} />
          </Animated.View>

          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </Animated.View>
      </View>
    );
  };

  // Determine dynamic background color based on scroll position
  let backgroundStyle;
  if (containerWidth > 0) {
    const bgInputRange = slides.map((_, i) => i * containerWidth);
    const bgOutputRange = slides.map((s) => s.bgColor);
    const animatedBgColor = scrollX.interpolate({
      inputRange: bgInputRange,
      outputRange: bgOutputRange,
      extrapolate: "clamp",
    });
    backgroundStyle = { backgroundColor: animatedBgColor };
  } else {
    backgroundStyle = { backgroundColor: slides[0].bgColor };
  }

  return (
    <Animated.View
      style={[styles.container, backgroundStyle]}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {/* Top Story Progress Bars */}
      <View style={[styles.storyBarContainer, { paddingTop: Math.max(insets.top, 20) + 10 }]}>
        {slides.map((_, idx) => {
          let barWidth = "0%";
          if (idx < activeIndex) barWidth = "100%";
          return (
            <View key={idx} style={styles.storyBarBG}>
              {idx === activeIndex ? (
                <Animated.View
                  style={[
                    styles.storyBarFill,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0%", "100%"],
                      }),
                    },
                  ]}
                />
              ) : (
                <View style={[styles.storyBarFill, { width: barWidth as any }]} />
              )}
            </View>
          );
        })}
      </View>

      {/* Skip Button */}
      {activeIndex < slides.length - 1 && (
        <TouchableOpacity
          onPress={handleStart}
          style={[styles.skipBtn, { top: Math.max(insets.top, 20) + 30 }]}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>{t.skip}</Text>
          <Feather name="chevron-right" size={16} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
      )}

      {containerWidth > 0 ? (
        <Animated.FlatList
          ref={flatListRef}
          data={slides}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false, // background interpolation doesn't support native driver always
          })}
          onScrollBeginDrag={handleScrollBeginDrag}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
        />
      ) : (
        <View style={{ flex: 1 }} />
      )}

      {/* Footer Area with Start Action */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) + 40 }]}>
        {activeIndex === slides.length - 1 ? (
          <TouchableOpacity
            style={[styles.startBtn, { backgroundColor: slides[4].accentColor }]}
            onPress={handleStart}
            activeOpacity={0.85}
          >
            <Text style={styles.startBtnText}>{t.startNow}</Text>
            <Feather name="zap" size={24} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholderBtn} />
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  storyBarContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 6,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  storyBarBG: {
    flex: 1,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 2,
    overflow: "hidden",
  },
  storyBarFill: {
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 2,
  },
  skipBtn: {
    position: "absolute",
    right: 20,
    zIndex: 20,
    paddingVertical: 8,
    paddingTop: 14,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  skipText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "rgba(255,255,255,0.6)",
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  slideContent: {
    alignItems: "center",
    maxWidth: 360,
  },
  iconContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.6,
    shadowRadius: 40,
    elevation: 20,
  },
  glow: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    opacity: 0.15,
    filter: "blur(20px)" as any, // Works on web to create an intense outer glow
  },
  title: {
    fontSize: 40,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    color: "#fff",
    marginBottom: 20,
    letterSpacing: -1,
    lineHeight: 46,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  description: {
    fontSize: 18,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    color: "rgba(255,255,255,0.75)",
    lineHeight: 28,
  },
  footer: {
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
    height: Platform.OS === "web" ? 100 : 90,
  },
  startBtn: {
    width: "100%",
    height: Platform.OS === "web" ? 68 : 64,
    borderRadius: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  startBtnText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  placeholderBtn: {
    height: 64, // Keeps space occupied so layout doesn't jump
  },
});
