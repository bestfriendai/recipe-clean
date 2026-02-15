import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, radius, fontSize, fontWeight } from '../../src/theme';

interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  prepTime: string;
  cookTime: string;
  servings: number;
  isFavorite: boolean;
}

const STORAGE_KEY = '@recipes';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filtered, setFiltered] = useState<Recipe[]>([]);

  useEffect(() => {
    loadRecipes();
  }, []);

  useEffect(() => {
    if (query.trim() === '') {
      setFiltered([]);
    } else {
      const q = query.toLowerCase();
      const results = recipes.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.ingredients.some((i) => i.toLowerCase().includes(q))
      );
      setFiltered(results);
    }
  }, [query, recipes]);

  const loadRecipes = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setRecipes(JSON.parse(data));
      }
    } catch (e) {
      console.error('Failed to load recipes', e);
    }
  };

  const renderResult = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      style={styles.resultCard}
      onPress={() => router.push(`/recipe/${item.id}`)}
    >
      <Text style={styles.resultTitle}>{item.title}</Text>
      <Text style={styles.resultDescription} numberOfLines={1}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      {query.trim() === '' ? (
        <>
          <View style={styles.searchIconLarge}>
            <View style={styles.searchCircleLarge} />
            <View style={styles.searchHandleLarge} />
          </View>
          <Text style={styles.emptyTitle}>Search your recipes</Text>
          <Text style={styles.emptySubtitle}>
            Find by name, ingredient, or description
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.noResultsTitle}>No matches found</Text>
          <Text style={styles.noResultsSubtitle}>
            Try a different search term
          </Text>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <View style={styles.searchIconSmall}>
            <View style={styles.searchCircleSmall} />
            <View style={styles.searchHandleSmall} />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Ingredients, recipes..."
            placeholderTextColor={colors.textTertiary}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <View style={styles.clearButton}>
                <View style={styles.clearX} />
                <View style={styles.clearX2} />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderResult}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: fontSize.largeTitle,
    fontWeight: fontWeight.bold,
    color: colors.text,
    letterSpacing: -0.4,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  searchIconSmall: {
    width: 20,
    height: 20,
    marginRight: spacing.sm,
  },
  searchCircleSmall: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.textTertiary,
    position: 'absolute',
    top: 2,
    left: 2,
  },
  searchHandleSmall: {
    width: 5,
    height: 2,
    backgroundColor: colors.textTertiary,
    position: 'absolute',
    bottom: 4,
    right: 2,
    transform: [{ rotate: '45deg' }],
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.bodyLarge,
    color: colors.text,
  },
  clearButton: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearX: {
    width: 12,
    height: 2,
    backgroundColor: colors.textTertiary,
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
  },
  clearX2: {
    width: 12,
    height: 2,
    backgroundColor: colors.textTertiary,
    transform: [{ rotate: '-45deg' }],
    position: 'absolute',
  },
  listContent: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  resultCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultTitle: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  resultDescription: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl,
  },
  searchIconLarge: {
    width: 48,
    height: 48,
    marginBottom: spacing.lg,
  },
  searchCircleLarge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: colors.border,
    position: 'absolute',
    top: 4,
    left: 4,
  },
  searchHandleLarge: {
    width: 12,
    height: 4,
    backgroundColor: colors.border,
    position: 'absolute',
    bottom: 10,
    right: 6,
    transform: [{ rotate: '45deg' }],
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
  },
  noResultsTitle: {
    fontSize: fontSize.title3,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  noResultsSubtitle: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
  },
});
