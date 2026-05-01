import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef, useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import Animated, { 
  FadeInDown, 
  FadeInRight, 
  FadeOutLeft, 
  Layout, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type StepType = "options" | "number" | "boolean" | "text";

type Step = {
  id: string;
  question: string;
  subtitle?: string;
  type: StepType;
  field: string;
  icon: keyof typeof Feather.glyphMap;
  options?: { label: string; value: string }[];
  placeholder?: string;
};

const STEPS: Step[] = [
  {
    id: "name",
    question: "Olá! Como te chamas?",
    subtitle: "Vamos personalizar a tua experiência financeira.",
    type: "text",
    field: "name",
    icon: "user",
    placeholder: "Escreve o teu nome...",
  },
  {
    id: "objective",
    question: "Qual o teu objetivo principal?",
    subtitle: "Adapta as tuas dicas e recomendações.",
    type: "options",
    field: "mainObjective",
    icon: "target",
    options: [
      { label: "Poupar dinheiro", value: "save" },
      { label: "Reduzir dívidas", value: "reduce_debt" },
      { label: "Investir", value: "invest" },
      { label: "Controlar gastos", value: "control" },
      { label: "Independência financeira", value: "freedom" },
    ],
  },
  {
    id: "income",
    question: "Rendimento mensal?",
    subtitle: "Ajuda-nos a calibrar as tuas metas.",
    type: "number",
    field: "monthlyIncome",
    icon: "trending-up",
  },
  {
    id: "patrimony",
    question: "Património atual?",
    subtitle: "Soma de todas as tuas poupanças e ativos.",
    type: "number",
    field: "initialPatrimony",
    icon: "briefcase",
  },
  {
    id: "debts",
    question: "Tens dívidas totais?",
    subtitle: "Cartões, empréstimos, etc. (0 se não tiveres)",
    type: "number",
    field: "debts",
    icon: "alert-circle",
  },
  {
    id: "dependents",
    question: "Tens dependentes?",
    subtitle: "Pessoas que dependem de ti financeiramente.",
    type: "boolean",
    field: "hasDependents",
    icon: "users",
  },
  {
    id: "horizon",
    question: "Horizonte temporal?",
    subtitle: "Por quanto tempo pretendes investir?",
    type: "options",
    field: "investmentHorizon",
    icon: "clock",
    options: [
      { label: "Curto prazo (< 1 ano)", value: "short" },
      { label: "Médio prazo (1-5 anos)", value: "medium" },
      { label: "Longo prazo (5+ anos)", value: "long" },
    ],
  },
];

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { updateProfile } = useApp();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [textValue, setTextValue] = useState("");
  const [numValue, setNumValue] = useState("");
  
  const progress = useSharedValue((1 / STEPS.length) * 100);
  const step = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;

  useEffect(() => {
    progress.value = withSpring(((currentStep + 1) / STEPS.length) * 100);
  }, [currentStep]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  const handleOption = (value: string | boolean) => {
    Haptics.selectionAsync();
    const updated = { ...answers, [step.field]: value };
    setAnswers(updated);
    if (step.type !== "number" && step.type !== "text") {
      setTimeout(() => goNext(updated), 300);
    }
  };

  const goNext = (updatedAnswers?: Record<string, any>) => {
    const ans = updatedAnswers ?? { ...answers };

    if (step.type === "number") {
      const val = parseFloat(numValue.replace(",", ".")) || 0;
      ans[step.field] = val;
      setNumValue("");
    } else if (step.type === "text") {
      ans[step.field] = textValue.trim();
      setTextValue("");
    }

    setAnswers(ans);

    if (currentStep < STEPS.length - 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentStep((s) => s + 1);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      updateProfile({
        ...ans,
        currentPatrimony: ans.initialPatrimony ?? 0,
        onboardingCompleted: true,
        currency: "EUR",
        language: "pt",
        financialGoal: ans.mainObjective ?? "",
      });
      router.replace("/(tabs)");
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      setNumValue("");
      setTextValue("");
    }
  };

  const canContinue = (() => {
    if (step.type === "number") return numValue.length > 0;
    if (step.type === "text") return textValue.trim().length > 0;
    return answers[step.field] !== undefined;
  })();

  const COLORS = {
    forest: "#01241c",
    deepEmerald: "#064e3b",
    neonEmerald: "#10b981",
    brightMint: "#34d399",
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient colors={[COLORS.forest, COLORS.deepEmerald]} style={StyleSheet.absoluteFill} />
      
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={goBack} disabled={currentStep === 0} style={[styles.backBtn, { opacity: currentStep === 0 ? 0 : 1 }]}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
           <View style={[styles.progressBar, { backgroundColor: "rgba(255,255,255,0.1)" }]}>
              <Animated.View style={[styles.progressFill, { backgroundColor: COLORS.neonEmerald }, progressStyle]} />
           </View>
           <Text style={styles.stepText}>{currentStep + 1} de {STEPS.length}</Text>
        </View>
        
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          key={step.id}
          entering={FadeInDown.springify()}
          layout={Layout.springify()}
          style={styles.content}
        >
          {/* ICON & TITLE */}
          <View style={styles.iconBox}>
             <BlurView intensity={20} tint="light" style={styles.iconCircle}>
                <Feather name={step.icon} size={32} color={COLORS.brightMint} />
             </BlurView>
          </View>

          <Text style={styles.question}>{step.question}</Text>
          {step.subtitle && <Text style={styles.subtitle}>{step.subtitle}</Text>}

          {/* INPUTS AREA */}
          <View style={styles.inputArea}>
            {step.type === "text" && (
              <Animated.View entering={FadeInRight.delay(200)}>
                <TextInput
                  style={styles.textInput}
                  value={textValue}
                  onChangeText={setTextValue}
                  placeholder={step.placeholder}
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  autoFocus
                  selectionColor={COLORS.neonEmerald}
                />
              </Animated.View>
            )}

            {step.type === "number" && (
              <Animated.View entering={FadeInRight.delay(200)} style={styles.numberInputBox}>
                <Text style={styles.currencyPrefix}>€</Text>
                <TextInput
                  style={styles.numberInput}
                  value={numValue}
                  onChangeText={setNumValue}
                  placeholder="0"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  keyboardType="numeric"
                  autoFocus
                  selectionColor={COLORS.neonEmerald}
                />
              </Animated.View>
            )}

            {(step.type === "options" || step.type === "boolean") && (
              <View style={styles.optionsGrid}>
                {(step.options || [{ label: "Sim", value: true }, { label: "Não", value: false }]).map((opt, i) => {
                  const selected = answers[step.field] === opt.value;
                  return (
                    <Animated.View key={String(opt.value)} entering={FadeInDown.delay(i * 100)}>
                      <TouchableOpacity
                        onPress={() => handleOption(opt.value)}
                        activeOpacity={0.7}
                        style={[
                          styles.optionCard,
                          { 
                            backgroundColor: selected ? COLORS.neonEmerald : "rgba(255,255,255,0.05)",
                            borderColor: selected ? COLORS.neonEmerald : "rgba(255,255,255,0.1)"
                          }
                        ]}
                      >
                        <Text style={[styles.optionLabel, { color: selected ? COLORS.forest : "#fff" }]}>
                          {opt.label}
                        </Text>
                        <View style={[styles.optionCheck, { backgroundColor: selected ? COLORS.forest : "rgba(255,255,255,0.1)" }]}>
                           {selected && <Feather name="check" size={14} color={COLORS.neonEmerald} />}
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
                  );
                })}
              </View>
            )}
          </View>

          {/* CONTINUE BUTTON */}
          {(step.type === "text" || step.type === "number") && (
            <Animated.View entering={FadeInUp.delay(400)}>
              <TouchableOpacity
                onPress={() => goNext()}
                disabled={!canContinue}
                style={[styles.continueBtn, { opacity: canContinue ? 1 : 0.5 }]}
              >
                <LinearGradient
                  colors={[COLORS.neonEmerald, COLORS.brightMint]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.btnGradient}
                >
                  <Text style={styles.btnText}>{isLast ? "Concluir" : "Próximo"}</Text>
                  <Feather name={isLast ? "check" : "chevron-right"} size={20} color={COLORS.forest} />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  backBtn: { width: 44, height: 44, justifyContent: "center", alignItems: "center" },
  progressContainer: { flex: 1, alignItems: "center", gap: 8 },
  progressBar: { width: "100%", height: 6, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  stepText: { color: "rgba(255,255,255,0.5)", fontSize: 12, fontFamily: "Outfit_700Bold", letterSpacing: 1 },
  scrollContent: { paddingHorizontal: 30, paddingTop: 40 },
  content: { flex: 1, alignItems: "center" },
  iconBox: { marginBottom: 30 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: "center", alignItems: "center", overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  question: { color: "#fff", fontSize: 32, fontFamily: "Outfit_900Black", textAlign: "center", marginBottom: 12, lineHeight: 40 },
  subtitle: { color: "rgba(255,255,255,0.6)", fontSize: 16, fontFamily: "Inter_400Regular", textAlign: "center", marginBottom: 40, lineHeight: 24 },
  inputArea: { width: "100%", marginBottom: 40 },
  textInput: { 
    width: "100%", 
    backgroundColor: "rgba(255,255,255,0.05)", 
    borderRadius: 20, 
    padding: 24, 
    color: "#fff", 
    fontSize: 20, 
    fontFamily: "Inter_600SemiBold",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    textAlign: "center"
  },
  numberInputBox: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)", 
    borderRadius: 20, 
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)"
  },
  currencyPrefix: { color: "#10b981", fontSize: 32, fontFamily: "Outfit_700Bold", marginRight: 8 },
  numberInput: { 
    flex: 1, 
    paddingVertical: 24, 
    color: "#fff", 
    fontSize: 40, 
    fontFamily: "Outfit_700Bold",
    textAlign: "left"
  },
  optionsGrid: { gap: 12 },
  optionCard: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    padding: 20, 
    borderRadius: 20, 
    borderWidth: 1 
  },
  optionLabel: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  optionCheck: { width: 24, height: 24, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  continueBtn: { width: "100%", height: 64, borderRadius: 20, overflow: "hidden", marginTop: 20 },
  btnGradient: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  btnText: { color: "#01241c", fontSize: 18, fontFamily: "Outfit_700Bold" },
});
