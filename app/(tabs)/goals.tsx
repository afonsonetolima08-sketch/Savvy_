import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Animated, { FadeInDown, FadeInRight, Layout } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useCurrency } from "@/hooks/useCurrency";
import { useT } from "@/hooks/useTranslations";
import { formatCurrency } from "@/utils/finance";

const { width } = Dimensions.get("window");

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  createdAt: string;
}

export default function GoalsScreen() {
  const colors = useColors();
  const t = useT();
  const insets = useSafeAreaInsets();
  const { currency } = useCurrency();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: "", target: "", current: "" });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const saved = await AsyncStorage.getItem("savvy_goals");
      if (saved) setGoals(JSON.parse(saved));
    } catch (e) {
      console.error("Load goals error:", e);
    }
  };

  const saveGoals = async (updatedGoals: Goal[]) => {
    try {
      await AsyncStorage.setItem("savvy_goals", JSON.stringify(updatedGoals));
    } catch (e) {
      console.error("Save goals error:", e);
    }
  };

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.target) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      targetAmount: parseFloat(newGoal.target),
      currentAmount: parseFloat(newGoal.current || "0"),
      createdAt: new Date().toISOString(),
    };

    const updated = [goal, ...goals];
    setGoals(updated);
    saveGoals(updated);
    setIsModalVisible(false);
    setNewGoal({ title: "", target: "", current: "" });
  };

  const deleteGoal = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const updated = goals.filter(g => g.id !== id);
    setGoals(updated);
    saveGoals(updated);
  };

  const renderGoal = ({ item, index }: { item: Goal, index: number }) => {
    const progress = Math.min((item.currentAmount / item.targetAmount) * 100, 100);
    const remaining = Math.max(item.targetAmount - item.currentAmount, 0);

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
          <TouchableOpacity onPress={() => deleteGoal(item.id)} style={styles.deleteBtn}>
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
            {remaining > 0 && (
              <Text style={[styles.remainingText, { color: colors.mutedForeground }]}>
                {t.ofLabel} {formatCurrency(remaining, currency, true)}
              </Text>
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={[colors.primary + "15", "transparent"]} style={styles.gradient} />
      
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View>
          <Text style={[styles.title, { color: colors.foreground }]}>{t.tabGoals}</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{t.goalsSubtitle}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.addBtn, { backgroundColor: colors.primary }]} 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setIsModalVisible(true);
          }}
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

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
          <TouchableOpacity 
            style={StyleSheet.absoluteFill} 
            activeOpacity={1} 
            onPress={() => setIsModalVisible(false)} 
          />
          
          <Animated.View entering={FadeInDown.springify()} style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>{t.addGoal}</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Feather name="x" size={24} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>{t.goalName}</Text>
                <TextInput
                  style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
                  placeholder={t.goalPlaceholder}
                  placeholderTextColor={colors.mutedForeground}
                  value={newGoal.title}
                  onChangeText={(text) => setNewGoal(p => ({ ...p, title: text }))}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>{t.goalCurrent}</Text>
                  <TextInput
                    style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
                    placeholder="0"
                    placeholderTextColor={colors.mutedForeground}
                    keyboardType="numeric"
                    value={newGoal.current}
                    onChangeText={(text) => setNewGoal(p => ({ ...p, current: text }))}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>{t.goalTarget}</Text>
                  <TextInput
                    style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
                    placeholder="1000"
                    placeholderTextColor={colors.mutedForeground}
                    keyboardType="numeric"
                    value={newGoal.target}
                    onChangeText={(text) => setNewGoal(p => ({ ...p, target: text }))}
                  />
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.submitBtn, { backgroundColor: colors.primary }]} 
                onPress={handleAddGoal}
              >
                <Text style={styles.submitBtnText}>{t.goalSave}</Text>
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
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    paddingHorizontal: 20,
    marginBottom: 20
  },
  title: { fontSize: 32, fontFamily: "Outfit_700Bold" },
  subtitle: { fontSize: 16, fontFamily: "Inter_400Regular" },
  addBtn: { width: 56, height: 56, borderRadius: 28, justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  goalCard: { 
    padding: 20, 
    borderRadius: 24, 
    marginBottom: 16, 
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2
  },
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
  progressInfo: { flexDirection: "row", justifyContent: "space-between" },
  progressText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  remainingText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  emptyContainer: { alignItems: "center", justifyContent: "center", marginTop: 100 },
  emptyIcon: { width: 100, height: 100, borderRadius: 50, borderWidth: 1, justifyContent: "center", alignItems: "center", marginBottom: 20 },
  emptyText: { fontSize: 16, fontFamily: "Inter_500Medium", textAlign: "center", maxWidth: 250 },
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalContent: { borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  modalTitle: { fontSize: 24, fontFamily: "Outfit_700Bold" },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  inputLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  input: { borderWidth: 1, borderRadius: 16, padding: 16, fontSize: 16, fontFamily: "Inter_400Regular" },
  row: { flexDirection: "row" },
  submitBtn: { borderRadius: 16, padding: 18, alignItems: "center", marginTop: 10 },
  submitBtnText: { color: "#fff", fontSize: 18, fontFamily: "Inter_700Bold" },
});
