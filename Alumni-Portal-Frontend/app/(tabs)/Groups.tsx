import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";

// Sample data with images for groups
const groupsData = [
  {
    id: "1",
    name: "KAHE - Chennai Alumni Lead",
    icon: "https://via.placeholder.com/80?text=CS",
  },
  {
    id: "2",
    name: "KAHE - Alumni CALICUT CHAPTER",
    icon: "https://via.placeholder.com/80?text=Bio",
  },
  {
    id: "3",
    name: "KAHEian's of Coimbatore",
    icon: "https://via.placeholder.com/80?text=Bus",
  },
];

// Members data with some placeholders
const membersData = {
  "1": [
    {
      id: "1",
      name: "John Doe",
      avatar: "https://via.placeholder.com/150?text=JD",
      degree: "B.Sc. 2024, CS",
    },
    {
      id: "2",
      name: "Jane Smith",
      avatar: "https://via.placeholder.com/150?text=JS",
      degree: "M.Sc. 2023, CS",
    },
    {
      id: "7",
      name: "Michael Jordan",
      avatar: "https://via.placeholder.com/150?text=MJ",
      degree: "B.Sc. 2025, CS",
    },
  ],
  "2": [
    {
      id: "3",
      name: "Alice Johnson",
      avatar: "https://via.placeholder.com/150?text=AJ",
      degree: "B.Sc. 2024, Biotech",
    },
    {
      id: "4",
      name: "Bob Williams",
      avatar: "https://via.placeholder.com/150?text=BW",
      degree: "Ph.D. 2022, Biotech",
    },
  ],
  "3": [
    {
      id: "5",
      name: "Charlie Brown",
      avatar: "https://via.placeholder.com/150?text=CB",
      degree: "MBA 2023",
    },
    {
      id: "6",
      name: "Diana Prince",
      avatar: "https://via.placeholder.com/150?text=DP",
      degree: "BBA 2024",
    },
  ],
};

// Events data for each group
const eventsData = {
  "1": [
    { id: "1", title: "CS Career Fair", date: "2024-05-15" },
    { id: "2", title: "AI Workshop", date: "2024-06-01" },
  ],
  "2": [
    { id: "3", title: "Biotech Symposium", date: "2024-07-10" },
    { id: "4", title: "Lab Equipment Expo", date: "2024-08-20" },
  ],
  "3": [
    { id: "5", title: "Entrepreneurship Summit", date: "2024-09-05" },
    { id: "6", title: "Finance Workshop", date: "2024-10-15" },
  ],
};

// Animated Group Component
const Groups = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [scaleAnim] = useState(new Animated.Value(1)); // Scale animation

  // Animate on press
  const handlePress = (groupId) => {
    setSelectedGroup(groupId);
    Animated.timing(scaleAnim, {
      toValue: 1.05,
      duration: 100,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() =>
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start()
    );
  };

  const renderGroupItem = ({
    item,
  }: {
    item: { id: string; name: string; icon: string };
  }) => (
    <Animated.View
      style={[styles.groupItem, { transform: [{ scale: scaleAnim }] }]}
    >
      <TouchableOpacity onPress={() => handlePress(item.id)}>
        <Image source={{ uri: item.icon }} style={styles.groupIcon} />
        <Text style={styles.groupName}>{item.name}</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderMemberItem = ({
    item,
  }: {
    item: { id: string; name: string; avatar: string; degree: string };
  }) => (
    <View style={styles.memberItem}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberDegree}>{item.degree}</Text>
      </View>
    </View>
  );

  const renderEventItem = ({
    item,
  }: {
    item: { id: string; title: string; date: string };
  }) => (
    <View style={styles.eventItem}>
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDate}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Explore Groups</Text>
      <FlatList
        data={groupsData}
        renderItem={renderGroupItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      {selectedGroup && (
        <View style={styles.groupDetails}>
          <Text style={styles.subHeader}>Members</Text>
          <FlatList
            data={membersData[selectedGroup]}
            renderItem={renderMemberItem}
            keyExtractor={(item) => item.id}
          />
          <Text style={styles.subHeader}>Upcoming Events</Text>
          <FlatList
            data={eventsData[selectedGroup]}
            renderItem={renderEventItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  groupItem: {
    backgroundColor: "#fff",
    padding: 16,
    marginRight: 12,
    borderRadius: 12,
    width: 120, // Limiting the card's width
    height: 160, // Limiting the card's height to appear small
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Shadow for Android
    justifyContent: "center", // Center the content vertically
    alignItems: "center", // Center the content horizontally
  },
  groupIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },

  groupName: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "#555",
  },
  groupDetails: {
    marginTop: 24,
  },
  subHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 12,
    color: "#333",
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: "#ccc", // Placeholder background
  },
  memberName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  memberDegree: {
    fontSize: 14,
    color: "#666",
  },
  eventItem: {
    paddingVertical: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
  },
  eventDate: {
    fontSize: 14,
    color: "#888",
  },
});

export default Groups;
