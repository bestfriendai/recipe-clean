import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../../src/theme';

interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  prepTime: string;
  cookTime: string;
  servings: number;
  imageUri?: string;
  isFavorite: boolean;
  createdAt: number;
}

const STORAGE_KEY = '@recipes';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const recipes: Recipe[] = JSON.parse(data);
        const found = recipes.find((r) => r.id === id);
        if (found) {
          setRecipe(found);
        }
      }
    } catch (e) {
      console.error('Failed to load recipe', e);
    }
  };

  const toggleFavorite = async () => {
    if (!recipe) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const recipes: Recipe[] = JSON.parse(data);
        const updated = recipes.map((r) =>
          r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
        );
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setRecipe({ ...recipe, isFavorite: !recipe.isFavorite });
      }
    } catch (e) {
      console.error('Failed to update favorite', e);
    }
  };

  const toggleIngredient = (index: number) => {
    Haptics.selectionAsync();
    const newSet = new Set(checkedIngredients);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setCheckedIngredients(newSet);
  };

  const toggleStep = (index: number) => {
    Haptics.selectionAsync();
    const newSet = new Set(checkedSteps);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setCheckedSteps(newSet);
  };

  const deleteRecipe = () => {
    Alert.alert(
      'Delete Recipe',
      `Are you sure you want to delete "${recipe?.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const data = await AsyncStorage.getItem(STORAGE_KEY);
              if (data) {
                const recipes: Recipe[] = JSON.parse(data);
                const filtered = recipes.filter((r) => r.id !== id);
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                router.back();
              }
            } catch (e) {
              console.error('Failed to delete', e);
            }
          },
        },
      ]
    );
  };

  if (!recipe) {
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <View style={styles.backIcon}>
            <View style={styles.backChevron} />
          </View>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={toggleFavorite} style={styles.actionButton}>
            <View style={[styles.heartIcon, recipe.isFavorite && styles.heartIconFilled]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={deleteRecipe} style={styles.actionButton}>
            <View style={styles.trashIcon}>
              <View style={styles.trashTop} />
              <View style={styles.trashBody} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{recipe.title}</Text>
          {recipe.description && (
            <Text style={styles.description}>{recipe.description}</Text>
          )}
          
          <View style={styles.metaRow}>
            <View style={styles.metaPill}>
              <Text style={styles.metaLabel}>Prep</Text>
              <Text style={styles.metaValue}>{recipe.prepTime}</Text>
            </View>
            <View style={styles.metaPill}>
              <Text style={styles.metaLabel}>Cook</Text>
              <Text style={styles.metaValue}>{recipe.cookTime}</Text>
            </View>
            <View style={styles.metaPill}>
              <Text style={styles.metaLabel}>Serves</Text>
              <Text style={styles.metaValue}>{recipe.servings}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {recipe.ingredients.map((ingredient, index) => (
            <TouchableOpacity
              key={index}
              style={styles.listItem}
              onPress={() => toggleIngredient(index)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  checkedIngredients.has(index) && styles.checkboxChecked,
                ]}
              >
                {checkedIngredients.has(index) && (
                  <View style={styles.checkmark} />
                )}
              </View>
              <Text
                style={[
                  styles.listText,
                  checkedIngredients.has(index) && styles.listTextChecked,
                ]}
              >
                {ingredient}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {recipe.steps.map((step, index) => (
            <TouchableOpacity
              key={index}
              style={styles.stepItem}
              onPress={() => toggleStep(index)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.stepNumber,
                  checkedSteps.has(index) && styles.stepNumberChecked,
                ]}
              >
                {checkedSteps.has(index) ? (
                  <View style={styles.checkmarkSmall} />
                ) : (
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                )}
              </View>
              <Text
                style={[
                  styles.stepText,
                  checkedSteps.has(index) && styles.stepTextChecked,
                ]}
              >
                {step}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xxl + spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.sm,
  },
  backIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backChevron: {
    width: 10,
    height: 10,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.brand,
    transform: [{ rotate: '45deg' }],
    marginLeft: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  actionButton: {
    padding: spacing.sm,
  },
  heartIcon: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: colors.textTertiary,
    borderRadius: 11,
    transform: [{ rotate: '45deg' }],
  },
  heartIconFilled: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  trashIcon: {
    width: 20,
    height: 22,
    alignItems: 'center',
  },
  trashTop: {
    width: 18,
    height: 3,
    backgroundColor: colors.destructive,
    borderRadius: 1,
  },
  trashBody: {
    width: 14,
    height: 16,
    backgroundColor: colors.destructive,
    borderRadius: 2,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  titleSection: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: fontSize.largeTitle,
    fontWeight: fontWeight.bold,
    color: colors.text,
    letterSpacing: -0.4,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: fontSize.bodyLarge,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  metaPill: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: fontSize.caption,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginTop: 2,
  },
  section: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  lastSection: {
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: fontSize.title2,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkboxChecked: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  checkmark: {
    width: 12,
    height: 6,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#fff',
    transform: [{ rotate: '-45deg' }],
    marginTop: -2,
  },
  listText: {
    flex: 1,
    fontSize: fontSize.bodyLarge,
    color: colors.text,
    lineHeight: 24,
  },
  listTextChecked: {
    textDecorationLine: 'line-through',
    color: colors.textTertiary,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: 2,
  },
  stepNumberChecked: {
    backgroundColor: colors.success,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
  },
  checkmarkSmall: {
    width: 10,
    height: 5,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#fff',
    transform: [{ rotate: '-45deg' }],
    marginTop: -2,
  },
  stepText: {
    flex: 1,
    fontSize: fontSize.bodyLarge,
    color: colors.text,
    lineHeight: 26,
  },
  stepTextChecked: {
    textDecorationLine: 'line-through',
    color: colors.textTertiary,
  },
});
