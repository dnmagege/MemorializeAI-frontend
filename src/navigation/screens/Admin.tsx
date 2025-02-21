import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";  // 👈 Import navigation

// ✅ Define API base URL
const API_URL = "http://192.168.56.1:5000"; // ✅ Change this if needed

// ✅ Define Memorial Type
type Memorial = {
  id: number;
  name: string;
  status: string;
  passport_photo_url: string;
};

export function Admin() {
  const navigation = useNavigation(); // 👈 Get navigation instance
  const [profiles, setProfiles] = useState<Memorial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemorials();
  }, []);

  // ✅ Fetch All Profiles from API
  const fetchMemorials = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/memorials`);
      const data = await response.json();

      if (response.ok) {
        setProfiles(data.memorials);
      } else {
        Alert.alert("Error", "Could not fetch memorials");
      }
    } catch (error) {
      console.error("❌ Error fetching memorials:", error);
      Alert.alert("Error", "Could not fetch memorials");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Approve or Disapprove a Profile
  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const endpoint =
        newStatus === "pending"
          ? `${API_URL}/disapprove-memorial/${id}`
          : `${API_URL}/approve-memorial/${id}`;
  
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setProfiles((prevProfiles) =>
          prevProfiles.map((profile) =>
            profile.id === id ? { ...profile, status: newStatus } : profile
          )
        );
        Alert.alert("Success", `Profile status updated to ${newStatus}`);
      } else {
        Alert.alert("Error", result.error || "Could not update status");
      }
    } catch (error) {
      console.error("❌ Error updating status:", error);
    }
  };

  // ✅ Delete a Profile
  const deleteProfile = async (id: number) => {
    Alert.alert("Confirm", "Are you sure you want to delete this profile?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            console.log(`🛠 Deleting profile with ID: ${id}`);

            const response = await fetch(`${API_URL}/delete-memorial/${id}`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
            });

            const result = await response.json();
            console.log("🛠 Server Response:", result);

            if (response.ok) {
              setProfiles((prevProfiles) =>
                prevProfiles.filter((profile) => profile.id !== id)
              );
              Alert.alert("Success", "Profile deleted successfully");
            } else {
              Alert.alert("Error", result.error || "Could not delete profile");
            }
          } catch (error) {
            console.error("❌ Error deleting profile:", error);
            Alert.alert("Error", "Could not delete profile. Please try again.");
          }
        },
      },
    ]);
  };

  // ✅ Show Loading Indicator
  if (loading) {
    return <ActivityIndicator size="large" color="black" />;
  }

  return (
    <View style={styles.container}>
      {/* ✅ Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("AdminLogin")}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Admin Dashboard</Text>

      {/* ✅ Show message if no profiles exist */}
      {profiles.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No profiles available
        </Text>
      ) : (
        <FlatList
          data={profiles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{ uri: item.passport_photo_url }}
                style={styles.image}
              />
              <View style={styles.info}>
                <Text style={styles.idText}>ID: {item.id}</Text> {/* ✅ Show Profile ID */}
                <Text style={styles.name}>{item.name}</Text>
                <Text>Status: {item.status}</Text>
              </View>
              <View style={styles.actions}>
                {item.status === "pending" ? (
                  <TouchableOpacity
                    style={styles.buttonApprove}
                    onPress={() => updateStatus(item.id, "approved")}
                  >
                    <Text style={styles.buttonText}>Approve</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.buttonDisapprove}
                    onPress={() => updateStatus(item.id, "pending")}
                  >
                    <Text style={styles.buttonText}>Disapprove</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.buttonDelete}
                  onPress={() => deleteProfile(item.id)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8F9FA" },
  backButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    alignSelf: "flex-start", // 👈 Position at the top-left
    marginBottom: 10,
  },
  backText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    padding: 10,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  image: { width: 60, height: 60, borderRadius: 30, marginRight: 10 },
  info: { flex: 1 },
  idText: { fontSize: 14, fontWeight: "bold", color: "#666" },
  name: { fontSize: 18, fontWeight: "bold" },
  actions: { flexDirection: "row", alignItems: "center" },
  buttonApprove: {
    backgroundColor: "green",
    padding: 8,
    borderRadius: 5,
    marginRight: 5,
  },
  buttonDisapprove: {
    backgroundColor: "orange",
    padding: 8,
    borderRadius: 5,
    marginRight: 5,
  },
  buttonDelete: { backgroundColor: "red", padding: 8, borderRadius: 5 },
  buttonText: { color: "white", fontWeight: "bold" },
});

export default Admin;
