import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { RootStackParamList } from '../App';
import { DogProfile } from '../types';
import { generateAIResponse } from '../api';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'dog';
  image?: string;
};

const ChatScreen: React.FC<Props> = ({ route }) => {
  const { dogProfile } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    generateDogResponse(`Woof! Hi, I'm ${dogProfile.name}. Let's chat!`);
  }, []);

  const sendMessage = async () => {
    if (inputText.trim() === '' || isLoading) return;

    setIsLoading(true);
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');

    await generateDogResponse(inputText);
    setIsLoading(false);
  };

  const generateDogResponse = async (userInput: string) => {
    const prompt = `You are a dog named ${dogProfile.name}. You are a ${dogProfile.breed} and ${dogProfile.age} years old. Your personality traits are ${dogProfile.personality.join(', ')}. Your favorite activity is ${dogProfile.favoriteActivity} and your favorite treat is ${dogProfile.favoriteTreat}. Respond to the following message from your owner in a playful, dog-like manner: "${userInput}"`;

    const aiResponse = await generateAIResponse(prompt);

    const dogMessage: Message = {
      id: Date.now().toString(),
      text: aiResponse,
      sender: 'dog',
    };

    setMessages(prevMessages => [...prevMessages, dogMessage]);
  };

  const pickImage = async () => {
    if (isLoading) return;

    setIsLoading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0 && result.assets[0].base64) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: "Here's a photo of you!",
        sender: 'user',
        image: result.assets[0].uri,
      };

      setMessages(prevMessages => [...prevMessages, userMessage]);
      await analyzePhoto(result.assets[0].base64);
    }
    setIsLoading(false);
  };

  const analyzePhoto = async (base64Image: string | undefined) => {
    if (!base64Image) return;

    const prompt = `You are an AI trained to analyze dog emotions and behavior in images. Analyze this image of a dog and describe what you see, focusing on the dog's emotions, body language, and any notable elements in the surroundings. Then, roleplay as ${dogProfile.name}, a ${dogProfile.breed} dog with the following personality traits: ${dogProfile.personality.join(', ')}. Respond as if you are the dog in the photo, expressing how you feel and what you're thinking based on the analysis. Keep the response playful and dog-like.

    [IMAGE]
    ${base64Image}`;

    const aiResponse = await generateAIResponse(prompt);

    const dogMessage: Message = {
      id: Date.now().toString(),
      text: aiResponse,
      sender: 'dog',
    };

    setMessages(prevMessages => [...prevMessages, dogMessage]);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.sender === 'user' ? styles.userMessage : styles.dogMessage]}>
            {item.image && <Image source={{ uri: item.image }} style={styles.messageImage} />}
            <Text>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          editable={!isLoading}
        />
        <TouchableOpacity style={[styles.button, isLoading && styles.disabledButton]} onPress={sendMessage} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Send</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, isLoading && styles.disabledButton]} onPress={pickImage} disabled={isLoading}>
          <Text style={styles.buttonText}>Photo</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  messageBubble: {
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
    marginHorizontal: 10,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  dogMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0E0E0',
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default ChatScreen;