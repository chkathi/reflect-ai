import { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useNote } from "@/contexts/NoteContext";

const NotePage = () => {
  const inputRef = useRef(null);
  const { selectedNote, deleteNote, editNote } = useNote();

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(selectedNote.text);

  const handleSave = () => {
    if (editedText.trim() === "") return;

    editNote(selectedNote.$id, editedText);

    setIsEditing(false);
  };

  if (!selectedNote) {
    return <Text>No note selected</Text>;
  }

  return (
    <View style={styles.noteItemPage}>
      {/* Display Notes Action */}
      <View style={styles.actions}>
        {isEditing ? (
          <TouchableOpacity
            onPress={() => {
              handleSave();
              inputRef.current?.blur();
            }}
          >
            <Text style={styles.save}>Save 💾</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text style={styles.edit}>Edit ✏️</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => deleteNote(selectedNote.$id)}>
          <Text style={styles.delete}>Delete ❌</Text>
        </TouchableOpacity>
      </View>

      {/* Display Notes Details */}
      <View style={styles.noteItem}>
        <Text style={styles.noteSummary}>
          {selectedNote.summary || "No summary available"}
        </Text>
        <View style={styles.divider} />

        {isEditing ? (
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={editedText}
            onChangeText={setEditedText}
            autoFocus
            onSubmitEditing={handleSave}
            returnKeyType="done"
            // Allow multiline input for longer notes
            multiline
          />
        ) : (
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text style={styles.noteText}>
              {selectedNote.text || "No text available"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  noteItemPage: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
  },
  save: {
    color: "#999da0",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 15,
    padding: 10,
    borderRadius: 8,
  },
  edit: {
    color: "#6495ED",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 15,
    borderRadius: 8,
  },
  delete: {
    color: "#ff3b30",
    fontSize: 16,
    fontWeight: "bold",
    padding: 10,
    borderRadius: 8,
  },
  noteItem: {
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 5,
  },
  noteSummary: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  noteText: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    fontSize: 16,
    color: "#333",
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
    minHeight: 100, // Minimum height for multiline input
  },
});
export default NotePage;
