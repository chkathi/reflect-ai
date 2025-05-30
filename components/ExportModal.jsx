import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ExportModal({
  exportModalVisible,
  setExportModalVisible,
}) {
  return (
    <Modal
      visible={exportModalVisible}
      animationType="slide"
      transparent
      onRequestClose={() => setExportModalVisible(false)} // Required for Android
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Export Notes</Text>

            {/* Input Fields */}
            <Text>From: </Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Month"
                style={styles.input}
                keyboardType="numeric"
                placeholderTextColor="#aaa"
                maxLength={2} // Limit input to 2 digits
              />
              <TextInput
                placeholder="Year"
                style={styles.input}
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                maxLength={4} // Limit input to 4 digits
              />
            </View>
            <Text>To: </Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Month"
                style={styles.input}
                keyboardType="numeric"
                placeholderTextColor="#aaa"
                maxLength={2} // Limit input to 2 digits
              />
              <TextInput
                placeholder="Year"
                style={styles.input}
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                maxLength={4} // Limit input to 4 digits
              />
            </View>
            <Text style={styles.exportFail}>
              {" "}
              No notes found within these dates
            </Text>
            <Text style={styles.exportSucess}> Available for download!</Text>

            {/* Modal Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => console.log("Exporting notes...")}
              >
                <Text style={styles.export}>Export</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setExportModalVisible(false)}>
                <Text style={styles.cancel}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "90%", // Set a width for the modal
    alignSelf: "center", // Center the modal horizontally
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20, // Add spacing below inputs
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: "45%", // Adjust width for side-by-side layout
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row", // Change to row for side-by-side layout
    justifyContent: "space-between", // Add spacing between buttons
    marginTop: 20, // Optional: Add some margin for better spacing
  },
  cancel: {
    color: "#ff3b30",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginRight: 40, // Add margin for spacing
  },
  export: {
    color: "#007bff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginLeft: 40, // Add margin for spacing
  },
  exportFail: {
    color: "red",
    textAlign: "center",
    marginBottom: 5,
    fontSize: 16,
  },
  exportSucess: {
    color: "green",
    textAlign: "center",
    marginBottom: 5,
    fontSize: 16,
  },
});
