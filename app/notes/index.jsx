import AddNoteModal from "@/components/AddNoteModal";
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
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          {error && <Text style={styles.errorText}>{error}</Text>}

          {notes.length === 0 ? (
            <Text style={styles.noNotesText}>You have no notes</Text>
          ) : (
            <NoteList notes={notes} onDelete={deleteNote} onEdit={editNote} />
          )}
        </>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add Note</Text>
      </TouchableOpacity>

      <AddNoteModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        newNoteText={newNoteText}
        setNewNoteText={setNewNoteText}
        setNewNoteSummary={setNewNoteSummary}
        addNote={addNote}
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
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 16,
  },
  noNotesText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginTop: 15,
  },
});

export default NoteScreen;
