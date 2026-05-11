import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MOCK_CONVERSATIONS } from "@/constants/data";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { useRouter } from "expo-router";

export default function MessagesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const router = useRouter();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  if (!user) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: topPad + 12 }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>Messages</Text>
        </View>
        <View style={styles.authPrompt}>
          <Feather name="message-circle" size={48} color={colors.mutedForeground} />
          <Text style={[styles.authTitle, { color: colors.foreground }]}>Sign In to View Messages</Text>
          <Text style={[styles.authSub, { color: colors.mutedForeground }]}>
            Connect with buyers and sellers across Nigeria
          </Text>
          <Pressable
            onPress={() => router.push("/auth")}
            style={[styles.authBtn, { backgroundColor: colors.gold }]}
          >
            <Text style={[styles.authBtnText, { color: colors.primaryForeground }]}>Sign In</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Messages</Text>
        <Pressable style={[styles.newBtn, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <Feather name="edit-2" size={18} color={colors.gold} />
        </Pressable>
      </View>

      <FlatList
        data={MOCK_CONVERSATIONS}
        keyExtractor={(c) => c.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
        )}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.row,
              { backgroundColor: pressed ? colors.secondary : "transparent" },
            ]}
          >
            <View style={[styles.avatar, { backgroundColor: colors.gold + "22", borderColor: colors.gold }]}>
              <Text style={[styles.initials, { color: colors.gold }]}>{item.initials}</Text>
            </View>
            <View style={styles.rowContent}>
              <View style={styles.rowTop}>
                <Text style={[styles.name, { color: colors.foreground }]}>{item.name}</Text>
                <Text style={[styles.time, { color: colors.mutedForeground }]}>{item.time}</Text>
              </View>
              <Text style={[styles.car, { color: colors.gold }]} numberOfLines={1}>
                {item.carTitle}
              </Text>
              <Text style={[styles.lastMsg, { color: colors.mutedForeground }]} numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>
            {item.unread > 0 && (
              <View style={[styles.unreadBadge, { backgroundColor: colors.gold }]}>
                <Text style={[styles.unreadText, { color: colors.primaryForeground }]}>
                  {item.unread}
                </Text>
              </View>
            )}
          </Pressable>
        )}
      />
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
  title: { fontSize: 24, fontFamily: "Inter_700Bold" },
  newBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  list: { paddingBottom: Platform.OS === "web" ? 120 : 120 },
  separator: { height: 1 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 14,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: { fontSize: 18, fontFamily: "Inter_700Bold" },
  rowContent: { flex: 1, gap: 3 },
  rowTop: { flexDirection: "row", justifyContent: "space-between" },
  name: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  time: { fontSize: 12, fontFamily: "Inter_400Regular" },
  car: { fontSize: 12, fontFamily: "Inter_500Medium" },
  lastMsg: { fontSize: 13, fontFamily: "Inter_400Regular" },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  unreadText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  authPrompt: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 14,
  },
  authTitle: { fontSize: 22, fontFamily: "Inter_700Bold", textAlign: "center" },
  authSub: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 21 },
  authBtn: { borderRadius: 12, paddingHorizontal: 32, paddingVertical: 14, marginTop: 8 },
  authBtnText: { fontSize: 16, fontFamily: "Inter_700Bold" },
});
