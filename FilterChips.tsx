import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { CarCondition } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

const FILTERS: Array<CarCondition | "All"> = [
  "All",
  "Tokunbo",
  "Foreign Used",
  "Brand New",
  "Nigerian Used",
];

interface FilterChipsProps {
  selected: CarCondition | "All";
  onSelect: (filter: CarCondition | "All") => void;
}

export default function FilterChips({ selected, onSelect }: FilterChipsProps) {
  const colors = useColors();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {FILTERS.map((filter) => {
        const active = selected === filter;
        return (
          <Pressable
            key={filter}
            onPress={() => onSelect(filter)}
            style={[
              styles.chip,
              {
                backgroundColor: active ? colors.gold : colors.secondary,
                borderColor: active ? colors.gold : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: active ? colors.primaryForeground : colors.silver },
              ]}
            >
              {filter}
            </Text>
          </Pressable>
        );
      })}
      <View style={{ width: 8 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: "center",
    paddingVertical: 4,
  },
  chip: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  label: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
});
