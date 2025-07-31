import React, { useEffect,useState } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setTasks, deleteTask as deleteTaskFromStore } from '../store/tasksSlice'; // Redux actions
import { fetchTasks, deleteTask } from '../services/firebaseConfig';  // Firebase functions
import { auth } from '../services/firebaseConfig';  // Firebase auth import
import { useFocusEffect } from '@react-navigation/native';  // Import useFocusEffect
import RoundedButton from '../components/Button';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks); // Redux store'dan görevler
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  // Firebase'den görevleri çekme ve Redux'a ekleme
const loadTasks = async () => {
  try {
    const fetchedTasks = await fetchTasks(auth.currentUser.uid);
    // Sort tasks by date (ascending)
    const sortedTasks = fetchedTasks.sort((a, b) =>
      moment(a.date).valueOf() - moment(b.date).valueOf()
    );
    dispatch(setTasks(sortedTasks));
  } catch (error) {
    console.error('Görevler alınırken hata:', error);
  }
};

  useEffect(() => {
    loadTasks();
  }, [dispatch]);

  // This will make sure the tasks are reloaded when the user navigates back from TaskEdit
  useFocusEffect(
    React.useCallback(() => {
      loadTasks(); // Reload tasks when the screen is focused
    }, [])
  );

  // Görev silme işlemi
  const handleDeleteTask = async (taskId) => {
    try {
      // Firebase'den sil
      await deleteTask(auth.currentUser.uid, taskId);
      // Redux store'dan sil
      dispatch(deleteTaskFromStore(taskId));  
    } catch (error) {
      console.error("Görev silinirken hata:", error);
      Alert.alert('Hata', 'Görev silinirken bir hata oluştu.');
    }
  };
const filteredTasks = tasks
  .filter((task) => moment(task.date).format('YYYY-MM-DD') === selectedDate)
  .sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());


  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

const getMarkedDates = () => {
  const marked = {};
  tasks.forEach((task) => {
    const date = moment(task.date).format('YYYY-MM-DD');
    marked[date] = {
      marked: true,
      dotColor: 'blue'
    };
  });
  marked[selectedDate] = {
    ...(marked[selectedDate] || {}),
    selected: true,
    selectedColor: '#70d7c7'
  };
  return marked;
};


  // FlatList render öğesi
  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{ margin: 10, padding: 15, backgroundColor: '#f9f9f9', borderRadius: 8 }}
      onPress={() => navigation.navigate('TaskEdit', { taskId: item.id })}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{item.title}</Text>
        <Text>{moment(item.date).format('YYYY-MM-DD')} {moment(item.time).format('hh:mm:ss')}</Text>
      </View>
      
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
    <View style={{ flex: 1, padding: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>Görevler:</Text>
      {tasks.length === 0 ? (
        <Text>Henüz görev yok.</Text>
      ) : (
        <View>
      <Calendar
        onDayPress={onDayPress}
        markedDates={getMarkedDates()}
        markingType="period"
        minDate={new Date().toISOString().split("T")[0]}
      />
  <FlatList
  data={filteredTasks}
  keyExtractor={(item) => item.id}
  renderItem={renderItem}
/>
</View>
      )}
      <RoundedButton onPress={handleAddTask} style={{ position: 'absolute', top: 10, right: 10 }} title="+" />
    </View>
  );
};

export default HomeScreen;
