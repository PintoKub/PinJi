import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ReviewScreen() {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const existingWords = await AsyncStorage.getItem('flashcards');
      if (existingWords) {
        setCards(JSON.parse(existingWords));
      }
    } catch (error) {
      console.error('Failed to load words');
    }
  };

  const nextCard = () => {
    setShowTranslation(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  if (cards.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No flashcards available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => setShowTranslation(!showTranslation)}
      >
        <Text style={styles.cardText}>
          {showTranslation 
            ? cards[currentIndex].english 
            : cards[currentIndex].japanese}
        </Text>
        <Text style={styles.tapText}>Tap to flip</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={nextCard}>
        <Text style={styles.buttonText}>Next Card</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '90%',
    height: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardText: {
    fontSize: 24,
    textAlign: 'center',
  },
  tapText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: '80%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
});