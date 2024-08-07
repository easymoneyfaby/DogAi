import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  ProfileCreation: undefined;
  Chat: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileCreation'>;

const ProfileCreationScreen: React.FC<Props> = ({ navigation }) => {
  const [dogName, setDogName] = useState('');
  const [dogBreed, setDogBreed] = useState('');

  const handleCreateProfile = () => {
    // Here you would typically save the profile data
    console.log('Dog Profile:', { name: dogName, breed: dogBreed });
    // Navigate to the Chat screen
    navigation.navigate('Chat');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Dog's Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Dog's Name"
        value={dogName}
        onChangeText={setDogName}
      />
      <TextInput
        style={styles.input}
        placeholder="Dog's Breed"
        value={dogBreed}
        onChangeText={setDogBreed}
      />
      <Button title="Create Profile" onPress={handleCreateProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default ProfileCreationScreen;