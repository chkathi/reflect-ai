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
    <View>
      <View style={styles.actions}>
        {isEditing ? (
          <TouchableOpacity
            onPress={() => {
              handleSave();
              inputRef.current?.blur();
            }}
          >
            <Text style={styles.edit}>Save 💾</Text>
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
      <View style={styles.noteItem}>
        <Text>
          Note Summary: {selectedNote.summary || "No summary available"}
        </Text>
        {isEditing ? (
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={editedText}
            onChangeText={setEditedText}
            autoFocus
            onSubmitEditing={handleSave}
            returnKeyType="done"
          />
        ) : (
          <Text>Note Text: {selectedNote.text || "No text available"}</Text>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  noteItem: {
    flexDirection: "column",
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
  input: {
    flex: "row",
    justifyContent: "center",
    fontSize: 16,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    height: 100,
    width: "80%",
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  textContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  summaryContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  summaryText: {
    fontSize: 16,
    color: "#333",
  },
  textInput: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    marginTop: 10,
  },
  textInputContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  noteText: {
    fontSize: 16,
    color: "#333",
  },
});
export default NotePage;
