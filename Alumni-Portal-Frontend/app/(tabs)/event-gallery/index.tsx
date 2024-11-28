import React from "react";
import { View, Image, FlatList, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const galleryImages = [
  "https://via.placeholder.com/160x160.png?text=Event+1",
  "https://via.placeholder.com/160x160.png?text=Event+2",
];

const EventGalleryScreen = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Event Gallery</ThemedText>
      <FlatList
        data={galleryImages}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} />
        )}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  image: {
    width: "48%",
    height: 160,
    margin: "1%",
    borderRadius: 10,
  },
  row: {
    justifyContent: "space-between",
  },
});

export default EventGalleryScreen;
