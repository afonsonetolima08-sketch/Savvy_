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
  StatusBar,
} from "react-native";
import Animated, { 
  FadeInDown, 
  FadeInRight,
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withSequence, 
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { useCurrency } from "@/hooks/useCurrency";
import { useT } from "@/hooks/useTranslations";
import { getMonthlyStats, getCategoryBreakdown, getMonthTransactions, formatCurrency } from "@/utils/finance";
import { BrandLogo } from "@/components/BrandLogo";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
}

function makeId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export default function AIScreen() {
  const colors = useColors();
  const t = useT();
  const insets = useSafeAreaInsets();
  const { profile, transactions, effectivePatrimony } = useApp();
  const { convert, currency } = useCurrency();

  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", content: t.aiWelcome },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Status Animation
  const headerGlow = useSharedValue(0);

  useEffect(() => {
    if (isThinking) {
      headerGlow.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
    } else {
      headerGlow.value = withTiming(0);
    }
  }, [isThinking]);

  const animatedHeaderGlow = useAnimatedStyle(() => ({ opacity: headerGlow.value }));

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
    transactions,
  };

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const generateSmartResponse = (userInput: string): string => {
    const text = userInput.toLowerCase();
    const firstName = profile.name?.split(" ")[0] || "";

    if (text.includes("gasto") || text.includes("spend") || text.includes("expense") || text.includes("analisa")) {
      const monthTxs = getMonthTransactions(transactions).filter(tx => tx.type === "expense");
      const breakdown = getCategoryBreakdown(monthTxs);
      const topCategoryEntry = Object.entries(breakdown).sort((a, b) => b[1] - a[1])[0];

      if (topCategoryEntry) {
        const [cat, amount] = topCategoryEntry;
        const catName = t[`cat${cat.charAt(0).toUpperCase() + cat.slice(1)}` as keyof typeof t] || cat;
        const percent = ((amount / financialContext.income) * 100).toFixed(0);
        return `${firstName ? firstName + ", a" : "A"} minha análise indica que este mês gastaste **${formatCurrency(amount, currency, true)}** em **${catName}**, o que representa **${percent}%** do teu rendimento mensal. \n\nSugiro que definas um limite de **${formatCurrency(amount * 0.8, currency, true)}** para esta categoria no próximo mês.`;
      }
      return `Ainda não tenho dados suficientes sobre os teus gastos deste mês para uma análise profunda.`;
    }

    if (text.includes("poupar") || text.includes("save") || text.includes("poupança")) {
      const currentRate = financialContext.savingsRate;
      return `Atualmente, a tua taxa de poupança é de **${currentRate.toFixed(1)}%**. \n\nUma estratégia de elite? Aplica a regra **50/30/20**: 50% para necessidades, 30% para desejos e 20% diretamente para o teu futuro.`;
    }

    if (text.includes("investir") || text.includes("invest") || text.includes("investimento")) {
      if (financialContext.patrimony < financialContext.expenses * 3) {
        return `Antes de investires, recomendo que solidifiques o teu **Fundo de Emergência**. O ideal é teres **${formatCurrency(financialContext.expenses * 6, currency, true)}** líquidos antes de entrares no mercado.`;
      }
      return `Com um património de **${formatCurrency(financialContext.patrimony, currency, true)}**, estás numa posição sólida. Sugiro alocar uma parte em ETFs globais para diversificação automática.`;
    }

    const agentDefaults = [
      `Analisei o teu resumo financeiro e o teu saldo atual é de **${formatCurrency(financialContext.balance, currency, true)}**. Como posso ajudar-te hoje?`,
      `Estou a monitorizar as tuas transações. Queres que analise alguma categoria específica?`,
    ];
    return agentDefaults[Math.floor(Math.random() * agentDefaults.length)];
  };

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isThinking) return;

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setInput("");

      const userMsg: Message = { id: makeId(), role: "user", content: trimmed };
      setMessages((prev) => [...prev, userMsg]);
      setIsThinking(true);

      setTimeout(() => {
        const reply = generateSmartResponse(trimmed);
        const assistantMsg: Message = { id: makeId(), role: "assistant", content: reply, isTyping: true };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsThinking(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 1000); 
    },
    [isThinking, financialContext, t, currency]
  );

  const suggestions = [t.aiSuggestion1, t.aiSuggestion2, t.aiSuggestion3, t.aiSuggestion4];

  const renderMessage = ({ item, index }: { item: Message, index: number }) => {
    const isUser = item.role === "user";
    return (
      <Animated.View 
        entering={FadeInDown.springify().delay(index * 50)}
        style={[styles.messageRow, isUser && styles.messageRowUser]}
      >
        <View 
          style={[
            styles.bubble,
            isUser ? [styles.bubbleUser, { backgroundColor: colors.primary }] : [styles.bubbleAssistant, { backgroundColor: colors.card, borderColor: colors.border }]
          ]}
        >
          {isUser ? (
            <Text style={styles.bubbleTextUser}>{item.content}</Text>
          ) : (
            <TypewriterText content={item.content} colors={colors} onComplete={scrollToBottom} />
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.dark ? "light-content" : "dark-content"} />
      
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={[styles.headerBox, { borderBottomColor: colors.border }]}>
          <BrandLogo style={styles.headerLogo} />
          <View style={styles.statusContainer}>
            <Animated.View style={[styles.statusGlow, { backgroundColor: colors.primary }, animatedHeaderGlow]} />
            <View style={[styles.statusDot, { backgroundColor: isThinking ? colors.primary : "#10b981" }]} />
            <Text style={[styles.statusText, { color: colors.mutedForeground }]}>
              {isThinking ? "A ANALISAR..." : "SISTEMA ATIVO"}
            </Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={[styles.messagesList, { paddingBottom: 100 }]}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            isThinking ? (
              <Animated.View style={styles.messageRow} entering={FadeInDown}>
                <View style={[styles.thinkingBubble, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <TypingIndicator color={colors.primary} />
                </View>
              </Animated.View>
            ) : null
          }
        />

        <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 10 }]}>
          {messages.length < 3 && (
            <View style={styles.suggestionsScroll}>
              {suggestions.map((s, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.suggestionChip, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => sendMessage(s)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.suggestionText, { color: colors.primary }]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={[styles.inputBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TextInput
              style={[styles.textInput, { color: colors.foreground }]}
              value={input}
              onChangeText={setInput}
              placeholder={t.aiPlaceholder}
              placeholderTextColor={colors.mutedForeground}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, { backgroundColor: input.trim() ? colors.primary : colors.border }]}
              onPress={() => sendMessage(input)}
              disabled={!input.trim() || isThinking}
            >
              <Feather name="zap" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function TypewriterText({ content, colors, onComplete }: { content: string, colors: any, onComplete: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const index = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (index.current < content.length) {
        setDisplayed((prev) => prev + content[index.current]);
        index.current += 1;
        if (index.current % 5 === 0) onComplete();
      } else {
        clearInterval(timer);
        onComplete();
      }
    }, 10);
    return () => clearInterval(timer);
  }, [content]);

  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <Text key={i} style={[styles.boldText, { color: colors.foreground }]}>
            {part.slice(2, -2)}
          </Text>
        );
      }
      return part;
    });
  };

  return <Text style={[styles.bubbleTextAssistant, { color: colors.mutedForeground }]}>{renderFormattedText(displayed)}</Text>;
}

function TypingIndicator({ color }: { color: string }) {
  const dot1 = useSharedValue(0.4);
  const dot2 = useSharedValue(0.4);
  const dot3 = useSharedValue(0.4);

  useEffect(() => {
    dot1.value = withRepeat(withSequence(withTiming(1, { duration: 400 }), withTiming(0.4, { duration: 400 })), -1);
    dot2.value = withDelay(200, withRepeat(withSequence(withTiming(1, { duration: 400 }), withTiming(0.4, { duration: 400 })), -1));
    dot3.value = withDelay(400, withRepeat(withSequence(withTiming(1, { duration: 400 }), withTiming(0.4, { duration: 400 })), -1));
  }, []);

  const s1 = useAnimatedStyle(() => ({ opacity: dot1.value, transform: [{ scale: dot1.value }] }));
  const s2 = useAnimatedStyle(() => ({ opacity: dot2.value, transform: [{ scale: dot2.value }] }));
  const s3 = useAnimatedStyle(() => ({ opacity: dot3.value, transform: [{ scale: dot3.value }] }));

  return (
    <View style={styles.typingContainer}>
      <Animated.View style={[styles.dot, { backgroundColor: color }, s1]} />
      <Animated.View style={[styles.dot, { backgroundColor: color }, s2]} />
      <Animated.View style={[styles.dot, { backgroundColor: color }, s3]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, zIndex: 100 },
  headerBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  headerLogo: { width: 100, height: 30 },
  statusContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  statusGlow: { 
    position: "absolute", 
    width: 20, height: 20, 
    borderRadius: 10, 
    left: -6, 
    opacity: 0.3,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 10, fontFamily: "Outfit_700Bold", letterSpacing: 1 },
  messagesList: { paddingHorizontal: 16, paddingTop: 20, gap: 16 },
  messageRow: { flexDirection: "row", marginBottom: 4 },
  messageRowUser: { justifyContent: "flex-end" },
  bubble: {
    maxWidth: "85%",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 24,
  },
  bubbleUser: {
    borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  bubbleTextUser: { color: "#fff", fontSize: 16, fontFamily: "Inter_500Medium", lineHeight: 24 },
  bubbleTextAssistant: { fontSize: 16, fontFamily: "Inter_400Regular", lineHeight: 24 },
  boldText: { fontFamily: "Inter_700Bold" },
  thinkingBubble: { padding: 15, borderRadius: 20, width: 80, alignItems: "center", borderWidth: 1 },
  typingContainer: { flexDirection: "row", gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  bottomSection: { position: "absolute", bottom: 0, width: "100%", paddingHorizontal: 16 },
  suggestionsScroll: { flexDirection: "row", gap: 10, marginBottom: 15 },
  suggestionChip: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1 },
  suggestionText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
    paddingLeft: 20,
    borderRadius: 32,
    borderWidth: 1,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    maxHeight: 120,
    paddingVertical: 10,
  },
  sendButton: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", marginLeft: 8 },
});
