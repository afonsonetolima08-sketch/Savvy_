import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type TransactionCategory =
  | "salary"
  | "freelance"
  | "investment"
  | "gift"
  | "food"
  | "housing"
  | "transport"
  | "health"
  | "entertainment"
  | "shopping"
  | "education"
  | "utilities"
  | "travel"
  | "other";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description: string;
  date: string;
}

export interface UserProfile {
  name: string;
  financialGoal: string;
  initialPatrimony: number;
  currentPatrimony: number;
  monthlyIncome: number;
  debts: number;
  hasDependents: boolean;
  mainObjective: string;
  investmentHorizon: string;
  currency: string;
  language: string;
  notificationsEnabled: boolean;
  onboardingCompleted: boolean;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  createdAt: string;
}

const DEFAULT_PROFILE: UserProfile = {
  name: "",
  financialGoal: "",
  initialPatrimony: 0,
  currentPatrimony: 0,
  monthlyIncome: 0,
  debts: 0,
  hasDependents: false,
  mainObjective: "",
  investmentHorizon: "",
  currency: "EUR",
  language: "pt",
  notificationsEnabled: true,
  onboardingCompleted: false,
};

export interface ExchangeRates {
  [key: string]: number;
}

interface AppContextValue {
  session: Session | null;
  transactions: Transaction[];
  goals: Goal[];
  profile: UserProfile;
  effectivePatrimony: number;
  exchangeRates: ExchangeRates;
  addTransaction: (t: Omit<Transaction, "id">) => void;
  updateTransaction: (t: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addGoal: (g: Omit<Goal, "id" | "createdAt">) => void;
  updateGoal: (g: Goal) => void;
  deleteGoal: (id: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  convertAmount: (amount: number, toCurrency: string) => number;
  toBaseAmount: (amount: number, fromCurrency: string) => number;
  isLoading: boolean;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<{ error: string | null }>;
}

const AppContext = createContext<AppContextValue | null>(null);

const HARDCODED_RATES: ExchangeRates = {
  EUR: 1,
  USD: 1.09,
  BRL: 5.45,
  GBP: 0.86,
  JPY: 165.2,
  CHF: 0.96,
  CAD: 1.47,
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [exchangeRates] = useState<ExchangeRates>(HARDCODED_RATES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadCloudData(session.user.id);
      else setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) loadCloudData(session.user.id);
      else {
        setTransactions([]);
        setGoals([]);
        setProfile(DEFAULT_PROFILE);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadCloudData = async (userId: string) => {
    setIsLoading(true);
    try {
      const [txsRes, profileRes] = await Promise.all([
        supabase.from("transactions").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").eq("id", userId).single(),
      ]);

      if (txsRes.data) {
        setTransactions(txsRes.data as Transaction[]);
      }

      // Load goals from local storage as requested
      const savedGoals = await AsyncStorage.getItem("savvy_goals");
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      }

      if (profileRes.data) {
        const p = profileRes.data;
        setProfile({
          name: p.name || "",
          financialGoal: p.financial_goal || "",
          initialPatrimony: p.initial_patrimony || 0,
          currentPatrimony: p.current_patrimony || 0,
          monthlyIncome: p.monthly_income || 0,
          debts: p.debts || 0,
          hasDependents: p.has_dependents || false,
          mainObjective: p.main_objective || "",
          investmentHorizon: p.investment_horizon || "",
          currency: p.currency || "EUR",
          language: p.language || "pt",
          notificationsEnabled: p.notifications_enabled ?? true,
          onboardingCompleted: p.onboarding_completed || false,
        });
      }
    } catch (err) {
      console.error("Erro ao carregar dados remotos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const effectivePatrimony = useMemo(() => {
    const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
    const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
    return (profile.initialPatrimony ?? 0) + totalIncome - totalExpenses;
  }, [transactions, profile.initialPatrimony]);

  const addTransaction = useCallback(async (t: Omit<Transaction, "id">) => {
    if (!session) return;

    // Optimistic update: add to local state immediately with a temporary ID
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const optimisticTx: Transaction = { ...t, id: tempId };
    setTransactions((prev) => [optimisticTx, ...prev]);

    try {
      const { data, error } = await supabase.from("transactions").insert([{
        user_id: session.user.id,
        type: t.type,
        amount: t.amount,
        category: t.category,
        description: t.description,
        date: t.date
      }]).select().single();

      if (!error && data) {
        // Replace the optimistic entry with the real server data
        setTransactions((prev) =>
          prev.map((tx) => (tx.id === tempId ? (data as Transaction) : tx))
        );
      } else if (error) {
        // Rollback optimistic update on error
        setTransactions((prev) => prev.filter((tx) => tx.id !== tempId));
        console.error("addTransaction error:", error);
      }
    } catch (e) {
      // Rollback on network failure
      setTransactions((prev) => prev.filter((tx) => tx.id !== tempId));
      console.error(e);
    }
  }, [session]);

  const updateTransaction = useCallback(async (t: Transaction) => {
    if (!session) return;

    // Optimistic update
    let oldTx: Transaction | undefined;
    setTransactions((prev) => {
      oldTx = prev.find((tx) => tx.id === t.id);
      return prev.map((tx) => (tx.id === t.id ? t : tx));
    });

    try {
      const { error } = await supabase.from("transactions").update({
        type: t.type,
        amount: t.amount,
        category: t.category,
        description: t.description,
        date: t.date
      }).eq("id", t.id);

      if (error) {
        // Rollback
        if (oldTx) {
          setTransactions((prev) => prev.map((tx) => (tx.id === t.id ? oldTx! : tx)));
        }
        console.error("updateTransaction error:", error);
      }
    } catch (e) {
      // Rollback
      if (oldTx) {
        setTransactions((prev) => prev.map((tx) => (tx.id === t.id ? oldTx! : tx)));
      }
      console.error(e);
    }
  }, [session]);

  const deleteTransaction = useCallback(async (id: string) => {
    if (!session) return;

    // Optimistic delete
    let deletedTx: Transaction | undefined;
    setTransactions((prev) => {
      deletedTx = prev.find((tx) => tx.id === id);
      return prev.filter((tx) => tx.id !== id);
    });

    try {
      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (error) {
        // Rollback
        if (deletedTx) {
          setTransactions((prev) => [deletedTx!, ...prev]);
        }
        console.error("deleteTransaction error:", error);
      }
    } catch (e) {
      // Rollback
      if (deletedTx) {
        setTransactions((prev) => [deletedTx!, ...prev]);
      }
      console.error(e);
    }
  }, [session]);

  const addGoal = useCallback(async (g: Omit<Goal, "id" | "createdAt">) => {
    const newGoal: Goal = { 
      ...g, 
      id: `goal_${Date.now()}`, 
      createdAt: new Date().toISOString() 
    };
    const updated = [newGoal, ...goals];
    setGoals(updated);
    try {
      await AsyncStorage.setItem("savvy_goals", JSON.stringify(updated));
    } catch (e) {
      console.error("Save goals error:", e);
    }
  }, [goals]);

  const updateGoal = useCallback(async (g: Goal) => {
    const updated = goals.map(item => item.id === g.id ? g : item);
    setGoals(updated);
    try {
      await AsyncStorage.setItem("savvy_goals", JSON.stringify(updated));
    } catch (e) {
      console.error("Save goals error:", e);
    }
  }, [goals]);

  const deleteGoal = useCallback(async (id: string) => {
    const updated = goals.filter(item => item.id !== id);
    setGoals(updated);
    try {
      await AsyncStorage.setItem("savvy_goals", JSON.stringify(updated));
    } catch (e) {
      console.error("Save goals error:", e);
    }
  }, [goals]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!session) return;
    const p = { ...profile, ...updates };
    setProfile(p); // Optimistic UI update

    try {
      await supabase.from("profiles").upsert({
        id: session.user.id,
        name: p.name,
        financial_goal: p.financialGoal,
        initial_patrimony: p.initialPatrimony,
        current_patrimony: p.currentPatrimony,
        monthly_income: p.monthlyIncome,
        debts: p.debts,
        has_dependents: p.hasDependents,
        main_objective: p.mainObjective,
        investment_horizon: p.investmentHorizon,
        currency: p.currency,
        language: p.language,
        notifications_enabled: p.notificationsEnabled,
        onboarding_completed: p.onboardingCompleted,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.error(e);
    }
  }, [session, profile]);

  const convertAmount = useCallback(
    (amount: number, toCurrency: string) => {
      const numAmount = Number(amount) || 0;
      const toRate = exchangeRates[toCurrency] ?? 1;
      return numAmount * toRate;
    },
    [exchangeRates]
  );

  const toBaseAmount = useCallback(
    (amount: number, fromCurrency: string) => {
      const numAmount = Number(amount) || 0;
      const fromRate = exchangeRates[fromCurrency] ?? 1;
      return numAmount / fromRate;
    },
    [exchangeRates]
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const deleteAccount = useCallback(async (): Promise<{ error: string | null }> => {
    if (!session) return { error: "No session" };
    try {
      // Call the improved "all-in-one" PostgreSQL function
      const { error } = await supabase.rpc("delete_user");
      if (error) throw error;
      
      await supabase.auth.signOut();
      return { error: null };
    } catch (e: any) {
      console.error("deleteAccount:", e);
      return { error: e?.message ?? "Unknown error" };
    }
  }, [session]);

  return (
    <AppContext.Provider
      value={{
        session,
        transactions,
        goals,
        profile,
        effectivePatrimony,
        exchangeRates,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addGoal,
        updateGoal,
        deleteGoal,
        updateProfile,
        convertAmount,
        toBaseAmount,
        isLoading,
        signOut,
        deleteAccount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
