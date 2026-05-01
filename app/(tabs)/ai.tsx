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
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming,
  withSequence,
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
  role: "user" | "assistant" | "system";
  content: string;
  isTyping?: boolean;
}

function makeId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

const SYSTEM_PROMPT = `És o Savvy AI, um assistente financeiro de elite. 
Utilizador atual: {name}. Balanço: {balance}. Ganhos: {income}. Gastos: {expenses}. Património: {patrimony}. Objetivo: {objective}.`;

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

  useEffect(() => {
    setMessages(prev => {
       if (prev.length === 1 && prev[0].id === "welcome") {
         return [{ id: "welcome", role: "assistant", content: t.aiWelcome }];
       }
       return prev;
    });
  }, [t.aiWelcome]);

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
  const financialContext = {
    name: profile.name,
    balance: convert(stats.balance),
    income: convert(stats.income),
    expenses: convert(stats.expenses),
    patrimony: convert(effectivePatrimony),
    objective: profile.mainObjective,
  };

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const callAIAgent = async (userMessage: string, history: Message[]) => {
    const API_KEY = process.env.EXPO_PUBLIC_AI_API_KEY;
    if (API_KEY && API_KEY !== "REPLACE_WITH_YOUR_OPENAI_KEY") {
      try {
        const fullSystemPrompt = SYSTEM_PROMPT
          .replace("{name}", financialContext.name)
          .replace("{balance}", financialContext.balance.toString())
          .replace("{income}", financialContext.income.toString())
          .replace("{expenses}", financialContext.expenses.toString())
          .replace("{patrimony}", financialContext.patrimony.toString())
          .replace("{objective}", financialContext.objective);

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: fullSystemPrompt },
              ...history.slice(-10).map(m => ({ role: m.role, content: m.content })),
              { role: "user", content: userMessage }
            ],
            temperature: 0.7,
          }),
        });
        const data = await response.json();
        if (data.choices && data.choices[0]) return data.choices[0].message.content;
      } catch (error) { console.error(error); }
    }
    return `Olá ${profile.name?.split(" ")[0] || "amigo"}! Analisei os teus gastos e o teu saldo atual é de **${formatCurrency(financialContext.balance, currency, true)}**. Como posso ajudar?`;
  };

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isThinking) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setInput("");
      const userMsg: Message = { id: makeId(), role: "user", content: trimmed };
      const currentHistory = [...messages];
      setMessages((prev) => [...prev, userMsg]);
      setIsThinking(true);
      setTimeout(async () => {
        const reply = await callAIAgent(trimmed, currentHistory);
        const assistantMsg: Message = { id: makeId(), role: "assistant", content: reply, isTyping: true };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsThinking(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 1000); 
    },
    [isThinking, messages, financialContext, currency]
  );

  const resetChat = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setMessages([{ id: "welcome", role: "assistant", content: t.aiWelcome }]);
  };

  const renderMessage = ({ item, index }: { item: Message, index: number }) => {
    const isUser = item.role === "user";
    return (
      <Animated.View entering={FadeInDown.springify().delay(index * 50)} style={[styles.messageRow, isUser && styles.messageRowUser]}>
        <View style={[styles.bubble, isUser ? [styles.bubbleUser, { backgroundColor: colors.primary }] : [styles.bubbleAssistant, { backgroundColor: colors.card, borderColor: colors.border }]]}>
          {isUser ? <Text style={styles.bubbleTextUser}>{item.content}</Text> : <TypewriterText content={item.content} colors={colors} onComplete={scrollToBottom} />}
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.dark ? "light-content" : "dark-content"} />
      
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={[styles.headerBox, { borderBottomColor: colors.border }]}>
          <BrandLogo style={styles.headerLogo} />
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={resetChat} style={styles.actionBtn}>
               <Feather name="refresh-cw" size={18} color={colors.mutedForeground} />
            </TouchableOpacity>
            <View style={styles.statusContainer}>
              <Animated.View style={[styles.statusGlow, { backgroundColor: colors.primary }, animatedHeaderGlow]} />
              <View style={[styles.statusDot, { backgroundColor: isThinking ? colors.primary : "#10b981" }]} />
              <Text style={[styles.statusText, { color: colors.mutedForeground }]}>{isThinking ? "A ANALISAR..." : "SAVVY GPT"}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* CONTENT AREA */}
      <View style={{ flex: 1 }}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={isThinking ? (
            <View style={styles.messageRow}>
              <View style={[styles.thinkingBubble, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <TypingIndicator color={colors.primary} />
              </View>
            </View>
          ) : null}
        />
      </View>

      {/* INPUT AREA (Pushed up to clear the tab bar) */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={styles.bottomArea}
      >
        <View style={[styles.bottomContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.inputBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TextInput
              style={[styles.textInput, { color: colors.foreground }]}
              value={input}
              onChangeText={setInput}
              placeholder={t.aiPlaceholder}
              placeholderTextColor={colors.mutedForeground}
              multiline
              maxLength={1000}
            />
            <TouchableOpacity
              style={[styles.sendButton, { backgroundColor: input.trim() ? colors.primary : colors.border }]}
              onPress={() => sendMessage(input)}
              disabled={!input.trim() || isThinking}
            >
              <Feather name="arrow-up" size={18} color="#fff" />
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
    setDisplayed("");
    index.current = 0;
    if (!content) return;
    const timer = setInterval(() => {
      if (index.current < content.length) {
        const char = content[index.current];
        if (char !== undefined) setDisplayed(p => p + char);
        index.current += 1;
        if (index.current % 10 === 0) onComplete();
      } else { clearInterval(timer); onComplete(); }
    }, 8);
    return () => clearInterval(timer);
  }, [content]);
  const renderFormattedText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part && part.startsWith("**") && part.endsWith("**")) return <Text key={i} style={[styles.boldText, { color: colors.foreground }]}>{part.slice(2, -2)}</Text>;
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
  return (
    <View style={styles.typingContainer}>
      <Animated.View style={[styles.dot, { backgroundColor: color }, useAnimatedStyle(() => ({ opacity: dot1.value, transform: [{ scale: dot1.value }] } ))]} />
      <Animated.View style={[styles.dot, { backgroundColor: color }, useAnimatedStyle(() => ({ opacity: dot2.value, transform: [{ scale: dot2.value }] } ))]} />
      <Animated.View style={[styles.dot, { backgroundColor: color }, useAnimatedStyle(() => ({ opacity: dot3.value, transform: [{ scale: dot3.value }] } ))]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, zIndex: 100 },
  headerBox: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12, borderBottomWidth: 1 },
  headerLogo: { width: 100, height: 30 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 16 },
  actionBtn: { padding: 4 },
  statusContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  statusGlow: { position: "absolute", width: 20, height: 20, borderRadius: 10, left: -6, opacity: 0.3 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 10, fontFamily: "Outfit_700Bold", letterSpacing: 1 },
  messagesList: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 20 },
  messageRow: { flexDirection: "row", marginBottom: 12 },
  messageRowUser: { justifyContent: "flex-end" },
  bubble: { maxWidth: "85%", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24 },
  bubbleUser: { borderBottomRightRadius: 4 },
  bubbleAssistant: { borderBottomLeftRadius: 4, borderWidth: 1 },
  bubbleTextUser: { color: "#fff", fontSize: 16, fontFamily: "Inter_500Medium", lineHeight: 24 },
  bubbleTextAssistant: { fontSize: 16, fontFamily: "Inter_400Regular", lineHeight: 24 },
  boldText: { fontFamily: "Inter_700Bold" },
  thinkingBubble: { padding: 15, borderRadius: 20, width: 80, alignItems: "center", borderWidth: 1 },
  typingContainer: { flexDirection: "row", gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  bottomArea: { marginBottom: 80 }, // Account for the tab bar height
  bottomContainer: { width: "100%", paddingHorizontal: 16, paddingTop: 10 },
  inputBar: { flexDirection: "row", alignItems: "center", padding: 6, paddingLeft: 20, borderRadius: 32, borderWidth: 1, minHeight: 52 },
  textInput: { flex: 1, fontSize: 16, fontFamily: "Inter_400Regular", maxHeight: 120, paddingVertical: 10 },
  sendButton: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", marginLeft: 8 },
});
