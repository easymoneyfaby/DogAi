import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, DogProfile } from '../types';
import { getDogProfiles } from '../storage';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileSelection'>;

const ProfileSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const [profiles, setProfiles] = useState<DogProfile[]>([]);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    const loadedProfiles = await getDogProfiles();
    setProfiles(loadedProfiles);
  };

  const selectProfile = (profile: DogProfile) => {
    navigation.navigate('Chat', { dogProfile: profile });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Dog Profile</Text>
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.profileItem} onPress={() => selectProfile(item)}>
            <Text style={styles.profileName}>{item.name}</Text>
            <Text style={styles.profileBreed}>{item.breed}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('Registration')}>
        <Text style={styles.createButtonText}>Create New Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileBreed: {
    fontSize: 14,
    color: '#666',
  },
  createButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileSelectionScreen;