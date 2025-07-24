// components/TaskCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TaskCard = ({ task, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(task.id)}>
      <Text style={styles.taskName}>{task.name}</Text>
      <Text style={styles.taskDate}>{new Date(task.createdAt).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  taskName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskDate: {
    fontSize: 14,
    color: '#888',
  },
});

export default TaskCard;
