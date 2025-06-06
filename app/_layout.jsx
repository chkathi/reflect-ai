import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { NoteProvider } from "@/contexts/NoteContext";
import { Stack } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const HeaderLogout = () => {
  const { user, logout } = useAuth();

  return user ? (
    <TouchableOpacity style={styles.logoutButton} onPress={logout}>
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  ) : null;
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <NoteProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: "#6495ED",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontSize: 20,
              fontWeight: "bold",
            },

            /* Adding the Header Logout */
            headerRight: () => <HeaderLogout />,
            contentStyle: {
              paddingHorizontal: 10,
              paddingTop: 10,
              backgroundColor: "#fff",
            },
          }}
        >
          <Stack.Screen name="index" options={{ title: "Home" }} />
          <Stack.Screen name="notes" options={{ headerTitle: "Notes" }} />
          <Stack.Screen name="auth" options={{ headerTitle: "" }} />
          <Stack.Screen name="note-page" options={{ headerTitle: "" }} />
        </Stack>
      </NoteProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    marginRight: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#ff3b30",
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
