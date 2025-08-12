import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { shapes } from '../theme/shapes';
import { motions } from '../theme/motions';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export type PromptType = 'text' | 'image';

interface PromptTypeToolbarProps {
  selectedOption: PromptType;
  onOptionSelected: (option: PromptType) => void;
  style?: any;
}

export const PromptTypeToolbar: React.FC<PromptTypeToolbarProps> = ({
  selectedOption,
  onOptionSelected,
  style,
}) => {
  const options: Array<{
    type: PromptType;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
  }> = [
    { type: 'text', label: 'Text Prompt', icon: 'text' },
    { type: 'image', label: 'Image Upload', icon: 'image' },
  ];

  const getOptionAnimatedStyle = (optionType: PromptType) => {
    return useAnimatedStyle(() => {
      const isSelected = selectedOption === optionType;
      
      return {
        backgroundColor: withTiming(
          isSelected ? colors.primaryContainer : colors.surface,
          { duration: motions.standard.duration }
        ),
        borderColor: withTiming(
          isSelected ? colors.primary : colors.outline,
          { duration: motions.standard.duration }
        ),
        transform: [{
          scale: withTiming(
            isSelected ? 1.02 : 1,
            { duration: motions.standard.duration }
          )
        }],
      };
    });
  };

  const getTextAnimatedStyle = (optionType: PromptType) => {
    return useAnimatedStyle(() => {
      const isSelected = selectedOption === optionType;
      
      return {
        color: withTiming(
          isSelected ? colors.onPrimaryContainer : colors.onSurface,
          { duration: motions.standard.duration }
        ),
      };
    });
  };

  const getIconColor = (optionType: PromptType) => {
    return selectedOption === optionType ? colors.onPrimaryContainer : colors.onSurfaceVariant;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.toolbar}>
        {options.map((option) => (
          <AnimatedTouchableOpacity
            key={option.type}
            style={[
              styles.option,
              getOptionAnimatedStyle(option.type),
            ]}
            onPress={() => onOptionSelected(option.type)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={option.icon}
              size={20}
              color={getIconColor(option.type)}
              style={styles.optionIcon}
            />
            <Animated.Text
              style={[
                styles.optionText,
                getTextAnimatedStyle(option.type),
              ]}
            >
              {option.label}
            </Animated.Text>
          </AnimatedTouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  toolbar: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainer,
    borderRadius: shapes.toolbar.borderRadius,
    padding: spacing.xs,
    shadowColor: colors.scrim,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.xs,
    borderRadius: shapes.toolbar.borderRadius,
    borderWidth: 1,
    minWidth: 120,
    justifyContent: 'center',
  },
  optionIcon: {
    marginRight: spacing.xs,
  },
  optionText: {
    ...typography.labelLarge,
    fontSize: 14,
  },
});
