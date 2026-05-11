import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useListings } from "@/context/ListingsContext";
import { useColors } from "@/hooks/useColors";
import { Car } from "@/constants/data";

const localImages: Record<string, ReturnType<typeof require>> = {
  car1: require("@/assets/images/car1.png"),
  car2: require("@/assets/images/car2.png"),
};

interface CarCardProps {
  car: Car;
  compact?: boolean;
}

export default function CarCard({ car, compact = false }: CarCardProps) {
  const colors = useColors();
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useListings();
  const fav = isFavorite(car.id);

  const handleFav = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleFavorite(car.id);
  };

  const handlePress = () => {
    router.push(`/car/${car.id}`);
  };

  const price = `₦${car.price}M`;
  const subtitle = `${car.year} ${car.make} ${car.model}`;

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
        pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
        compact && styles.cardCompact,
      ]}
    >
      <View style={[styles.imageContainer, compact && styles.imageContainerCompact]}>
        {car.localImage && localImages[car.localImage] ? (
          <Image
            source={localImages[car.localImage]}
            style={styles.image}
            contentFit="cover"
          />
        ) : (
          <LinearGradient
            colors={["#1A1A2E", "#16213E", "#0F3460"]}
            style={styles.image}
          >
            <Feather name="truck" size={36} color={colors.border} />
          </LinearGradient>
        )}

        <Pressable onPress={handleFav} style={styles.heartBtn}>
          <Feather
            name={fav ? "heart" : "heart"}
            size={16}
            color={fav ? colors.gold : "#fff"}
          />
        </Pressable>

        {car.aiInspected && (
          <View style={[styles.aiTag, { backgroundColor: colors.gold }]}>
            <Text style={[styles.aiTagText, { color: colors.primaryForeground }]}>
              AI
            </Text>
          </View>
        )}

        <View style={styles.priceTag}>
          <Text style={[styles.price, { color: colors.gold }]}>{price}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={[styles.subtitle, { color: colors.foreground }]} numberOfLines={1}>
          {subtitle}
        </Text>
        <View style={styles.row}>
          <View style={[styles.conditionBadge, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.conditionText, { color: colors.silver }]}>
              {car.condition}
            </Text>
          </View>
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={11} color={colors.mutedForeground} />
            <Text style={[styles.location, { color: colors.mutedForeground }]} numberOfLines={1}>
              {car.state}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 12,
  },
  cardCompact: {
    width: 200,
    marginRight: 12,
    marginBottom: 0,
  },
  imageContainer: {
    width: "100%",
    height: 140,
    position: "relative",
  },
  imageContainerCompact: {
    height: 120,
  },
  image: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  heartBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  aiTag: {
    position: "absolute",
    top: 8,
    left: 8,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  aiTagText: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  priceTag: {
    position: "absolute",
    bottom: 8,
    left: 8,
  },
  price: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  info: {
    padding: 10,
    gap: 6,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  conditionBadge: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  conditionText: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    flex: 1,
  },
  location: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
});
