// SignupPage.tsx
import React, { useState } from "react";
import { View, TextInput, Button, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";
import * as ImagePicker from "react-native-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignupPage = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [major, setMajor] = useState("");
  const [currentPosition, setCurrentPosition] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const handleImagePick = () => {
    ImagePicker.launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setProfileImage(response.assets[0]);
      }
    });
  };

  const handleSignup = async () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("password", password);
    formData.append("bio", bio);
    formData.append("graduation_year", graduationYear);
    formData.append("major", major);
    formData.append("current_position", currentPosition);
    formData.append("contact_email", contactEmail);
    if (profileImage) {
      formData.append("profile_image", {
        uri: profileImage.uri,
        type: profileImage.type,
        name: profileImage.fileName,
      });
    }

    try {
      const response = await axios.post(
        "https://yourbackendapi.com/register/", 
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      
      if (response.data.token) {
        await AsyncStorage.setItem("token", response.data.token); // Store token
        navigation.replace("login");  // Redirect to login screen
      }
    } catch (error) {
      console.error("Error registering:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
      />
      <TextInput
        style={styles.input}
        placeholder="Graduation Year"
        value={graduationYear}
        onChangeText={setGraduationYear}
      />
      <TextInput
        style={styles.input}
        placeholder="Major"
        value={major}
        onChangeText={setMajor}
      />
      <TextInput
        style={styles.input}
        placeholder="Current Position"
        value={currentPosition}
        onChangeText={setCurrentPosition}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Email"
        value={contactEmail}
        onChangeText={setContactEmail}
      />

      <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
        <Text style={styles.imagePickerText}>Pick Profile Image</Text>
      </TouchableOpacity>

      {profileImage && (
        <Image
          source={{ uri: profileImage.uri }}
          style={styles.profileImage}
        />
      )}

      <Button title="Sign Up" onPress={handleSignup} />

      <TouchableOpacity onPress={() => navigation.navigate("login")}>
        <Text style={styles.loginRedirect}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 5,
  },
  imagePicker: {
    backgroundColor: "#008CBA",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  imagePickerText: {
    color: "#fff",
    textAlign: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginVertical: 10,
  },
  loginRedirect: {
    textAlign: "center",
    color: "#008CBA",
    marginTop: 10,
  },
});

export default SignupPage;
