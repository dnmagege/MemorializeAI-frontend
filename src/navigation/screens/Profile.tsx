import React, { useEffect, useState } from "react";
import { 
  View, Text, StyleSheet, Image, ActivityIndicator, Alert, TouchableOpacity, ScrollView, ImageBackground 
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Linking from "expo-linking";
import { Platform } from "react-native";
import QRCode from "react-native-qrcode-svg"; // ✅ Import QR Code generator


// Define the expected route parameters
type RouteParams = {
  id: string;
};

export function Profile() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params as RouteParams;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Banner Image URL (Replace with an actual API-based image if needed)
  const bannerImage = "https://images.unsplash.com/photo-1739467444239-840b9b3c2480?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"; 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // const response = await fetch(`http://192.168.56.1:5000/memorial/${id}`);
        const response = await fetch(`https://memorializeai-backend.onrender.com/memorial/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && data.memorial) {
          setProfile(data.memorial);
        } else {
          setProfile(null);
          Alert.alert("Profile Not Found", "This profile does not exist.");
        }
      } catch (error) {
        setProfile(null);
        Alert.alert("Error", "There was an error fetching the profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  // If still loading, show a loading spinner
  if (loading) {
    return <ActivityIndicator size="large" color="black" />;
  }

  // Handle missing profiles gracefully
  if (!profile) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Profile not found.</Text>
      </View>
    );
  }

  // Handle pending profile
// ✅ Handle Pending Profile (Show Edit Button)
if (profile.status === "pending") {
  return (
    <View style={styles.container}>
      <Text style={styles.pendingMessage}>
        Your profile is awaiting approval by an admin. If needed, you can edit your profile.
      </Text>
      <TouchableOpacity 
        style={styles.editButton} 
        onPress={() => navigation.navigate("UpdateProfile", { id: profile.id })}
      >
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

if (profile.status === "pending") {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.pendingMessage}>
        Your profile is awaiting approval by an admin. If needed, you can edit your profile.
      </Text>

      {/* ✅ Show QR Code even if the profile is pending */}
      <View style={styles.qrContainer}>
        {profile.qr_code_url ? (
          <QRCode value={profile.qr_code_url} size={160} />
        ) : (
          <Text>No QR Code available</Text>
        )}
      </View>

      <TouchableOpacity 
        style={styles.editButton} 
        onPress={() => navigation.navigate("UpdateProfile", { id: profile.id })}
      >
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


  // Handle approved profile (show complete profile details)
  // Handle approved profile (show complete profile details)
return (
  <ScrollView contentContainerStyle={styles.container}>
    <View style={styles.card}>
      {/* ✅ Banner Image Section */}
    <View style={styles.bannerContainer}>
      <ImageBackground source={{ uri: bannerImage }} style={styles.banner}>
        <View style={styles.profileImageContainer}>
          {profile.passport_photo_url ? (
            <Image source={{ uri: profile.passport_photo_url }} style={styles.image} />
          ) : (
            <Text style={styles.noImage}>No Image Available</Text>
          )}
        </View>
      </ImageBackground>
    </View>


      {/* Name */}
      <Text style={styles.name}>{profile.name}</Text>

      {/* Date of Birth & Date of Death */}
      <Text style={styles.date}>Born: {formatDate(profile.birth_date)}</Text>
      <Text style={styles.date}>Died: {formatDate(profile.death_date)}</Text>

      {/* Age at Passing */}
      <Text style={styles.age}>
        Age at Passing: {calculateAge(profile.birth_date, profile.death_date)}
      </Text>

      {/* Biography */}
      <View style={styles.bioContainer}>
        <Text style={styles.heading}>Biography</Text>
        <Text style={styles.text}>{profile.bio || "No biography available."}</Text>
      </View>

      {/* QR Code and Buttons */}
      <View style={styles.bottomContainer}>
        {profile.qr_code_url ? (
          <QRCode value={profile.qr_code_url} size={160} />
        ) : (
          <Text>No QR Code available</Text>
        )}

        <TouchableOpacity style={styles.downloadButton} onPress={() => handleDownloadQRCode(profile)}>
          <Text style={styles.buttonText}>Download</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.editButton} onPress={() => handleEditProfile(profile, navigation)}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  </ScrollView>
);
}

// Function to format date into "Month Day, Year" (e.g., "October 8, 1990")
function formatDate(dateString: string) {
  if (!dateString) return "Unknown"; // Handle missing dates

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Unknown"; // Handle invalid dates

  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}


// Function to calculate age from birth date and death date
function calculateAge(birthDate: string, deathDate: string) {
  if (!birthDate || !deathDate) return "Unknown";

  const birth = new Date(birthDate);
  const death = new Date(deathDate);

  if (isNaN(birth.getTime()) || isNaN(death.getTime())) return "Unknown";

  let age = death.getFullYear() - birth.getFullYear();
  const monthDiff = death.getMonth() - birth.getMonth();
  const dayDiff = death.getDate() - birth.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1; // Adjust age if the birthday hasn't occurred yet in the death year
  }

  return age;
}

// QR Code Download Handler
const handleDownloadQRCode = async (profile: any) => {
  if (!profile?.qr_code_url) {
    Alert.alert("Error", "No QR Code available for this profile.");
    return;
  }

  if (Platform.OS === "web") {
    const a = document.createElement("a");
    a.href = profile.qr_code_url;
    a.download = `QR_Code_${profile.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    try {
      const fileUri = FileSystem.documentDirectory + `QR_Code_${profile.id}.png`;
      const { uri } = await FileSystem.downloadAsync(profile.qr_code_url, fileUri);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("Downloaded", `QR Code saved at: ${uri}`);
      }
    } catch (error) {
      console.error("Error downloading QR Code:", error);
      Alert.alert("Error", "Could not download QR Code.");
    }
  }
};

const handleEditProfile = (profile: any, navigation: any) => {
  navigation.navigate("UpdateProfile", { id: profile.id });
};

// ✅ Styles (Fixed)
const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", padding: 20, backgroundColor: "#F8F9FA" },
  
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 18, color: "red", fontWeight: "bold" },
  
  pendingMessage: { fontSize: 18, fontWeight: "bold", color: "#333", textAlign: "center", padding: 20 },
  noImage: { fontSize: 16, color: "#666", marginBottom: 10 },

  bannerContainer: { width: "100%", height: 450, alignItems: "center", justifyContent: "center" },
  banner: { width: "100%", height: "100%", resizeMode: "cover", justifyContent: "center", alignItems: "center" },
  profileImageContainer: { position: "absolute", bottom: -50, alignItems: "center" },
  image: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: "#fff" },

  card: { // ✅ FIXED: Add card styling
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderColor: "#ddd",
    borderWidth: 1,
    marginTop: 50, // Prevent overlap with banner
  },
  qrContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  

  name: { fontSize: 26, fontWeight: "bold", textAlign: "center", marginTop: 50 },
  date: { fontSize: 16, color: "#666", marginBottom: 15 },
  age: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  
  bioContainer: { width: "100%", paddingVertical: 15, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#ddd", marginBottom: 15 },
  heading: { fontSize: 18, fontWeight: "bold", textAlign: "center" },
  text: { fontSize: 16, textAlign: "justify", paddingHorizontal: 10, lineHeight: 22 },

  bottomContainer: { alignItems: "center", marginTop: 20 },
  downloadButton: { backgroundColor: "#007BFF", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, width: "90%", alignItems: "center" },
  editButton: { backgroundColor: "#17A2B8", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, marginTop: 10, width: "90%", alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default Profile;
