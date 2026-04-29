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
  Dimensions,
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
}

function makeId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

const COLORS = {
  forest: "#01241c",
  deepEmerald: "#064e3b",
  neonEmerald: "#10b981",
  brightMint: "#34d399",
  white: "#ffffff",
  textMuted: "#a7f3d0",
};

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

  // Animation values for background mesh
  const orb1Y = useSharedValue(100);
  const orb2Y = useSharedValue(SCREEN_HEIGHT - 300);
  const headerGlow = useSharedValue(0);

  useEffect(() => {
    orb1Y.value = withRepeat(withTiming(300, { duration: 15000 }), -1, true);
    orb2Y.value = withRepeat(withTiming(SCREEN_HEIGHT - 600, { duration: 18000 }), -1, true);
  }, []);

  useEffect(() => {
    if (isThinking) {
      headerGlow.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
    } else {
      headerGlow.value = withTiming(0);
    }
  }, [isThinking]);

  const animatedOrb1 = useAnimatedStyle(() => ({ transform: [{ translateY: orb1Y.value }] }));
  const animatedOrb2 = useAnimatedStyle(() => ({ transform: [{ translateY: orb2Y.value }] }));
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

  // --- SMART AI REASONING ENGINE ---
  const generateSmartResponse = (userInput: string): string => {
    const text = userInput.toLowerCase();
    const firstName = profile.name?.split(" ")[0] || "";

    // 1. ANALYSIS OF SPENDING
    if (text.includes("gasto") || text.includes("spend") || text.includes("expense") || text.includes("analisa")) {
      const monthTxs = getMonthTransactions(transactions).filter(tx => tx.type === "expense");
      const breakdown = getCategoryBreakdown(monthTxs);
      const topCategoryEntry = Object.entries(breakdown).sort((a, b) => b[1] - a[1])[0];

      if (topCategoryEntry) {
        const [cat, amount] = topCategoryEntry;
        const catName = t[`cat${cat.charAt(0).toUpperCase() + cat.slice(1)}` as keyof typeof t] || cat;
        const percent = ((amount / financialContext.income) * 100).toFixed(0);
        
        return `${firstName ? firstName + ", a" : "A"} minha análise indica que este mês gastaste **${formatCurrency(amount, currency, true)}** em **${catName}**, o que representa **${percent}%** do teu rendimento mensal. \n\nSugiro que definas um limite de **${formatCurrency(amount * 0.8, currency, true)}** para esta categoria no próximo mês. Isso permitiria poupar mais **${formatCurrency(amount * 0.2, currency, true)}** mensais.`;
      }
      return `Ainda não tenho dados suficientes sobre os teus gastos deste mês para uma análise profunda. Regista as tuas primeiras transações e eu ajudarei a otimizar o teu orçamento!`;
    }

    // 2. SAVINGS ADVICE
    if (text.includes("poupar") || text.includes("save") || text.includes("poupança")) {
      const targetRate = 20;
      const currentRate = financialContext.savingsRate;
      const diff = targetRate - currentRate;

      if (diff > 0) {
        const needed = (financialContext.income * (targetRate / 100)) - (financialContext.income - financialContext.expenses);
        return `Atualmente, a tua taxa de poupança é de **${currentRate.toFixed(1)}%**. Para atingires a meta ideal de **20%**, precisas de poupar mais **${formatCurrency(needed, currency, true)}** este mês.\n\nUma estratégia de elite? Aplica a regra **50/30/20**: 50% para necessidades, 30% para desejos e 20% diretamente para o teu futuro.`;
      }
      return `Incrível! A tua taxa de poupança atual é de **${currentRate.toFixed(1)}%**, o que é excelente. Como o teu objetivo é **${t[`obj${financialContext.objective.charAt(0).toUpperCase() + financialContext.objective.slice(1)}` as keyof typeof t] || financialContext.objective}**, podes começar a considerar investimentos mais agressivos com o teu excedente.`;
    }

    // 3. INVESTING STRATEGY
    if (text.includes("investir") || text.includes("invest") || text.includes("investimento")) {
      if (financialContext.patrimony < financialContext.expenses * 3) {
        return `Antes de investires, recomendo que solidifiques o teu **Fundo de Emergência**. O ideal é teres **${formatCurrency(financialContext.expenses * 6, currency, true)}** (6 meses de despesas) líquidos antes de entrares no mercado de capitais.`;
      }
      
      const suggestedStock = financialContext.patrimony * 0.15;
      return `Com um património de **${formatCurrency(financialContext.patrimony, currency, true)}**, estás numa posição sólida. \n\nSugiro alocar **${formatCurrency(suggestedStock, currency, true)}** (15%) em ETFs globais para diversificação automática. Queres que analise o teu perfil de risco para uma recomendação mais específica?`;
    }

    // 4. DEBT ANALYSIS
    if (text.includes("dívida") || text.includes("debt") || text.includes("devo")) {
      if (profile.debts > 0) {
        const debtRatio = (profile.debts / (financialContext.monthlyIncome * 12)) * 100;
        return `Notei que tens uma dívida total de **${formatCurrency(profile.debts, currency, true)}**. Isto representa **${debtRatio.toFixed(1)}%** do teu rendimento anual previsto. \n\nRecomendo o **Método Avalanche**: foca todos os teus recursos extras na dívida com a maior taxa de juro, enquanto manténs os pagamentos mínimos nas outras.`;
      }
      return `Não detetei dívidas ativas no teu perfil. Isto coloca-te numa vantagem estratégica enorme para acelerar a tua independência financeira!`;
    }

    // 5. DEFAULT AGENTIC RESPONSES
    const agentDefaults = [
      `Analisei o teu resumo financeiro e o teu saldo atual é de **${formatCurrency(financialContext.balance, currency, true)}**. O que queres que eu otimize agora?`,
      `Estou a monitorizar as tuas transações 24/7. De momento, a tua saúde financeira está estável, mas podemos melhorar a tua alocação de ativos. Queres ver como?`,
      `Como o teu assistente de elite, o meu objetivo é maximizar a tua liberdade. Baseado no teu perfil, a maior oportunidade hoje está em **reduzir gastos recorrentes**.`,
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

      // AI Reasoning Step
      setTimeout(() => {
        const reply = generateSmartResponse(trimmed);
        const assistantMsg: Message = { id: makeId(), role: "assistant", content: reply, isTyping: true };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsThinking(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 1200); 
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
        <BlurView 
          intensity={isUser ? 20 : 40} 
          tint="light" 
          style={[
            styles.bubble,
            isUser ? styles.bubbleUser : styles.bubbleAssistant,
            { borderColor: isUser ? "rgba(255,255,255,0.2)" : "rgba(16, 185, 129, 0.2)" }
          ]}
        >
          {isUser ? (
            <Text style={styles.bubbleTextUser}>{item.content}</Text>
          ) : (
            <TypewriterText content={item.content} onComplete={scrollToBottom} />
          )}
        </BlurView>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* CINEMATIC BACKGROUND */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient colors={[COLORS.forest, COLORS.deepEmerald]} style={StyleSheet.absoluteFill} />
        <Animated.View style={[styles.glowOrb, styles.orb1, animatedOrb1]} />
        <Animated.View style={[styles.glowOrb, styles.orb2, animatedOrb2]} />
        <BlurView intensity={Platform.OS === "web" ? 0 : 60} tint="dark" style={StyleSheet.absoluteFill} />
      </View>

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <BlurView intensity={20} tint="light" style={styles.headerGlass}>
          <BrandLogo style={styles.headerLogo} />
          <View style={styles.statusContainer}>
            <Animated.View style={[styles.statusGlow, animatedHeaderGlow]} />
            <View style={[styles.statusDot, { backgroundColor: isThinking ? COLORS.brightMint : COLORS.neonEmerald }]} />
            <Text style={styles.statusText}>{isThinking ? "A ANALISAR..." : "SISTEMA ATIVO"}</Text>
          </View>
        </BlurView>
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
                <BlurView intensity={20} tint="light" style={styles.thinkingBubble}>
                  <TypingIndicator />
                </BlurView>
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
                  style={styles.suggestionChip}
                  onPress={() => sendMessage(s)}
                  activeOpacity={0.7}
                >
                  <BlurView intensity={30} tint="light" style={styles.chipGlass}>
                    <Text style={styles.suggestionText}>{s}</Text>
                  </BlurView>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <BlurView intensity={40} tint="light" style={styles.inputBar}>
            <TextInput
              style={styles.textInput}
              value={input}
              onChangeText={setInput}
              placeholder={t.aiPlaceholder}
              placeholderTextColor="rgba(255,255,255,0.4)"
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, { opacity: input.trim() ? 1 : 0.5 }]}
              onPress={() => sendMessage(input)}
              disabled={!input.trim() || isThinking}
            >
              <LinearGradient 
                colors={[COLORS.neonEmerald, COLORS.brightMint]} 
                style={styles.sendGradient}
              >
                <Feather name="zap" size={18} color={COLORS.forest} />
              </LinearGradient>
            </TouchableOpacity>
          </BlurView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function TypewriterText({ content, onComplete }: { content: string, onComplete: () => void }) {
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
    }, 12);
    return () => clearInterval(timer);
  }, [content]);

  // Handle Markdown-style bolding **text**
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <Text key={i} style={styles.boldText}>
            {part.slice(2, -2)}
          </Text>
        );
      }
      return part;
    });
  };

  return <Text style={styles.bubbleTextAssistant}>{renderFormattedText(displayed)}</Text>;
}

