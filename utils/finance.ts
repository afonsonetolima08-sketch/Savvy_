import { Transaction, TransactionCategory, UserProfile } from "@/context/AppContext";
import { Translations } from "./i18n";

export const CATEGORY_ICONS: Record<TransactionCategory, string> = {
  salary: "briefcase",
  freelance: "laptop",
  investment: "trending-up",
  gift: "gift",
  food: "coffee",
  housing: "home",
  transport: "navigation",
  health: "heart",
  entertainment: "film",
  shopping: "shopping-bag",
  education: "book",
  utilities: "zap",
  travel: "globe",
  other: "more-horizontal",
};

export const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  salary: "#16a34a",
  freelance: "#0891b2",
  investment: "#7c3aed",
  gift: "#db2777",
  food: "#ea580c",
  housing: "#ca8a04",
  transport: "#2563eb",
  health: "#dc2626",
  entertainment: "#9333ea",
  shopping: "#c026d3",
  education: "#0d9488",
  utilities: "#d97706",
  travel: "#0284c7",
  other: "#6b7280",
};

export const INCOME_CATEGORIES: TransactionCategory[] = [
  "salary",
  "freelance",
  "investment",
  "gift",
];

export const EXPENSE_CATEGORIES: TransactionCategory[] = [
  "food",
  "housing",
  "transport",
  "health",
  "entertainment",
  "shopping",
  "education",
  "utilities",
  "travel",
  "other",
];

export const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: "€",
  USD: "$",
  BRL: "R$",
  GBP: "£",
  JPY: "¥",
  CHF: "Fr",
  CAD: "CA$",
};

export function formatCurrency(amount: number, currency: string, exact = false): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";
  if (!exact) {
    if (absAmount >= 1_000_000) {
      return `${sign}${symbol}${(absAmount / 1_000_000).toFixed(2)}M`;
    }
    if (absAmount >= 1_000) {
      return `${sign}${symbol}${(absAmount / 1_000).toFixed(2)}k`;
    }
  }
  return `${sign}${symbol}${absAmount.toFixed(2)}`;
}

export function getMonthTransactions(transactions: Transaction[], monthOffset = 0): Transaction[] {
  const target = new Date();
  target.setMonth(target.getMonth() + monthOffset);
  const targetY = target.getFullYear();
  const targetM = target.getMonth() + 1;

  return transactions.filter((tx) => {
    if (!tx.date) return false;
    
    // Extract YYYY and MM strictly from string to prevent timezone offset boundary bugs
    const timestampMatch = tx.date.match(/^(\d{4})[/-](\d{1,2})/);
    if (timestampMatch) {
      return parseInt(timestampMatch[1], 10) === targetY && parseInt(timestampMatch[2], 10) === targetM;
    }
    
    // Fallback if Date is oddly formatted
    const parsed = new Date(tx.date);
    if (!isNaN(parsed.getTime())) {
      return parsed.getFullYear() === targetY && parsed.getMonth() === targetM - 1;
    }
    
    return false;
  });
}

export function getMonthlyStats(transactions: Transaction[], monthOffset = 0) {
  const monthTxs = getMonthTransactions(transactions, monthOffset);
  const income = monthTxs.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount || 0), 0);
  const expenses = monthTxs.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount || 0), 0);
  return { income, expenses, balance: income - expenses, count: monthTxs.length };
}

export function getCategoryBreakdown(expenseTxs: Transaction[]): Record<string, number> {
  const breakdown: Record<string, number> = {};
  for (const tx of expenseTxs) {
    breakdown[tx.category] = (breakdown[tx.category] ?? 0) + tx.amount;
  }
  return breakdown;
}

export interface MonthData {
  key: string;
  label: string;
  shortLabel: string;
  income: number;
  expenses: number;
  balance: number;
  count: number;
}

