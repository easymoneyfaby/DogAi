import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Switch, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DogProfile } from '../types';

type RootStackParamList = {
  Home: undefined;
  Registration: undefined;
  Chat: { dogProfile: DogProfile };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Registration'>;

// You'll need to install these additional packages:
// npm install @react-native-picker/picker @react-native-community/datetimepicker

type RootStackParamList = {
  Home: undefined;
  Registration: undefined;
  Chat: { dogProfile: DogProfile };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Registration'>;

interface DogProfile {
  name: string;
  breed: string;
  age: string;
  gender: 'male' | 'female';
  weight: string;
  birthday: Date;
  personality: string[];
  favoriteActivity: string;
  favoriteTreat: string;
  hasAllergies: boolean;
  allergies: string;
  photos: string[];
}

const personalityTraits = ['Energetic', 'Calm', 'Friendly', 'Shy', 'Playful', 'Independent', 'Affectionate', 'Protective'];
const activities = ['Walking', 'Playing fetch', 'Swimming', 'Dog park', 'Agility training', 'Cuddling'];

const RegistrationScreen: React.FC<Props> = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [dogProfile, setDogProfile] = useState<DogProfile>({
    name: '',
    breed: '',
    age: '',
    gender: 'male',
    weight: '',
    birthday: new Date(),
    personality: [],
    favoriteActivity: '',
    favoriteTreat: '',
    hasAllergies: false,
    allergies: '',
    photos: [],
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setDogProfile(prev => ({
        ...prev,
        photos: [...prev.photos, result.assets[0].uri],
      }));
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigation.navigate('Chat', { dogProfile });
    }
  };

  const togglePersonality = (trait: string) => {
    setDogProfile(prev => ({
      ...prev,
      personality: prev.personality.includes(trait)
        ? prev.personality.filter(t => t !== trait)
        : [...prev.personality, trait],
    }));
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <View>
            <Text style={styles.stepTitle}>Step 1: Basic Information</Text>
            <TextInput
              style={styles.input}
              placeholder="Dog's Name"
              value={dogProfile.name}
              onChangeText={(text) => setDogProfile({...dogProfile, name: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Dog's Breed"
              value={dogProfile.breed}
              onChangeText={(text) => setDogProfile({...dogProfile, breed: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Dog's Age"
              value={dogProfile.age}
              onChangeText={(text) => setDogProfile({...dogProfile, age: text})}
              keyboardType="numeric"
            />
            <Picker
              selectedValue={dogProfile.gender}
              onValueChange={(itemValue) => setDogProfile({...dogProfile, gender: itemValue})}
            >
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
            </Picker>
          </View>
        );
      case 2:
        return (
          <View>
            <Text style={styles.stepTitle}>Step 2: Photo Upload</Text>
            <Text>Upload at least 3 photos of your dog</Text>
            <Button title="Pick an image from camera roll" onPress={pickImage} />
            <ScrollView horizontal style={styles.photoContainer}>
              {dogProfile.photos.map((photo, index) => (
                <Image key={index} source={{ uri: photo }} style={styles.photo} />
              ))}
            </ScrollView>
          </View>
        );
      case 3:
        return (
          <View>
            <Text style={styles.stepTitle}>Step 3: Additional Information</Text>
            <TextInput
              style={styles.input}
              placeholder="Weight (in kg)"
              value={dogProfile.weight}
              onChangeText={(text) => setDogProfile({...dogProfile, weight: text})}
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={styles.input}>
                {dogProfile.birthday.toDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dogProfile.birthday}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setDogProfile({...dogProfile, birthday: selectedDate});
                  }
                }}
              />
            )}
            <Text style={styles.subTitle}>Personality Traits:</Text>
            <View style={styles.traitsContainer}>
              {personalityTraits.map(trait => (
                <TouchableOpacity
                  key={trait}
                  style={[
                    styles.traitButton,
                    dogProfile.personality.includes(trait) && styles.selectedTrait
                  ]}
                  onPress={() => togglePersonality(trait)}
                >
                  <Text>{trait}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.subTitle}>Favorite Activity:</Text>
            <Picker
              selectedValue={dogProfile.favoriteActivity}
              onValueChange={(itemValue) => setDogProfile({...dogProfile, favoriteActivity: itemValue})}
            >
              {activities.map(activity => (
                <Picker.Item key={activity} label={activity} value={activity} />
              ))}
            </Picker>
            <TextInput
              style={styles.input}
              placeholder="Favorite Treat"
              value={dogProfile.favoriteTreat}
              onChangeText={(text) => setDogProfile({...dogProfile, favoriteTreat: text})}
            />
            <View style={styles.switchContainer}>
              <Text>Has Allergies?</Text>
              <Switch
                value={dogProfile.hasAllergies}
                onValueChange={(value) => setDogProfile({...dogProfile, hasAllergies: value})}
              />
            </View>
            {dogProfile.hasAllergies && (
              <TextInput
                style={styles.input}
                placeholder="Allergies"
                value={dogProfile.allergies}
                onChangeText={(text) => setDogProfile({...dogProfile, allergies: text})}
              />
            )}
          </View>
        );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {renderStep()}
      <Button 
        title={step === 3 ? "Finish" : "Next"} 
        onPress={handleNext}
        disabled={step === 2 && dogProfile.photos.length < 3}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  photoContainer: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  photo: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  traitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  traitButton: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'gray',
  },
  selectedTrait: {
    backgroundColor: 'lightblue',
  },
});

export default RegistrationScreen;