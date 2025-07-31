import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";

const CustomHeader = ({ title, onAddPress, onUserPress }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.buttonGroup}>
          {onUserPress && (
            <TouchableOpacity onPress={onUserPress} style={styles.userButton}>
              <Text style={styles.userText}>👤</Text>
            </TouchableOpacity>
          )}
          {onAddPress && (
            <TouchableOpacity onPress={onAddPress} style={styles.addButton}>
              <Text style={styles.addText}>+</Text>
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
    padding: 0,
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
