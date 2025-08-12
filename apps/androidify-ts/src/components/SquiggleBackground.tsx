import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

import { colors } from '../theme/colors';

interface SquiggleBackgroundProps {
  offsetHeightFraction?: number;
  animated?: boolean;
  opacity?: number;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const SquiggleBackground: React.FC<SquiggleBackgroundProps> = ({
  offsetHeightFraction = 0,
  animated = true,
  opacity = 0.3,
}) => {
  const animationValue = useSharedValue(0);

  React.useEffect(() => {
    if (animated) {
      animationValue.value = withRepeat(
        withTiming(1, { duration: 20000 }),
        -1,
        false
      );
    }
  }, [animated, animationValue]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = animated
      ? interpolate(animationValue.value, [0, 1], [0, -50])
      : 0;
    
    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  const offsetY = screenHeight * offsetHeightFraction;

  // Generate squiggle paths
  const generateSquigglePath = (yOffset: number, amplitude: number = 20, frequency: number = 0.02) => {
    let path = `M 0 ${yOffset}`;
    
    for (let x = 0; x <= screenWidth; x += 5) {
      const y = yOffset + Math.sin(x * frequency) * amplitude;
      path += ` L ${x} ${y}`;
    }
    
    return path;
  };

  return (
    <Animated.View style={[styles.container, animatedStyle, { top: offsetY }]}>
      <Svg
        width={screenWidth}
        height={screenHeight}
        style={styles.svg}
      >
        <Defs>
          <LinearGradient id="squiggleGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors.primary} stopOpacity="0.6" />
            <Stop offset="50%" stopColor={colors.secondary} stopOpacity="0.4" />
            <Stop offset="100%" stopColor={colors.tertiary} stopOpacity="0.3" />
          </LinearGradient>
          
          <LinearGradient id="squiggleGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors.tertiary} stopOpacity="0.5" />
            <Stop offset="50%" stopColor={colors.primary} stopOpacity="0.35" />
            <Stop offset="100%" stopColor={colors.secondary} stopOpacity="0.25" />
          </LinearGradient>
          
          <LinearGradient id="squiggleGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors.secondary} stopOpacity="0.45" />
            <Stop offset="50%" stopColor={colors.tertiary} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={colors.primary} stopOpacity="0.2" />
          </LinearGradient>
        </Defs>

        {/* Multiple squiggle layers for depth */}
        <Path
          d={generateSquigglePath(100, 25, 0.015)}
          stroke="url(#squiggleGradient1)"
          strokeWidth="3"
          fill="none"
        />
        
        <Path
          d={generateSquigglePath(200, 30, 0.02)}
          stroke="url(#squiggleGradient2)"
          strokeWidth="2"
          fill="none"
        />
        
        <Path
          d={generateSquigglePath(300, 20, 0.025)}
          stroke="url(#squiggleGradient3)"
          strokeWidth="2.5"
          fill="none"
        />
        
        <Path
          d={generateSquigglePath(450, 35, 0.018)}
          stroke="url(#squiggleGradient1)"
          strokeWidth="2"
          fill="none"
        />
        
        <Path
          d={generateSquigglePath(600, 28, 0.022)}
          stroke="url(#squiggleGradient2)"
          strokeWidth="3"
          fill="none"
        />
        
        {/* Additional decorative elements */}
        <Path
          d={generateSquigglePath(150, 15, 0.03)}
          stroke={colors.primary}
          strokeWidth="1"
          fill="none"
          opacity="0.4"
        />
        
        <Path
          d={generateSquigglePath(350, 18, 0.028)}
          stroke={colors.secondary}
          strokeWidth="1.5"
          fill="none"
          opacity="0.3"
        />
        
        <Path
          d={generateSquigglePath(550, 22, 0.019)}
          stroke={colors.tertiary}
          strokeWidth="1"
          fill="none"
          opacity="0.35"
        />
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  svg: {
    position: 'absolute',
  },
  decorativeContainer: {
    alignSelf: 'center',
    marginVertical: 8,
  },
});
