import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { 
  FadeInDown, 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withSequence, 
  withTiming 
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { useCurrency } from "@/hooks/useCurrency";
import { useT } from "@/hooks/useTranslations";
import { getMonthlyStats } from "@/utils/finance";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function makeId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export default function AIScreen() {
  const colors = useColors();
  const t = useT();
  const insets = useSafeAreaInsets();
  const { profile, transactions, effectivePatrimony } = useApp();
  const { convert } = useCurrency();

  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", content: t.aiWelcome },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Animation values for "thinking" state
  const thinkingGlow = useSharedValue(0.4);
  
  useEffect(() => {
    if (isTyping) {
      thinkingGlow.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000 }),
          withTiming(0.4, { duration: 1000 })
        ),
        -1,
        true
      );
    } else {
      thinkingGlow.value = 0.4;
    }
  }, [isTyping]);

  const animatedThinkingStyle = useAnimatedStyle(() => ({
    opacity: thinkingGlow.value,
    transform: [{ scale: thinkingGlow.value * 0.1 + 0.95 }]
  }));

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 84 : insets.bottom + 60;

  const stats = getMonthlyStats(transactions);
  const savingsRate = stats.income > 0 ? ((stats.income - stats.expenses) / stats.income) * 100 : 0;

  const financialContext = {
    name: profile.name,
    language: profile.language,
    objective: profile.mainObjective,
    monthlyIncome: convert(profile.monthlyIncome),
    currency: profile.currency,
    balance: convert(stats.balance),
    income: convert(stats.income),
    expenses: convert(stats.expenses),
    patrimony: convert(effectivePatrimony),
    savingsRate,
  };

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setInput("");

      const userMsg: Message = { id: makeId(), role: "user", content: trimmed };
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      setTimeout(() => {
        const lower = trimmed.toLowerCase();
        let reply = "";
        
        if (lower.includes("poupar") || lower.includes("save") || lower.includes("poupança") || lower.includes("épargner") || lower.includes("ahorrar")) {
           reply = t.aiResponseSaving.replace("{rate}", financialContext.savingsRate.toFixed(1)).replace("{objective}", financialContext.objective || t.notDefined);
        } else if (lower.includes("gasto") || lower.includes("spend") || lower.includes("expense") || lower.includes("análise") || lower.includes("analisa") || lower.includes("dépense")) {
           reply = t.aiResponseSpending.replace("{currency}", financialContext.currency).replace("{expenses}", financialContext.expenses.toFixed(2)).replace("{income}", financialContext.income.toFixed(2)).replace("{balance}", financialContext.balance.toFixed(2));
        } else if (lower.includes("investir") || lower.includes("invest") || lower.includes("investimento")) {
           reply = financialContext.patrimony > 1000 ? t.aiResponseInvesting.replace("{currency}", financialContext.currency).replace("{patrimony}", financialContext.patrimony.toFixed(2)) : t.aiResponseInvestingStart;
        } else if (lower.includes("dívida") || lower.includes("debt") || lower.includes("reduzir") || lower.includes("devo") || lower.includes("dette")) {
           reply = t.aiResponseDebt;
        } else {
           const defaults = [
             t.aiResponseDefault1.replace("{currency}", financialContext.currency).replace("{balance}", financialContext.balance.toFixed(2)),
             t.aiResponseDefault2, t.aiResponseDefault3, t.aiResponseDefault4,
           ];
           reply = defaults[Math.floor(Math.random() * defaults.length)];
        }

        const assistantMsg: Message = { id: makeId(), role: "assistant", content: reply };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsTyping(false);
      }, 1800); 
    },
    [isTyping, financialContext]
  );

  const suggestions = [t.aiSuggestion1, t.aiSuggestion2, t.aiSuggestion3, t.aiSuggestion4];
  const showSuggestions = messages.length <= 1;

  const renderMessage = ({ item, index }: { item: Message, index: number }) => {
    const isUser = item.role === "user";
    return (
      <Animated.View 
        entering={FadeInDown.springify().delay(index * 100)}
        style={[styles.messageRow, isUser && styles.messageRowUser]}
      >
        <BlurView 
          intensity={Platform.OS === 'ios' ? 40 : 80} 
          tint={isUser ? "dark" : "light"} 
          style={[
            styles.bubble,
            isUser ? styles.bubbleUser : styles.bubbleAssistant,
            { 
              borderColor: isUser ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
              backgroundColor: isUser ? colors.primary : "rgba(255,255,255,0.8)" 
            }
          ]}
        >
          <Text style={[styles.bubbleText, { color: isUser ? "#fff" : "#1a1a1a" }]}>
            {item.content}
          </Text>
        </BlurView>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPadding + 12 }]}>
        <View style={styles.headerContent}>
          <View style={[styles.headerIcon, { backgroundColor: colors.primary + "15" }]}>
            <Feather name="cpu" size={20} color={colors.primary} />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>Savvy AI Agent</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>Proactive Intelligence</Text>
            </View>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            isTyping ? (
              <Animated.View style={styles.messageRow} entering={FadeInDown}>
                <Animated.View style={[styles.thinkingBubble, animatedThinkingStyle]}>
                  <BlurView intensity={30} tint="light" style={styles.bubble}>
                    <View style={styles.typingIndicator}>
                      <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                      <View style={[styles.dot, { backgroundColor: colors.primary, opacity: 0.6 }]} />
                      <View style={[styles.dot, { backgroundColor: colors.primary, opacity: 0.3 }]} />
                    </View>
                  </BlurView>
                </Animated.View>
              </Animated.View>
            ) : null
          }
        />

        {showSuggestions && (
          <View style={styles.suggestionsContainer}>
            <View style={styles.suggestionsRow}>
              {suggestions.map((s, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.suggestionChip}
                  onPress={() => sendMessage(s)}
                  activeOpacity={0.75}
                >
                  <BlurView intensity={30} tint="light" style={styles.chipGlass}>
                    <Text style={[styles.suggestionText, { color: colors.primary }]}>{s}</Text>
                  </BlurView>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={[styles.inputContainer, { paddingBottom: bottomPadding + 8 }]}>
          <BlurView intensity={60} tint="light" style={styles.inputBar}>
            <TextInput
              style={styles.textInput}
              value={input}
              onChangeText={setInput}
              placeholder={t.aiPlaceholder}
              placeholderTextColor={colors.mutedForeground}
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={() => sendMessage(input)}
            />
            <TouchableOpacity
              style={[styles.sendButton, { backgroundColor: input.trim() ? colors.primary : colors.border }]}
              onPress={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
            >
              <Feather name="arrow-up" size={20} color="#fff" />
            </TouchableOpacity>
          </BlurView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: { flex: 1 },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 1 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#10b981" },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
    gap: 16,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  messageRowUser: {
    justifyContent: "flex-end",
  },
  bubble: {
    maxWidth: "85%",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1,
    overflow: "hidden",
  },
  bubbleUser: {
    borderBottomRightRadius: 4,
    backgroundColor: "rgba(16, 185, 129, 0.5)",
  },
  bubbleAssistant: {
    borderBottomLeftRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  bubbleText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  thinkingBubble: {
    width: 85,
  },
  typingIndicator: {
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
    height: 20,
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
  suggestionsContainer: { paddingHorizontal: 16, marginBottom: 12 },
  suggestionsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  suggestionChip: { borderRadius: 20, overflow: "hidden" },
  chipGlass: { paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" },
  suggestionText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  inputContainer: { paddingHorizontal: 16, paddingTop: 10 },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    paddingLeft: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    maxHeight: 100,
    outlineStyle: "none" as any,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
});
