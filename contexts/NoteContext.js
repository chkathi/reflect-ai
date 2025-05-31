import noteService from "@/services/notesService";
import { useRouter } from "expo-router";
import { createContext, useContext, useState } from "react";
import { Alert } from "react-native";

const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const router = useRouter();

  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [exportError, setExportError] = useState("");
  const [exportSuccess, setExportSuccess] = useState("");

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

  const filterNotesFunc = (startMonth, startYear, endMonth, endYear) => {
    if (
      startMonth === 0 ||
      startYear === 0 ||
      endMonth === 0 ||
      endYear === 0
    ) {
      console.log("NotesContext: Missing date fields for filtering");
      setExportError("Please fill in all fields.");
      return [];
    }

    if (
      startYear > endYear ||
      (startYear === endYear && startMonth > endMonth)
    ) {
      setExportError("Start date cannot be after end date.");
      setExportSuccess("");
      console.log("NotesContext: Start date is after end date");
      return [];
    }

    if (
      startYear < 1900 ||
      endYear < 1900 ||
      startMonth < 1 ||
      endMonth < 1 ||
      startMonth > 12 ||
      endMonth > 12
    ) {
      setExportError("Invalid month or year for filtering.");
      setExportSuccess("");
      console.log("NotesContext: Invalid month or year for filtering");
      return [];
    }

    const filtered = notes.filter((note) => {
      const noteDate = new Date(note.createdAt);
      const startDate = new Date(startYear, startMonth - 1, 1);
      const endDate = new Date(endYear, endMonth - 1, 0);

      console.log(
        `NotesContext: Filtering notes from ${startDate} to ${endDate}`
      );

      return noteDate >= startDate && noteDate <= endDate;
    });

    if (!filtered || filtered.length === 0) {
      console.log("NotesContext: No notes found within the specified dates");
      setExportError("No notes found within these dates.");
      setExportSuccess("");
      return [];
    }

    setFilteredNotes(filtered);
    setExportError(""); // Clear any previous error
    setExportSuccess("Notes available for download!");
    console.log("NotesContext: Filtered notes successfully");
    console.log("Filtered Notes:", filteredNotes);
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
        filterNotesFunc,
        filteredNotes,
        exportError,
        exportSuccess,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};

export const useNote = () => useContext(NoteContext);

export default NoteContext;
