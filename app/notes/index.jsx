import AddNoteModal from "@/components/AddNoteModal";
import ExportModal from "@/components/ExportModal";
import NoteList from "@/components/NoteList";
import { useAuth } from "@/contexts/AuthContext";
import noteService from "@/services/notesService";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useNote } from "@/contexts/NoteContext";

const NoteScreen = () => {
  const { notes, setNotes, fetchNotes, editNote, deleteNote } = useNote();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");
  const [newNoteSummary, setNewNoteSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth");
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (user) {
      fetchNotes(user.$id, setLoading);
    }
  }, [user]);

  const addNote = async () => {
    if (newNoteText.trim() === "") return;

    const response = await noteService.addNote(
      user.$id,
      newNoteText,
      newNoteSummary
    );

    if (response.error) {
      Alert.alert("Error", response.error);
    } else {
      setNotes([...notes, response.data]);
    }

    setNewNoteText("");
    setNewNoteSummary("");
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Add Note</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.exportButton}
          onPress={() => {
            console.log("Export requested!");
            setExportModalVisible(true);
          }}
        >
          <Text style={styles.addButtonText}>Export Notes</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          {error && <Text style={styles.errorText}>{error}</Text>}

          {notes.length === 0 ? (
            <Text style={styles.noNotes}>You have no notes</Text>
          ) : (
            <NoteList notes={notes} onDelete={deleteNote} onEdit={editNote} />
          )}
        </>
      )}

      <AddNoteModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        newNoteText={newNoteText}
        setNewNoteText={setNewNoteText}
        setNewNoteSummary={setNewNoteSummary}
        addNote={addNote}
      />
      <ExportModal
        exportModalVisible={exportModalVisible}
        setExportModalVisible={setExportModalVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 16,
  },
  noNotes: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginTop: 15,
  },
  actions: {
    flexDirection: "row", // Arrange buttons in a row
    justifyContent: "space-between", // Space out the buttons
    padding: 5,
    marginBottom: 20, // Add margin at the bottom
    backgroundColor: "#fff", // Optional: Background color for the actions bar
    borderBottomWidth: 1, // Optional: Add a border at the top
    borderBottomColor: "#ccc", // Optional: Border color
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    flex: 1, // Make the button take equal space
    marginHorizontal: 5, // Add spacing between buttons
  },
  exportButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    flex: 1, // Make the button take equal space
    marginHorizontal: 5, // Add spacing between buttons
  },
});

export default NoteScreen;
