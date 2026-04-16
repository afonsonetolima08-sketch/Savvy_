import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { useCurrency } from "@/hooks/useCurrency";
import { useT } from "@/hooks/useTranslations";
import { getMonthlyStats } from "@/utils/finance";

const API_BASE = process.env.EXPO_PUBLIC_DOMAIN
  ? `https://${process.env.EXPO_PUBLIC_DOMAIN}`
  : "http://localhost:8080";

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

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  // Account for the absolute Tab Bar height (84 on Web, 60 on mobile)
  const bottomPadding = Platform.OS === "web" ? 84 : insets.bottom + 60;

  const stats = getMonthlyStats(transactions);
  const savingsRate =
    stats.income > 0 ? ((stats.income - stats.expenses) / stats.income) * 100 : 0;

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

      // Local Fake AI Logic
      setTimeout(() => {
        const lower = trimmed.toLowerCase();
        let reply = "";
        
        if (lower.includes("poupar") || lower.includes("save") || lower.includes("poupança")) {
           reply = `Com uma taxa de poupança atual de ${financialContext.savingsRate.toFixed(1)}%, poderias otimizar cortando em gastos não essenciais. O teu objetivo principal é "${financialContext.objective || "não definido"}". Tens alguma categoria específica onde sentes que gastas demasiado?`;
        } else if (lower.includes("gasto") || lower.includes("spend") || lower.includes("expense") || lower.includes("análise") || lower.includes("analisa")) {
           reply = `Este mês já gastaste ${financialContext.currency}${financialContext.expenses.toFixed(2)}. Em comparação com os teus ganhos (${financialContext.currency}${financialContext.income.toFixed(2)}), o teu saldo livre é de ${financialContext.currency}${financialContext.balance.toFixed(2)}. Posso ajudar a estabelecer um limite mensal se precisares!`;
        } else if (lower.includes("investir") || lower.includes("invest") || lower.includes("investimento")) {
           if (financialContext.patrimony > 1000) {
             reply = `Tendo um património de ${financialContext.currency}${financialContext.patrimony.toFixed(2)}, começar a investir parte do teu capital em ETFs ou contas-poupança de alto rendimento pode ajudar a bater a inflação. Qual é a tua tolerância ao risco?`;
           } else {
             reply = `Para começar a investir, o ideal é construir primeiro um fundo de emergência. Tenta poupar cerca de 3 a 6 meses das tuas despesas habituais antes de entrares no mercado financeiro.`;
           }
        } else if (lower.includes("dívida") || lower.includes("debt") || lower.includes("reduzir") || lower.includes("devo")) {
           reply = `A melhor estratégia para reduzir dívidas é pagar primeiro a que tem a taxa de juro mais alta (método Avalanche) ou liquidar a de menor valor primeiro para ganhar motivação (método Bola de Neve).`;
        } else {
           const defaults = [
             `Essa é uma excelente perspetiva. Com um saldo limpo de ${financialContext.currency}${financialContext.balance.toFixed(2)} este mês, estás no caminho certo para os teus objetivos reais.`,
             "Posso ajudar com dicas de poupança, análise do teu orçamento ou estratégias de planeamento a longo prazo. O que preferes explorar mais com base nos teus dados?",
             `Notei que queres perceber mais sobre finanças. Podes sempre aplicar a regra 50/30/20 ao teu orçamento: 50% necessidades, 30% desejos e 20% para a tua poupança futura!`,
             "Não tenho uma resposta matemática exata para isso, mas como o teu Assistente Pessoal sei que a chave do sucesso financeiro é a consistência no registo de cada transação no painel de estatísticas!",
           ];
           reply = defaults[Math.floor(Math.random() * defaults.length)];
        }

        const assistantMsg: Message = { id: makeId(), role: "assistant", content: reply };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsTyping(false);
      }, 1500); // 1.5 second simulated think time
      
    },
    [isTyping, financialContext]
  );

  const suggestions = [t.aiSuggestion1, t.aiSuggestion2, t.aiSuggestion3, t.aiSuggestion4];
  const showSuggestions = messages.length <= 1;

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === "user";
    return (
      <View style={[styles.messageRow, isUser && styles.messageRowUser]}>
        {!isUser && (
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Feather name="cpu" size={14} color="#fff" />
          </View>
        )}
        <View
          style={[
            styles.bubble,
            isUser
              ? [styles.bubbleUser, { backgroundColor: colors.primary }]
              : [styles.bubbleAssistant, { backgroundColor: colors.card, borderColor: colors.border }],
          ]}
        >
          <Text
            style={[
              styles.bubbleText,
              { color: isUser ? "#fff" : colors.foreground },
            ]}
          >
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: topPadding + 12, backgroundColor: colors.background, borderBottomColor: colors.border },
        ]}
      >
        <View style={[styles.headerIcon, { backgroundColor: colors.primary + "18" }]}>
          <Feather name="cpu" size={18} color={colors.primary} />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>{t.aiTitle}</Text>
          <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>{t.aiSubtitle}</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={[
            styles.messagesList,
            { paddingBottom: showSuggestions ? 16 : 16 },
          ]}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
          ListFooterComponent={
            isTyping ? (
              <View style={[styles.messageRow]}>
                <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                  <Feather name="cpu" size={14} color="#fff" />
                </View>
                <View style={[styles.bubble, styles.bubbleAssistant, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={styles.typingIndicator}>
                    <ActivityIndicator size="small" color={colors.primary} />
                    <Text style={[styles.typingText, { color: colors.mutedForeground }]}>{t.aiTyping}</Text>
                  </View>
                </View>
              </View>
            ) : null
          }
        />

        {/* Suggestion chips */}
        {showSuggestions && (
          <View style={styles.suggestionsContainer}>
            <View style={styles.suggestionsRow}>
              {suggestions.map((s, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.suggestionChip, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => sendMessage(s)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.suggestionText, { color: colors.primary }]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Input bar */}
        <View
          style={[
            styles.inputBar,
            {
              backgroundColor: colors.card,
              borderTopColor: colors.border,
              paddingBottom: bottomPadding + 8,
            },
          ]}
        >
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: colors.background,
                color: colors.foreground,
                borderColor: colors.border,
              },
            ]}
            value={input}
            onChangeText={setInput}
            placeholder={t.aiPlaceholder}
            placeholderTextColor={colors.mutedForeground}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={() => sendMessage(input)}
            blurOnSubmit
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: input.trim() && !isTyping ? colors.primary : colors.border,
              },
            ]}
            onPress={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            activeOpacity={0.8}
          >
            <Feather name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: { flex: 1 },
  headerTitle: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 1,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 4,
  },
  messageRowUser: {
    flexDirection: "row-reverse",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  bubble: {
    maxWidth: "80%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleUser: {
    borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  bubbleText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  typingText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  suggestionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  suggestionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  suggestionChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  suggestionText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingTop: 10,
    gap: 10,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    maxHeight: 120,
    lineHeight: 20,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
});
