import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

export default function HomeScreen() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadRecipes = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setRecipes(JSON.parse(data));
      } else {
        // Add sample recipes for first launch
        const samples = getSampleRecipes();
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(samples));
        setRecipes(samples);
      }
    } catch (e) {
      console.error('Failed to load recipes', e);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecipes();
    setRefreshing(false);
  };

  const renderRecipe = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => router.push(`/recipe/${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <Text style={styles.recipeTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.recipeDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Prep</Text>
            <Text style={styles.metaValue}>{item.prepTime}</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Cook</Text>
            <Text style={styles.metaValue}>{item.cookTime}</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Serves</Text>
            <Text style={styles.metaValue}>{item.servings}</Text>
          </View>
        </View>
      </View>
      {item.isFavorite && (
        <View style={styles.favoriteBadge}>
          <View style={styles.heartSmall} />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <View style={styles.emptyPlate} />
        <View style={styles.emptyForkLeft} />
        <View style={styles.emptyForkRight} />
      </View>
      <Text style={styles.emptyTitle}>No recipes yet</Text>
      <Text style={styles.emptySubtitle}>
        Add your first recipe to get started
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => router.push('/(tabs)/add')}
      >
        <Text style={styles.emptyButtonText}>Add Recipe</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Your recipes</Text>
        <Text style={styles.subtitle}>
          {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
        </Text>
      </View>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={renderRecipe}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
}

function getSampleRecipes(): Recipe[] {
  return [
    {
      id: '1',
      title: 'Classic Spaghetti Carbonara',
      description: 'Creamy Italian pasta with crispy pancetta and parmesan',
      ingredients: ['400g spaghetti', '200g pancetta', '4 egg yolks', '100g parmesan', 'Black pepper'],
      steps: ['Cook spaghetti al dente', 'Fry pancetta until crispy', 'Mix eggs with parmesan', 'Combine everything off heat', 'Season and serve'],
      prepTime: '10 min',
      cookTime: '20 min',
      servings: 4,
      isFavorite: true,
      createdAt: Date.now(),
    },
    {
      id: '2',
      title: 'Quick Avocado Toast',
      description: 'Healthy breakfast with perfectly ripe avocado',
      ingredients: ['2 slices sourdough', '1 ripe avocado', 'Cherry tomatoes', 'Red pepper flakes', 'Lemon juice'],
      steps: ['Toast bread', 'Mash avocado with lemon', 'Spread on toast', 'Top with tomatoes', 'Add seasoning'],
      prepTime: '5 min',
      cookTime: '2 min',
      servings: 1,
      isFavorite: false,
      createdAt: Date.now() - 86400000,
    },
    {
      id: '3',
      title: 'Thai Green Curry',
      description: 'Aromatic coconut curry with vegetables',
      ingredients: ['400ml coconut milk', '2 tbsp green curry paste', 'Mixed vegetables', 'Thai basil', 'Fish sauce'],
      steps: ['Heat coconut milk', 'Add curry paste', 'Simmer with vegetables', 'Season with fish sauce', 'Garnish with basil'],
      prepTime: '15 min',
      cookTime: '25 min',
      servings: 3,
      isFavorite: true,
      createdAt: Date.now() - 172800000,
    },
  ];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  greeting: {
    fontSize: fontSize.largeTitle,
    fontWeight: fontWeight.bold,
    color: colors.text,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: fontSize.bodyLarge,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  recipeCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  cardContent: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: fontSize.title3,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  recipeDescription: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
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
    fontWeight: fontWeight.medium,
    color: colors.text,
    marginTop: 2,
  },
  metaDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
  },
  favoriteBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  heartSmall: {
    width: 12,
    height: 12,
    backgroundColor: colors.brand,
    transform: [{ rotate: '45deg' }],
    borderRadius: 6,
  },
  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl * 2,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyPlate: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: colors.border,
  },
  emptyForkLeft: {
    position: 'absolute',
    left: 8,
    top: 10,
    width: 4,
    height: 30,
    backgroundColor: colors.border,
    borderRadius: 2,
  },
  emptyForkRight: {
    position: 'absolute',
    right: 8,
    top: 10,
    width: 4,
    height: 30,
    backgroundColor: colors.border,
    borderRadius: 2,
  },
  emptyTitle: {
    fontSize: fontSize.title3,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  emptyButton: {
    backgroundColor: colors.brand,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold,
  },
});
