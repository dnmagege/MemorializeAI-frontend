import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { OPENAI_API_KEY } from "@env"; // Import API key from .env
console.log("API Key Loaded:", OPENAI_API_KEY);


const API_BASE_URL = "http://192.168.56.1:5000";  
const APP_BASE_URL = "http://192.168.56.1:8081";  


interface OpenAIResponse {
  choices: { message: { content: string } }[];
}


export function CreateProfile() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [biography, setBiography] = useState("");
  const [dob, setDob] = useState("");
  const [dod, setDod] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Function to pick an image from the gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log("✅ Image Selected:", result.assets[0].uri);
    }
  };

  // ✅ AI-Powered Biography Generator
  const [briefInfo, setBriefInfo] = useState(""); // ✅ New state for brief info
  const generateBiography = async () => {
    if (!name.trim() || !dob.trim() || !dod.trim() || !briefInfo.trim()) {  
      Alert.alert("Error", "Please enter the name, date of birth, date of death, and a brief description.");  
      console.log("❌ Missing required fields: Name, DOB, DOD, or Brief Info.");  
      return;  
    }
  
    console.log("⏳ Generating biography for:", { name, dob, dod, briefInfo });
  
    setLoading(true);
  
    try {
      const response = await axios.post<OpenAIResponse>(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are an obituary writer. Write a respectful and heartfelt biography." },
            { 
              role: "user", 
              content: `Write a short but meaningful biography for ${name}, born on ${dob}, passed away on ${dod}. 
                        Here are some details about them: ${briefInfo.trim()}. 
                        Keep it compassionate and inspiring.`
            }
          ],
          max_tokens: 250,
        },
        {
          headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
        }
      );
  
      const generatedBio = response.data.choices[0].message.content;
      console.log("✅ AI-Generated Biography:", generatedBio);
  
      setBiography(generatedBio);  // ✅ Set AI output into the second input field
  
    } catch (error) {
      console.error("❌ AI Error:", error);
      Alert.alert("Error", "Could not generate biography.");
    } finally {
      setLoading(false);
    }
  };
  
  
  

  // ✅ Handle profile creation
  const handleSignUp = async () => {
    if (!name || !image) {
      Alert.alert("Error", "Name and image are required.");
      console.log("❌ Missing required fields: Name or Image.");
      return;
    }
  
    console.log("📩 Sending Create Profile Request:", JSON.stringify({
      name, bio: biography, birth_date: dob, death_date: dod, passport_photo_url: image, brief_info: briefInfo // ✅ Include briefInfo
    }, null, 2));
  
    try {
      const response = await fetch(`${API_BASE_URL}/create-memorial`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          bio: biography,
          birth_date: dob,
          death_date: dod,
          passport_photo_url: image,
          brief_info: briefInfo, // ✅ Send briefInfo to backend
        }),
      });
  
      const result = await response.json();
  
      if (result.success) {
        const qrCodeURL = `${APP_BASE_URL}/@${result.id}`;
  
        await fetch(`${API_BASE_URL}/update-memorial/${result.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ qr_code_url: qrCodeURL }),
        });
  
        Alert.alert("Profile Created", `Your profile has been created!`);
        console.log("✅ Profile successfully created:", result.id);
        navigation.navigate("Profile", { id: result.id });
      } else {
        Alert.alert("Error", "Could not create profile.");
        console.log("❌ Profile creation failed:", result);
      }
    } catch (error) {
      console.error("❌ Error creating profile:", error);
      Alert.alert("Error", "There was an error creating your profile.");
    }
  };
  

  return (
    <View style={[styles.container, styles.myElement]}>
      <Text style={styles.title}>Create Profile</Text>

      {/* ✅ Image Upload */}
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imageText}>Upload Image</Text>
        )}
      </TouchableOpacity>

      <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Date of Birth (YYYY-MM-DD)" value={dob} onChangeText={setDob} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Date of Death (YYYY-MM-DD)" value={dod} onChangeText={setDod} keyboardType="numeric" />

      {/* ✅ User Input - Brief Info */}
      <TextInput 
        style={[styles.input, styles.bioInput, styles.myElement]}  
        placeholder="Brief info about the deceased (e.g., personality, hobbies, achievements)"  
        value={briefInfo}  
        onChangeText={setBriefInfo}  // ✅ User manually enters info here
        multiline 
      />

      {/* ✅ AI-Generated Biography - Read Only */}
      <TextInput 
        style={[styles.input, styles.bioInput, styles.myElement, { backgroundColor: "#f3f3f3" }]}  
        placeholder="Generated Biography will appear here..."  
        value={biography}  
        onChangeText={setBiography}  // ✅ User can edit AI-generated text
        multiline  
        editable={true}  // ✅ Allow user to modify AI-generated bio if needed
      />
      
      
      
      {/* ✅ AI Generation Button */}
      <Button title="Generate with AI" onPress={generateBiography} />

      {/* ✅ Show Loader While AI is Processing */}
      {loading && <ActivityIndicator size="large" color="blue" />}

      {/* ✅ Create Profile Button */}
      <Button title="Create Profile" onPress={handleSignUp} />
    </View>
  );
}

const styles = StyleSheet.create({
  myElement: {
    height: 200, // ✅ Set height to 200px
  }, container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  imagePicker: { width: 150, height: 150, borderRadius: 75, backgroundColor: "#ddd", justifyContent: "center", alignItems: "center", alignSelf: "center", marginBottom: 20, overflow: "hidden" },
  imageText: { color: "#555" },
  image: { width: "100%", height: "100%", borderRadius: 75 },
  input: { height: 40, borderColor: "#ccc", borderWidth: 1, borderRadius: 5, marginBottom: 10, paddingHorizontal: 10 },
  bioInput: { height: 80, textAlignVertical: "top" },
});

export default CreateProfile;
