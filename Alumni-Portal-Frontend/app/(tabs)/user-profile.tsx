import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Button,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "",
    github: "",
    twitter: "",
  });
  const [resume, setResume] = useState<string | null>(null);

  // Load user data from local storage on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedLinks = await AsyncStorage.getItem("socialLinks");
        const storedResume = await AsyncStorage.getItem("resume");

        if (storedLinks) {
          setSocialLinks(JSON.parse(storedLinks));
        }
        if (storedResume) {
          setResume(storedResume);
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };

    loadUserData();
  }, []);

  // Save user data to local storage
  const saveUserData = async () => {
    try {
      await AsyncStorage.setItem("socialLinks", JSON.stringify(socialLinks));
      await AsyncStorage.setItem("resume", resume || "");
      Alert.alert("Profile updated successfully!");
    } catch (error) {
      Alert.alert("Failed to save profile.");
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleResumeUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });
      if (result.type === "success" && result.mimeType === "application/pdf") {
        const { uri } = result;
        setResume(uri);
        Alert.alert("Resume uploaded successfully!");
      }
    } catch (error) {
      Alert.alert("Failed to upload resume.");
    }
  };

  const handleSaveChanges = () => {
    if (!resume) {
      Alert.alert("Please upload a resume before saving.");
      return;
    }

    saveUserData(); // Save changes to local storage
    setIsEditing(false);
  };

  // New function to handle canceling edits
  const handleCancelEdit = () => {
    setIsEditing(false);
    Alert.alert("Changes discarded.");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{
          uri: "https://via.placeholder.com/100x100.png?text=User+Profile",
        }}
        style={styles.profileImage}
      />
      <Text style={styles.name}>Mukilan T</Text>
      <Text style={styles.info}>Full Stack Developer</Text>
      <Text style={styles.info}>BE 2026, CSE</Text>
      <Text style={styles.info}>Coimbatore, India</Text>

      {isEditing ? (
        <View style={styles.editSection}>
          <TextInput
            style={styles.input}
            placeholder="LinkedIn URL"
            value={socialLinks.linkedin}
            onChangeText={(text) =>
              setSocialLinks((prev) => ({ ...prev, linkedin: text }))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="GitHub URL"
            value={socialLinks.github}
            onChangeText={(text) =>
              setSocialLinks((prev) => ({ ...prev, github: text }))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Twitter URL"
            value={socialLinks.twitter}
            onChangeText={(text) =>
              setSocialLinks((prev) => ({ ...prev, twitter: text }))
            }
          />
          <Button title="Upload Resume" onPress={handleResumeUpload} />
          {resume && <Text style={styles.info}>Resume attached: {resume}</Text>}
          <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
          {/* New Cancel Button */}
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancelEdit}
          >
            <Text style={[styles.buttonText, styles.cancelButtonText]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleEditToggle}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <Text style={styles.info}>About me</Text>
        <Text style={styles.info}>
          I am a Fullstack Developer in Laabhum Private Limited and also a part
          of the Metaverse Students Club.
        </Text>
        <Text style={styles.info}>Born on 28 April 2004</Text>
        <Text style={styles.info}>Relationship Status: Single</Text>
        <Text style={styles.info}>Contact Details</Text>
        <Text style={styles.info}>Lives in Coimbatore, India</Text>
        <Text style={styles.info}>
          Correspondence address: No.151 Teachers Colony Podanur, Coimbatore,
          India, 641023
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#2E8B57",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  editSection: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
});

export default ProfileScreen;
