import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { shapes } from '../theme/shapes';
import { motions } from '../theme/motions';
import { typography } from '../theme/typography';

type BotColor = {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface AndroidBotColorPickerProps {
  selectedBotColor: BotColor;
  listBotColors: BotColor[];
  onBotColorSelected: (color: BotColor) => void;
  style?: any;
}

export const AndroidBotColorPicker: React.FC<AndroidBotColorPickerProps> = ({
  selectedBotColor,
  listBotColors,
  onBotColorSelected,
  style,
}) => {
  const renderColorOption = (color: BotColor, index: number) => {
    const isSelected = selectedBotColor.id === color.id;

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{
          scale: withSpring(isSelected ? 1.1 : 1, {
            damping: 15,
            stiffness: 300,
          })
        }],
        borderWidth: withTiming(isSelected ? 3 : 2, {
          duration: motions.standard.duration,
        }),
        borderColor: withTiming(
          isSelected ? colors.primary : colors.outline,
          { duration: motions.standard.duration }
        ),
      };
    });

    const innerCircleStyle = useAnimatedStyle(() => {
      return {
        opacity: withTiming(isSelected ? 1 : 0, {
          duration: motions.standard.duration,
        }),
        transform: [{
          scale: withSpring(isSelected ? 1 : 0.5, {
            damping: 15,
            stiffness: 300,
          })
        }],
      };
    });

    return (
      <View key={color.id} style={styles.colorOptionContainer}>
        <AnimatedTouchableOpacity
          style={[
            styles.colorOption,
            { borderColor: '#000', backgroundColor: color.primary },
            animatedStyle,
          ]}
          onPress={() => onBotColorSelected(color)}
          activeOpacity={0.8}
        >
          <Animated.View style={[styles.selectedIndicator, innerCircleStyle]}>
            <Ionicons name="checkmark" size={14} color={colors.surface} />
          </Animated.View>
        </AnimatedTouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.colorGrid}>
          {listBotColors.map((color, index) => renderColorOption(color, index))}
        </View>
      </ScrollView>
    </View>
  );
};

// Modal version for bottom sheet
interface BotColorPickerModalProps extends AndroidBotColorPickerProps {
  visible: boolean;
  onClose: () => void;
}

export const BotColorPickerModal: React.FC<BotColorPickerModalProps> = ({
  visible,
  onClose,
  selectedBotColor,
  listBotColors,
  onBotColorSelected,
}) => {
  if (!visible) return null;

  const handleColorSelect = (color: BotColor) => {
    onBotColorSelected(color);
    onClose();
  };

  return (
    <View style={styles.modal}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Choose Bot Color</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={24} color={colors.onSurface} />
          </TouchableOpacity>
        </View>
        
        <AndroidBotColorPicker
          selectedBotColor={selectedBotColor}
          listBotColors={listBotColors}
          onBotColorSelected={handleColorSelect}
          style={styles.modalPicker}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 4,
  },
  colorOptionContainer: {
    alignItems: 'center',
    marginRight: 4,
    marginBottom: 4,
  },
  colorOption: {
    width: 24,
    height: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  selectedIndicator: {
    position: 'absolute',
    right: -4,
    top: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.scrim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Modal styles
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: shapes.bottomSheet.borderRadius,
    borderTopRightRadius: shapes.bottomSheet.borderRadius,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    ...typography.headlineSmall,
    color: colors.onSurface,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPicker: {
    flex: 0,
  },
});
