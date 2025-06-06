import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddWordScreen() {
  const [japanese, setJapanese] = useState('');
  const [english, setEnglish] = useState('');
  const [newGroup, setNewGroup] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [groups, setGroups] = useState<string[]>([]);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const existingGroups = await AsyncStorage.getItem('groups');
      if (existingGroups) {
        setGroups(JSON.parse(existingGroups));
      }
    } catch (error) {
      console.error('Failed to load groups');
    }
  };

  const addGroup = async () => {
    if (!newGroup.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    try {
      const updatedGroups = [...groups, newGroup.trim()];
      await AsyncStorage.setItem('groups', JSON.stringify(updatedGroups));
      setGroups(updatedGroups);
      setNewGroup('');
      setSelectedGroup(newGroup.trim());
    } catch (error) {
      Alert.alert('Error', 'Failed to add group');
    }
  };

  const saveWord = async () => {
    if (!japanese || !english || !selectedGroup) {
      Alert.alert('Error', 'Please fill in all fields and select a group');
      return;
    }

    try {
      const existingWords = await AsyncStorage.getItem('flashcards');
      const words = existingWords ? JSON.parse(existingWords) : [];
      
      words.push({
        japanese,
        english,
        group: selectedGroup,
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
    <ScrollView style={styles.container}>
      <View style={styles.groupSection}>
        <Text style={styles.sectionTitle}>Create New Group</Text>
        <View style={styles.groupInput}>
          <TextInput
            style={styles.input}
            placeholder="New Group Name"
            placeholderTextColor="#666666"
            value={newGroup}
            onChangeText={setNewGroup}
          />
          <TouchableOpacity style={styles.addButton} onPress={addGroup}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.groupSection}>
        <Text style={styles.sectionTitle}>Select Group</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.groupList}>
          {groups.map((group, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.groupButton,
                selectedGroup === group && styles.selectedGroup,
              ]}
              onPress={() => setSelectedGroup(group)}
            >
              <Text style={[
                styles.groupButtonText,
                selectedGroup === group && styles.selectedGroupText,
              ]}>
                {group}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.wordSection}>
        <Text style={styles.sectionTitle}>Add New Word</Text>
        <TextInput
          style={styles.input}
          placeholder="Japanese Word"
          placeholderTextColor="#666666"
          value={japanese}
          onChangeText={setJapanese}
        />
        <TextInput
          style={styles.input}
          placeholder="English Translation"
          placeholderTextColor="#666666"
          value={english}
          onChangeText={setEnglish}
        />
        <TouchableOpacity 
          style={[styles.saveButton, !selectedGroup && styles.disabledButton]} 
          onPress={saveWord}
          disabled={!selectedGroup}
        >
          <Text style={styles.buttonText}>Save Word</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  groupSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 15,
    fontWeight: '600',
  },
  groupInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#1c1c1e',
    borderRadius: 10,
    padding: 15,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#0071e3',
    padding: 15,
    borderRadius: 10,
    marginLeft: 10,
    width: 80,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  groupList: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  groupButton: {
    backgroundColor: '#1c1c1e',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
    minWidth: 80,
  },
  selectedGroup: {
    backgroundColor: '#0071e3',
  },
  groupButtonText: {
    color: '#ffffff',
    textAlign: 'center',
  },
  selectedGroupText: {
    fontWeight: '600',
  },
  wordSection: {
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#9F7AEA',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#333333',
  },
});