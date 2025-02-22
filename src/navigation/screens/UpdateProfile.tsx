import React, { useEffect, useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

// const API_BASE_URL = "http://192.168.56.1:5000";  // ✅ Use the updated API
const API_BASE_URL = "https://memorializeai-backend.onrender.com";

// const APP_BASE_URL = "http://192.168.56.1:8081";  // ✅ Ensure QR codes link to the app

export function UpdateProfile() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params as { id: string };

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [passportPhotoUrl, setPassportPhotoUrl] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [deathDate, setDeathDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/memorial/${id}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setName(data.memorial.name);
          setBio(data.memorial.bio || "");
          setPassportPhotoUrl(data.memorial.passport_photo_url || "");
          setBirthDate(data.memorial.birth_date || "");
          setDeathDate(data.memorial.death_date || "");
        } else {
          Alert.alert("Error", "Profile not found.");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        Alert.alert("Error", "There was an error loading the profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleSubmit = async () => {
    if (!name || !passportPhotoUrl) {
      Alert.alert("Error", "Name and passport photo URL are required.");
      return;
    }
  
    // ✅ Fix Date Formatting
    const formatDate = (dateString: string) => {
      if (!dateString) return null;
      const date = new Date(dateString);
      return date.toISOString().split("T")[0]; // Ensures format is YYYY-MM-DD
    };
  
    const updatedData = {
      name,
      bio,
      birth_date: formatDate(birthDate),
      death_date: formatDate(deathDate),
      passport_photo_url: passportPhotoUrl, // Leave as it is for now
    };
  
    console.log("📩 Sending Update Request:", updatedData);
  
    try {
      // const response = await fetch(`http://192.168.56.1:5000/update-memorial/${id}`, {
      const response = await fetch(`${API_BASE_URL}/update-memorial/${id}`, {

        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
  
      const result = await response.json();
      console.log("🛠 Server Response:", result);
  
      if (response.ok) {
        Alert.alert("Profile Updated", `Profile has been successfully updated!`);
        navigation.navigate("Profile", { id });
      } else {
        Alert.alert("Error", result.error || "Could not update profile.");
      }
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      Alert.alert("Error", "There was an error updating the profile.");
    }
  };
  

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
      />
      <TextInput
        style={styles.input}
        placeholder="Passport Photo URL"
        value={passportPhotoUrl}
        onChangeText={setPassportPhotoUrl}
      />
      <TextInput
        style={styles.input}
        placeholder="Birth Date (YYYY-MM-DD)"
        value={birthDate}
        onChangeText={setBirthDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Death Date (YYYY-MM-DD)"
        value={deathDate}
        onChangeText={setDeathDate}
      />
      <Button title="Update Profile" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    width: "100%",
    paddingLeft: 10,
  },
});

export default UpdateProfile;
