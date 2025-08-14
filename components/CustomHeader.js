import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

const CustomHeader = ({
  title,
  onAddPress,
  onUserPress,
  onSavePress,
  onDTPress,
  onTaskUpdate,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.buttonGroup}>
          {onUserPress && (
            <TouchableOpacity onPress={onUserPress} style={styles.userButton}>
              <Ionicons name="person" size={24} color="#313131ff" />
            </TouchableOpacity>
          )}

          {onAddPress && (
            <TouchableOpacity onPress={onAddPress} style={styles.addButton}>
              <Ionicons name="add" size={26} color="#313131ff" />
            </TouchableOpacity>
          )}

          {onSavePress && (
            <TouchableOpacity onPress={onSavePress} style={styles.addButton}>
              <Ionicons name="save" size={22} color="#313131ff" />
            </TouchableOpacity>
          )}

          {onDTPress && (
            <TouchableOpacity onPress={onDTPress} style={styles.addButton}>
              <Ionicons name="calendar" size={22} color="#313131ff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#70d7c7",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#70d7c7",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  buttonGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 0,
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  addText: {
    fontSize: 20,
    color: "#70d7c7",
  },
  userButton: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 4,
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  userText: {
    fontSize: 18,
    color: "#70d7c7",
  },
});

export default CustomHeader;
