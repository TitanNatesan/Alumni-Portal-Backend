import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Picker } from "@react-native-picker/picker";

const alumniData = [
  {
    id: "1",
    name: "Jane Doe",
    image: "https://via.placeholder.com/80x80.png?text=JD",
    bio: "Jane is a software engineer with a passion for AI and machine learning. She has worked on various projects and is now a senior developer at TechCorp.",
    graduationYear: "2020",
    major: "Computer Science",
    currentPosition: "Senior Developer at TechCorp",
  },
  {
    id: "2",
    name: "John Smith",
    image: "https://via.placeholder.com/80x80.png?text=JS",
    bio: "John is a marketing strategist with expertise in digital marketing and brand development. He currently leads the marketing team at CreativeInc.",
    graduationYear: "2018",
    major: "Marketing",
    currentPosition: "Marketing Director at CreativeInc",
  },
  // More alumni
];

const NewAlumniScreen = () => {
  const [selectedAlumnus, setSelectedAlumnus] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const openModal = (alumnus) => {
    setSelectedAlumnus(alumnus);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedAlumnus(null);
    setModalVisible(false);
  };

  // Filter alumni based on search text and selected year
  const filteredAlumni = alumniData.filter((alumnus) => {
    const matchesNameOrCompany =
      alumnus.name.toLowerCase().includes(searchText.toLowerCase()) ||
      alumnus.currentPosition.toLowerCase().includes(searchText.toLowerCase());
    const matchesYear = selectedYear
      ? alumnus.graduationYear === selectedYear
      : true;
    return matchesNameOrCompany && matchesYear;
  });

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        All Alumni
      </ThemedText>

      {/* Search Text Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or company"
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />

      {/* Year Filter Picker */}
      <Picker
        selectedValue={selectedYear}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedYear(itemValue)}
      >
        <Picker.Item label="All Years" value="" />
        <Picker.Item label="2020" value="2020" />
        <Picker.Item label="2018" value="2018" />
        {/* Add more years as needed */}
      </Picker>

      {/* Filtered Alumni List */}
      <FlatList
        data={filteredAlumni}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.alumniCard}
            onPress={() => openModal(item)}
            accessible={true}
            accessibilityLabel={`View details for ${item.name}`}
          >
            <Image source={{ uri: item.image }} style={styles.alumniImage} />
            <ThemedText type="subtitle" style={styles.alumniName}>
              {item.name}
            </ThemedText>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.noResultsText}>No results found</Text>
        }
      />

      {/* Modal for displaying alumni details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedAlumnus && (
              <ScrollView contentContainerStyle={styles.modalScroll}>
                <Image
                  source={{ uri: selectedAlumnus.image }}
                  style={styles.modalImage}
                />
                <ThemedText type="title" style={styles.modalName}>
                  {selectedAlumnus.name}
                </ThemedText>
                <Text style={styles.modalText}>Bio: {selectedAlumnus.bio}</Text>
                <Text style={styles.modalText}>
                  Graduation Year: {selectedAlumnus.graduationYear}
                </Text>
                <Text style={styles.modalText}>
                  Major: {selectedAlumnus.major}
                </Text>
                <Text style={styles.modalText}>
                  Current Position: {selectedAlumnus.currentPosition}
                </Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={closeModal}>
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
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
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  picker: {
    height: 40,
    marginBottom: 16,
  },
  alumniCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 4, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  alumniImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  alumniName: {
    fontSize: 18,
    fontWeight: "600",
  },
  noResultsText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
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
    borderRadius: 12,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalScroll: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  modalName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginVertical: 8,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default NewAlumniScreen;
