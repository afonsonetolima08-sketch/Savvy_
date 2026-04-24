import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { supabase } from "@/utils/supabase";

// ---------------------------------------------------------------------------
// Translations are only available inside AppProvider (via useT/useApp).
// Since this screen renders BEFORE the session is known we inline the strings
// for the two most-used languages to avoid the context crash.
// ---------------------------------------------------------------------------
const STRINGS = {
  title: "Bem-vindo de volta",
  subtitle: "Entra na tua conta para sincronizar as tuas finanças",
  loginBtn: "Entrar",
  registerLink: "Não tens conta?",
  registerLinkBold: "Regista-te agora",
  forgotPassword: "Esqueceste a palavra-passe?",
  forgotPasswordTitle: "Recuperar palavra-passe",
  forgotPasswordDesc:
    "Introduz o email da tua conta. Vais receber um link para criar uma nova palavra-passe.",
  forgotPasswordSend: "Enviar link",
  forgotPasswordSuccess: "Email enviado!",
  forgotPasswordSuccessMsg:
    "Verifica a tua caixa de entrada e segue o link para redefinir a palavra-passe.",
  forgotPasswordError: "Erro ao enviar. Verifica o endereço de email.",
  cancel: "Cancelar",
  errorTitle: "Erro de Login",
  requiredFields: "Por favor preenche o email e a password.",
};

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // ── Login form state ──
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ── Forgot password modal state ──
  const [forgotVisible, setForgotVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");

  // ── Login ──
  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Erro", STRINGS.requiredFields);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      Alert.alert(STRINGS.errorTitle, error.message);
    } else {
      router.replace("/(tabs)");
    }
  }

  // ── Forgot password ──
  function openForgotPassword() {
    setResetEmail(email); // pre-fill with whatever the user typed in the login field
    setResetError("");
    setForgotVisible(true);
  }

  async function handleSendReset() {
    const trimmed = resetEmail.trim().toLowerCase();
    if (!trimmed) return;

    setResetLoading(true);
    setResetError("");

    const { error } = await supabase.auth.resetPasswordForEmail(trimmed, {
      // Deep-link back into the app after the user sets a new password.
      // On mobile this opens the Expo Go / production app via the scheme.
      redirectTo: "savvy://reset-password",
    });

    setResetLoading(false);

    if (error) {
      setResetError(STRINGS.forgotPasswordError);
    } else {
      setForgotVisible(false);
      Alert.alert(STRINGS.forgotPasswordSuccess, STRINGS.forgotPasswordSuccessMsg);
    }
  }

  // ── Render ──
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.content, { paddingTop: insets.top + 40 }]}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={require("@/assets/images/logo.png")} 
            style={styles.logoImage} 
            resizeMode="contain" 
          />
        </View>

        <Text style={[styles.title, { color: colors.foreground }]}>{STRINGS.title}</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          {STRINGS.subtitle}
        </Text>

        {/* Form */}
        <View style={styles.form}>
          {/* Email */}
          <View style={[styles.inputGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="mail" size={20} color={colors.mutedForeground} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="Email"
              placeholderTextColor={colors.mutedForeground}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password */}
          <View style={[styles.inputGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="key" size={20} color={colors.mutedForeground} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="Password"
              placeholderTextColor={colors.mutedForeground}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
              <Feather
                name={showPassword ? "eye-off" : "eye"}
                size={18}
                color={colors.mutedForeground}
              />
            </TouchableOpacity>
          </View>

          {/* Forgot password link */}
          <TouchableOpacity
            onPress={openForgotPassword}
            style={styles.forgotLink}
            activeOpacity={0.7}
          >
            <Text style={[styles.forgotText, { color: colors.primary }]}>
              {STRINGS.forgotPassword}
            </Text>
          </TouchableOpacity>

          {/* Log in button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{STRINGS.loginBtn}</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Register link */}
        <TouchableOpacity onPress={() => router.push("/(auth)/register")} style={styles.linkButton}>
          <Text style={[styles.linkText, { color: colors.mutedForeground }]}>
            {STRINGS.registerLink}{" "}
            <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold" }}>
              {STRINGS.registerLinkBold}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Forgot password modal ── */}
      <Modal
        visible={forgotVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setForgotVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          {/* Modal header */}
          <View
            style={[
              styles.modalHeader,
              { borderBottomColor: colors.border, paddingTop: insets.top + 16 },
            ]}
          >
            <TouchableOpacity onPress={() => setForgotVisible(false)} hitSlop={12}>
              <Feather name="x" size={22} color={colors.foreground} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>
              {STRINGS.forgotPasswordTitle}
            </Text>
            <View style={{ width: 22 }} />
          </View>

          {/* Modal body */}
          <View style={styles.modalBody}>
            {/* Lock icon */}
            <View style={[styles.modalIcon, { backgroundColor: colors.primary + "12" }]}>
              <Feather name="mail" size={26} color={colors.primary} />
            </View>

            <Text style={[styles.modalDesc, { color: colors.mutedForeground }]}>
              {STRINGS.forgotPasswordDesc}
            </Text>

            {/* Email input */}
            <View
              style={[
                styles.resetInputGroup,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Feather name="mail" size={18} color={colors.mutedForeground} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="Email"
                placeholderTextColor={colors.mutedForeground}
                value={resetEmail}
                onChangeText={(v) => {
                  setResetEmail(v);
                  setResetError("");
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                autoFocus
                returnKeyType="send"
                onSubmitEditing={handleSendReset}
              />
            </View>

            {/* Error message */}
            {!!resetError && (
              <View style={[styles.errorBox, { backgroundColor: "#FF3B3012", borderColor: "#FF3B3030" }]}>
                <Feather name="alert-circle" size={14} color="#FF3B30" />
                <Text style={styles.errorText}>{resetError}</Text>
              </View>
            )}

            {/* Send button */}
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor:
                    resetEmail.trim() && !resetLoading ? colors.primary : colors.border,
                  marginTop: 8,
                },
              ]}
              onPress={handleSendReset}
              disabled={!resetEmail.trim() || resetLoading}
              activeOpacity={0.85}
            >
              {resetLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>{STRINGS.forgotPasswordSend}</Text>
              )}
            </TouchableOpacity>

            {/* Cancel */}
            <TouchableOpacity
              onPress={() => setForgotVisible(false)}
              style={styles.cancelBtn}
              activeOpacity={0.7}
            >
              <Text style={[styles.cancelText, { color: colors.mutedForeground }]}>
                {STRINGS.cancel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoImage: {
    width: 180,
    height: 80,
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    marginBottom: 32,
    lineHeight: 22,
  },
  form: { gap: 14, marginBottom: 24 },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: { marginRight: 12 },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    height: "100%",
    outlineStyle: "none" as any,
  },
  forgotLink: {
    alignSelf: "flex-end",
    marginTop: -4,
  },
  forgotText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  button: {
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  linkButton: { alignItems: "center", paddingVertical: 16 },
  linkText: { fontSize: 15, fontFamily: "Inter_400Regular" },

  // ── Modal ──
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  modalBody: { padding: 24, gap: 16 },
  modalIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 4,
  },
  modalDesc: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    textAlign: "center",
  },
  resetInputGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  errorText: { fontSize: 13, fontFamily: "Inter_400Regular", color: "#FF3B30", flex: 1 },
  cancelBtn: { alignItems: "center", paddingVertical: 8 },
  cancelText: { fontSize: 15, fontFamily: "Inter_400Regular" },
});
