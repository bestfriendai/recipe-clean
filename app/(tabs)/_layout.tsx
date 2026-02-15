import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSize, spacing } from '../../src/theme';

// Simple icon components using shapes
const HomeIcon = ({ focused }: { focused: boolean }) => (
  <View style={[styles.iconContainer, focused && styles.iconFocused]}>
    <View style={styles.homeIcon}>
      <View style={styles.homeRoof} />
      <View style={styles.homeBody} />
    </View>
  </View>
);

const SearchIcon = ({ focused }: { focused: boolean }) => (
  <View style={[styles.iconContainer, focused && styles.iconFocused]}>
    <View style={styles.searchCircle} />
    <View style={styles.searchHandle} />
  </View>
);

const PlusIcon = () => (
  <View style={styles.plusContainer}>
    <View style={styles.plusHorizontal} />
    <View style={styles.plusVertical} />
  </View>
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Recipes',
          tabBarIcon: ({ focused }) => <HomeIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused }) => <SearchIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarIcon: () => <PlusIcon />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconFocused]}>
              <View style={[styles.heartIcon, focused && styles.heartIconFilled]} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    height: 84,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  tabBarLabel: {
    fontSize: fontSize.caption,
    fontWeight: '500',
  },
  iconContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconFocused: {
    opacity: 1,
  },
  // Home icon
  homeIcon: {
    width: 22,
    height: 20,
    alignItems: 'center',
  },
  homeRoof: {
    width: 0,
    height: 0,
    borderLeftWidth: 11,
    borderRightWidth: 11,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.brand,
  },
  homeBody: {
    width: 16,
    height: 10,
    backgroundColor: colors.brand,
    marginTop: -1,
  },
  // Search icon
  searchCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.textTertiary,
    position: 'absolute',
    top: 4,
    left: 4,
  },
  searchHandle: {
    width: 6,
    height: 2,
    backgroundColor: colors.textTertiary,
    position: 'absolute',
    bottom: 6,
    right: 4,
    transform: [{ rotate: '45deg' }],
  },
  // Plus icon
  plusContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand,
    borderRadius: 14,
    marginBottom: 4,
  },
  plusHorizontal: {
    width: 14,
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 1.5,
  },
  plusVertical: {
    width: 3,
    height: 14,
    backgroundColor: '#fff',
    borderRadius: 1.5,
    position: 'absolute',
  },
  // Heart icon
  heartIcon: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.textTertiary,
    borderRadius: 10,
    transform: [{ rotate: '45deg' }],
    position: 'relative',
  },
  heartIconFilled: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
});
