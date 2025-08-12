import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';

import { HomePageButton } from '../src/components/Button';
import { AndroidifyTopAppBar } from '../src/components/AndroidifyTopAppBar';
import { colors } from '../src/theme/colors';
import { typography } from '../src/theme/typography';
import { spacing } from '../src/theme/spacing';
import { motions } from '../src/theme/motions';
import { SquiggleBackground } from '../src/components/SquiggleBackground';

export default function Index() {
  const router = useRouter();
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withTiming(1.1, { duration: motions.pulse.duration }),
      -1,
      true
    );
  }, []);

  const handleLetsGoPress = () => {
    router.push('/creation');
  };

  const handleAboutPress = () => {
    router.push('/about');
  };

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          colors.background,
          colors.primaryContainer + '30',
          colors.secondaryContainer + '20',
          colors.background,
        ]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <SquiggleBackground />

      <AndroidifyTopAppBar onAboutClicked={handleAboutPress} />

      <Animated.View style={styles.compactContent}>
        <View style={styles.pagerPage}>
          <DancingBotContent />
        </View>

        <Animated.View style={[styles.buttonContainer, pulseAnimatedStyle]}>
          <HomePageButton
            title="Let's Go"
            onPress={handleLetsGoPress}
            style={styles.letsGoButton}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const DancingBotContent: React.FC = () => {
  return (
    <View style={styles.mainContent}>
      <View style={styles.dancingBotContainer}>
        <Image
          source={{ uri: 'https://services.google.com/fh/files/misc/android_dancing.gif' }}
          style={styles.dancingBot}
          contentFit="contain"
        />
        <Text style={styles.headlineText}>Create Your Android</Text>
        <Text style={styles.subheadlineText}>Design unique Android characters with Gemini AI</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  compactContent: {
    flex: 1,
    paddingTop: 56,
  },
  pagerPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  mainContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dancingBotContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dancingBot: {
    width: 300,
    height: 300,
    marginBottom: spacing.lg,
  },
  headlineText: {
    ...typography.headlineMedium,
    color: colors.onBackground,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subheadlineText: {
    ...typography.bodyLarge,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 300,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  letsGoButton: {
    width: 220,
    height: 64,
  },
});