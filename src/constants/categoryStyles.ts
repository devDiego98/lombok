// Category styling configuration
// This file contains only visual styling properties for package detail categories
// The actual category data (title, fields, enabled status) comes from Firebase

import type { Category } from '../types'

// Category style interface
interface CategoryStyle {
  iconName: string
  gradient: string
  textColor: string
}

// Category styles mapping
export const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  accommodation: {
    iconName: 'Home',
    gradient: 'from-blue-500 to-cyan-500',
    textColor: 'text-slate-200'
  },
  food: {
    iconName: 'Utensils',
    gradient: 'from-emerald-500 to-teal-500',
    textColor: 'text-slate-200'
  },
  equipment: {
    iconName: 'Shield',
    gradient: 'from-purple-500 to-pink-500',
    textColor: 'text-slate-200'
  },
  instruction: {
    iconName: 'BookOpen',
    gradient: 'from-orange-500 to-red-500',
    textColor: 'text-slate-200'
  },
  activities: {
    iconName: 'Activity',
    gradient: 'from-indigo-500 to-purple-500',
    textColor: 'text-slate-200'
  },
  safety: {
    iconName: 'AlertTriangle',
    gradient: 'from-red-500 to-pink-500',
    textColor: 'text-slate-200'
  }
};

// Default styling for new categories that don't have specific styles defined
export const DEFAULT_CATEGORY_STYLE: CategoryStyle = {
  iconName: 'Home',
  gradient: 'from-gray-500 to-gray-600',
  textColor: 'text-slate-200'
};

// Function to merge Firebase category data with styling
export const mergeCategoryWithStyles = (category: Category): Category => {
  const styles = CATEGORY_STYLES[category.id] || DEFAULT_CATEGORY_STYLE;
  
  return {
    ...category,
    // Override with styling properties, but keep any existing styling from Firebase
    iconName: category.iconName || styles.iconName,
    gradient: category.gradient || styles.gradient,
    textColor: category.textColor || styles.textColor
  };
};

// Function to merge an array of categories with their styles
export const mergeCategoriesWithStyles = (categories: Category[] | null | undefined): Category[] => {
  if (!categories || !Array.isArray(categories)) {
    return [];
  }
  
  return categories.map(mergeCategoryWithStyles);
};
