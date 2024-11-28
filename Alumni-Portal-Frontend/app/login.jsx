import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage


const Login = () => {
  const [showLogin, setShowLogin] = useState(false);
  const slideAnimation = new Animated.Value(0);
  const navigation = useNavigation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleShowLogin = () => {
    setShowLogin(true);
    Animated.timing(slideAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const slideInterpolate = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["100%", "0%"],
  });

  const handleLogin = () => {
    axios
      .post("http://192.168.88.106:8000/login/", {
        username: username,
        password: password,
      })
      .then(async (response) => {
        if (response.data.token) {  // Ensure token exists in response
          console.log("Login successful:", response.data.token);
          await AsyncStorage.setItem("token", response.data.token); // Store token
          navigation.navigate("(tabs)"); // Navigate to next screen
        } else {
          console.error("Token not received in response");
          alert("Login failed. Token not received.");
        }
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        alert("Login failed. Please try again.");
      });
  };
  


  return (
    <View style={styles.container}>
      {!showLogin ? (
        <View style={styles.splashScreen}>
          <Image
            source={require("../assets/kahe-image.png")}
            style={styles.backgroundImage}
          />
          <View style={styles.overlay} />
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>KAHE ALUMNI PORTAL</Text>
            <Text style={styles.subLogoText}>Build Your Network</Text>
          </View>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={handleShowLogin}
          >
            <Text style={styles.getStartedButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Animated.View
          style={[
            styles.loginContainer,
            { transform: [{ translateY: slideAnimation }] },
          ]}
        >
          <Image
            source={require("../assets/kahe-image.png")}
            style={styles.backgroundImage}
          />
          <View style={styles.overlay} />
          <View style={styles.loginForm}>
            <Text style={styles.loginTitle}>Login</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#999"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            <View style={styles.socialLoginContainer}>
              <Text style={styles.socialLoginText}>Or login with</Text>
              <View style={styles.socialButtons}>
                <TouchableOpacity style={styles.socialButton}>
                  <Text style={styles.socialButtonText}>G</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Text style={styles.socialButtonText}>ln</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Text style={styles.socialButtonText}>f</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity>
                <Text style={styles.signupLink} onPress={() => navigation.navigate("signup")}>Signup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splashScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  logoContainer: {
    alignItems: "center",
  },
  logoText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
  },
  subLogoText: {
    fontSize: 18,
    color: "white",
  },
  getStartedButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  getStartedButtonText: {
    color: "white",
    fontSize: 16,
  },
  loginContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  loginForm: {
    width: "80%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    padding: 20,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#4CAF50",
  },
  loginButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
  },
  socialLoginContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  socialLoginText: {
    marginBottom: 10,
  },
  socialButtons: {
    flexDirection: "row",
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  socialButtonText: {
    fontSize: 16,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupText: {
    color: "#333",
  },
  signupLink: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
});

export default Login;
