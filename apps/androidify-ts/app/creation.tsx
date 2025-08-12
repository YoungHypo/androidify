import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { AndroidifyTopAppBar } from '../src/components/AndroidifyTopAppBar';
import { PromptTypeToolbar, PromptType } from '../src/components/PromptTypeToolbar';
import { MainCreationPane } from '../src/components/MainCreationPane';
import { BotColorPickerModal } from '../src/components/AndroidBotColorPicker';
import { SquiggleBackground } from '../src/components/SquiggleBackground';
import { Button } from '../src/components/Button';
import { colors, botColors } from '../src/theme/colors';
import { spacing } from '../src/theme/spacing';
import { geminiService } from '../src/services/geminiService';

export default function CreationRoute() {
  const [promptText, setPromptText] = useState('');
  const [selectedBotColor, setSelectedBotColor] = useState(botColors[0]);
  const availableBotColors = botColors;
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const router = useRouter();
  const [selectedPromptOption, setSelectedPromptOption] = useState<PromptType>('text');
  const [showColorPickerModal, setShowColorPickerModal] = useState(false);
  const [uploadedImageUri, setUploadedImageUri] = useState<string>();

  const handleBackPress = () => router.back();
  const handleAboutPress = () => router.push('/about');

  const handleUndo = () => {
    if (selectedPromptOption === 'text') {
      setPromptText('');
    } else {
      setUploadedImageUri(undefined);
    }
  };

  const handleStartGeneration = async () => {
    try {
      setIsGenerating(true);
      setGenerationError(null);

      if (selectedPromptOption === 'text' && !promptText.trim()) {
        setGenerationError('Please enter a text prompt');
        return;
      }

      if (selectedPromptOption === 'image' && !uploadedImageUri) {
        setGenerationError('Please upload an image');
        return;
      }

      const result =
        selectedPromptOption === 'image' && uploadedImageUri
          ? await geminiService.generateAndroidBotFromImage(uploadedImageUri, selectedBotColor)
          : await geminiService.generateAndroidBot({ prompt: promptText, botColor: selectedBotColor });
      router.push({
        pathname: '/results',
        params: {
          prompt: selectedPromptOption === 'image' ? 'From uploaded image' : promptText,
          imageUri: result.imageUri,
          botColorId: selectedBotColor.id,
        },
      });
    } catch (error: any) {
      console.error('Error generating bot:', error);
      const message = typeof error?.message === 'string' ? error.message : 'Failed to generate Android bot';
      setGenerationError(message);
      Alert.alert('Generation Error', message);
    } finally {
      setIsGenerating(false);
    }
  };

  const canStartGeneration = () => {
    if (selectedPromptOption === 'text') {
      return promptText.trim().length > 0;
    } else {
      return uploadedImageUri !== undefined;
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
        <AndroidifyTopAppBar
          backEnabled
          onBackPressed={handleBackPress}
          onAboutClicked={handleAboutPress}
        />
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

        <View style={[styles.compactContainer, { paddingTop: 56 }]}>
          <PromptTypeToolbar
            selectedOption={selectedPromptOption}
            onOptionSelected={setSelectedPromptOption}
          />

          <MainCreationPane
            selectedPromptOption={selectedPromptOption}
            promptText={promptText}
            onPromptTextChange={setPromptText}
            onUndoPressed={handleUndo}
            onSelectedPromptOptionChanged={setSelectedPromptOption}
            onImageSelected={setUploadedImageUri}
            uploadedImageUri={uploadedImageUri}
            style={styles.mainCreationPane}
          />

          <View style={styles.actionsRow}>
            <Button
              title="Bot Color"
              onPress={() => setShowColorPickerModal(true)}
              variant="outline"
              icon={<View style={[styles.colorSwatch, { backgroundColor: selectedBotColor.primary }]} />}
              style={styles.actionButtonLeft}
              textStyle={styles.actionButtonLeftText}
            />

            <Button
              title="Transform"
              onPress={handleStartGeneration}
              disabled={!canStartGeneration() || isGenerating}
              loading={isGenerating}
              style={styles.actionButtonRight}
              textStyle={styles.actionButtonRightText}
            />
          </View>
        </View>

        <BotColorPickerModal
          visible={showColorPickerModal}
          onClose={() => setShowColorPickerModal(false)}
          selectedBotColor={selectedBotColor}
          listBotColors={availableBotColors}
          onBotColorSelected={setSelectedBotColor}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -2,
  },
  compactContainer: {
    flex: 1,
  },
  mainCreationPane: {
    flex: 1,
    marginTop: spacing.sm,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  actionButtonLeft: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.outline,
  },
  actionButtonLeftText: {
    color: colors.onSurface,
  },
  colorSwatch: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: spacing.sm,
  },
  actionButtonRight: {
    flex: 1,
    backgroundColor: colors.onSurface,
  },
  actionButtonRightText: {
    color: colors.surface,
  },
});


