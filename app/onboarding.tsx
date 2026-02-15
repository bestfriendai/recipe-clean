import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, radius, fontSize, fontWeight } from '../src/theme';

const { width } = Dimensions.get('window');
const TOTAL_PAGES = 3;

const PAGES = [
  {
    emoji: '📝',
    title: 'Add Your Recipes',
    subtitle: 'Capture recipes from anywhere — cookbooks, websites, or your own creations',
  },
  {
    emoji: '🔍',
    title: 'Quick Search',
    subtitle: 'Find exactly what you need with powerful search across ingredients and titles',
  },
  {
    emoji: '❤️',
    title: 'Save Your Favorites',
    subtitle: 'Keep your go-to meals organized and easy to find',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);

  const handleNext = async () => {
    if (currentPage < TOTAL_PAGES - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      // Complete onboarding
      await AsyncStorage.setItem('@onboarding_complete', 'true');
      router.replace('/(tabs)');
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('@onboarding_complete', 'true');
    router.replace('/(tabs)');
  };

  const renderPage = (page: typeof PAGES[0], index: number) => (
    <View key={index} style={styles.page}>
      <View style={styles.illustration}>
        <Text style={styles.emoji}>{page.emoji}</Text>
      </View>
      <Text style={styles.title}>{page.title}</Text>
      <Text style={styles.subtitle}>{page.subtitle}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.pagesContainer}>
        {PAGES.map(renderPage)}
      </View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {Array.from({ length: TOTAL_PAGES }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentPage && styles.dotActive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>
            {currentPage === TOTAL_PAGES - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  skipButton: {
    position: 'absolute',
    top: spacing.xxl + spacing.md,
    right: spacing.lg,
    zIndex: 10,
    padding: spacing.sm,
  },
  skipText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
  },
  pagesContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  page: {
    alignItems: 'center',
  },
  illustration: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  emoji: {
    fontSize: 64,
  },
  title: {
    fontSize: fontSize.largeTitle,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.4,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fontSize.bodyLarge,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.lg,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl + spacing.lg,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.brand,
    width: 24,
  },
  nextButton: {
    backgroundColor: colors.brand,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  nextText: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: '#fff',
  },
});
