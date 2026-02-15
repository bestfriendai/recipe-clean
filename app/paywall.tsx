import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../src/theme';
import { getPremiumStatus, PurchasePackage } from '../src/services/purchases';

const FEATURES = [
  { icon: '∞', title: 'Unlimited Recipes', desc: 'Never hit a limit' },
  { icon: '📸', title: 'Photo Storage', desc: 'Save photos with recipes' },
  { icon: '📤', title: 'Export & Share', desc: 'Export recipes as PDF' },
  { icon: '🔒', title: 'Cloud Backup', desc: 'Sync across devices' },
];

export default function PaywallScreen() {
  const router = useRouter();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPremium();
  }, []);

  const checkPremium = async () => {
    try {
      const status = await getPremiumStatus();
      setIsPremium(status);
    } catch (e) {
      console.error('Failed to check premium', e);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (packageType: 'monthly' | 'annual') => {
    // RevenueCat integration stub
    alert(`Purchase ${packageType} - Configure RevenueCat API keys to enable`);
  };

  const handleRestore = async () => {
    // RevenueCat restore stub
    alert('Restore purchases - Configure RevenueCat to enable');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <View style={styles.closeIcon}>
            <View style={styles.closeX} />
            <View style={styles.closeX2} />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Text style={styles.heroEmoji}>👨‍🍳</Text>
          </View>
          <Text style={styles.title}>RecipeClean Premium</Text>
          <Text style={styles.subtitle}>
            Unlock the full cooking experience
          </Text>
        </View>

        <View style={styles.features}>
          {FEATURES.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureEmoji}>{feature.icon}</Text>
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.pricing}>
          <TouchableOpacity
            style={[styles.planCard, styles.planRecommended]}
            onPress={() => handlePurchase('annual')}
            activeOpacity={0.8}
          >
            <View style={styles.recommendedBadge}>
              <Text style={styles.recommendedText}>BEST VALUE</Text>
            </View>
            <Text style={styles.planName}>Annual</Text>
            <View style={styles.planPriceRow}>
              <Text style={styles.planPrice}>$29.99</Text>
              <Text style={styles.planPeriod}>/year</Text>
            </View>
            <Text style={styles.planSavings}>Save 50%</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.planCard}
            onPress={() => handlePurchase('monthly')}
            activeOpacity={0.8}
          >
            <Text style={styles.planName}>Monthly</Text>
            <View style={styles.planPriceRow}>
              <Text style={styles.planPrice}>$4.99</Text>
              <Text style={styles.planPeriod}>/month</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.ctaButton} onPress={() => handlePurchase('annual')}>
          <Text style={styles.ctaText}>Start Free Trial</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.restoreButton} onPress={handleRestore}>
          <Text style={styles.restoreText}>Restore Purchases</Text>
        </TouchableOpacity>

        <View style={styles.terms}>
          <Text style={styles.termsText}>
            Subscription automatically renews. Cancel anytime in Settings.
          </Text>
          <View style={styles.termsLinks}>
            <TouchableOpacity>
              <Text style={styles.linkText}>Terms</Text>
            </TouchableOpacity>
            <Text style={styles.termsDivider}>•</Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>Privacy</Text>
            </TouchableOpacity>
          </View>
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
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xxl + spacing.md,
    paddingBottom: spacing.md,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeX: {
    width: 16,
    height: 2,
    backgroundColor: colors.textSecondary,
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
  },
  closeX2: {
    width: 16,
    height: 2,
    backgroundColor: colors.textSecondary,
    transform: [{ rotate: '-45deg' }],
    position: 'absolute',
  },
  content: {
    flex: 1,
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  heroEmoji: {
    fontSize: 40,
  },
  title: {
    fontSize: fontSize.largeTitle,
    fontWeight: fontWeight.bold,
    color: colors.text,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.bodyLarge,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  features: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  featureEmoji: {
    fontSize: 18,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  featureDesc: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  pricing: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
  planCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  planRecommended: {
    borderColor: colors.brand,
    borderWidth: 2,
    position: 'relative',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: colors.brand,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    color: '#fff',
    letterSpacing: 0.5,
  },
  planName: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  planPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontSize: fontSize.title2,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  planPeriod: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  planSavings: {
    fontSize: fontSize.caption,
    color: colors.brand,
    fontWeight: fontWeight.medium,
    marginTop: spacing.xs,
  },
  ctaButton: {
    backgroundColor: colors.brand,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: '#fff',
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  restoreText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
  },
  terms: {
    alignItems: 'center',
    paddingBottom: spacing.xxl,
  },
  termsText: {
    fontSize: fontSize.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  termsLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  linkText: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
  termsDivider: {
    fontSize: fontSize.caption,
    color: colors.textTertiary,
  },
});
