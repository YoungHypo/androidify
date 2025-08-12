// Material Design 3 Motion System - Matching Android Androidify App

import { Easing } from 'react-native-reanimated';

// Easing curves
export const easings = {
  // Standard easing - most common
  standard: Easing.bezier(0.2, 0.0, 0.0, 1.0),
  
  // Decelerate easing - entering elements
  decelerate: Easing.bezier(0.0, 0.0, 0.2, 1.0),
  
  // Accelerate easing - exiting elements
  accelerate: Easing.bezier(0.4, 0.0, 1.0, 1.0),
  
  // Accelerate-decelerate - through transitions
  accelerateDecelerate: Easing.bezier(0.4, 0.0, 0.2, 1.0),
  
  // Emphasized easing - important transitions
  emphasized: Easing.bezier(0.2, 0.0, 0.0, 1.0),
  
  // Emphasized decelerate - important entering
  emphasizedDecelerate: Easing.bezier(0.05, 0.7, 0.1, 1.0),
  
  // Emphasized accelerate - important exiting
  emphasizedAccelerate: Easing.bezier(0.3, 0.0, 0.8, 0.15),
  
  // Legacy Android easings
  fastOutSlowIn: Easing.bezier(0.4, 0.0, 0.2, 1.0),
  fastOutLinearIn: Easing.bezier(0.4, 0.0, 1.0, 1.0),
  linearOutSlowIn: Easing.bezier(0.0, 0.0, 0.2, 1.0),
};

// Duration tokens
export const durations = {
  // Short durations
  short1: 50,   // Small utility animations
  short2: 100,  // Small component animations
  short3: 150,  // Small component animations
  short4: 200,  // Component state changes
  
  // Medium durations
  medium1: 250, // Component animations
  medium2: 300, // Component animations
  medium3: 350, // Component animations
  medium4: 400, // Component animations
  
  // Long durations
  long1: 450,   // Large component animations
  long2: 500,   // Large component animations
  long3: 550,   // Large component animations
  long4: 600,   // Large component animations
  
  // Extra long durations
  extraLong1: 700, // Screen transitions
  extraLong2: 800, // Screen transitions
  extraLong3: 900, // Screen transitions
  extraLong4: 1000, // Screen transitions
  
  // App-specific durations
  splash: 1000,        // Splash screen animations
  pageTransition: 300, // Page transitions
  buttonPress: 150,    // Button press feedback
  colorSplash: 800,    // ColorSplashTransition
  sharedElement: 400,  // Shared element transitions
  loading: 2000,       // Loading animations (infinite)
};

// Motion tokens combining easing and duration
export const motions = {
  // Standard motions
  standard: {
    duration: durations.medium2,
    easing: easings.standard,
  },
  
  // Emphasized motions
  emphasized: {
    duration: durations.long2,
    easing: easings.emphasized,
  },
  
  // Decelerated motions (entering)
  enter: {
    duration: durations.medium4,
    easing: easings.decelerate,
  },
  
  // Accelerated motions (exiting)
  exit: {
    duration: durations.short4,
    easing: easings.accelerate,
  },
  
  // App-specific motions
  buttonPress: {
    duration: durations.buttonPress,
    easing: easings.standard,
  },
  
  pageTransition: {
    duration: durations.pageTransition,
    easing: easings.emphasized,
  },
  
  colorSplash: {
    duration: durations.colorSplash,
    easing: easings.emphasizedDecelerate,
  },
  
  sharedElement: {
    duration: durations.sharedElement,
    easing: easings.emphasized,
  },
  
  fadeIn: {
    duration: durations.medium1,
    easing: easings.decelerate,
  },
  
  fadeOut: {
    duration: durations.short2,
    easing: easings.accelerate,
  },
  
  slideIn: {
    duration: durations.medium3,
    easing: easings.emphasizedDecelerate,
  },
  
  slideOut: {
    duration: durations.short3,
    easing: easings.emphasizedAccelerate,
  },
  
  scaleIn: {
    duration: durations.medium2,
    easing: easings.emphasizedDecelerate,
  },
  
  scaleOut: {
    duration: durations.short2,
    easing: easings.emphasizedAccelerate,
  },
  
  // Loading and infinite animations
  rotate: {
    duration: durations.loading,
    easing: Easing.linear,
  },
  
  pulse: {
    duration: durations.long4,
    easing: easings.standard,
  },
};

export type MotionKey = keyof typeof motions;
