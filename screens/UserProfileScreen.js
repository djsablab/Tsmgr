import { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, StyleSheet, Alert, Modal } from "react-native";
import { auth } from "../services/firebaseConfig";
import { updateProfile, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import CustomHeader from "../components/CustomHeader";
import { fetchTasks } from "../services/firebaseConfig";
import RoundedButton from "../components/RoundedButton";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

const db = getFirestore();

const UserProfileScreen = ({ navigation }) => {
  const [name, setName] = useState(auth.currentUser?.displayName || "");
  const [username, setUsername] = useState(""); // For username fetched from Firestore
  const [tasks, setTasks] = useState([]); // For storing tasks
  const [loading, setLoading] = useState(false); // For loading state when updating
  const [logoutLoading, setLogoutLoading] = useState(false); // For loading state when logging out
  const [modalVisible, setModalVisible] = useState(false); // To control modal visibility

  // Fetch user data (username) from Firestore
  const loadUserData = useCallback(async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUsername(userDoc.data().username); // Set username fetched from Firestore
      } else {
        Toast.show({
          type: "info",
          text1: "No user data found",
          text2: "Please check your Firestore setup.",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error fetching user data",
        text2: error.message,
      });
    }
  }, []);

  // Fetch tasks and calculate completed ones
  const loadTasks = useCallback(async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    try {
      const tasksList = await fetchTasks(uid);
      setTasks(tasksList);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error fetching tasks",
        text2: error.message,
      });
    }
  }, []);

  // Fetch user data and tasks when the component mounts
  useEffect(() => {
    loadUserData();
    loadTasks();
  }, [loadUserData, loadTasks]);

  const handleUpdate = async () => {
    if (!name) {
      Toast.show({
        type: "info",
        text1: "Please enter a valid name",
        text2: "Name cannot be empty.",
      });
      return;
    }

    setLoading(true);
    try {
      // Update username in Firebase Authentication
      await updateProfile(auth.currentUser, { displayName: name });

      // Update username in Firestore
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const userDocRef = doc(db, "users", uid);
      await setDoc(userDocRef, { username: name }, { merge: true });

      Toast.show({
        type: "success",
        text1: "Username updated successfully",
        text2: "Your username has been updated.",
      });
      loadUserData(); // Re-fetch user data to ensure username is updated
      setModalVisible(false); // Close the modal
    } catch (error) {
      Toast.show({
        type: "success",
        text1: "Task updated successfully",
        text2: "Your task has been updated.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await signOut(auth);
      navigation.navigate("Login"); // Navigate to Login screen after logout
      Toast.show({
        type: "info",
        text1: "Logged out successfully",
        text2: "You have been logged out.",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Logout failed",
        text2: "Error logging out. Please try again.",
      });
    } finally {
      setLogoutLoading(false);
    }
  };

  // Calculate the number of completed tasks
  const completedTasks = tasks.filter((task) => task.isCompleted).length;
  const totalTasks = tasks.length;

  return (
    <View style={styles.container}>
      <CustomHeader
        title={"Hi there, " + username + " 👋"}
        onUserPress={() => setModalVisible(true)}
        onLogoutPress={handleLogout}
      />
      <Text style={{ fontSize: 20, fontWeight: "bold", margin: 20 }}>
        Your stats:
      </Text>

      <View style={styles.formContainer}>
        <View style={styles.formText}>
          <Ionicons name="mail-outline" size={24} color="#313131ff" />
          <Text style={styles.formText}> {auth.currentUser?.email}</Text>
        </View>

        <View style={styles.formText}>
          <Ionicons name="time-outline" size={24} color="#313131ff" />
          <Text style={styles.formText}>
            {" "}
            {auth.currentUser?.metadata.creationTime}
          </Text>
        </View>

        <View style={styles.formText}>
          <Ionicons name="key-outline" size={24} color="#313131ff" />
          <Text style={styles.formText}>
            {" "}
            {auth.currentUser?.metadata.lastSignInTime}
          </Text>
        </View>
      </View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 10,
          margin: 20,
        }}
      >
        Task Stats:
      </Text>
      <View style={styles.infoWrapperContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            {completedTasks}
            {"\n"}Checked
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            {totalTasks}
            {"\n"}Total Tasks
          </Text>
        </View>
      </View>

      {/* Modal for Username Update */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
            >
              Enter your new name:
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              style={styles.input}
            />

            <View style={{ alignItems: "center" }}>
              <RoundedButton
                title="Update"
                onPress={handleUpdate}
                style={{
                  marginBottom: 20,
                  width: "100%",
                  backgroundColor: "#70d7c7",
                  alignItems: "center",
                }}
              />
              <RoundedButton
                title="Close"
                onPress={() => setModalVisible(false)}
                color="red"
                style={{
                  marginBottom: 20,
                  width: "100%",
                  backgroundColor: "#3fb5a8",
                  alignItems: "center",
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  formContainer: {
    padding: 10,
    gap: 12,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    marginBottom: 12,
  },
  input: {
    marginBottom: 20,
    borderWidth: 1,
    padding: 10,
    borderRadius: 12,
  },
  infoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginHorizontal: 20,
  },
  infoText: {
    fontSize: 18,
    marginVertical: 5,
    textAlign: "center",
  },
  loader: {
    marginTop: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  infoWrapperContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  formText: {
    fontSize: 18,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});

export default UserProfileScreen;
