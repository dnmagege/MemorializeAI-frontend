import React, { useState } from "react";
import { TextInput, Button, Text, StyleSheet, View, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

export function Home() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [dod, setDod] = useState("");
  const [profileStatus, setProfileStatus] = useState<string | null>(null);

  // Handle profile search
  const handleSearchProfile = async () => {
    if (!name || !dod) {
      Alert.alert("Error", "Please enter both name and date of death.");
      return;
    }

    try {
      // const response = await fetch(
      //   `http://192.168.56.1:5000/search-profile?name=${name}&death_date=${dod}`
      // );
      const response = await fetch(`https://memorializeai-backend.onrender.com/search-profile?name=${name}&death_date=${dod}`);

      console.log("🔍 Searching Profile with:", { name, dod });


      const data = await response.json();

      if (response.ok && data.success && data.profile) {
        setProfileStatus("found");
        // Navigate to the page where the QR code can be scanned
        navigation.navigate("Profile", { id: data.profile.id });
      } else {
        setProfileStatus("not_found");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "There was an error searching for the profile.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Memorialize AI App</Text>

      {/* Form for name and DOD */}
      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Date of Death (YYYY-MM-DD)"
        value={dod}
        onChangeText={setDod}
        keyboardType="numeric"
      />

      {/* Handle profile search */}
      <Button title="Search Profile" onPress={handleSearchProfile} />

      {/* Display result */}
      {profileStatus === "found" ? (
        <Text style={styles.message}>
          Create a profile if one is not created for the inputed name yet!
        </Text>
      ) : profileStatus === "not_found" ? (
        <Text style={styles.message}>
          Profile does not exist. Please create a profile.
        </Text>
      ) : null}

      {/* Button to navigate to Create Profile */}
      <Button title="Create Profile" onPress={() => navigation.navigate("Settings")} />

        {/* ✅ New Scanner Button */}
      <View style={styles.scannerButtonContainer}>
        <Button title="Scan QR Code" onPress={() => navigation.navigate("Scanner")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    width: "100%",
    paddingLeft: 10,
    borderRadius: 5,
  },
  message: {
    fontSize: 16,
    color: "#333",
    marginTop: 20,
    textAlign: "center",
  },
  scannerButtonContainer: {
    marginTop: 20, // Adds spacing above the scanner button
  },
});
