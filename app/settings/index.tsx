import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, radius, fontSize, fontWeight } from '../../src/theme';

interface SettingsRow {
  label: string;
  onPress?: () => void;
  destructive?: boolean;
  showChevron?: boolean;
}

export default function SettingsScreen() {
  const router = useRouter();
  const [recipeCount, setRecipeCount] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await AsyncStorage.getItem('@recipes');
      if (data) {
        const recipes = JSON.parse(data);
        setRecipeCount(recipes.length);
      }
    } catch (e) {
      console.error('Failed to load stats', e);
    }
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Recipes',
      'This will delete all your recipes. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('@recipes');
              await AsyncStorage.removeItem('@onboarding_complete');
              await AsyncStorage.removeItem('@premium_status');
              Alert.alert('Done', 'All data has been cleared');
              loadStats();
            } catch (e) {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  const sections = [
    {
      title: 'Preferences',
      rows: [
        { label: 'Default Servings', onPress: () => {}, showChevron: true },
      ] as SettingsRow[],
    },
    {
      title: 'Data',
      rows: [
        { label: 'Export Recipes', onPress: () => {}, showChevron: true },
        { label: 'Clear All Recipes', onPress: clearAllData, destructive: true },
      ] as SettingsRow[],
    },
    {
      title: 'Support',
      rows: [
        { label: 'Rate RecipeClean', onPress: () => {}, showChevron: true },
        { label: 'Send Feedback', onPress: () => {}, showChevron: true },
        { label: 'Privacy Policy', onPress: () => {}, showChevron: true },
      ] as SettingsRow[],
    },
    {
      title: 'About',
      rows: [
        { label: 'Version', onPress: undefined, showChevron: false },
      ] as SettingsRow[],
    },
  ];

  const PremiumRow = () => (
    <TouchableOpacity 
      style={styles.premiumCard}
      onPress={() => router.push('/paywall')}
    >
      <View style={styles.premiumContent}>
        <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
        <Text style={styles.premiumSubtitle}>Unlock unlimited recipes &</Text>
      more </View>
      <View style={styles.premiumArrow}>
        <View style={styles.chevron} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <View style={styles.backIcon}>
            <View style={styles.backChevron} />
          </View>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsCard}>
          <Text style={styles.statsNumber}>{recipeCount}</Text>
          <Text style={styles.statsLabel}>Saved Recipes</Text>
        </View>

        <PremiumRow />

        {sections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionHeader}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.rows.map((row, rowIndex) => (
                <TouchableOpacity
                  key={rowIndex}
                  style={[
                    styles.row,
                    rowIndex === 0 && styles.rowFirst,
                    rowIndex === section.rows.length - 1 && styles.rowLast,
                  ]}
                  onPress={row.onPress}
                  disabled={!row.onPress}
                >
                  <Text
                    style={[
                      styles.rowLabel,
                      row.destructive && styles.rowLabelDestructive,
                    ]}
                  >
                    {row.label}
                  </Text>
                  {row.label === 'Version' && (
                    <Text style={styles.rowValue}>1.0.0</Text>
                  )}
                  {row.showChevron && row.onPress && (
                    <View style={styles.chevronRow}>
                      <View style={styles.chevron} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>RecipeClean</Text>
          <Text style={styles.footerSubtext}>Made with ❤️ for home cooks</Text>
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
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xxl + spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  backIcon: {
    width: 40,
    height: 40,
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
  title: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  statsCard: {
    backgroundColor: colors.surface,
    margin: spacing.lg,
    padding: spacing.xl,
    borderRadius: radius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statsNumber: {
    fontSize: 48,
    fontWeight: fontWeight.bold,
    color: colors.brand,
  },
  statsLabel: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  premiumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brand,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  premiumContent: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: fontSize.title3,
    fontWeight: fontWeight.semibold,
    color: '#fff',
  },
  premiumSubtitle: {
    fontSize: fontSize.body,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  premiumArrow: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevron: {
    width: 8,
    height: 8,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.textSecondary,
    transform: [{ rotate: '-45deg' }],
  },
  chevronRow: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionContent: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 44,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  rowFirst: {
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
  },
  rowLast: {
    borderBottomLeftRadius: radius.md,
    borderBottomRightRadius: radius.md,
    borderBottomWidth: 0,
  },
  rowLabel: {
    fontSize: fontSize.bodyLarge,
    color: colors.text,
  },
  rowLabelDestructive: {
    color: colors.destructive,
  },
  rowValue: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  footerText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  footerSubtext: {
    fontSize: fontSize.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
});
