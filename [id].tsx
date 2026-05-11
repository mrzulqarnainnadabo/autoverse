import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import TrustBadge from "@/components/TrustBadge";
import { MOCK_CARS } from "@/constants/data";
import { useListings } from "@/context/ListingsContext";
import { useColors } from "@/hooks/useColors";

const { width: SCREEN_W } = Dimensions.get("window");

const localImages: Record<string, ReturnType<typeof require>> = {
  car1: require("@/assets/images/car1.png"),
  car2: require("@/assets/images/car2.png"),
};

export default function CarDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useListings();
  const [activePhoto, setActivePhoto] = useState(0);
  const [calcOpen, setCalcOpen] = useState(false);
  const [downPct, setDownPct] = useState("20");
  const [months, setMonths] = useState("24");

  const car = MOCK_CARS.find((c) => c.id === id);
  const fav = isFavorite(id ?? "");

  if (!car) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { top: insets.top + 12, backgroundColor: colors.card }]}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <View style={styles.notFound}>
          <Text style={[styles.notFoundText, { color: colors.mutedForeground }]}>Car not found</Text>
        </View>
      </View>
    );
  }

  const photos = Array(3).fill(car.localImage);

  const priceM = car.price * 1_000_000;
  const down = (parseFloat(downPct) || 20) / 100;
  const principal = priceM * (1 - down);
  const rate = 0.22 / 12;
  const n = parseInt(months) || 24;
  const monthly = principal > 0 && n > 0
    ? (principal * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1)
    : 0;
  const total = monthly * n;

  const handleCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(`tel:${car.dealerPhone}`);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Back + Fav buttons */}
      <Pressable
        onPress={() => router.back()}
        style={[styles.backBtn, { top: insets.top + 12, backgroundColor: "rgba(0,0,0,0.6)" }]}
      >
        <Feather name="arrow-left" size={20} color="#fff" />
      </Pressable>
      <Pressable
        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); toggleFavorite(car.id); }}
        style={[styles.favBtn, { top: insets.top + 12, backgroundColor: "rgba(0,0,0,0.6)" }]}
      >
        <Feather name="heart" size={20} color={fav ? colors.gold : "#fff"} />
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 140 : 140 }}>
        {/* Photo Carousel */}
        <FlatList
          data={photos}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
            setActivePhoto(idx);
          }}
          keyExtractor={(_, i) => i.toString()}
          renderItem={() =>
            car.localImage && localImages[car.localImage] ? (
              <Image source={localImages[car.localImage]} style={styles.photo} contentFit="cover" />
            ) : (
              <LinearGradient colors={["#1A1A2E", "#16213E", "#0F3460"]} style={styles.photo}>
                <Feather name="truck" size={64} color={colors.border} />
              </LinearGradient>
            )
          }
        />
        {/* Dots */}
        <View style={styles.dots}>
          {photos.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, { backgroundColor: i === activePhoto ? colors.gold : colors.border }]}
            />
          ))}
        </View>

        <View style={styles.content}>
          {/* Trust Badges */}
          {car.aiInspected && car.trustBadge && (
            <View style={styles.badgeRow}>
              <TrustBadge type={car.trustBadge} score={car.conditionScore} />
              {car.verified && <TrustBadge type="Dealer Verified" size="sm" />}
            </View>
          )}

          {/* Price & Title */}
          <Text style={[styles.price, { color: colors.gold }]}>₦{car.price}M</Text>
          <Text style={[styles.carTitle, { color: colors.foreground }]}>
            {car.year} {car.make} {car.model}
          </Text>

          {/* Meta badges */}
          <View style={styles.metaRow}>
            <MetaBadge icon="tag" label={car.condition} colors={colors} />
            <MetaBadge icon="map-pin" label={`${car.location}`} colors={colors} />
            <MetaBadge icon="activity" label={`${(car.mileage / 1000).toFixed(0)}k km`} colors={colors} />
          </View>

          {/* Specs */}
          <View style={[styles.specsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SpecRow label="Engine" value={car.engine} colors={colors} />
            <SpecRow label="Transmission" value={car.transmission} colors={colors} />
            <SpecRow label="Fuel Type" value={car.fuelType} colors={colors} />
            <SpecRow label="Color" value={car.color} colors={colors} />
            <SpecRow label="Seats" value={`${car.seats} seats`} colors={colors} last />
          </View>

          {/* AI Inspection Score */}
          {car.aiInspected && car.conditionScore != null && (
            <View style={[styles.scoreCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.scoreHeader}>
                <Feather name="zap" size={18} color={colors.gold} />
                <Text style={[styles.scoreTitle, { color: colors.foreground }]}>
                  AutoInspect AI Report
                </Text>
              </View>
              <View style={styles.scoreBody}>
                <View style={styles.scoreCircle}>
                  <View style={[styles.scoreCircleInner, { borderColor: colors.gold }]}>
                    <Text style={[styles.scoreNumber, { color: colors.gold }]}>{car.conditionScore}</Text>
                    <Text style={[styles.scoreOf, { color: colors.mutedForeground }]}>/100</Text>
                  </View>
                </View>
                <View style={styles.scoreInfo}>
                  <Text style={[styles.scoreGrade, { color: colors.success }]}>Grade: A</Text>
                  <Text style={[styles.scoreDesc, { color: colors.mutedForeground }]}>
                    Excellent condition. No major issues detected. Paint and bodywork are consistent with stated mileage.
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Description */}
          <View style={styles.descSection}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Description</Text>
            <Text style={[styles.desc, { color: colors.mutedForeground }]}>{car.description}</Text>
          </View>

          {/* Financing Calculator */}
          <Pressable
            onPress={() => setCalcOpen(!calcOpen)}
            style={[styles.calcHeader, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={styles.calcHeaderLeft}>
              <Feather name="percent" size={18} color={colors.gold} />
              <Text style={[styles.calcTitle, { color: colors.foreground }]}>Financing Calculator</Text>
            </View>
            <Feather name={calcOpen ? "chevron-up" : "chevron-down"} size={18} color={colors.mutedForeground} />
          </Pressable>

          {calcOpen && (
            <View style={[styles.calcBody, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.calcRow}>
                <View style={styles.calcField}>
                  <Text style={[styles.calcLabel, { color: colors.mutedForeground }]}>Down Payment %</Text>
                  <TextInput
                    value={downPct}
                    onChangeText={setDownPct}
                    keyboardType="numeric"
                    style={[styles.calcInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.secondary }]}
                  />
                </View>
                <View style={styles.calcField}>
                  <Text style={[styles.calcLabel, { color: colors.mutedForeground }]}>Tenure (months)</Text>
                  <TextInput
                    value={months}
                    onChangeText={setMonths}
                    keyboardType="numeric"
                    style={[styles.calcInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.secondary }]}
                  />
                </View>
              </View>
              <View style={[styles.calcResult, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
                <View style={styles.calcResultItem}>
                  <Text style={[styles.calcResultLabel, { color: colors.mutedForeground }]}>Monthly Payment</Text>
                  <Text style={[styles.calcResultValue, { color: colors.gold }]}>
                    ₦{(monthly / 1_000_000).toFixed(2)}M
                  </Text>
                </View>
                <View style={[styles.calcDivider, { backgroundColor: colors.border }]} />
                <View style={styles.calcResultItem}>
                  <Text style={[styles.calcResultLabel, { color: colors.mutedForeground }]}>Total Loan Cost</Text>
                  <Text style={[styles.calcResultValue, { color: colors.foreground }]}>
                    ₦{(total / 1_000_000).toFixed(1)}M
                  </Text>
                </View>
              </View>
              <Text style={[styles.calcNote, { color: colors.mutedForeground }]}>
                *Based on 22% p.a. interest rate. Subject to lender approval.
              </Text>
            </View>
          )}

          {/* Dealer */}
          <View style={[styles.dealerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.dealerAvatar, { backgroundColor: colors.gold + "22", borderColor: colors.gold }]}>
              <Text style={[styles.dealerInitials, { color: colors.gold }]}>
                {car.dealerName.split(" ").map((n) => n[0]).join("").toUpperCase()}
              </Text>
            </View>
            <View style={styles.dealerInfo}>
              <Text style={[styles.dealerName, { color: colors.foreground }]}>{car.dealerName}</Text>
              <View style={styles.dealerMeta}>
                <Feather name="star" size={12} color={colors.gold} />
                <Text style={[styles.dealerRating, { color: colors.gold }]}>{car.dealerRating}</Text>
                <Text style={[styles.dealerReviews, { color: colors.mutedForeground }]}>
                  ({car.dealerReviews} reviews)
                </Text>
              </View>
            </View>
            {car.verified && (
              <View style={[styles.verifiedBadge, { backgroundColor: colors.success + "22" }]}>
                <Feather name="check-circle" size={12} color={colors.success} />
                <Text style={[styles.verifiedText, { color: colors.success }]}>Verified</Text>
              </View>
            )}
          </View>

          <Text style={[styles.postedAt, { color: colors.mutedForeground }]}>
            Listed {car.postedAt} · {car.views} views
          </Text>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={[styles.cta, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable
          onPress={handleCall}
          style={({ pressed }) => [
            styles.callBtn,
            { backgroundColor: colors.gold, borderRadius: colors.radius, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Feather name="phone" size={18} color={colors.primaryForeground} />
          <Text style={[styles.callText, { color: colors.primaryForeground }]}>Contact Dealer</Text>
        </Pressable>
        <Pressable
          style={[styles.msgBtn, { backgroundColor: colors.secondary, borderColor: colors.border, borderRadius: colors.radius }]}
        >
          <Feather name="message-circle" size={20} color={colors.gold} />
        </Pressable>
      </View>
    </View>
  );
}

function MetaBadge({ icon, label, colors }: { icon: string; label: string; colors: any }) {
  return (
    <View style={[metaStyles.badge, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
      <Feather name={icon as any} size={12} color={colors.silver} />
      <Text style={[metaStyles.label, { color: colors.silver }]}>{label}</Text>
    </View>
  );
}

function SpecRow({ label, value, colors, last }: { label: string; value: string; colors: any; last?: boolean }) {
  return (
    <View style={[specStyles.row, !last && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
      <Text style={[specStyles.label, { color: colors.mutedForeground }]}>{label}</Text>
      <Text style={[specStyles.value, { color: colors.foreground }]}>{value}</Text>
    </View>
  );
}

const metaStyles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 5,
  },
  label: { fontSize: 12, fontFamily: "Inter_400Regular" },
});

const specStyles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12 },
  label: { fontSize: 14, fontFamily: "Inter_400Regular" },
  value: { fontSize: 14, fontFamily: "Inter_500Medium" },
});

const styles = StyleSheet.create({
  root: { flex: 1 },
  backBtn: {
    position: "absolute", left: 16, zIndex: 10,
    width: 36, height: 36, borderRadius: 18,
    alignItems: "center", justifyContent: "center",
  },
  favBtn: {
    position: "absolute", right: 16, zIndex: 10,
    width: 36, height: 36, borderRadius: 18,
    alignItems: "center", justifyContent: "center",
  },
  photo: {
    width: SCREEN_W,
    height: 260,
    alignItems: "center",
    justifyContent: "center",
  },
  dots: { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: 10 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  content: { padding: 20, gap: 16 },
  badgeRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  price: { fontSize: 28, fontFamily: "Inter_700Bold" },
  carTitle: { fontSize: 20, fontFamily: "Inter_600SemiBold", marginTop: -8 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  specsCard: { borderRadius: 14, borderWidth: 1, padding: 16 },
  scoreCard: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 12 },
  scoreHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  scoreTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  scoreBody: { flexDirection: "row", gap: 16, alignItems: "center" },
  scoreCircle: { alignItems: "center", justifyContent: "center" },
  scoreCircleInner: {
    width: 72, height: 72, borderRadius: 36, borderWidth: 3,
    alignItems: "center", justifyContent: "center",
  },
  scoreNumber: { fontSize: 22, fontFamily: "Inter_700Bold" },
  scoreOf: { fontSize: 10, fontFamily: "Inter_400Regular" },
  scoreInfo: { flex: 1, gap: 6 },
  scoreGrade: { fontSize: 15, fontFamily: "Inter_700Bold" },
  scoreDesc: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  descSection: { gap: 8 },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  desc: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  calcHeader: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    borderRadius: 14, borderWidth: 1, padding: 14,
  },
  calcHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  calcTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  calcBody: {
    borderRadius: 14, borderWidth: 1, padding: 16, gap: 12,
    borderTopLeftRadius: 0, borderTopRightRadius: 0,
    borderTopWidth: 0, marginTop: -14,
  },
  calcRow: { flexDirection: "row", gap: 12 },
  calcField: { flex: 1, gap: 6 },
  calcLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  calcInput: {
    borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 16, fontFamily: "Inter_600SemiBold",
  },
  calcResult: {
    borderRadius: 10, borderWidth: 1, padding: 14,
    flexDirection: "row", alignItems: "center",
  },
  calcResultItem: { flex: 1, alignItems: "center", gap: 4 },
  calcResultLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  calcResultValue: { fontSize: 18, fontFamily: "Inter_700Bold" },
  calcDivider: { width: 1, height: 40, marginHorizontal: 12 },
  calcNote: { fontSize: 11, fontFamily: "Inter_400Regular" },
  dealerCard: {
    flexDirection: "row", alignItems: "center", gap: 12,
    borderRadius: 14, borderWidth: 1, padding: 14,
  },
  dealerAvatar: {
    width: 48, height: 48, borderRadius: 24, borderWidth: 2,
    alignItems: "center", justifyContent: "center",
  },
  dealerInitials: { fontSize: 18, fontFamily: "Inter_700Bold" },
  dealerInfo: { flex: 1, gap: 4 },
  dealerName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  dealerMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  dealerRating: { fontSize: 13, fontFamily: "Inter_700Bold" },
  dealerReviews: { fontSize: 12, fontFamily: "Inter_400Regular" },
  verifiedBadge: {
    flexDirection: "row", alignItems: "center", gap: 4,
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
  },
  verifiedText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  postedAt: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center" },
  cta: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  callBtn: {
    flex: 1, flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 8, paddingVertical: 15,
  },
  callText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  msgBtn: {
    width: 50, alignItems: "center", justifyContent: "center",
    borderWidth: 1,
  },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFoundText: { fontSize: 16, fontFamily: "Inter_400Regular" },
});
