import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { colors, spacing, radius, fontSize, fontWeight } from '../../src/theme';

const STORAGE_KEY = '@recipes';

export default function AddScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Missing title', 'Please add a recipe title');
      return;
    }
    if (!ingredients.trim()) {
      Alert.alert('Missing ingredients', 'Please add at least one ingredient');
      return;
    }
    if (!steps.trim()) {
      Alert.alert('Missing steps', 'Please add at least one step');
      return;
    }

    setSaving(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    try {
      // Load existing recipes
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      const existingRecipes = data ? JSON.parse(data) : [];

      // Create new recipe
      const newRecipe = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        ingredients: ingredients.split('\n').filter((i) => i.trim()),
        steps: steps.split('\n').filter((s) => s.trim()),
        prepTime: prepTime.trim() || '—',
        cookTime: cookTime.trim() || '—',
        servings: parseInt(servings) || 1,
        isFavorite: false,
        createdAt: Date.now(),
      };

      // Save
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([newRecipe, ...existingRecipes])
      );

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Failed to save recipe');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Recipe</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          <Text style={[styles.saveText, saving && styles.saveTextDisabled]}>
            {saving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.form}
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Grandma's Apple Pie"
            placeholderTextColor={colors.textTertiary}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Brief description of the dish"
            placeholderTextColor={colors.textTertiary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Prep Time</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 15 min"
              placeholderTextColor={colors.textTertiary}
              value={prepTime}
              onChangeText={setPrepTime}
            />
          </View>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Cook Time</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 45 min"
              placeholderTextColor={colors.textTertiary}
              value={cookTime}
              onChangeText={setCookTime}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Servings</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 4"
            placeholderTextColor={colors.textTertiary}
            value={servings}
            onChangeText={setServings}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ingredients</Text>
          <Text style={styles.hint}>One ingredient per line</Text>
          <TextInput
            style={[styles.input, styles.textArea, styles.ingredientsArea]}
            placeholder="400g spaghetti&#10;200g pancetta&#10;4 egg yolks&#10;100g parmesan"
            placeholderTextColor={colors.textTertiary}
            value={ingredients}
            onChangeText={setIngredients}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Instructions</Text>
          <Text style={styles.hint}>One step per line</Text>
          <TextInput
            style={[styles.input, styles.textArea, styles.stepsArea]}
            placeholder="Cook spaghetti al dente&#10;Fry pancetta until crispy&#10;Mix eggs with parmesan"
            placeholderTextColor={colors.textTertiary}
            value={steps}
            onChangeText={setSteps}
            multiline
            numberOfLines={10}
            textAlignVertical="top"
          />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  cancelText: {
    fontSize: fontSize.bodyLarge,
    color: colors.brand,
  },
  saveText: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.brand,
  },
  saveTextDisabled: {
    opacity: 0.5,
  },
  form: {
    flex: 1,
  },
  formContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  hint: {
    fontSize: fontSize.caption,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSize.bodyLarge,
    color: colors.text,
  },
  textArea: {
    minHeight: 100,
    paddingTop: spacing.md,
  },
  ingredientsArea: {
    minHeight: 160,
  },
  stepsArea: {
    minHeight: 200,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
});
