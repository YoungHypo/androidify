// Material Design 3 Shape System - Matching Android Androidify App

export const shapes = {
  // Corner radius values
  none: 0,
  extraSmall: 4,
  small: 8,
  medium: 12,
  large: 16,
  extraLarge: 28,
  full: 9999, // Fully rounded
  
  // Component-specific shapes
  button: {
    borderRadius: 20, // Pill-shaped buttons like Android
  },
  
  card: {
    borderRadius: 16, // Large rounded corners for cards
  },
  
  videoCard: {
    borderRadius: 16, // Matching VideoPlayerRotatedCard
  },
  
  input: {
    borderRadius: 12, // Medium rounded for inputs
  },
  
  chip: {
    borderRadius: 8, // Small rounded for chips/tags
  },
  
  fab: {
    borderRadius: 16, // Floating action button
  },
  
  bottomSheet: {
    borderRadius: 28, // Extra large for modal bottom sheets
  },
  
  dialog: {
    borderRadius: 28, // Extra large for dialogs
  },
  
  snackbar: {
    borderRadius: 4, // Extra small for snackbars
  },
  
  // App-specific shapes
  botColorPicker: {
    borderRadius: 9999, // Fully rounded for color circles
  },
  
  resultCard: {
    borderRadius: 16, // Large rounded for result cards
  },
  
  toolbar: {
    borderRadius: 20, // Pill-shaped for floating toolbars
  },
};

export type ShapeKey = keyof typeof shapes;
