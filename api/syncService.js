import axios from "axios";

export const syncToAnalysisAPI = async (rawAppwriteData) => {
  if (!Array.isArray(rawAppwriteData) || rawAppwriteData.length === 0) {
    throw new Error("No data to sync");
  }

  const payload = {
    documents: rawAppwriteData.map(({ summary, text, createdAt, user_id }) => ({
      summary,
      text,
      createdAt,
      user_id,
    })),
  };

  try {
    const response = await axios.post("http://192.168.8.176:8000/sync", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });


    console.log("Sync successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Sync failed:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to sync data");
  }
};
