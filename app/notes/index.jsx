import { useAuth } from "@/contexts/AuthContext";
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

import AddNoteModal from "@/components/AddNoteModal";
import NoteList from "@/components/NoteList";

import notesService from "@/services/notesService";

export default function NotesScreen() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [notes, setNotes] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && user === null) {
      router.replace("/auth");
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, []);

  const fetchNotes = async () => {
    setLoading(true);

    const response = await notesService.getNotes(user.$id);

    console.log("Fetched notes response:", response);

    if (response.error) {
      setError(response.error);
      Alert.alert("Error");
    } else {
      setNotes(response.data);
      setError(null);
    }

    setLoading(false);
  };

  const addNote = async () => {
    console.log("Add Note: Log");

    if (newNote.trim() === "") return;

    const response = await notesService.addNote(user.$id, newNote);

    if (response.error) {
      Alert.alert("Error: ", response.error);
    } else {
      setNotes([...notes, response.data]);
    }

    setNewNote("");
    setModalVisible(false);
  };

  const deleteNote = async (id) => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      {
        text: "cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive", // Red color for the button
        onPress: async () => {
          const response = await notesService.deleteNote(id);

          if (response.error) {
            Alert.alert("Error: ", response.error);
          } else {
            // Update notes on screen (keep notes that dont match the id)
            setNotes(notes.filter((note) => note.$id != id));
          }
        },
      },
    ]);
  };

  const editNote = async (id, updatedText) => {
    if (!updatedText.trim()) {
      Alert.alert("Error", "Note text cannot be empty.");
      return;
    }
    const response = await notesService.updateNote(id, updatedText);

    if (response.error) {
      Alert.alert("Error: ", response.error);
    } else {
      // Update notes on screen
      setNotes((prevNotes) => {
        prevNotes.map((note) =>
          note.$id == id ? { ...note, text: updatedText } : note
        );
      });
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          {error && <Text style={styles.errorText}>{error}</Text>}

          {notes.length === 0 ? (
            <Text style={styles.noNotesText}>You have no notes</Text>
          ) : (
            /* Note List Component */
            <NoteList notes={notes} onDelete={deleteNote} onEdit={editNote} />
          )}
        </>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}> + Add Notes </Text>
      </TouchableOpacity>

      {/* Modal Component */}
      <AddNoteModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        newNote={newNote}
        setNewNote={setNewNote}
        addNote={addNote}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
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
});
