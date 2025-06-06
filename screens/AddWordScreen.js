import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddWordScreen({ navigation }) {
  const [japanese, setJapanese] = useState('');
  const [english, setEnglish] = useState('');

  const saveWord = async () => {
    if (!japanese || !english) {
      Alert.alert('Error', 'Please fill in both fields');
      return;
    }

    try {
      const existingWords = await AsyncStorage.getItem('flashcards');
      const words = existingWords ? JSON.parse(existingWords) : [];
      
      words.push({
        japanese,
        english,
        timestamp: new Date().getTime(),
      });

      await AsyncStorage.setItem('flashcards', JSON.stringify(words));
      Alert.alert('Success', 'Word saved successfully!');
      setJapanese('');
      setEnglish('');
    } catch (error) {
      Alert.alert('Error', 'Failed to save word');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Japanese Word"
        value={japanese}
        onChangeText={setJapanese}
      />
      <TextInput
        style={styles.input}
        placeholder="English Translation"
        value={english}
        onChangeText={setEnglish}
      />
      <TouchableOpacity style={styles.button} onPress={saveWord}>
        <Text style={styles.buttonText}>Save Word</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});