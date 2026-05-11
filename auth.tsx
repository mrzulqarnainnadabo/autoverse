import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function AuthScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login } = useAuth();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const [step, setStep] = useState<"phone" | "otp" | "name">("phone");
  const [phone, setPhone] = useState("+234 ");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef<Array<TextInput | null>>([]);

  const handleSendOtp = async () => {
    if (phone.replace(/\D/g, "").length < 11) {
      Alert.alert("Invalid Number", "Enter a valid Nigerian phone number.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setStep("otp");
  };

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      Alert.alert("Invalid Code", "Enter the 6-digit code sent to your phone.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setStep("name");
  };

  const handleComplete = async () => {
    if (!name.trim()) {
      Alert.alert("Name Required", "Please enter your name.");
      return;
    }
    setLoading(true);
    await login(phone, name.trim());
    setLoading(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace("/(tabs)/profile");
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.topSection, { paddingTop: topPad + 20 }]}>
          <Pressable
            onPress={() => router.back()}
            style={[styles.closeBtn, { backgroundColor: colors.secondary, borderColor: colors.border }]}
          >
            <Feather name="x" size={20} color={colors.foreground} />
          </Pressable>

          <View style={styles.logoSection}>
            <View style={[styles.logoCircle, { backgroundColor: colors.gold + "22", borderColor: colors.gold }]}>
              <Text style={[styles.logoAV, { color: colors.gold }]}>AV</Text>
            </View>
            <Text style={[styles.brand, { color: colors.foreground }]}>
              AUTO<Text style={{ color: colors.gold }}>VERSE</Text>
            </Text>
            <Text style={[styles.tagline, { color: colors.mutedForeground }]}>
              Driving Trust. Delivering Value.
            </Text>
          </View>
        </View>

        <View style={styles.formSection}>
          {step === "phone" && (
            <>
              <Text style={[styles.stepTitle, { color: colors.foreground }]}>Enter Your Number</Text>
              <Text style={[styles.stepSub, { color: colors.mutedForeground }]}>
                We'll send a verification code via SMS
              </Text>
              <View style={[styles.phoneInput, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
                <Text style={[styles.flag, { color: colors.foreground }]}>🇳🇬</Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+234 8012345678"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="phone-pad"
                  style={[styles.phoneText, { color: colors.foreground }]}
                />
              </View>
              <Pressable
                onPress={handleSendOtp}
                disabled={loading}
                style={({ pressed }) => [
                  styles.primaryBtn,
                  { backgroundColor: colors.gold, borderRadius: colors.radius, opacity: pressed ? 0.85 : 1 },
                ]}
              >
                {loading ? (
                  <ActivityIndicator color={colors.primaryForeground} />
                ) : (
                  <Text style={[styles.primaryBtnText, { color: colors.primaryForeground }]}>Send Code</Text>
                )}
              </Pressable>
            </>
          )}

          {step === "otp" && (
            <>
              <Text style={[styles.stepTitle, { color: colors.foreground }]}>Enter OTP</Text>
              <Text style={[styles.stepSub, { color: colors.mutedForeground }]}>
                Code sent to {phone}
              </Text>
              <View style={styles.otpRow}>
                {otp.map((digit, i) => (
                  <TextInput
                    key={i}
                    ref={(r) => { otpRefs.current[i] = r; }}
                    value={digit}
                    onChangeText={(t) => {
                      const next = [...otp];
                      next[i] = t.slice(-1);
                      setOtp(next);
                      if (t && i < 5) otpRefs.current[i + 1]?.focus();
                      if (!t && i > 0) otpRefs.current[i - 1]?.focus();
                    }}
                    keyboardType="numeric"
                    maxLength={1}
                    textAlign="center"
                    style={[
                      styles.otpBox,
                      {
                        backgroundColor: colors.secondary,
                        borderColor: digit ? colors.gold : colors.border,
                        color: colors.foreground,
                      },
                    ]}
                  />
                ))}
              </View>
              <Text style={[styles.demoNote, { color: colors.mutedForeground }]}>
                Demo: enter any 6 digits
              </Text>
              <Pressable
                onPress={handleVerifyOtp}
                disabled={loading}
                style={({ pressed }) => [
                  styles.primaryBtn,
                  { backgroundColor: colors.gold, borderRadius: colors.radius, opacity: pressed ? 0.85 : 1 },
                ]}
              >
                {loading ? (
                  <ActivityIndicator color={colors.primaryForeground} />
                ) : (
                  <Text style={[styles.primaryBtnText, { color: colors.primaryForeground }]}>Verify</Text>
                )}
              </Pressable>
              <Pressable onPress={() => setStep("phone")} style={styles.backLink}>
                <Text style={[styles.backLinkText, { color: colors.mutedForeground }]}>Change number</Text>
              </Pressable>
            </>
          )}

          {step === "name" && (
            <>
              <Text style={[styles.stepTitle, { color: colors.foreground }]}>What's Your Name?</Text>
              <Text style={[styles.stepSub, { color: colors.mutedForeground }]}>
                Help buyers and sellers know who they're talking to
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Full name"
                placeholderTextColor={colors.mutedForeground}
                style={[
                  styles.nameInput,
                  { backgroundColor: colors.secondary, borderColor: colors.border, color: colors.foreground },
                ]}
                autoFocus
              />
              <Pressable
                onPress={handleComplete}
                disabled={loading}
                style={({ pressed }) => [
                  styles.primaryBtn,
                  { backgroundColor: colors.gold, borderRadius: colors.radius, opacity: pressed ? 0.85 : 1 },
                ]}
              >
                {loading ? (
                  <ActivityIndicator color={colors.primaryForeground} />
                ) : (
                  <Text style={[styles.primaryBtnText, { color: colors.primaryForeground }]}>
                    Join Autoverse
                  </Text>
                )}
              </Pressable>
            </>
          )}

          <Text style={[styles.terms, { color: colors.mutedForeground }]}>
            By continuing you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topSection: { alignItems: "center", paddingBottom: 40 },
  closeBtn: {
    alignSelf: "flex-end",
    marginRight: 20,
    marginBottom: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoSection: { alignItems: "center", gap: 10 },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  logoAV: { fontSize: 26, fontFamily: "Inter_700Bold", letterSpacing: 2 },
  brand: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: 3 },
  tagline: { fontSize: 12, fontFamily: "Inter_400Regular", letterSpacing: 1 },
  formSection: { paddingHorizontal: 24, paddingBottom: 40, gap: 14 },
  stepTitle: { fontSize: 24, fontFamily: "Inter_700Bold" },
  stepSub: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
  phoneInput: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
  },
  flag: { fontSize: 22 },
  phoneText: { flex: 1, fontSize: 18, fontFamily: "Inter_500Medium" },
  primaryBtn: {
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryBtnText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  otpRow: { flexDirection: "row", gap: 10, justifyContent: "center" },
  otpBox: {
    width: 46,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  demoNote: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center" },
  backLink: { alignItems: "center", paddingVertical: 8 },
  backLinkText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  nameInput: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    fontFamily: "Inter_400Regular",
  },
  terms: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 17 },
});
