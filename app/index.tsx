import { StyleSheet, View, Text, Animated, TouchableOpacity } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native';

interface Word {
  japanese: string;
  english: string;
  group: string;
}

export default function LandingScreen() {
  const [randomWord, setRandomWord] = useState<Word>({ japanese: '', english: '', group: '' });
  const [wordsCount, setWordsCount] = useState(0);
  const [groupsCount, setGroupsCount] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadRandomWord();
    loadCounts();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadRandomWord = async () => {
    try {
      const words = await AsyncStorage.getItem('flashcards');
      if (words) {
        const parsedWords: Word[] = JSON.parse(words);
        if (parsedWords.length > 0) {
          const randomIndex = Math.floor(Math.random() * parsedWords.length);
          setRandomWord(parsedWords[randomIndex]);
        }
      }
    } catch (error) {
      console.error('Failed to load random word');
    }
  };

  const loadCounts = async () => {
    try {
      const words = await AsyncStorage.getItem('flashcards');
      const groups = await AsyncStorage.getItem('groups');
      if (words) setWordsCount(JSON.parse(words).length);
      if (groups) setGroupsCount(JSON.parse(groups).length);
    } catch (error) {
      console.error('Failed to load counts');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#1a1a1a']}
        style={[styles.gradient, { flex: 1, width: '100%' }]}
      >
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <View style={styles.logoContainer}>
              <Text style={styles.title}>PinJi</Text>
              <Text style={styles.subtitle}>Master Japanese, One Card at a Time</Text>
            </View>

            <TouchableOpacity 
              style={styles.cardContainer}
              onPress={loadRandomWord}
            >
              <Text style={styles.labelText}>TODAY'S WORD</Text>
              <View style={styles.card}>
                <Text style={styles.japaneseText}>
                  {randomWord.japanese || '始めましょう'}
                </Text>
                <Text style={styles.englishText}>
                  {randomWord.english || "Let's begin"}
                </Text>
                {randomWord.group && (
                  <View style={styles.groupBadge}>
                    <Text style={styles.groupText}>{randomWord.group}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{wordsCount}</Text>
                <Text style={styles.statLabel}>Words Learned</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{groupsCount}</Text>
                <Text style={styles.statLabel}>Groups</Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#888888',
    textAlign: 'center',
  },
  cardContainer: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  labelText: {
    fontSize: 13,
    color: '#888888',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: '600',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 25,
    padding: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  japaneseText: {
    fontSize: 36,
    color: '#ffffff',
    marginBottom: 15,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  englishText: {
    fontSize: 20,
    color: '#888888',
    marginBottom: 20,
    fontWeight: '500',
  },
  groupBadge: {
    backgroundColor: '#0071e3',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 15,
  },
  groupText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40,
    width: '100%',
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: '700',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 15,
    color: '#888888',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  gradient: {
    flex: 1,
    width: '100%',
  },
  content: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});