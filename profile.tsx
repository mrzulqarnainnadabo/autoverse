import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MOCK_CARS } from "@/constants/data";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const router = useRouter();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const myListings = MOCK_CARS.slice(0, 2);

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          logout();
        },
      },
    ]);
  };

  if (!user) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: topPad + 12 }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>Profile</Text>
        </View>
        <View style={styles.authPrompt}>
          <View style={[styles.guestAvatar, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
            <Feather name="user" size={48} color={colors.mutedForeground} />
          </View>
          <Text style={[styles.authTitle, { color: colors.foreground }]}>Join Autoverse</Text>
          <Text style={[styles.authSub, { color: colors.mutedForeground }]}>
            Sign in to list cars, track inquiries, and connect with verified dealers.
          </Text>
          <Pressable
            onPress={() => router.push("/auth")}
            style={[styles.signInBtn, { backgroundColor: colors.gold, borderRadius: colors.radius }]}
          >
            <Text style={[styles.signInText, { color: colors.primaryForeground }]}>Sign In with Phone</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 120 : 120 }}
      >
        <View style={[styles.header, { paddingTop: topPad + 12 }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>Profile</Text>
          <Pressable style={[styles.settingsBtn, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
            <Feather name="settings" size={20} color={colors.silver} />
          </Pressable>
        </View>

        {/* User Card */}
        <View style={[styles.userCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.avatar, { backgroundColor: colors.gold + "22", borderColor: colors.gold }]}>
            <Text style={[styles.initials, { color: colors.gold }]}>{user.initials}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.foreground }]}>{user.name}</Text>
            <Text style={[styles.userPhone, { color: colors.mutedForeground }]}>{user.phone}</Text>
          </View>
          {user.isDealer && (
            <View style={[styles.dealerBadge, { backgroundColor: colors.gold + "22", borderColor: colors.gold }]}>
              <Feather name="briefcase" size={11} color={colors.gold} />
              <Text style={[styles.dealerText, { color: colors.gold }]}>Dealer</Text>
            </View>
          )}
        </View>

        {/* Dealer Dashboard */}
        {user.isDealer && (
          <View style={[styles.dashboard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.dashTitle, { color: colors.foreground }]}>Dealer Dashboard</Text>
            <View style={styles.stats}>
              <StatBox icon="list" value={user.totalListings.toString()} label="Listings" colors={colors} />
              <StatBox icon="star" value={`${user.dealerRating}★`} label="Rating" colors={colors} gold />
              <StatBox icon="message-square" value={user.totalReviews.toString()} label="Reviews" colors={colors} />
            </View>

            <Pressable
              onPress={() => router.push("/inspect")}
              style={[styles.instagramRow, { backgroundColor: colors.gold + "15", borderColor: colors.gold + "44" }]}
            >
              <Feather name="instagram" size={16} color={colors.gold} />
              <Text style={[styles.instagramText, { color: colors.gold }]}>
                Auto-Import from Instagram
              </Text>
              <View style={[styles.liveDot, { backgroundColor: colors.gold }]} />
            </Pressable>
          </View>
        )}

        {/* My Listings */}
        <View style={[styles.listingsSection, { borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>My Listings</Text>
          {myListings.map((car) => (
            <Pressable
              key={car.id}
              onPress={() => router.push(`/car/${car.id}`)}
              style={[styles.listingRow, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.listingInfo}>
                <Text style={[styles.listingTitle, { color: colors.foreground }]}>
                  {car.year} {car.make} {car.model}
                </Text>
                <Text style={[styles.listingPrice, { color: colors.gold }]}>₦{car.price}M</Text>
              </View>
              <View style={styles.listingRight}>
                <Text style={[styles.listingViews, { color: colors.mutedForeground }]}>{car.views} views</Text>
                <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
              </View>
            </Pressable>
          ))}
        </View>

        {/* Settings */}
        <View style={styles.menuSection}>
          {[
            { icon: "heart", label: "Saved Cars" },
            { icon: "bell", label: "Notifications" },
            { icon: "shield", label: "Verification" },
            { icon: "help-circle", label: "Help & Support" },
          ].map((item) => (
            <Pressable
              key={item.label}
              style={({ pressed }) => [
                styles.menuRow,
                { borderBottomColor: colors.border, backgroundColor: pressed ? colors.secondary : "transparent" },
              ]}
            >
              <Feather name={item.icon as any} size={20} color={colors.silver} />
              <Text style={[styles.menuLabel, { color: colors.foreground }]}>{item.label}</Text>
              <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
            </Pressable>
          ))}
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.menuRow,
              { borderBottomColor: colors.border, backgroundColor: pressed ? colors.secondary : "transparent" },
            ]}
          >
            <Feather name="log-out" size={20} color={colors.destructive} />
            <Text style={[styles.menuLabel, { color: colors.destructive }]}>Sign Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function StatBox({
  icon, value, label, colors, gold,
}: { icon: string; value: string; label: string; colors: any; gold?: boolean }) {
  return (
    <View style={[styles.statBox, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
      <Feather name={icon as any} size={18} color={gold ? colors.gold : colors.silver} />
      <Text style={[styles.statValue, { color: gold ? colors.gold : colors.foreground }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
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
    paddingBottom: 20,
  },
  title: { fontSize: 24, fontFamily: "Inter_700Bold" },
  settingsBtn: {
    width: 40, height: 40, borderRadius: 20, borderWidth: 1,
    alignItems: "center", justifyContent: "center",
  },
  userCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },
  avatar: {
    width: 60, height: 60, borderRadius: 30, borderWidth: 2,
    alignItems: "center", justifyContent: "center",
  },
  initials: { fontSize: 22, fontFamily: "Inter_700Bold" },
  userInfo: { flex: 1 },
  userName: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  userPhone: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  dealerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dealerText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  dashboard: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    gap: 14,
  },
  dashTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  stats: { flexDirection: "row", gap: 10 },
  statBox: {
    flex: 1, borderRadius: 12, borderWidth: 1,
    alignItems: "center", paddingVertical: 12, gap: 6,
  },
  statValue: { fontSize: 20, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  instagramRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  instagramText: { flex: 1, fontSize: 13, fontFamily: "Inter_500Medium" },
  liveDot: { width: 8, height: 8, borderRadius: 4 },
  listingsSection: { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 12 },
  listingRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 8,
  },
  listingInfo: { flex: 1 },
  listingTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  listingPrice: { fontSize: 15, fontFamily: "Inter_700Bold", marginTop: 3 },
  listingRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  listingViews: { fontSize: 12, fontFamily: "Inter_400Regular" },
  menuSection: { paddingHorizontal: 16 },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    gap: 14,
  },
  menuLabel: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },
  authPrompt: {
    flex: 1, alignItems: "center", justifyContent: "center",
    paddingHorizontal: 32, gap: 14,
  },
  guestAvatar: {
    width: 100, height: 100, borderRadius: 50, borderWidth: 1,
    alignItems: "center", justifyContent: "center",
  },
  authTitle: { fontSize: 24, fontFamily: "Inter_700Bold", textAlign: "center" },
  authSub: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 21 },
  signInBtn: { paddingHorizontal: 32, paddingVertical: 14, marginTop: 8 },
  signInText: { fontSize: 16, fontFamily: "Inter_700Bold" },
});
