import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

type BadgeType = "AI Verified" | "Caution Advised" | "High Risk" | "Dealer Verified" | string;

interface TrustBadgeProps {
  type: BadgeType;
  score?: number | null;
  size?: "sm" | "md";
}

export default function TrustBadge({ type, score, size = "md" }: TrustBadgeProps) {
  const colors = useColors();
  const isSmall = size === "sm";

  const config: Record<string, { icon: string; bg: string; text: string }> = {
    "AI Verified": { icon: "shield", bg: colors.gold, text: colors.primaryForeground },
    "Dealer Verified": { icon: "check-circle", bg: colors.silver, text: "#0A0A0F" },
    "Caution Advised": { icon: "alert-triangle", bg: colors.warning, text: "#0A0A0F" },
    "High Risk": { icon: "alert-octagon", bg: colors.destructive, text: "#fff" },
  };

  const cfg = config[type] ?? { icon: "shield", bg: colors.muted, text: colors.silver };

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: cfg.bg },
        isSmall && styles.badgeSm,
      ]}
    >
      <Feather
        name={cfg.icon as any}
        size={isSmall ? 10 : 13}
        color={cfg.text}
      />
      <Text style={[styles.label, { color: cfg.text }, isSmall && styles.labelSm]}>
        {type}
      </Text>
      {score != null && (
        <Text style={[styles.score, { color: cfg.text }, isSmall && styles.labelSm]}>
          {score}/100
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
    alignSelf: "flex-start",
  },
  badgeSm: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 3,
  },
  label: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.2,
  },
  labelSm: {
    fontSize: 10,
  },
  score: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
  },
});
