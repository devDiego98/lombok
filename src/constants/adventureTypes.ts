// Adventure type constants for contact forms and package management
import type { AdventureType } from '../types'

export const ADVENTURE_TYPES: AdventureType[] = [
  { 
    id: 1, 
    value: "surf", 
    name: "Surf",
    emoji: "🏄‍♂️",
    description: "Aventuras de surf en las mejores playas"
  },
  { 
    id: 2, 
    value: "snowboard", 
    name: "Ski/Snowboard",
    emoji: "🏂",
    description: "Aventuras de ski y snowboard en las montañas"
  },
];

// Helper function to get adventure type by value
export const getAdventureTypeByValue = (value: string): AdventureType | undefined => {
  return ADVENTURE_TYPES.find(type => type.value === value);
};

// Helper function to get adventure type name by value
export const getAdventureTypeName = (value: string): string => {
  const type = getAdventureTypeByValue(value);
  return type ? type.name : value;
};

// Helper function to get adventure type emoji by value
export const getAdventureTypeEmoji = (value: string): string => {
  const type = getAdventureTypeByValue(value);
  return type ? type.emoji : "🌊";
};
