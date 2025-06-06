import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface Word {
  japanese: string;
  english: string;
  group: string;
}

interface PracticeResult {
  total: number;
  correct: number;
  incorrectWords: Word[];
}

export default function PracticeScreen() {
  const [groups, setGroups] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [wordCount, setWordCount] = useState<string>('10');
  const [practiceWords, setPracticeWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showingAnswer, setShowingAnswer] = useState(false);
  const [result, setResult] = useState<PracticeResult | null>(null);
  const [incorrectWords, setIncorrectWords] = useState<Word[]>([]);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const savedGroups = await AsyncStorage.getItem('groups');
      if (savedGroups) {
        setGroups(JSON.parse(savedGroups));
      }
    } catch (error) {
      console.error('Failed to load groups');
    }
  };

  const startPractice = async () => {
    try {
      const savedWords = await AsyncStorage.getItem('flashcards');
      if (savedWords) {
        const allWords: Word[] = JSON.parse(savedWords);
        const groupWords = allWords.filter(word => word.group === selectedGroup);
        const shuffled = [...groupWords].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, parseInt(wordCount));
        setPracticeWords(selected);
        setCurrentIndex(0);
        setResult(null);
        setIncorrectWords([]);
      }
    } catch (error) {
      console.error('Failed to load words');
    }
  };

  const checkAnswer = (selectedWord: Word) => {
    if (Platform.OS === 'android') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const isCorrect = selectedWord.japanese === practiceWords[currentIndex].japanese;
    
    if (!isCorrect) {
      setIncorrectWords([...incorrectWords, practiceWords[currentIndex]]);
    }

    setShowingAnswer(true);
    
    setTimeout(() => {
      if (currentIndex < practiceWords.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowingAnswer(false);
      } else {
        setResult({
          total: practiceWords.length,
          correct: practiceWords.length - incorrectWords.length - (isCorrect ? 0 : 1),
          incorrectWords: incorrectWords
        });
      }
    }, 2000);
  };

  if (!selectedGroup) {
    return (
      <ScrollView style={styles.container}>
        <LinearGradient colors={['#000000', '#1a1a1a']} style={styles.gradient}>
          <Text style={styles.title}>Select a Group</Text>
          <View style={styles.groupList}>
            {groups.map((group, index) => (
              <TouchableOpacity
                key={index}
                style={styles.groupButton}
                onPress={() => setSelectedGroup(group)}
              >
                <Text style={styles.groupButtonText}>{group}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>
      </ScrollView>
    );
  }

  if (!practiceWords.length) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#000000', '#1a1a1a']} style={styles.gradient}>
          <Text style={styles.title}>How many words?</Text>
          <TextInput
            style={styles.input}
            value={wordCount}
            onChangeText={setWordCount}
            keyboardType="numeric"
            placeholder="Enter number of words"
            placeholderTextColor="#666"
          />
          <TouchableOpacity style={styles.startButton} onPress={startPractice}>
            <Text style={styles.startButtonText}>Start Practice</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  if (result) {
    return (
      <ScrollView style={styles.container}>
        <LinearGradient colors={['#000000', '#1a1a1a']} style={styles.gradient}>
          <Text style={styles.title}>Practice Complete!</Text>
          <View style={styles.resultCard}>
            <Text style={styles.resultText}>
              Score: {result.correct}/{result.total}
            </Text>
            {result.incorrectWords.length > 0 && (
              <View style={styles.incorrectList}>
                <Text style={styles.incorrectTitle}>Review these words:</Text>
                {result.incorrectWords.map((word, index) => (
                  <View key={index} style={styles.incorrectItem}>
                    <Text style={styles.incorrectJapanese}>{word.japanese}</Text>
                    <Text style={styles.incorrectEnglish}>{word.english}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => {
              setSelectedGroup('');
              setPracticeWords([]);
              setResult(null);
            }}
          >
            <Text style={styles.startButtonText}>Practice Another Group</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#000000', '#1a1a1a']} style={styles.gradient}>
        <Text style={styles.progress}>
          {currentIndex + 1} of {practiceWords.length}
        </Text>
        <View style={styles.wordContainer}>
          <Text style={styles.englishWord}>{practiceWords[currentIndex].english}</Text>
          {showingAnswer && (
            <Text style={styles.correctAnswer}>
              {practiceWords[currentIndex].japanese}
            </Text>
          )}
        </View>
        <View style={styles.optionsContainer}>
          {[...practiceWords]
            .sort(() => Math.random() - 0.5)
            .slice(0, 4)
            .map((word, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  showingAnswer && word.japanese === practiceWords[currentIndex].japanese && 
                  styles.correctOption
                ]}
                onPress={() => !showingAnswer && checkAnswer(word)}
                disabled={showingAnswer}
              >
                <Text style={styles.optionText}>{word.japanese}</Text>
              </TouchableOpacity>
            ))}
        </View>
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
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: '700',
    marginBottom: 30,
    textAlign: 'center',
  },
  groupList: {
    gap: 10,
  },
  groupButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  groupButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    borderRadius: 10,
    color: '#ffffff',
    fontSize: 18,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#9F7AEA',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  groupButton: {
    backgroundColor: 'rgba(159, 122, 234, 0.1)', // Transparent purple
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  optionButton: {
    backgroundColor: 'rgba(159, 122, 234, 0.1)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  correctOption: {
    backgroundColor: '#9F7AEA',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  progress: {
    color: '#888888',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  wordContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  englishWord: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: '700',
    marginBottom: 20,
  },
  correctAnswer: {
    fontSize: 24,
    color: '#0071e3',
    fontWeight: '600',
  },
  optionsContainer: {
    gap: 10,
  },
  optionButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  correctOption: {
    backgroundColor: '#0071e3',
  },
  optionText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
  },
  resultText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  incorrectList: {
    gap: 10,
  },
  incorrectTitle: {
    color: '#888888',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  incorrectItem: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 10,
  },
  incorrectJapanese: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  incorrectEnglish: {
    color: '#888888',
    fontSize: 16,
  },
});