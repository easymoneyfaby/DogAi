export interface DogProfile {
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