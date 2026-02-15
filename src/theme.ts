// RecipeClean Theme - Warm Coral Minimalist
export const colors = {
  // Brand: Warm Coral - evokes warmth, appetite, home cooking
  brand: '#FF6B5B',
  brandLight: '#FF8A7D',
  brandDark: '#E55547',
  
  // Neutrals - Warm gray palette
  background: '#FAFAF9',
  surface: '#FFFFFF',
  surfaceSecondary: '#F5F5F4',
  surfaceTertiary: '#E7E5E4',
  
  // Text - Warm blacks
  text: '#1C1917',
  textSecondary: 'rgba(28, 25, 23, 0.55)',
  textTertiary: 'rgba(28, 25, 23, 0.35)',
  
  // Borders
  border: '#E7E5E4',
  borderLight: '#F5F5F4',
  
  // Semantic
  destructive: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  
  // Dark mode
  dark: {
    background: '#0C0A09',
    surface: '#1C1917',
    surfaceSecondary: '#292524',
    surfaceTertiary: '#44403C',
    text: '#FAFAF9',
    textSecondary: 'rgba(250, 250, 249, 0.6)',
    textTertiary: 'rgba(250, 250, 249, 0.35)',
    border: 'rgba(250, 250, 249, 0.08)',
    borderLight: 'rgba(250, 250, 249, 0.04)',
  }
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const fontSize = {
  caption: 13,
  body: 15,
  bodyLarge: 17,
  title3: 20,
  title2: 22,
  largeTitle: 34,
};

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const shadows = {
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
};
