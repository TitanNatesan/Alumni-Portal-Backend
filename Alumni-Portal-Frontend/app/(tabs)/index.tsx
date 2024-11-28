import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  FlatList,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Alert,
  Linking,
} from "react-native";
import { format } from "date-fns";
import { useNavigation, NavigationProp } from "@react-navigation/native";
type RootStackParamList = {
  "user-profile": undefined;
  "login": undefined;
  "upcoming-events": undefined;
  "past-events": undefined;
  "new-alumni": undefined;
  "event-gallery": undefined;
}; // Define the type inline if the module is not found
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BaseURL } from "../BaseURL";

const LIGHT_GREEN = "#90EE90";
const DARK_GREEN = "#2E8B57";
const WHITE = "#FFFFFF";

const ThemedText = ({ style, children, type }: any) => {
  const baseStyle = {
    color: type === "title" ? DARK_GREEN : "#333333",
    fontSize: type === "title" ? 24 : type === "subtitle" ? 18 : 14,
    fontWeight: type === "title" || type === "subtitle" ? "bold" : "normal",
  };
  return <Text style={[baseStyle, style]}>{children}</Text>;
};

const Navbar = ({ onProfilePress }: any) => (
  <View style={styles.navbar}>
    <Image source={require("../../assets/kahelogo.png")} style={styles.logo} />
    <ThemedText style={styles.subtitle} type="subtitle">
      Alumni Portal
    </ThemedText>
    <TouchableOpacity
      onPress={onProfilePress}
      style={styles.profileIconContainer}
    >
      <Image
        source={{ uri: "https://via.placeholder.com/40x40.png?text=U" }}
        style={styles.profileIcon}
      />
    </TouchableOpacity>
  </View>
);


const EventCard = (
  {
    title,
    start_date,
    images,
  }
    : {
      title: string;
      start_date: string;
      images: Array<{ image: string }>;
    }) => {

  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const [imageIndex, setImageIndex] = useState(0);

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  // Check if images array exists and has at least one item, otherwise use a placeholder URL
  const imageUrl = images && images[imageIndex] ? `${BaseURL}${images[imageIndex].image}` : "https://via.placeholder.com/300x150.png?text=No+Image";

  useEffect(() => {
    // Only start the interval if there is more than one image
    if (images.length > 1) {
      const intervalId = setInterval(() => {
        setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000); // Change image every 5 seconds

      // Clear the interval when the component unmounts
      return () => clearInterval(intervalId);
    }
  }, [images]);

  // Format the start_date to a more readable format with AM/PM indication
  const formattedDate = format(new Date(start_date), 'MMMM dd, yyyy hh:mm a');

  return (
    <TouchableOpacity
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      activeOpacity={1}
    >
      <Animated.View
        style={[styles.eventCard, { transform: [{ scale: scaleAnim }] }]}
      >
        <Image source={{ uri: imageUrl }} style={styles.eventImage} />
        <View style={styles.eventInfo}>
          <ThemedText style={styles.subtitle} type="subtitle">
            {title}
          </ThemedText>
          <ThemedText style={styles.date} type="subtitle">
            {formattedDate}
          </ThemedText>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};


interface InternshipCardProps {
  title: string;
  company: {
    name: string;
    logo: string;
    website: string;
  };
  location: string;
  apply_link: string;
  description: string;
}

const InternshipCard = ({
  title,
  company,
  location,
  apply_link,
  description,
}: InternshipCardProps) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <TouchableOpacity
      onPress={() =>
        Alert.alert("Apply Now", "Do you want to open the application link?", [
          { text: "Cancel", style: "cancel" },
          { text: "Yes", onPress: () => Linking.openURL(apply_link) },
        ])
      }
      style={styles.internshipCard}
    >
      <View style={styles.internshipHeader}>
        <Image
          source={{ uri: `${BaseURL}${company.logo}` }}
          style={styles.internshipLogo}
        />
        <View>
          <Text style={styles.internshipTitle}>{title}</Text>
          <Text style={styles.internshipCompany}>{company.name}</Text>
        </View>
      </View>
      <Text style={styles.internshipLocation}>{location}</Text>
      <Text numberOfLines={3} style={styles.internshipDescription}>
        {description}
      </Text>
      <Text style={styles.internshipApply}>Tap to Apply</Text>
    </TouchableOpacity>
  );
};


