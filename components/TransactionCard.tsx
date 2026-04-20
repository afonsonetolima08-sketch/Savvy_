import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { Transaction, TransactionCategory } from "@/context/AppContext";
import { CATEGORY_COLORS, CATEGORY_ICONS, formatDate } from "@/utils/finance";
import { useCurrency } from "@/hooks/useCurrency";
import { useT } from "@/hooks/useTranslations";

interface TransactionCardProps {
  transaction: Transaction;
  onPress?: () => void;
  onLongPress?: () => void;
  delayLongPress?: number;
  onDelete?: () => void;
}

export default function TransactionCard({ transaction, onPress, onLongPress, delayLongPress, onDelete }: TransactionCardProps) {
  const colors = useColors();
  const { profile } = useApp();
  const { format } = useCurrency();
  const t = useT();
  const isIncome = transaction.type === "income";
  const catColor = CATEGORY_COLORS[transaction.category];
  const icon = CATEGORY_ICONS[transaction.category];

  const getCategoryLabel = (cat: TransactionCategory): string => {
    const map: Record<TransactionCategory, string> = {
      salary: t.catSalary,
      freelance: t.catFreelance,
      investment: t.catInvestment,
      gift: t.catGift,
      food: t.catFood,
      housing: t.catHousing,
      transport: t.catTransport,
      health: t.catHealth,
      entertainment: t.catEntertainment,
      shopping: t.catShopping,
      education: t.catEducation,
      utilities: t.catUtilities,
      travel: t.catTravel,
      other: t.catOther,
    };
    return map[cat];
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={delayLongPress}
      activeOpacity={0.75}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={[styles.iconWrap, { backgroundColor: catColor + "1a" }]}>
        <Feather name={icon as any} size={18} color={catColor} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.description, { color: colors.foreground }]} numberOfLines={1}>
          {transaction.description || getCategoryLabel(transaction.category)}
        </Text>
        <Text style={[styles.date, { color: colors.mutedForeground }]}>
          {getCategoryLabel(transaction.category)} · {formatDate(transaction.date, profile.language)}
        </Text>
      </View>
      <View style={styles.rightContent}>
        <Text style={[styles.amount, { color: isIncome ? colors.income : colors.expense }]}>
          {isIncome ? "+" : "-"}{format(transaction.amount)}
        </Text>
        {onDelete && (
          <TouchableOpacity
            onPress={(e) => {
              if (e && e.stopPropagation) e.stopPropagation();
              onDelete();
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.deleteBtn}
          >
            <Feather name="trash-2" size={18} color="#ef4444" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    gap: 2,
  },
  description: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  date: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  amount: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  deleteBtn: {
    padding: 4,
  },
});
