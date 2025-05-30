import noteService from "@/services/notesService";
import { useRouter } from "expo-router";
import { createContext, useContext, useState } from "react";
import { Alert } from "react-native";

const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const router = useRouter();

  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  const fetchNotes = async (userId, setLoading) => {
    setLoading(true); // Start loading
    const response = await noteService.getNotes(userId);
    if (response.error) {
      Alert.alert("Error", response.error);
    } else {
      setNotes(response.data);
    }
    setLoading(false); // Stop loading
  };

  const editNote = async (id, newText) => {
    if (!newText.trim()) {
      Alert.alert("Error", "Note text cannot be empty");
      return;
    }

    // Optimistically update the selectedNote and notes array
    const previousNote = selectedNote;
    setSelectedNote((prevSelectedNote) => ({
      ...prevSelectedNote,
      text: newText,
    }));
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.$id === id ? { ...note, text: newText } : note
      )
    );

    // Send the update request to the database
    const response = await noteService.updateNote(id, newText);
    if (response.error) {
      // Roll back the changes if the request fails
      Alert.alert("Error", response.error);
      setSelectedNote(previousNote);
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.$id === id ? previousNote : note))
      );
    }
  };

  const deleteNote = async (id) => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          // Optimistically remove the note from the state
          const previousNotes = notes; // Save the current state for rollback
          setNotes((prevNotes) => prevNotes.filter((note) => note.$id !== id));

          // If the deleted note is the currently selected note, navigate back to /notes
          if (selectedNote?.$id === id && router.pathname === "/note-page") {
            setSelectedNote(null); // Clear the selected note
            router.push("/notes");
          }

          // Send the delete request to the database
          const response = await noteService.deleteNote(id);
          if (response.error) {
            // Roll back the changes if the request fails
            Alert.alert("Error", response.error);
            setNotes(previousNotes); // Restore the previous state
          }
        },
      },
    ]);
  };

  const navigateToNote = (note) => {
    if (!note) {
      Alert.alert("Error", "Note not found");
      return;
    }

    // Set the selected note in context
    setSelectedNote(note);

    // Navigate to the note page only if not already on it
    if (router.pathname !== "/note-page") {
      router.push("/note-page");
    }
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        setNotes,
        selectedNote,
        setSelectedNote,
        fetchNotes,
        editNote,
        deleteNote,
        navigateToNote,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};

export const useNote = () => useContext(NoteContext);

export default NoteContext;
