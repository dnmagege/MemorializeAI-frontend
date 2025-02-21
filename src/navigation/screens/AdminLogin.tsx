import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const AdminLogin = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [debugMessage, setDebugMessage] = useState("");

  const handleLogin = () => {
    console.log("Attempting login with:", { username, password });

    if (username === "admin" && password === "admin") {
      console.log("✅ Login successful!");
      setDebugMessage("✅ Login successful!");

      setTimeout(() => {
        console.log("🚀 Navigating to Admin...");
        navigation.reset({
          index: 0,
          routes: [{ name: "AdminDashboard" as never }],
        });
      }, 500);
    } else {
      console.log("❌ Login failed. Incorrect credentials.");
      setDebugMessage("❌ Login failed. Incorrect credentials.");
      setLoginAttempts((prev) => prev + 1);
      Alert.alert("Invalid Credentials", "Username or password is incorrect.");
    }
  };

  // ✅ Back Button Function (Navigates to HomeTabs and Home Screen)
  const handleBackPress = () => {
    console.log("🔄 Navigating back to HomeTabs...");
    navigation.navigate("HomeTabs", { screen: "Home" }); // ✅ Corrected navigation
  };

  return (
    <View style={styles.container}>
      {/* ✅ Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Admin Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Debugging Info */}
      <View style={styles.debugContainer}>
        <Text style={styles.debugText}>Login Attempts: {loginAttempts}</Text>
        <Text style={styles.debugMessage}>{debugMessage}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  backButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    alignSelf: "flex-start",
    position: "absolute",
    top: 40,
    left: 20,
  },
  backText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  debugContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
  },
  debugText: {
    fontSize: 14,
    color: "black",
  },
  debugMessage: {
    fontSize: 14,
    color: "red",
    fontWeight: "bold",
  },
});

export default AdminLogin;