export default function HomeScreen() {
  const navigation = useNavigation();

  const [user, setUser] = useState<any>({});
  const [newAlumni, setNewAlumni] = useState<any[]>([]);
  const [pastEvents, setPastEvents] = useState<any[]>([]);
  const [internships, setInternships] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await axios.get("http://192.168.88.106:8000/auth/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
    } catch (err) {
      console.error(err);
      await AsyncStorage.clear();
      Alert.alert("Session Expired", "Please login again", [
        {
          text: "OK",
          onPress: () => navigation.navigate("login" as never),
        },
      ]);
    }
  };

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await axios.get("http://192.168.88.106:8000/home/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const currentDate = new Date();
      const allEvents = response.data.events;
      setNewAlumni(response.data.new_users);
      setInternships(response.data.internships);
      setUser(response.data.user);
      const upcoming = allEvents.filter((event: any) => new Date(event.start_date) > currentDate);
      const past = allEvents.filter((event: any) => new Date(event.start_date) <= currentDate);
      setUpcomingEvents(upcoming);
      setPastEvents(past);
      console.log(upcomingEvents);
      console.log("Success");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    checkAuth();
  }, []);

  const renderShowMoreButton = (section: string) => (
    <TouchableOpacity onPress={() => navigation.navigate(section as never)}>
      <Text style={styles.showMoreText}>Show More</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <Navbar
          onProfilePress={() => navigation.navigate("user-profile" as never)}
        />
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <ThemedText type="title" style={styles.sectionTitle}>
            Upcoming Events
          </ThemedText>
          <FlatList
            data={upcomingEvents}
            renderItem={({ item }) => <EventCard title={item.title} start_date={item.start_date} images={item.images} />}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.eventList}
          />
          {renderShowMoreButton("upcoming-events")}
          <ThemedText type="title" style={styles.sectionTitle}>
            Past Events
          </ThemedText>
          <FlatList
            data={pastEvents}
            renderItem={({ item }) => <EventCard title={item.title} start_date={item.start_date} images={item.images} />}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.eventList}
          />
          {renderShowMoreButton("past-events")}

          <ThemedText type="title" style={styles.sectionTitle}>
            New Alumni
          </ThemedText>
          <FlatList
            data={newAlumni}
            renderItem={({ item }) => (
              <View style={styles.alumniCard}>
                <Image
                  source={{ uri: `${BaseURL}${item.profile_image}` }}
                  style={styles.alumniImage}
                />
                <ThemedText type="subtitle" style={styles.alumniName}>
                  {item.first_name} {item.last_name}
                </ThemedText>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.alumniList}
          />
          {renderShowMoreButton("new-alumni")}

          <ThemedText type="title" style={styles.sectionTitle}>
            Event Gallery
          </ThemedText>
          <FlatList
            data={upcomingEvents.flatMap(event => event.images)}
            renderItem={({ item }) => (
              <Image source={{ uri: `${BaseURL}${item}` }} style={styles.galleryImage} />
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.galleryList}
          />
          {renderShowMoreButton("event-gallery")}

          <ThemedText type="title" style={styles.sectionTitle}>
            Internship Opportunities
          </ThemedText>
          <FlatList
            data={internships}
            renderItem={({ item }) => <InternshipCard {...item} />}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.internshipList}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA", // Light grey background for a clean look
  },
  safeArea: {
    flex: 1,
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: DARK_GREEN,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  logo: {
    width: 120,
    height: 35,
    marginRight: 10,
    resizeMode: "contain",
  },
  profileIconContainer: {
    marginLeft: "auto",
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ddd",
  },
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 12,
    color: DARK_GREEN,
    fontSize: 22,
    fontWeight: "bold",
  },
  showMoreText: {
    color: "#2E8B57",
    textAlign: "right",
    marginVertical: 10,
    fontSize: 16,
    fontWeight: "500",
  },
  eventCard: {
    width: 280,
    marginRight: 12,
    borderRadius: 15,
    backgroundColor: WHITE,
    elevation: 4,
    overflow: "hidden",
  },
  eventImage: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  eventInfo: {
    padding: 12,
  },
  date: {
    color: "#999",
    fontSize: 14,
    marginTop: 5,
  },
  eventList: {
    marginBottom: 24,
  },
  alumniCard: {
    alignItems: "center",
    marginRight: 20,
    backgroundColor: WHITE,
    padding: 10,
    borderRadius: 10,
    elevation: 3,
  },
  alumniImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  alumniName: {
    marginTop: 8,
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  alumniList: {
    marginBottom: 20,
  },
  galleryImage: {
    width: 160,
    height: 160,
    marginRight: 12,
    borderRadius: 10,
  },
  galleryList: {
    marginBottom: 20,
  },
  internshipCard: {
    width: 280,
    padding: 16,
    marginRight: 12,
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  internshipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  internshipLogo: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
  },
  internshipTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: DARK_GREEN,
  },
  internshipCompany: {
    marginVertical: 8,
    color: "#2E8B57",
    fontSize: 16,
    fontWeight: "600",
  },
  internshipDetails: {
    fontSize: 14,
    color: "#777",
  },
  internshipLocation: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "Roboto",
    color: "#333333",
    fontSize: 18,
  },
  internshipList: {
    marginBottom: 20,
  },
  internshipDescription: {
    fontSize: 14,
    color: "#777",
    marginBottom: 8,
  },
  internshipApply: {
    fontSize: 16,
    color: DARK_GREEN,
    fontWeight: "bold",
    marginTop: 10,
  },
});