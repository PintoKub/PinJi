import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface Word {
  japanese: string;
  english: string;
  group: string;
}

export default function EditScreen() {
  const [groups, setGroups] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [words, setWords] = useState<Word[]>([]);
  const [newGroupName, setNewGroupName] = useState(''); // Add this

  useEffect(() => {
    loadGroups();
    loadWords();
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

  const loadWords = async () => {
    try {
      const existingWords = await AsyncStorage.getItem('flashcards');
      if (existingWords) {
        setWords(JSON.parse(existingWords));
      }
    } catch (error) {
      console.error('Failed to load words');
    }
  };

  const deleteWord = async (index: number) => {
    Alert.alert(
      'Delete Word',
      'Are you sure you want to delete this word?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const newWords = words.filter((_, i) => i !== index);
            try {
              await AsyncStorage.setItem('flashcards', JSON.stringify(newWords));
              setWords(newWords);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete word');
            }
          },
        },
      ]
    );
  };

  const deleteGroup = async (group: string) => {
    Alert.alert(
      'Delete Group',
      'Are you sure you want to delete this group and all its words?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const newGroups = groups.filter(g => g !== group);
              const newWords = words.filter(w => w.group !== group);
              
              await AsyncStorage.setItem('groups', JSON.stringify(newGroups));
              await AsyncStorage.setItem('flashcards', JSON.stringify(newWords));
              
              setGroups(newGroups);
              setWords(newWords);
              setSelectedGroup('');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete group');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#1a1a1a']}
        style={styles.gradient}
      >
        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Create New Group</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="New Group Name"
                placeholderTextColor="#666"
                value={newGroupName}
                onChangeText={setNewGroupName}
              />
              <TouchableOpacity style={styles.addButton} onPress={createGroup}>
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Group</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.groupList}>
              {groups.map((group, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.groupButton,
                    selectedGroup === group && styles.selectedGroup
                  ]}
                  onPress={() => setSelectedGroup(group)}
                >
                  <Text style={[
                    styles.groupButtonText,
                    selectedGroup === group && styles.selectedGroupText
                  ]}>{group}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {selectedGroup && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Words in {selectedGroup}</Text>
              {groupWords.map((word, index) => (
                <View key={index} style={styles.wordCard}>
                  <View style={styles.wordInfo}>
                    <Text style={styles.japaneseText}>{word.japanese}</Text>
                    <Text style={styles.englishText}>{word.english}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteWord(word)}
                  >
                    <Ionicons name="trash-outline" size={24} color="#9F7AEA" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  gradient: {
    flex: 1,
    width: '100%',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    padding: 15,
    color: '#ffffff',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#9F7AEA',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  groupList: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  groupButton: {
    backgroundColor: 'rgba(159, 122, 234, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedGroup: {
    backgroundColor: '#9F7AEA',
  },
  groupButtonText: {
    color: '#9F7AEA',
    fontSize: 16,
    fontWeight: '500',
  },
  selectedGroupText: {
    color: '#ffffff',
  },
  wordCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  wordInfo: {
    flex: 1,
  },
  japaneseText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 5,
  },
  englishText: {
    fontSize: 16,
    color: '#888888',
  },
  deleteButton: {
    padding: 10,
  },
});

  const createGroup = async () => {
    if (!newGroupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    try {
      const newGroups = [...groups, newGroupName.trim()];
      await AsyncStorage.setItem('groups', JSON.stringify(newGroups));
      setGroups(newGroups);
      setNewGroupName('');
    } catch (error) {
      Alert.alert('Error', 'Failed to create group');
    }
  };

  // Add this computed property
  const groupWords = words.filter(word => word.group === selectedGroup);

  return (
    // Your JSX content should be here
    <View style={styles.container}>
      {/* Your existing UI components */}
    </View>
  );
}