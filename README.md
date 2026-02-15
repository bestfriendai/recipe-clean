# RecipeClean

Ultra-minimalist cooking app: snap recipes, get just ingredients + steps. No ads, no bloat.

## Features

- **Add Recipes** — Capture recipes from cookbooks, websites, or your own creations
- **Quick Search** — Find exactly what you need with powerful search
- **Save Favorites** — Keep your go-to meals organized
- **Cooking Mode** — Check off ingredients and steps as you cook
- **Premium** — Unlock unlimited recipes, photo storage, and cloud backup

## Tech Stack

- Expo SDK 54
- React Native 0.79
- expo-router (file-based navigation)
- AsyncStorage (local persistence)
- RevenueCat (monetization)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npx expo start
```

## Project Structure

```
app/
├── _layout.tsx          # Root navigation
├── (tabs)/               # Tab navigator
│   ├── index.tsx        # Recipes list (home)
│   ├── search.tsx       # Search recipes
│   ├── add.tsx          # Add new recipe
│   ├── favorites.tsx    # Saved recipes
│   └── settings.tsx    # Settings link
├── recipe/
│   └── [id].tsx        # Recipe detail view
├── settings/
│   └── index.tsx        # Full settings
├── onboarding.tsx       # First-launch onboarding
└── paywall.tsx         # Premium upgrade

src/
├── theme.ts            # Design tokens
├── services/
│   └── purchases.ts    # RevenueCat stub
└── ui/
    └── components.tsx  # Reusable components
```

## Design

- **Brand Color**: Warm Coral (#FF6B5B)
- **Inspiration**: Bear Notes — clean, minimal, focused on content
- **Typography**: System fonts, tight tracking on headings
- **Spacing**: Generous whitespace, 16px base grid

## License

MIT
