import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CarCard from "@/components/CarCard";
import FilterChips from "@/components/FilterChips";
import { CarCondition, MOCK_CARS } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

const heroImage = require("@/assets/images/hero-car.png");

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [filter, setFilter] = useState<CarCondition | "All">("All");
  const [search, setSearch] = useState("");

  const featured = MOCK_CARS.filter((c) => c.featured);
  const filtered = MOCK_CARS.filter((c) => {
    const matchFilter = filter === "All" || c.condition === filter;
    const matchSearch =
      !search ||
      `${c.make} ${c.model}`.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 120 : 120 }}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: topPad + 12 }]}>
          <View>
            <View style={styles.logoRow}>
              <Text style={[styles.logoAV, { color: colors.gold }]}>AV</Text>
              <Text style={[styles.logoText, { color: colors.foreground }]}>
                AUTO<Text style={{ color: colors.gold }}>VERSE</Text>
              </Text>
            </View>
            <Text style={[styles.tagline, { color: colors.mutedForeground }]}>
              Nigeria's #1 Car Marketplace
            </Text>
          </View>
          <Pressable style={[styles.bellBtn, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
            <Feather name="bell" size={20} color={colors.silver} />
            <View style={[styles.bellDot, { backgroundColor: colors.gold }]} />
          </Pressable>
        </View>

        {/* Search */}
        <View style={[styles.searchWrapper, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <Feather name="search" size={18} color={colors.mutedForeground} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Find any car in Nigeria..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.searchInput, { color: colors.foreground }]}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>

        {/* Hero Banner */}
        <View style={styles.heroWrapper}>
          <Image source={heroImage} style={styles.heroImage} contentFit="cover" />
          <View style={styles.heroOverlay}>
            <View style={[styles.heroPill, { backgroundColor: colors.gold }]}>
              <Text style={[styles.heroPillText, { color: colors.primaryForeground }]}>
                36 States · 2,800+ Listings
              </Text>
            </View>
            <Text style={[styles.heroTitle, { color: "#fff" }]}>
              Find Your{"\n"}
              <Text style={{ color: colors.gold }}>Dream Car</Text>
            </Text>
            <Pressable
              onPress={() => router.push("/(tabs)/search")}
              style={[styles.heroCta, { backgroundColor: colors.gold }]}
            >
              <Text style={[styles.heroCtaText, { color: colors.primaryForeground }]}>
                Explore Now
              </Text>
              <Feather name="arrow-right" size={16} color={colors.primaryForeground} />
            </Pressable>
          </View>
        </View>

        {/* Filter chips */}
        <FilterChips selected={filter} onSelect={setFilter} />

        {/* Featured Cars */}
        {featured.length > 0 && search.length === 0 && filter === "All" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Featured Cars
              </Text>
              <Pressable onPress={() => router.push("/(tabs)/search")}>
                <Text style={[styles.seeAll, { color: colors.gold }]}>See all</Text>
              </Pressable>
            </View>
            <FlatList
              data={featured}
              horizontal
              keyExtractor={(c) => c.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              renderItem={({ item }) => <CarCard car={item} compact />}
            />
          </View>
        )}

        {/* All Listings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, paddingHorizontal: 16 }]}>
            {search || filter !== "All" ? `Results (${filtered.length})` : "All Listings"}
          </Text>
          <View style={styles.grid}>
            {filtered.map((car) => (
              <View key={car.id} style={styles.gridItem}>
                <CarCard car={car} />
              </View>
            ))}
            {filtered.length === 0 && (
              <View style={styles.empty}>
                <Feather name="search" size={32} color={colors.mutedForeground} />
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                  No cars found
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  logoAV: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1,
  },
  logoText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    letterSpacing: 2,
  },
  tagline: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bellDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  heroWrapper: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    height: 200,
  },
  heroImage: { width: "100%", height: "100%" },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
    padding: 20,
    justifyContent: "flex-end",
  },
  heroPill: {
    alignSelf: "flex-start",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  heroPillText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  heroTitle: { fontSize: 24, fontFamily: "Inter_700Bold", marginBottom: 12 },
  heroCta: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 10,
    gap: 6,
  },
  heroCtaText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  section: { marginBottom: 8 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  seeAll: { fontSize: 14, fontFamily: "Inter_500Medium" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 10,
  },
  gridItem: { width: "48%" },
  empty: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: { fontSize: 15, fontFamily: "Inter_500Medium" },
});
