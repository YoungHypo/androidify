import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as MediaLibrary from 'expo-media-library';
import { Image } from 'expo-image';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { botColors } from '../src/theme/colors';
import { AndroidifyTopAppBar } from '../src/components/AndroidifyTopAppBar';
import { SquiggleBackground } from '../src/components/SquiggleBackground';
import { Button } from '../src/components/Button';
import { colors } from '../src/theme/colors';
import { typography } from '../src/theme/typography';
import { spacing } from '../src/theme/spacing';
import { shapes } from '../src/theme/shapes';
import { motions } from '../src/theme/motions';

export default function ResultsRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ prompt?: string; imageUri?: string; botColorId?: string }>();
  const selectedBotColor = botColors.find(b => b.id === params.botColorId) || botColors[0];
  const currentResult = params.imageUri && params.prompt ? {
    id: 'route',
    prompt: params.prompt,
    imageUri: params.imageUri,
    botColor: selectedBotColor,
    timestamp: Date.now(),
  } : null as any;

  // Animations
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(100);
  const scaleAnim = useSharedValue(0.8);

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: motions.fadeIn.duration });
    slideAnim.value = withTiming(0, { duration: motions.slideIn.duration });
    scaleAnim.value = withSpring(1, { damping: 15, stiffness: 300 });
  }, []);

  const handleBackPress = () => router.back();
  const handleAboutPress = () => router.push('/about');

  const handleSaveImage = async () => {
    try {
      if (!currentResult?.imageUri) {
        Alert.alert('Error', 'No image to save');
        return;
      }
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera permission is required to save images');
        return;
      }
      await MediaLibrary.saveToLibraryAsync(currentResult.imageUri);
      Alert.alert('Success', 'Image Saved!');
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Error', 'Failed to save image');
    }
  };

  const containerStyle = useAnimatedStyle(() => ({ opacity: fadeAnim.value }));
  const cardStyle = useAnimatedStyle(() => ({ transform: [{ scale: scaleAnim.value }] }));
  const slideUpStyle = useAnimatedStyle(() => ({ transform: [{ translateY: slideAnim.value }] }));

  if (!currentResult) {
    return (
      <View style={{ flex: 1 }}>
        <AndroidifyTopAppBar backEnabled onBackPressed={handleBackPress} onAboutClicked={handleAboutPress} />
        <LinearGradient
          colors={[ colors.background, colors.primaryContainer + '30', colors.secondaryContainer + '20', colors.background ]}
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <SquiggleBackground />
        <View style={[styles.errorContainer, { paddingTop: 56 }]}>
          <Ionicons name="alert-circle" size={64} color={colors.error} />
          <Text style={styles.errorText}>No result to display</Text>
        </View>
      </View>
    );
  }

  const renderResultCard = () => (
    <Animated.View style={[styles.cardContainer, cardStyle]}>
      <View style={styles.card}>
        <Image source={{ uri: currentResult.imageUri }} style={styles.resultImage} contentFit="cover" transition={300} />
      </View>
    </Animated.View>
  );

  const renderActionButtons = () => (
    <Animated.View style={[styles.actionButtons, slideUpStyle]}>
      <Button title="Save" onPress={handleSaveImage} variant="outline" icon="download" style={styles.actionButton} />
      <Button title="Create" onPress={() => router.push('/creation')} variant="primary" icon="add" style={styles.actionButton} />
    </Animated.View>
  );

  return (
    <View style={{ flex: 1 }}>
      <AndroidifyTopAppBar backEnabled onBackPressed={handleBackPress} onAboutClicked={handleAboutPress} />
      <LinearGradient
        colors={[ colors.background, colors.primaryContainer + '30', colors.secondaryContainer + '20', colors.background ]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <SquiggleBackground />
      <Animated.View style={[styles.container, containerStyle]}>
        <View style={[styles.compactLayout, { paddingTop: 56 }]}>
          {renderResultCard()}
          <View style={styles.compactBottom}>{renderActionButtons()}</View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -2,
  },
  compactLayout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  compactBottom: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.massive,
  },
  card: {
    width: 300,
    height: 400,
    borderRadius: shapes.resultCard.borderRadius,
    backgroundColor: colors.surface,
    shadowColor: colors.scrim,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  resultImage: { width: '100%', height: '100%' },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  actionButton: { flex: 1, maxWidth: 120 },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  errorText: {
    ...typography.headlineSmall,
    color: colors.onSurface,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});


