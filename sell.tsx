import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

type CarCondition = "Tokunbo" | "Foreign Used" | "Brand New" | "Nigerian Used";

const CONDITIONS: CarCondition[] = ["Tokunbo", "Foreign Used", "Brand New", "Nigerian Used"];

export default function SellScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const [photos, setPhotos] = useState<string[]>([]);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [mileage, setMileage] = useState("");
  const [condition, setCondition] = useState<CarCondition>("Tokunbo");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow access to your photo library.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsMultipleSelection: true,
      quality: 0.85,
      selectionLimit: 8,
    });
    if (!result.canceled) {
      const uris = result.assets.map((a) => a.uri);
      setPhotos((prev) => [...prev, ...uris].slice(0, 8));
    }
  };

  const removePhoto = (idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleInspect = () => {
    if (photos.length === 0) {
      Alert.alert("Add Photos", "Please add at least one photo before running AI inspection.");
      return;
    }
    router.push({ pathname: "/inspect", params: { photoUris: JSON.stringify(photos) } });
  };

  const handleSubmit = () => {
    if (!user) {
      router.push("/auth");
      return;
    }
    if (!make || !model || !year || !price) {
      Alert.alert("Missing Info", "Please fill in Make, Model, Year and Price.");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSubmitted(true);
  };

  const handleReset = () => {
    setPhotos([]);
    setMake(""); setModel(""); setYear(""); setPrice("");
    setMileage(""); setCondition("Tokunbo"); setLocation(""); setDescription("");
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <View style={styles.successContainer}>
          <View style={[styles.successIcon, { backgroundColor: colors.success + "22" }]}>
            <Feather name="check-circle" size={56} color={colors.success} />
          </View>
          <Text style={[styles.successTitle, { color: colors.foreground }]}>Listing Posted!</Text>
          <Text style={[styles.successSub, { color: colors.mutedForeground }]}>
            Your car has been listed on Autoverse. Buyers can now contact you directly.
          </Text>
          <Pressable
            onPress={handleReset}
            style={[styles.resetBtn, { backgroundColor: colors.gold }]}
          >
            <Text style={[styles.resetBtnText, { color: colors.primaryForeground }]}>
              Post Another Car
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 140 : 140 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.header, { paddingTop: topPad + 12 }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>List Your Car</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Add photos and details to reach thousands of buyers
          </Text>
        </View>

        {/* Photos */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.foreground }]}>
            Photos ({photos.length}/8)
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photoRow}>
            <Pressable
              onPress={pickImages}
              style={[styles.addPhoto, { backgroundColor: colors.secondary, borderColor: colors.border }]}
            >
              <Feather name="camera" size={28} color={colors.gold} />
              <Text style={[styles.addPhotoText, { color: colors.mutedForeground }]}>Add Photos</Text>
            </Pressable>
            {photos.map((uri, i) => (
              <View key={i} style={styles.photoThumb}>
                <Image source={{ uri }} style={styles.thumbImg} contentFit="cover" />
                <Pressable onPress={() => removePhoto(i)} style={styles.removePhoto}>
                  <Feather name="x" size={12} color="#fff" />
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* AI Inspect Button */}
        <Pressable
          onPress={handleInspect}
          style={({ pressed }) => [
            styles.aiBtn,
            { backgroundColor: colors.gold, borderRadius: colors.radius, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Feather name="zap" size={20} color={colors.primaryForeground} />
          <View>
            <Text style={[styles.aiBtnTitle, { color: colors.primaryForeground }]}>
              Run AI AutoInspect
            </Text>
            <Text style={[styles.aiBtnSub, { color: colors.primaryForeground + "CC" }]}>
              Get AI-generated condition report & trust badge
            </Text>
          </View>
          <Feather name="chevron-right" size={18} color={colors.primaryForeground} style={styles.aiBtnArrow} />
        </Pressable>

        {/* Form */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Car Details</Text>
          <View style={styles.formGrid}>
            <Field label="Make" value={make} onChangeText={setMake} placeholder="e.g. Toyota" colors={colors} flex />
            <Field label="Model" value={model} onChangeText={setModel} placeholder="e.g. Camry" colors={colors} flex />
          </View>
          <View style={styles.formGrid}>
            <Field label="Year" value={year} onChangeText={setYear} placeholder="2021" colors={colors} numeric flex />
            <Field label="Mileage (km)" value={mileage} onChangeText={setMileage} placeholder="34000" colors={colors} numeric flex />
          </View>
          <Field label="Price (₦ Millions)" value={price} onChangeText={setPrice} placeholder="38" colors={colors} numeric />
          <Field label="Location" value={location} onChangeText={setLocation} placeholder="e.g. Lekki, Lagos" colors={colors} />
        </View>

        {/* Condition */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Condition</Text>
          <View style={styles.conditionRow}>
            {CONDITIONS.map((c) => (
              <Pressable
                key={c}
                onPress={() => setCondition(c)}
                style={[
                  styles.conditionChip,
                  {
                    backgroundColor: condition === c ? colors.gold : colors.secondary,
                    borderColor: condition === c ? colors.gold : colors.border,
                  },
                ]}
              >
                <Text style={[styles.conditionText, { color: condition === c ? colors.primaryForeground : colors.silver }]}>
                  {c}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Tell buyers about this car..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            numberOfLines={5}
            style={[
              styles.textarea,
              { color: colors.foreground, backgroundColor: colors.secondary, borderColor: colors.border, borderRadius: colors.radius },
            ]}
          />
        </View>

        {/* Submit */}
        <Pressable
          onPress={handleSubmit}
          style={({ pressed }) => [
            styles.submitBtn,
            { backgroundColor: colors.gold, borderRadius: colors.radius, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={[styles.submitText, { color: colors.primaryForeground }]}>Post Listing</Text>
        </Pressable>
      </KeyboardAwareScrollView>
    </View>
  );
}

function Field({
  label, value, onChangeText, placeholder, colors, numeric, flex,
}: {
  label: string; value: string; onChangeText: (t: string) => void;
  placeholder: string; colors: any; numeric?: boolean; flex?: boolean;
}) {
  return (
    <View style={[styles.field, flex && { flex: 1 }]}>
      <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        keyboardType={numeric ? "numeric" : "default"}
        style={[
          styles.fieldInput,
          { color: colors.foreground, backgroundColor: colors.secondary, borderColor: colors.border, borderRadius: colors.radius },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 20 },
  title: { fontSize: 24, fontFamily: "Inter_700Bold", marginBottom: 4 },
  subtitle: { fontSize: 14, fontFamily: "Inter_400Regular" },
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionLabel: { fontSize: 16, fontFamily: "Inter_600SemiBold", marginBottom: 12 },
  photoRow: { gap: 10, paddingRight: 16 },
  addPhoto: {
    width: 90,
    height: 90,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  addPhotoText: { fontSize: 10, fontFamily: "Inter_400Regular", textAlign: "center" },
  photoThumb: { width: 90, height: 90, borderRadius: 10, overflow: "hidden" },
  thumbImg: { width: "100%", height: "100%" },
  removePhoto: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  aiBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    gap: 12,
  },
  aiBtnTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  aiBtnSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  aiBtnArrow: { marginLeft: "auto" },
  formGrid: { flexDirection: "row", gap: 10, marginBottom: 10 },
  field: { marginBottom: 10 },
  fieldLabel: { fontSize: 12, fontFamily: "Inter_500Medium", marginBottom: 6 },
  fieldInput: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  conditionRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  conditionChip: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  conditionText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  textarea: {
    borderWidth: 1,
    padding: 14,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    minHeight: 100,
    textAlignVertical: "top",
  },
  submitBtn: {
    marginHorizontal: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  successIcon: { width: 100, height: 100, borderRadius: 50, alignItems: "center", justifyContent: "center" },
  successTitle: { fontSize: 28, fontFamily: "Inter_700Bold", textAlign: "center" },
  successSub: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 22 },
  resetBtn: { borderRadius: 12, paddingHorizontal: 28, paddingVertical: 14, marginTop: 8 },
  resetBtnText: { fontSize: 16, fontFamily: "Inter_700Bold" },
});
