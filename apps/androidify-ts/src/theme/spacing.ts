// Spacing system based on 8px grid
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
  huge: 64,
  massive: 80,
} as const;

// Specific spacing values for common use cases
export const layout = {
  // Screen padding
  screenPadding: spacing.md,
  screenPaddingHorizontal: spacing.md,
  screenPaddingVertical: spacing.lg,
  
  // Card spacing
  cardPadding: spacing.md,
  cardMargin: spacing.md,
  cardRadius: 16,
  
  // Button spacing
  buttonPadding: spacing.md,
  buttonPaddingVertical: spacing.sm,
  buttonRadius: 24,
  buttonMinHeight: 48,
  
  // Input spacing
  inputPadding: spacing.md,
  inputRadius: 12,
  inputMinHeight: 48,
  
  // List item spacing
  listItemPadding: spacing.md,
  listItemMinHeight: 56,
  
  // Icon sizes
  iconXs: 16,
  iconSm: 20,
  iconMd: 24,
  iconLg: 32,
  iconXl: 40,
  iconXxl: 48,
  
  // Avatar sizes
  avatarSm: 32,
  avatarMd: 40,
  avatarLg: 56,
  avatarXl: 72,
  
  // Header heights
  headerHeight: 56,
  tabBarHeight: 60,
  
  // Bottom sheet
  bottomSheetRadius: 28,
  bottomSheetHandleWidth: 32,
  bottomSheetHandleHeight: 4,
  
  // Modal
  modalRadius: 28,
  modalPadding: spacing.lg,
  
  // Floating Action Button
  fabSize: 56,
  fabSizeSmall: 40,
  
  // Progress indicators
  progressHeight: 4,
  progressRadius: 2,
  
  // Dividers
  dividerHeight: 1,
  dividerThick: 2,
  
  // Elevation/Shadow
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
} as const;

export type SpacingKey = keyof typeof spacing;
export type LayoutKey = keyof typeof layout;
