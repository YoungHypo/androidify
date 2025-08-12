import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

import { PromptType } from './PromptTypeToolbar';
import { Button } from './Button';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { shapes } from '../theme/shapes';
import { motions } from '../theme/motions';

interface MainCreationPaneProps {
  selectedPromptOption: PromptType;
  promptText: string;
  onPromptTextChange: (text: string) => void;
  onUndoPressed: () => void;
  onSelectedPromptOptionChanged: (option: PromptType) => void;
  onImageSelected?: (uri: string) => void;
  uploadedImageUri?: string;
  style?: any;
}

export const MainCreationPane: React.FC<MainCreationPaneProps> = ({
  selectedPromptOption,
  promptText,
  onPromptTextChange,
  onUndoPressed,
  onSelectedPromptOptionChanged,
  onImageSelected,
  uploadedImageUri,
  style,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        console.log('Image selected:', uri);
        onSelectedPromptOptionChanged('image');
        onImageSelected && onImageSelected(uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleDocumentPicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        console.log('Document selected:', result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const dragOverStyle = useAnimatedStyle(() => ({
    borderColor: withTiming(
      isDragOver ? colors.primary : colors.outline,
      { duration: motions.standard.duration }
    ),
    backgroundColor: withTiming(
      isDragOver ? colors.primaryContainer : colors.surface,
      { duration: motions.standard.duration }
    ),
    transform: [{
      scale: withSpring(isDragOver ? 1.02 : 1, {
        damping: 15,
        stiffness: 300,
      })
    }],
  }));

  const renderTextPromptPane = () => (
    <View style={styles.promptContainer}>
      <View style={styles.headlineRow}>
        <Ionicons name="create-outline" size={24} color={colors.onSurface} style={styles.headlineIcon} />
        <Text style={styles.headlineText}>My bot is</Text>
      </View>

      <View style={styles.dashedContainer}>
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            value={promptText}
            onChangeText={onPromptTextChange}
            placeholder="Describe clothing, accessories, hairstyles, or any unique traits to make your bot a reflection of yourself."
            placeholderTextColor={colors.onSurfaceVariant}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>
      </View>
    </View>
  );

  const renderImageUploadPane = () => (
    <Animated.View style={[styles.uploadContainer, dragOverStyle]}>
      <View style={styles.uploadContent}>
        <Ionicons
          name="cloud-upload-outline"
          size={48}
          color={colors.onSurfaceVariant}
          style={styles.uploadIcon}
        />
        
        <Text style={styles.uploadTitle}>Upload an Image</Text>

        <View style={styles.uploadActions}>
          <Button
            title="Choose from Gallery"
            onPress={handleImagePicker}
            variant="primary"
            size="medium"
            icon="images"
            style={styles.uploadButton}
          />
        </View>

        {uploadedImageUri && (
          <View style={styles.uploadedImageContainer}>
            <Text style={styles.uploadedImageText}>Image uploaded successfully!</Text>
            <Button
              title="Remove"
              onPress={onUndoPressed}
                variant="outline"
              size="small"
              icon="trash-outline"
            />
          </View>
        )}
      </View>
    </Animated.View>
  );

  return (
    <View style={[styles.container, style]}>
      {selectedPromptOption === 'text' ? renderTextPromptPane() : renderImageUploadPane()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  
  // Text Prompt Styles
  promptContainer: {
    flex: 1,
  },
  sectionTitle: {
    ...typography.titleMedium,
    color: colors.onSurface,
    marginBottom: spacing.md,
  },
  headlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  headlineIcon: {
    marginRight: spacing.sm,
  },
  headlineText: {
    ...typography.headlineMedium,
    fontSize: 24,
    color: colors.onSurface,
  },
  dashedContainer: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.outline,
    borderStyle: 'dashed',
    borderRadius: shapes.input.borderRadius,
  },
  textInputContainer: {
    flex: 1
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.surfaceContainer,
    borderRadius: shapes.input.borderRadius,
    padding: spacing.md,
    ...typography.bodyLarge,
    color: 'black',
    borderWidth: 1,
    borderColor: colors.outline,
    textAlignVertical: 'top',
  },
  promptActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  suggestionButton: {
    flex: 1,
    marginRight: spacing.sm,
  },
  
  // Image Upload Styles
  uploadContainer: {
    flex: 1,
    borderRadius: shapes.large,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.outline,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  uploadContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  uploadIcon: {
    marginBottom: spacing.lg,
  },
  uploadTitle: {
    ...typography.titleMedium,
    color: colors.onSurface,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  uploadSubtitle: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: spacing.xl,
    maxWidth: 280,
  },
  uploadActions: {
    width: '100%',
    gap: spacing.md,
  },
  uploadButton: {
    width: '100%',
    marginTop: spacing.lg,
  },
  uploadedImageContainer: {
    marginTop: spacing.lg,
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surfaceContainer,
    borderRadius: shapes.medium,
  },
  uploadedImageText: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.sm,
  },
});
