import { FlatList, StyleSheet } from "react-native";
import NoteItem from "./NoteItem";

export default function NoteList({ notes, onDelete, onEdit }) {
  return (
    <FlatList
      data={notes}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <NoteItem note={item} onDelete={onDelete} onEdit={onEdit} />
      )}
      contentContainerStyle={styles.listContainer} // Add padding to avoid overlap
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 30,
  },
});
