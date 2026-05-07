import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useMemo } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import Animated, { FadeInDown, FadeInRight, Layout } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp, Goal } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { useCurrency } from "@/hooks/useCurrency";
import { useT } from "@/hooks/useTranslations";
import { formatCurrency } from "@/utils/finance";

export default function GoalsScreen() {
  const colors = useColors();
  const t = useT();
  const insets = useSafeAreaInsets();
  const { currency, convert } = useCurrency();
  const { effectivePatrimony, goals, addGoal, updateGoal, deleteGoal } = useApp();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAllocating, setIsAllocating] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState({ title: "", target: "", current: "" });
  const [allocAmount, setAllocAmount] = useState("");

  const totalAllocated = useMemo(() => goals.reduce((s, g) => s + g.currentAmount, 0), [goals]);
  const availableToAllocate = useMemo(() => convert(effectivePatrimony) - totalAllocated, [effectivePatrimony, totalAllocated, convert]);

  const handleAddGoal = () => {
    const target = parseFloat(newGoal.target);
    const current = parseFloat(newGoal.current || "0");
    
    if (!newGoal.title || isNaN(target)) return;
    if (current > availableToAllocate) {
      Alert.alert("Saldo Insuficiente", "Não podes alocar mais do que o teu património disponível.");
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addGoal({
      title: newGoal.title,
      targetAmount: target,
      currentAmount: current,
    });

    setIsModalVisible(false);
    setNewGoal({ title: "", target: "", current: "" });
  };

  const handleAllocation = () => {
    const amount = parseFloat(allocAmount);
    if (isNaN(amount) || amount <= 0 || !isAllocating) return;

    if (amount > availableToAllocate) {
      Alert.alert("Limite Excedido", "O valor excede o património livre disponível.");
      return;
    }

    const goal = goals.find(g => g.id === isAllocating);
    if (goal) {
      updateGoal({ ...goal, currentAmount: goal.currentAmount + amount });
    }

    setIsAllocating(null);
    setAllocAmount("");
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleDeleteGoal = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    deleteGoal(id);
  };

  const renderGoal = ({ item, index }: { item: Goal, index: number }) => {
    const progress = Math.min((item.currentAmount / item.targetAmount) * 100, 100);

    return (
      <Animated.View 
        entering={FadeInDown.delay(index * 100).springify()} 
        layout={Layout.springify()}
        style={[styles.goalCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <View style={styles.goalHeader}>
          <View style={styles.goalTitleContainer}>
            <Text style={[styles.goalTitle, { color: colors.foreground }]}>{item.title}</Text>
            <Text style={[styles.goalDate, { color: colors.mutedForeground }]}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <TouchableOpacity onPress={() => handleDeleteGoal(item.id)} style={styles.deleteBtn}>
            <Feather name="trash-2" size={16} color={colors.destructive} />
          </TouchableOpacity>
        </View>

        <View style={styles.amountRow}>
          <View>
            <Text style={[styles.amountLabel, { color: colors.mutedForeground }]}>{t.goalCurrent}</Text>
            <Text style={[styles.amountValue, { color: colors.primary }]}>
              {formatCurrency(item.currentAmount, currency, true)}
            </Text>
          </View>
          <View style={styles.alignRight}>
            <Text style={[styles.amountLabel, { color: colors.mutedForeground }]}>{t.goalTarget}</Text>
            <Text style={[styles.amountValue, { color: colors.foreground }]}>
              {formatCurrency(item.targetAmount, currency, true)}
            </Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
            <Animated.View 
              entering={FadeInRight.delay(index * 100 + 300).duration(1000)}
              style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: colors.primary }]} 
            />
          </View>
          <View style={styles.progressInfo}>
            <Text style={[styles.progressText, { color: colors.mutedForeground }]}>
              {progress.toFixed(1)}% {t.goalProgress}
            </Text>
            <TouchableOpacity 
              onPress={() => setIsAllocating(item.id)}
              style={[styles.allocBtn, { borderColor: colors.primary }]}
            >
              <Feather name="plus" size={12} color={colors.primary} />
              <Text style={[styles.allocBtnText, { color: colors.primary }]}>ALOCAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={[colors.primary + "15", "transparent"]} style={styles.gradient} />
      
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.foreground }]}>{t.tabGoals}</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>PATRIMÓNIO LIVRE</Text>
              <Text style={[styles.summaryValue, { color: colors.foreground }]}>
                {formatCurrency(availableToAllocate, currency, true)}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity 
          style={[styles.addBtn, { backgroundColor: colors.primary }]} 
          onPress={() => setIsModalVisible(true)}
        >
          <Feather name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={renderGoal}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="target" size={40} color={colors.mutedForeground} />
            </View>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>{t.goalEmpty}</Text>
          </View>
        }
      />

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
          <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => setIsModalVisible(false)} />
          <Animated.View entering={FadeInDown} style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>{t.addGoal}</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}><Feather name="x" size={24} color={colors.mutedForeground} /></TouchableOpacity>
            </View>
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>{t.goalName}</Text>
                <TextInput style={[styles.input, { color: colors.foreground, borderColor: colors.border }]} placeholder={t.goalPlaceholder} placeholderTextColor={colors.mutedForeground} value={newGoal.title} onChangeText={(text) => setNewGoal(p => ({ ...p, title: text }))} />
              </View>
              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>{t.goalCurrent}</Text>
                  <TextInput style={[styles.input, { color: colors.foreground, borderColor: colors.border }]} placeholder="0" keyboardType="numeric" value={newGoal.current} onChangeText={(text) => setNewGoal(p => ({ ...p, current: text }))} />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>{t.goalTarget}</Text>
                  <TextInput style={[styles.input, { color: colors.foreground, borderColor: colors.border }]} placeholder="1000" keyboardType="numeric" value={newGoal.target} onChangeText={(text) => setNewGoal(p => ({ ...p, target: text }))} />
                </View>
              </View>
              <TouchableOpacity style={[styles.submitBtn, { backgroundColor: colors.primary }]} onPress={handleAddGoal}><Text style={styles.submitBtnText}>{t.goalSave}</Text></TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={!!isAllocating} animationType="fade" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlayCenter}>
          <BlurView intensity={50} style={StyleSheet.absoluteFill} tint="dark" />
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => setIsAllocating(null)} />
          <Animated.View entering={FadeInDown} style={[styles.modalContentSmall, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitleSmall, { color: colors.foreground }]}>Alocar Património</Text>
            <Text style={[styles.modalSubtitleSmall, { color: colors.mutedForeground }]}>Disponível: {formatCurrency(availableToAllocate, currency, true)}</Text>
            <TextInput
              style={[styles.input, { color: colors.foreground, borderColor: colors.border, marginTop: 20 }]}
              placeholder="Montante a alocar..."
              placeholderTextColor={colors.mutedForeground}
              keyboardType="numeric"
              autoFocus
              value={allocAmount}
              onChangeText={setAllocAmount}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.border }]} onPress={() => setIsAllocating(null)}>
                <Text style={[styles.modalBtnText, { color: colors.foreground }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.primary }]} onPress={handleAllocation}>
                <Text style={[styles.modalBtnText, { color: "#fff" }]}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { position: "absolute", top: 0, left: 0, right: 0, height: 300 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingHorizontal: 20, marginBottom: 20 },
  title: { fontSize: 32, fontFamily: "Outfit_700Bold" },
  summaryRow: { marginTop: 8 },
  summaryItem: { backgroundColor: "rgba(255,255,255,0.05)", padding: 10, borderRadius: 12 },
  summaryLabel: { fontSize: 10, fontFamily: "Outfit_700Bold", letterSpacing: 1 },
  summaryValue: { fontSize: 18, fontFamily: "Outfit_700Bold", marginTop: 2 },
  addBtn: { width: 56, height: 56, borderRadius: 28, justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  goalCard: { padding: 20, borderRadius: 24, marginBottom: 16, borderWidth: 1, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  goalHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  goalTitleContainer: { flex: 1 },
  goalTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  goalDate: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  deleteBtn: { padding: 5 },
  amountRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  amountLabel: { fontSize: 12, fontFamily: "Inter_500Medium", marginBottom: 4 },
  amountValue: { fontSize: 18, fontFamily: "Outfit_700Bold" },
  alignRight: { alignItems: "flex-end" },
  progressSection: { width: "100%" },
  progressBarBg: { height: 10, borderRadius: 5, overflow: "hidden", marginBottom: 10 },
  progressBarFill: { height: "100%", borderRadius: 5 },
  progressInfo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  progressText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  allocBtn: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, gap: 4 },
  allocBtnText: { fontSize: 10, fontFamily: "Outfit_700Bold" },
  emptyContainer: { alignItems: "center", justifyContent: "center", marginTop: 100 },
  emptyIcon: { width: 100, height: 100, borderRadius: 50, borderWidth: 1, justifyContent: "center", alignItems: "center", marginBottom: 20 },
  emptyText: { fontSize: 16, fontFamily: "Inter_500Medium", textAlign: "center", maxWidth: 250 },
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalOverlayCenter: { flex: 1, justifyContent: "center", padding: 20 },
  modalContent: { borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40 },
  modalContentSmall: { borderRadius: 24, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 10 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  modalTitle: { fontSize: 24, fontFamily: "Outfit_700Bold" },
  modalTitleSmall: { fontSize: 20, fontFamily: "Outfit_700Bold", textAlign: "center" },
  modalSubtitleSmall: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", marginTop: 4 },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  inputLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  input: { borderWidth: 1, borderRadius: 16, padding: 16, fontSize: 16, fontFamily: "Inter_400Regular" },
  row: { flexDirection: "row" },
  submitBtn: { borderRadius: 16, padding: 18, alignItems: "center", marginTop: 10 },
  submitBtnText: { color: "#fff", fontSize: 18, fontFamily: "Inter_700Bold" },
  modalActions: { flexDirection: "row", gap: 12, marginTop: 24 },
  modalBtn: { flex: 1, padding: 16, borderRadius: 12, alignItems: "center" },
  modalBtnText: { fontSize: 16, fontFamily: "Inter_700Bold" },
});
