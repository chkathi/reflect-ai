import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useNote } from "@/contexts/NoteContext";

export default function NoteItem({ note }) {
  const { navigateToNote, setSelectedNote } = useNote();

  const handleNavigation = () => {
    if (!note) {
      console.error("No note provided for navigation");
      return;
    }

    console.log("Navigating with note:", note); // Debugging the note object
    setSelectedNote(note); // Update the context state
    navigateToNote(note); // Navigate using the note directly
  };

  return (
    <TouchableOpacity onPress={handleNavigation}>
      <View style={styles.noteItem}>
        <Text style={styles.noteSummary}>{note.summary}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  noteItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
  },
  noteSummary: {
    fontSize: 18,
  },
  delete: {
    fontSize: 18,
    color: "red",
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
