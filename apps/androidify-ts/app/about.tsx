import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Link } from 'expo-router';

import { colors } from '../src/theme/colors';
import { typography } from '../src/theme/typography';
import { spacing } from '../src/theme/spacing';

export default function AboutRoute() {
  const router = useRouter();

  const handleBack = () => router.back();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Info */}
        <View style={styles.section}>
          <View style={styles.appIconContainer}>
            <Text style={styles.appIcon}>🤖</Text>
          </View>
          <Text style={styles.appName}>Androidify</Text>
          <Text style={styles.appAuthor}>by @YoungHypo</Text>
          <Text style={styles.appDescription}>
            Create personalized Android bot characters using Gemini AI.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <FeatureItem
            icon="create-outline"
            title="AI-Powered Generation"
            description="Advanced AI creates unique Android bots based on your text descriptions"
          />
          <FeatureItem
            icon="color-palette-outline"
            title="Custom Color Schemes"
            description="Choose from beautiful pre-designed color palettes for your bot"
          />
          <FeatureItem
            icon="sparkles-outline"
            title="Smart Prompt Enhancement"
            description="AI helps enhance your descriptions for better generation results"
          />
          <FeatureItem
            icon="download-outline"
            title="Save & Share"
            description="Export your creations to gallery and share with friends"
          />
        </View>

        {/* Credits */}
        <View style={styles.section}>
          <View style={styles.creditCard}>
            <Text style={styles.creditTitle}>Original Android App</Text>
            <Text style={styles.creditDescription}>
              This React Native version is inspired by the original Androidify app created by Google:{' '}
              <Link href="https://github.com/android/androidify">https://github.com/android/androidify</Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface FeatureItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => (
  <View style={styles.featureItem}>
    <View style={styles.featureIcon}>
      <Ionicons name={icon} size={20} color={colors.primary} />
    </View>
    <View style={styles.featureContent}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  headerButton: {
    padding: spacing.sm,
    width: 40,
  },
  headerTitle: {
    ...typography.titleLarge,
    color: colors.onSurface,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  section: {
    marginTop: spacing.lg,
  },
  appIconContainer: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  appIcon: {
    fontSize: 40,
  },
  appName: {
    ...typography.headlineMedium,
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  appAuthor: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  appDescription: {
    ...typography.bodyLarge,
    color: colors.onSurface,
    textAlign: 'center',
    lineHeight: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    ...typography.titleMedium,
    color: colors.onSurface,
    marginBottom: spacing.xs,
  },
  featureDescription: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
  },
  creditCard: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  creditTitle: {
    ...typography.titleMedium,
    color: colors.onSurface,
    marginBottom: spacing.sm,
  },
  creditDescription: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
  },
});


