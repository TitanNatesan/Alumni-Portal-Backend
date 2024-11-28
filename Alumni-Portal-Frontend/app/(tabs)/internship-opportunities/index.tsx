import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  Modal,
  Button,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

const opportunities = [
  {
    id: "1",
    title: "Software Developer Internship",
    company: "TechCorp",
    details: "Work on developing scalable software solutions...",
    postedDate: "2024-09-01",
    address: "123 Tech Street, Tech City",
  },
  {
    id: "2",
    title: "Marketing Internship",
    company: "CreativeInc",
    details: "Assist in marketing campaigns and digital strategies...",
    postedDate: "2024-09-05",
    address: "456 Market Road, Creative Town",
  },
  // More opportunities
];

const InternshipOpportunitiesScreen = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filteredOpportunities = opportunities.filter(
    (opportunity) =>
      (filter === "All" || opportunity.company === filter) &&
      opportunity.title.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (internship) => {
    setSelectedInternship(internship);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedInternship(null);
    setModalVisible(false);
  };

  const handleApplyNow = () => {
    // Implement the apply functionality here
    alert("Applied for " + selectedInternship?.title);
    closeModal();
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Internship Opportunities
      </ThemedText>
      <TextInput
        style={styles.searchInput}
        placeholder="Search internships..."
        value={search}
        onChangeText={setSearch}
      />
      <Picker
        selectedValue={filter}
        style={styles.picker}
        onValueChange={(itemValue) => setFilter(itemValue)}
      >
        <Picker.Item label="All" value="All" />
        <Picker.Item label="TechCorp" value="TechCorp" />
        <Picker.Item label="CreativeInc" value="CreativeInc" />
        {/* Add more filter options as needed */}
      </Picker>
      <FlatList
        data={filteredOpportunities}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
            <View style={styles.cardContent}>
              <Ionicons
                name="briefcase"
                size={24}
                color="#007BFF"
                style={styles.icon}
              />
              <View style={styles.textContainer}>
                <ThemedText type="subtitle" style={styles.cardTitle}>
                  {item.title}
                </ThemedText>
                <Text style={styles.cardCompany}>{item.company}</Text>
                <Text style={styles.cardDetails}>{item.details}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />

      {/* Modal for displaying internship details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedInternship && (
              <ScrollView contentContainerStyle={styles.modalScroll}>
                <Text style={styles.modalTitle}>
                  {selectedInternship.title}
                </Text>
                <Text style={styles.modalText}>
                  Company: {selectedInternship.company}
                </Text>
                <Text style={styles.modalText}>
                  Posted on: {selectedInternship.postedDate}
                </Text>
                <Text style={styles.modalText}>
                  Address: {selectedInternship.address}
                </Text>
                <Text style={styles.modalText}>
                  Details: {selectedInternship.details}
                </Text>
                <View style={styles.buttonContainer}>
                  <Button
                    title="Apply Now"
                    onPress={handleApplyNow}
                    color="#007BFF"
                  />
                  <Button title="Close" onPress={closeModal} color="red" />
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },
  searchInput: {
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  picker: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  card: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 4, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  cardCompany: {
    fontSize: 16,
    color: "#555",
  },
  cardDetails: {
    fontSize: 14,
    color: "#777",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalScroll: {
    flexGrow: 1,
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginVertical: 8,
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default InternshipOpportunitiesScreen;
