import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AddTransactionModal from "@/components/AddTransactionModal";
import TransactionCard from "@/components/TransactionCard";
import { Transaction, useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { useCurrency } from "@/hooks/useCurrency";
import { useT } from "@/hooks/useTranslations";

const NEGATIVE_CARD_COLOR = "#dc2626";

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { transactions, profile, effectivePatrimony, goals } = useApp();
  const { format, formatExact, convert } = useCurrency();
  const t = useT();
  const [showModal, setShowModal] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);

  const safeTransactions = transactions || [];
  
  const currentMonthTxs = safeTransactions.filter((tx) => {
    if (!tx.date) return false;
    const target = new Date();
    const tY = target.getFullYear();
    const tM = target.getMonth() + 1;
    
    const match = tx.date.match(/^(\d{4})[/-](\d{1,2})/);
    if (match) {
      return parseInt(match[1], 10) === tY && parseInt(match[2], 10) === tM;
    }
    
    const parsed = new Date(tx.date);
    if (!isNaN(parsed.getTime())) {
      return parsed.getFullYear() === tY && parsed.getMonth() === tM - 1;
    }
    return false;
  });

  const incomeSum = currentMonthTxs.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount || 0), 0);
  const expenseSum = currentMonthTxs.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount || 0), 0);
  
  const stats = {
    income: incomeSum,
    expenses: expenseSum,
    balance: incomeSum - expenseSum,
  };

  const recentTxs = currentMonthTxs.slice(0, 6);
  const isNegative = stats.balance < 0;
  const cardColor = isNegative ? NEGATIVE_CARD_COLOR : colors.primary;

  const firstName = profile.name?.trim().split(" ")[0] || "";
  const hour = new Date().getHours();
  const greetingBase = hour < 12 ? t.morning : hour < 19 ? t.afternoon : t.evening;

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  const displayIncome = convert(profile.monthlyIncome);
  const displayPatrimony = convert(effectivePatrimony);
  const displayInitial = convert(profile.initialPatrimony ?? 0);
  const patrimonGain = displayPatrimony - displayInitial;

  const budgetPct =
    displayIncome > 0
      ? Math.min(100, (convert(stats.expenses) / displayIncome) * 100)
      : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingTop: topPadding + 8, paddingBottom: 80 + bottomPadding }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header / Greeting */}
        <View style={styles.headerSection}>
          <View style={styles.greetingRow}>
            <View style={styles.greetingText}>
              {firstName ? (
                <>
                  <Text style={[styles.greetingBase, { color: colors.mutedForeground }]}>
                    {greetingBase},
                  </Text>
                  <Text style={[styles.greetingName, { color: colors.primary }]}>
                    {firstName}
                  </Text>
                </>
              ) : (
                <Text style={[styles.greeting, { color: colors.foreground }]}>{greetingBase}</Text>
              )}
              <Text style={[styles.greetingSub, { color: colors.mutedForeground }]}>{t.greetingSub}</Text>
            </View>
            <TouchableOpacity
              style={[styles.addIconBtn, { backgroundColor: colors.primary }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setEditTx(null);
                setShowModal(true);
              }}
              activeOpacity={0.85}
            >
              <Feather name="plus" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance Card */}
        <View style={[styles.balanceCard, { backgroundColor: cardColor }]}>
          <Text style={styles.balanceLabel}>{t.monthlyBalance}</Text>
          <Text style={styles.balanceAmount}>
            {stats.balance >= 0 ? "+" : ""}{format(stats.balance)}
          </Text>

          <View style={styles.balanceStatsRow}>
            <View style={styles.balanceStat}>
              <View style={[styles.balanceStatIcon, { backgroundColor: "rgba(74, 222, 128, 0.25)" }]}>
                <Feather name="trending-up" size={13} color="#4ade80" />
              </View>
              <View>
                <Text style={styles.balanceStatLabel}>{t.income}</Text>
                <Text style={[styles.balanceStatValue, { color: "#4ade80" }]}>+{format(stats.income)}</Text>
              </View>
            </View>
            <View style={styles.balanceDivider} />
            <View style={styles.balanceStat}>
              <View style={[styles.balanceStatIcon, { backgroundColor: "rgba(248, 113, 113, 0.25)" }]}>
                <Feather name="trending-down" size={13} color="#f87171" />
              </View>
              <View>
                <Text style={styles.balanceStatLabel}>{t.expenses}</Text>
                <Text style={[styles.balanceStatValue, { color: "#f87171" }]}>-{format(stats.expenses)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Patrimony Card */}
        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.infoCardRow}>
            <View style={[styles.infoIcon, { backgroundColor: colors.primary + "15" }]}>
              <Feather name="archive" size={16} color={colors.primary} />
            </View>
            <View style={styles.infoCardText}>
              <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>{t.currentPatrimony}</Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>
                {formatExact(effectivePatrimony)}
              </Text>
            </View>
            {patrimonGain > 0 && (
              <View style={[styles.badge, { backgroundColor: "#dcfce7" }]}>
                <Feather name="trending-up" size={12} color="#16a34a" />
                <Text style={[styles.badgeText, { color: "#16a34a" }]}>
                  +{formatExact(effectivePatrimony - (profile.initialPatrimony ?? 0))}
                </Text>
              </View>
            )}
            {patrimonGain < 0 && (
              <View style={[styles.badge, { backgroundColor: "#fee2e2" }]}>
                <Feather name="trending-down" size={12} color="#ef4444" />
                <Text style={[styles.badgeText, { color: "#ef4444" }]}>
                  {formatExact(effectivePatrimony - (profile.initialPatrimony ?? 0))}
                </Text>
              </View>
            )}
          </View>

          {displayIncome > 0 && (
            <>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={[styles.progressLabel, { color: colors.mutedForeground }]}>
                    {t.budgetUsed}
                  </Text>
                  <Text style={[styles.progressPct, { color: budgetPct > 80 ? colors.expense : colors.primary }]}>
                    {budgetPct.toFixed(0)}%
                  </Text>
                </View>
                <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${budgetPct}%`,
                        backgroundColor: budgetPct > 80 ? colors.expense : colors.primary,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.progressSub, { color: colors.mutedForeground }]}>
                  {formatExact(stats.expenses)} {t.ofLabel} {formatExact(profile.monthlyIncome)}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Goals Summary Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t.tabGoals}</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/goals")}>
              <Text style={[styles.sectionLink, { color: colors.primary }]}>{t.seeAll || "Ver todos"}</Text>
            </TouchableOpacity>
          </View>

          {goals.length === 0 ? (
            <View style={[styles.emptyStateSmall, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.emptyTextSmall, { color: colors.mutedForeground }]}>{t.goalEmpty}</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.goalsScroll}>
              {goals.map((goal) => {
                const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                return (
                  <TouchableOpacity 
                    key={goal.id} 
                    style={[styles.goalCardMini, { backgroundColor: colors.card, borderColor: colors.border }]}
                    onPress={() => router.push("/(tabs)/goals")}
                  >
                    <View style={styles.goalCardMiniHeader}>
                      <Text style={[styles.goalCardMiniTitle, { color: colors.foreground }]} numberOfLines={1}>{goal.title}</Text>
                      <Text style={[styles.goalCardMiniPerc, { color: colors.primary }]}>{progress.toFixed(0)}%</Text>
                    </View>
                    <View style={[styles.goalCardMiniTrack, { backgroundColor: colors.border }]}>
                      <View style={[styles.goalCardMiniFill, { width: `${progress}%`, backgroundColor: colors.primary }]} />
                    </View>
                    <Text style={[styles.goalCardMiniValue, { color: colors.mutedForeground }]}>
                      {format(goal.currentAmount)} / {format(goal.targetAmount)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t.recentTransactions}</Text>

          {recentTxs.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="inbox" size={28} color={colors.mutedForeground} />
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>{t.noTransactions}</Text>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>{t.noTransactionsHint}</Text>
            </View>
          ) : (
            <View style={styles.txList}>
              {recentTxs.map((tx) => (
                <TransactionCard
                  key={tx.id}
                  transaction={tx}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setEditTx(tx);
                    setShowModal(true);
                  }}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <AddTransactionModal
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          setEditTx(null);
        }}
        editTransaction={editTx}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerSection: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greetingText: { flex: 1 },
  greeting: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.4,
  },
  greetingBase: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0,
  },
  greetingName: {
    fontSize: 36,
    fontFamily: "Caveat_700Bold",
    letterSpacing: 0.5,
    lineHeight: 40,
    marginTop: -2,
  },
  greetingSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  addIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  balanceCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.75)",
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 38,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: -1,
    marginBottom: 16,
  },
  balanceStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  balanceStat: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  balanceStatIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  balanceStatLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#ffffff",
  },
  balanceStatValue: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  balanceDivider: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  infoCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: "hidden",
  },
  infoCardRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  infoCardText: { flex: 1 },
  infoLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  infoValue: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  divider: { height: 1 },
  progressSection: {
    padding: 14,
    paddingTop: 10,
    gap: 6,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  progressPct: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
  progressSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
  },
  sectionLink: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  goalsScroll: {
    gap: 12,
    paddingRight: 20,
  },
  goalCardMini: {
    width: 200,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
  },
  goalCardMiniHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  goalCardMiniTitle: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
  goalCardMiniPerc: {
    fontSize: 12,
    fontFamily: "Outfit_700Bold",
  },
  goalCardMiniTrack: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  goalCardMiniFill: {
    height: "100%",
    borderRadius: 2,
  },
  goalCardMiniValue: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  emptyStateSmall: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTextSmall: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  txList: { gap: 8 },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  emptyText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 19,
  },
});
