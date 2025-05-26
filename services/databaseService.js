import { database } from "./appwrite";

// Preforms our CRUD operations
const databaseService = {
  // List Documents
  async listDocuments(dbId, colId) {
    try {
      const response = await database.listDocuments(dbId, colId);

      return response.documents || [];
    } catch (error) {
      console.error("Error Fetching Documents: ", error.message);

      return { error: error.message };
    }
  },

  // Create Document
  async createDocument(dbId, colId, data, id = null) {
    try {
      return await database.createDocument(dbId, colId, id || undefined, data);
    } catch (error) {
      console.error("Error Creating Document: ", error.message);

      return {
        error: error.message,
      };
    }
  },
  
  // Update Document
  async updateDocument(dbId, colId, id, data) {
    try {
      return await database.updateDocument(dbId, colId, id, data);
    } catch (error) {
      console.error("Error Updating Document: ", error.message);

      return {
        error: error.message,
      };
    }
  },

  // Delete document
  async deleteDocument(dbId, colId, id) {
    try {
      await database.deleteDocument(dbId, colId, id);

      return { success: true };
    } catch (error) {
      console.error("Error Deleting Document: ", error.message);

      return {
        error: error.message,
      };
    }
  },
};

export default databaseService;