function TypingIndicator() {
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
      <Animated.View style={[styles.dot, s1]} />
      <Animated.View style={[styles.dot, s2]} />
      <Animated.View style={[styles.dot, s3]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.forest },
  glowOrb: { position: "absolute", width: 300, height: 300, borderRadius: 150, opacity: 0.2 },
  orb1: { backgroundColor: COLORS.neonEmerald, top: -50, right: -100 },
  orb2: { backgroundColor: COLORS.deepEmerald, bottom: 50, left: -100 },
  header: { paddingHorizontal: 16, zIndex: 100 },
  headerGlass: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  },
  headerLogo: { width: 100, height: 30 },
  statusContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  statusGlow: { 
    position: "absolute", 
    width: 20, height: 20, 
    borderRadius: 10, 
    backgroundColor: COLORS.neonEmerald, 
    left: -6, 
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { color: COLORS.white, fontSize: 10, fontFamily: "Outfit_700Bold", letterSpacing: 1 },
  messagesList: { paddingHorizontal: 16, paddingTop: 20, gap: 16 },
  messageRow: { flexDirection: "row", marginBottom: 4 },
  messageRowUser: { justifyContent: "flex-end" },
  bubble: {
    maxWidth: "85%",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1,
    overflow: "hidden",
  },
  bubbleUser: {
    borderBottomRightRadius: 4,
    backgroundColor: "rgba(16, 185, 129, 0.3)",
  },
  bubbleAssistant: {
    borderBottomLeftRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  bubbleTextUser: { color: COLORS.white, fontSize: 16, fontFamily: "Inter_500Medium", lineHeight: 24 },
  bubbleTextAssistant: { color: COLORS.textMuted, fontSize: 16, fontFamily: "Inter_400Regular", lineHeight: 24 },
  boldText: { fontFamily: "Inter_700Bold", color: COLORS.white },
  thinkingBubble: { padding: 15, borderRadius: 20, width: 80, alignItems: "center", overflow: "hidden" },
  typingContainer: { flexDirection: "row", gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.brightMint },
  bottomSection: { position: "absolute", bottom: 0, width: "100%", paddingHorizontal: 16 },
  suggestionsScroll: { flexDirection: "row", gap: 10, marginBottom: 15 },
  suggestionChip: { borderRadius: 20, overflow: "hidden" },
  chipGlass: { paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  suggestionText: { color: COLORS.white, fontSize: 13, fontFamily: "Inter_600SemiBold" },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
    paddingLeft: 20,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  textInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    maxHeight: 120,
    paddingVertical: 10,
  },
  sendButton: { width: 44, height: 44, borderRadius: 22, overflow: "hidden", marginLeft: 8 },
  sendGradient: { flex: 1, alignItems: "center", justifyContent: "center" },
});
