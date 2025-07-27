import React, { useEffect } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setTasks, deleteTask } from '../store/tasksSlice'; // Redux actions
import { fetchTasks } from '../services/firebaseConfig';  // Firebase veri çekme fonksiyonu

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks); // Redux store'dan görevler

  // Firebase'den görevleri çekme ve Redux'a ekleme
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const fetchedTasks = await fetchTasks();
        dispatch(setTasks(fetchedTasks)); // Redux store'a veri ekle
      } catch (error) {
        console.error('Görevler alınırken hata:', error);
      }
    };

    loadTasks();  // Sayfa yüklendiğinde görevleri çek
  }, [dispatch]);

  // Görev silme işlemi
  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);  // Firebase'den sil
      dispatch(deleteTask(taskId));  // Redux store'dan sil
    } catch (error) {
      Alert.alert('Hata', 'Görev silinirken bir hata oluştu.');
    }
  };

  // FlatList render öğesi
  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{ margin: 10, padding: 15, backgroundColor: '#f9f9f9', borderRadius: 8 }}
      onPress={() => navigation.navigate('TaskEdit', { taskId: item.id })}
    >
      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{item.title}</Text>
      <Text>{item.description}</Text>

      {/* Görev Silme Butonu */}
      <TouchableOpacity
        onPress={() => handleDeleteTask(item.id)}
        style={{ marginTop: 10, backgroundColor: '#ff5555', padding: 10, borderRadius: 5 }}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>Sil</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Ekleme Butonuna Tıklama
  const handleAddTask = () => {
    navigation.navigate('AddTask'); // AddTask ekranına git
  };

  return (
    <View style={{ flex: 1, padding: 15 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>Görevler:</Text>
      {tasks.length === 0 ? (
        <Text>Henüz görev yok.</Text>
      ) : (
        <FlatList
          data={tasks}  // Redux'tan gelen görevler
          keyExtractor={(item) => item.id}  // Her öğe için benzersiz bir ID kullan
          renderItem={renderItem}  // Liste elemanlarını render et
        />
      )}

      {/* Ekleme Butonu */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddTask}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#3498db',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  }
});

export default HomeScreen;
