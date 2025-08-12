import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface AndroidifyTopAppBarProps {
  title?: string;
  backEnabled?: boolean;
  aboutEnabled?: boolean;
  isMediumWindowSize?: boolean;
  onBackPressed?: () => void;
  onAboutClicked?: () => void;
  expandedCenterButtons?: React.ReactNode;
  backgroundColor?: string;
  elevation?: number;
}

export const AndroidifyTopAppBar: React.FC<AndroidifyTopAppBarProps> = ({
  title = 'Androidify',
  backEnabled = false,
  aboutEnabled = true,
  isMediumWindowSize = false,
  onBackPressed,
  onAboutClicked,
  expandedCenterButtons,
  backgroundColor = 'transparent',
  elevation = 0,
}) => {
  const insets = useSafeAreaInsets();

  const containerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(backgroundColor, { duration: 200 }),
      elevation: withTiming(elevation, { duration: 200 }),
      shadowOpacity: withTiming(elevation > 0 ? 0.12 : 0, { duration: 200 }),
    };
  });

  const handleBackPress = () => {
    if (onBackPressed) {
      onBackPressed();
    }
  };

  const handleAboutPress = () => {
    if (onAboutClicked) {
      onAboutClicked();
    }
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Animated.View 
        style={[
          styles.container,
          containerStyle,
          { paddingTop: insets.top }
        ]}
      >
        <View style={styles.appBar}>
          {/* Leading icon */}
          <View style={styles.leadingSection}>
            {backEnabled ? (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleBackPress}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={colors.onSurface}
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.iconButton} />
            )}
          </View>

          {/* Center content */}
          <View style={styles.centerSection}>
            {isMediumWindowSize && expandedCenterButtons ? (
              expandedCenterButtons
            ) : (
              <Text style={[styles.title, { color: colors.onSurface }]}>
                {title}
              </Text>
            )}
          </View>

          {/* Trailing icons */}
          <View style={styles.trailingSection}>
            {aboutEnabled && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleAboutPress}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={24}
                  color={colors.onSurface}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    ...Platform.select({
      ios: {
        shadowColor: colors.scrim,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      },
      android: {
        shadowColor: colors.scrim,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      },
    }),
  },
  appBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  leadingSection: {
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.xs,
  },
  trailingSection: {
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.titleLarge,
    textAlign: 'center',
  },
});
