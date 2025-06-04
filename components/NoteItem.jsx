import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useNote } from "@/contexts/NoteContext";

export default function NoteItem({ note }) {
  const { navigateToNote, deleteNote, setSelectedNote } = useNote();

  const handleNavigation = () => {
    if (!note) {
      console.error("No note provided for navigation");
      return;
    }

    console.log("Navigating with note:", note); // Debugging the note object
    setSelectedNote(note); // Update the context state
    navigateToNote(note); // Navigate using the note directly
  };

  // Format the date to show only the day and time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "long", // Full month name (e.g., "May")
      day: "numeric", // Day of the month (e.g., "29")
      year: "numeric", // Full year (e.g., "2025")
      hour: "2-digit", // Hour (e.g., "2")
      minute: "2-digit", // Minute (e.g., "30")
      hour12: true, // Use 12-hour format (e.g., "PM")
    });
  };

  return (
    <TouchableOpacity onPress={handleNavigation}>
      <View style={styles.noteItem}>
        <Text style={styles.noteSummary}>{note.summary}</Text>
        <Text style={styles.noteDate}>{formatDate(note.createdAt)}</Text>
        <TouchableOpacity onPress={() => deleteNote(note.$id)}>
          <Text style={styles.delete}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  noteItem: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
  },
  noteSummary: {
    fontSize: 18,
    fontWeight: "bold",
  },
  noteDate: {
    fontSize: 12,
    padding: 5
  },
  delete: {
    fontSize: 16,
    color: "white",
    fontweight: "bold",
    backgroundColor: "red",
    padding: 5,
    width: "30%",
    textAlign: "center",
    borderRadius: 5,
  },
  actions: {
    flexDirection: "row",
  },
  edit: {
    fontSize: 18,
    marginRight: 10,
    color: "blue",
  },
});
