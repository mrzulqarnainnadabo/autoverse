import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
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

type SortOption = "newest" | "price_asc" | "price_desc" | "score";

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<CarCondition | "All">("All");
  const [sort, setSort] = useState<SortOption>("newest");
  const [showSort, setShowSort] = useState(false);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const sortOptions: Array<{ key: SortOption; label: string }> = [
    { key: "newest", label: "Newest First" },
    { key: "price_asc", label: "Price: Low to High" },
    { key: "price_desc", label: "Price: High to Low" },
    { key: "score", label: "AI Score" },
  ];

  const results = MOCK_CARS.filter((c) => {
    const matchFilter = filter === "All" || c.condition === filter;
    const matchQuery =
      !query ||
      `${c.make} ${c.model} ${c.year}`.toLowerCase().includes(query.toLowerCase());
    return matchFilter && matchQuery;
  }).sort((a, b) => {
    if (sort === "price_asc") return a.price - b.price;
    if (sort === "price_desc") return b.price - a.price;
    if (sort === "score") return (b.conditionScore ?? 0) - (a.conditionScore ?? 0);
    return 0;
  });

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <View style={[styles.searchBar, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <Feather name="search" size={18} color={colors.mutedForeground} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Make, model, year..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { color: colors.foreground }]}
            autoFocus={false}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>
        <Pressable
          onPress={() => setShowSort(!showSort)}
          style={[styles.sortBtn, { backgroundColor: colors.secondary, borderColor: showSort ? colors.gold : colors.border }]}
        >
          <Feather name="sliders" size={18} color={showSort ? colors.gold : colors.silver} />
        </Pressable>
      </View>

      {showSort && (
        <View style={[styles.sortDropdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {sortOptions.map((opt) => (
            <Pressable
              key={opt.key}
              onPress={() => { setSort(opt.key); setShowSort(false); }}
              style={[styles.sortOption, { borderBottomColor: colors.border }]}
            >
              <Text style={[styles.sortLabel, { color: sort === opt.key ? colors.gold : colors.foreground }]}>
                {opt.label}
              </Text>
              {sort === opt.key && <Feather name="check" size={16} color={colors.gold} />}
            </Pressable>
          ))}
        </View>
      )}

      <FilterChips selected={filter} onSelect={setFilter} />

      <View style={[styles.countRow, { borderBottomColor: colors.border }]}>
        <Text style={[styles.count, { color: colors.mutedForeground }]}>
          {results.length} cars found
        </Text>
      </View>

      <FlatList
        data={results}
        keyExtractor={(c) => c.id}
        numColumns={2}
        columnWrapperStyle={styles.columns}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <CarCard car={item} />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="search" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No Results</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Try a different search or filter
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
    alignItems: "center",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 10,
  },
  input: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },
  sortBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sortDropdown: {
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 8,
  },
  sortOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
  },
  sortLabel: { fontSize: 14, fontFamily: "Inter_500Medium" },
  countRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  count: { fontSize: 13, fontFamily: "Inter_400Regular" },
  list: { padding: 12, paddingBottom: Platform.OS === "web" ? 120 : 120 },
  columns: { gap: 10 },
  gridItem: { flex: 1 },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular" },
});
