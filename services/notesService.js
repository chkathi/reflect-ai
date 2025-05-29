import { ID, Query } from "react-native-appwrite";
import databaseService from "./databaseService";

// Appwrite database and collection ID
const dbId = process.env.EXPO_PUBLIC_APPWRITE_DB_ID;
const colId = process.env.EXPO_PUBLIC_APPWRITE_COL_NOTES_ID;

// Notes Service
const notesService = {
  // Get Note
  async getNotes(user_id) {
    if (!user_id) {
      console.error("Error: Missing user_id in getNotes()");
      return {
        data: [],
        error: "User_id is missing",
      };
    }

    try {
      const response = await databaseService.listDocuments(dbId, colId, [
        Query.equal("user_id", user_id),
      ]);

      return response;
    } catch (error) {
      console.log("Error fetching notes:", error.message);

      return { data: [], error: error.message };
    }
  },

  // Add New Note
  async addNote(user_id, text, summary) {
    if (!text) {
      return { error: "Note text cannot be empty." };
    }

    const data = {
      text: text,
      createdAt: new Date().toISOString(),
      summary,
      user_id,
    };

    const response = await databaseService.createDocument(
      dbId,
      colId,
      data,
      ID.unique()
    );

    if (response?.error) {
      return { error: response.error };
    }

    return { data: response };
  },

  async updateNote(id, text) {
    const response = await databaseService.updateDocument(dbId, colId, id, {
      text,
    });

    if (response?.error) {
      return { error: response.error };
    } else {
      return { data: response };
    }
  },

  async deleteNote(noteId) {
    const response = await databaseService.deleteDocument(dbId, colId, noteId);

    if (response?.error) {
      return { error: response.error };
    }

    return { sucess: true };
  },
};

export default notesService;
