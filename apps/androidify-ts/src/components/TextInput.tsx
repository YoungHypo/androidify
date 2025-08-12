import React, { useState, useRef } from 'react';
import {
  TextInput as RNTextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

export interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  onSubmitEditing?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  showCharacterCount?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  disabled = false,
  autoFocus = false,
  keyboardType = 'default',
  returnKeyType = 'done',
  onSubmitEditing,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  inputStyle,
  showCharacterCount = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;
  const inputRef = useRef<RNTextInput>(null);

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value, animatedValue]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleLabelPress = () => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  };

  const getBorderColor = () => {
    if (error) return colors.error;
    if (isFocused) return colors.primary;
    return colors.outline;
  };

  const getBackgroundColor = () => {
    if (disabled) return colors.surfaceVariant;
    return colors.surface;
  };

  const labelStyle = {
    position: 'absolute' as const,
    left: leftIcon ? 48 : spacing.md,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [multiline ? 20 : 16, 8],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.onSurfaceVariant, isFocused ? colors.primary : colors.onSurfaceVariant],
    }),
    backgroundColor: colors.surface,
    paddingHorizontal: 4,
    zIndex: 1,
  };

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: getBorderColor(),
            backgroundColor: getBackgroundColor(),
            minHeight: multiline ? 120 : 48,
          },
        ]}
      >
        {label && (
          <TouchableOpacity onPress={handleLabelPress} activeOpacity={1}>
            <Animated.Text style={labelStyle}>{label}</Animated.Text>
          </TouchableOpacity>
        )}
        
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            {leftIcon}
          </View>
        )}
        
        <RNTextInput
          ref={inputRef}
          style={[
            styles.input,
            {
              paddingLeft: leftIcon ? 48 : spacing.md,
              paddingRight: rightIcon ? 48 : spacing.md,
              paddingTop: label ? 24 : spacing.md,
              textAlignVertical: multiline ? 'top' : 'center',
              height: multiline ? undefined : 48,
            },
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={!label ? placeholder : undefined}
          placeholderTextColor={colors.onSurfaceVariant}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          editable={!disabled}
          autoFocus={autoFocus}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onFocus={handleFocus}
          onBlur={handleBlur}
          selectionColor={colors.primary}
        />
        
        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.helperContainer}>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <View style={{ flex: 1 }} />
        )}
        
        {showCharacterCount && maxLength && (
          <Text style={styles.characterCount}>
            {value.length}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
  },
  
  inputContainer: {
    borderWidth: 1,
    borderRadius: 12,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  
  input: {
    flex: 1,
    ...typography.bodyLarge,
    color: colors.onSurface,
    padding: 0,
    margin: 0,
  },
  
  leftIconContainer: {
    position: 'absolute',
    left: spacing.md,
    top: '50%',
    transform: [{ translateY: -12 }],
    zIndex: 2,
  },
  
  rightIconContainer: {
    position: 'absolute',
    right: spacing.md,
    top: '50%',
    transform: [{ translateY: -12 }],
    zIndex: 2,
  },
  
  helperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
  },
  
  characterCount: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
  },
});