export function getLast6MonthsData(transactions: Transaction[], language = "pt-PT"): MonthData[] {
  const result: MonthData[] = [];
  const locale = language === "pt" ? "pt-PT" : language === "en" ? "en-US" : language === "es" ? "es-ES" : language === "fr" ? "fr-FR" : "pt-PT";
  
  for (let i = -5; i <= 0; i++) {
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const stats = getMonthlyStats(transactions, i);
    const monthName = target.toLocaleDateString(locale, { month: "short" });
    const fullName = target.toLocaleDateString(locale, { month: "long", year: "numeric" });
    result.push({
      key: `${target.getFullYear()}-${target.getMonth()}`,
      label: fullName.charAt(0).toUpperCase() + fullName.slice(1),
      shortLabel: monthName.charAt(0).toUpperCase() + monthName.slice(1),
      ...stats,
    });
  }
  return result;
}

export function getBestAndWorstMonths(monthsData: MonthData[]): {
  best: MonthData | null;
  worst: MonthData | null;
} {
  const withData = monthsData.filter((m) => m.count > 0);
  if (withData.length === 0) return { best: null, worst: null };
  const sorted = [...withData].sort((a, b) => b.balance - a.balance);
  return { best: sorted[0] ?? null, worst: sorted[sorted.length - 1] ?? null };
}

export function getAllTimeCategoryBreakdown(transactions: Transaction[]): Record<string, number> {
  const expenses = transactions.filter((t) => t.type === "expense");
  return getCategoryBreakdown(expenses);
}

export function generateTips(transactions: Transaction[], profile: UserProfile, t: Translations): string[] {
  const tips: string[] = [];
  const { income, expenses } = getMonthlyStats(transactions);
  const expTxs = getMonthTransactions(transactions).filter((t) => t.type === "expense");
  const breakdown = getCategoryBreakdown(expTxs);
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
  const firstName = profile.name?.split(" ")[0] || "";

  if (profile.mainObjective === "save" && savingsRate < 20) {
    tips.push(t.tipSavingsTarget.replace("{name}", firstName ? firstName + ", " : ""));
  }

  if (income > 0 && expenses > income * 0.8) {
    tips.push(t.tipHighExpenses);
  }

  const topCategory = Object.entries(breakdown).sort(([, a], [, b]) => b - a)[0];
  if (topCategory && income > 0 && topCategory[1] > income * 0.3) {
    const catKey = `cat${(topCategory[0] as string).charAt(0).toUpperCase() + (topCategory[0] as string).slice(1)}` as keyof Translations;
    const catLabel = t[catKey] || topCategory[0];
    tips.push(t.tipTopCategory
      .replace("{category}", String(catLabel))
      .replace("{percent}", String(Math.round((topCategory[1] / income) * 100))));
  }

  if (profile.debts > 0) {
    tips.push(t.tipDebtPriority);
  }

  if (breakdown["entertainment"] && income > 0 && breakdown["entertainment"] > income * 0.15) {
    tips.push(t.tipEntertainmentLimit);
  }

  if (savingsRate > 30) {
    tips.push(t.tipSavingsSuccess);
  }

  if (profile.investmentHorizon === "long" && expenses < income) {
    tips.push(t.tipLongHorizon);
  }

  if (tips.length === 0) {
    tips.push(t.tipNoData1);
    tips.push(t.tipNoData2);
  }

  return tips.slice(0, 4);
}

export function formatDate(dateStr: string, language = "pt-PT"): string {
  const d = new Date(dateStr);
  const locale = language === "pt" ? "pt-PT" : language === "en" ? "en-US" : language === "es" ? "es-ES" : language === "fr" ? "fr-FR" : "pt-PT";
  return d.toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" });
}

export function getMonthName(offset = 0, language = "pt-PT"): string {
  const d = new Date();
  d.setMonth(d.getMonth() + offset);
  const locale = language === "pt" ? "pt-PT" : language === "en" ? "en-US" : language === "es" ? "es-ES" : language === "fr" ? "fr-FR" : "pt-PT";
  return d.toLocaleDateString(locale, { month: "long", year: "numeric" });
}
