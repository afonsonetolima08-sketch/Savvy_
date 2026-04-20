import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
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
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { useT } from "@/hooks/useTranslations";

export default function WelcomeScreen() {
  const [containerWidth, setContainerWidth] = useState(0);
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const app = useApp();
  const t = useT();
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // We need to know which slide is currently active to show the right button
  const [activeIndex, setActiveIndex] = useState(0);

  if (!app) return null;
  const { session, profile } = app;

  const slides = [
    {
      id: "1",
      title: t.introSlide1Title,
      description: t.introSlide1Desc,
      icon: "shield",
      color: colors.primary,
    },
    {
      id: "2",
      title: t.introSlide2Title,
      description: t.introSlide2Desc,
      icon: "trending-down",
      color: "#ef4444",
    },
    {
      id: "3",
      title: t.introSlide3Title,
      description: t.introSlide3Desc,
      icon: "trending-up",
      color: "#10b981",
    },
    {
      id: "4",
      title: t.introSlide4Title,
      description: t.introSlide4Desc,
      icon: "pie-chart",
      color: "#3b82f6",
    },
    {
      id: "5",
      title: t.introSlide5Title,
      description: t.introSlide5Desc,
      icon: "zap",
      color: "#f59e0b",
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

  const goNext = () => {
    if (activeIndex < slides.length - 1) {
      flatListRef.current?.scrollToOffset({ offset: (activeIndex + 1) * containerWidth, animated: true });
    } else {
      handleStart();
    }
  };

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const inputRange = [(index - 1) * containerWidth, index * containerWidth, (index + 1) * containerWidth];

    const slideY = scrollX.interpolate({
      inputRange,
      outputRange: [50, 0, 50],
      extrapolate: "clamp",
    });

    const slideOpacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: "clamp",
    });

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: "clamp",
    });

    return (
      <View style={[styles.slide, { width: containerWidth }]}>
        <Animated.View
          style={[
            styles.slideContent,
            {
              opacity: slideOpacity,
              transform: [{ translateY: slideY }],
            },
          ]}
        >
          <Animated.View style={[styles.iconContainer, { backgroundColor: item.color + "15", transform: [{ scale }] }]}>
            <Feather name={item.icon as any} size={48} color={item.color} />
          </Animated.View>
          <Text style={[styles.title, { color: colors.foreground }]}>{item.title}</Text>
          <Text style={[styles.description, { color: colors.mutedForeground }]}>
            {item.description}
          </Text>
        </Animated.View>
      </View>
    );
  };

  return (
    <View 
      style={[styles.container, { backgroundColor: colors.background }]}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <LinearGradient colors={[colors.primary + "10", colors.background]} style={StyleSheet.absoluteFill} />

      {/* Header with Skip Button */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 20 }]}>
        {activeIndex < slides.length - 1 ? (
          <TouchableOpacity onPress={handleStart} style={styles.skipBtn}>
            <Text style={[styles.skipText, { color: colors.mutedForeground }]}>{t.skip}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.skipBtn} />
        )}
      </View>

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
            useNativeDriver: true,
          })}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
          scrollEventThrottle={16}
        />
      ) : (
        <View style={{ flex: 1 }} />
      )}

      {/* Footer Area with Dots and Button */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) + 40 }]}>
        <View style={styles.pagination}>
          {slides.map((_, idx) => {
            const inputRange = [(idx - 1) * containerWidth, idx * containerWidth, (idx + 1) * containerWidth];

            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: "clamp",
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: "clamp",
            });

            const backgroundColor = scrollX.interpolate({
              inputRange,
              outputRange: [colors.mutedForeground, colors.primary, colors.mutedForeground],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={idx}
                style={[
                  styles.dot,
                  { width: dotWidth, opacity, backgroundColor },
                ]}
              />
            );
          })}
        </View>

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={goNext} activeOpacity={0.85}>
          <Text style={styles.buttonText}>
            {activeIndex === slides.length - 1 ? t.startNow : t.next}
          </Text>
          <Feather name={activeIndex === slides.length - 1 ? "arrow-right" : "chevron-right"} size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "flex-end",
    zIndex: 10,
  },
  skipBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipText: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  slideContent: {
    alignItems: "center",
    maxWidth: 320,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 32,
    alignItems: "center",
    gap: 32,
    marginTop: "auto",
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  button: {
    width: "100%",
    height: Platform.OS === "web" ? 64 : 60,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 15,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
  },
});
