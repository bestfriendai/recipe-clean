# RecipeClean Setup Guide

## Prerequisites

- **Node.js** 18+
- **Expo CLI** (`npm install -g expo`)
- **EAS CLI** (`npm install -g eas-cli`)
- **Apple Developer Account** (for iOS builds)
- **Google Play Console** (for Android builds)

## Installation

```bash
cd recipe-clean

# Install dependencies
npm install

# Start development
npx expo start
```

## Running on Device/Simulator

```bash
# iOS Simulator
npx expo start --ios

# Android Emulator
npx expo start --android

# QR Code (physical device)
npx expo start
```

## RevenueCat Setup

1. **Create Account**: [revenuecat.com](https://revenuecat.com)
2. **Add App**: Create iOS/Android app in dashboard
3. **Create Products**:
   - Monthly: $4.99/mo (com.recipeclean.monthly)
   - Annual: $29.99/yr (com.recipeclean.annual)
4. **Configure API Keys**:
   - Copy iOS API key → Add to `ios/RecipeClean/Info.plist`
   - Copy Android API key → Add to `android/app/build.gradle`
5. **Update Entitlements**: Enable in Apple Developer Portal

## App Store Connect Setup

### iOS

1. **Bundle ID**: `com.recipeclean.app` (already configured)
2. **Create App**: Login to App Store Connect
3. **Screenshots** (required):
   - 6.5" (iPhone 14 Pro Max): 1242 x 2688
   - 5.5" (iPhone 8): 1242 x 2208
   - iPad Pro 12.9": 2048 x 2732
4. **Submit Build**: Use EAS Build or Xcode

### Required Info

- **App Name**: RecipeClean
- **Bundle ID**: com.recipeclean.app
- **Category**: Food & Drink
- **Content Rating**: 4+ (no age restrictions)
- **Privacy Policy**: Required (can use placeholder URL)

## EAS Build Commands

```bash
# Configure EAS
eas build:configure

# Build for iOS (Simulator)
eas build -p ios --profile development

# Build for iOS (App Store)
eas build -p ios --profile production

# Build for Android
eas build -p android --profile production
```

## Submission Checklist

- [ ] RevenueCat products created and active
- [ ] App Store Connect app created
- [ ] Screenshots captured (all required sizes)
- [ ] Privacy policy URL ready
- [ ] Test on physical device
- [ ] Build submitted via EAS or Xcode
- [ ] App Store review passed

## Troubleshooting

**Metro bundler issues**:
```bash
npx expo start --clear
```

**Cache issues**:
```bash
npx expo r -c
```

**iOS pod install**:
```bash
cd ios && pod install && cd ..
```

## Support

For issues, check:
- [Expo Docs](https://docs.expo.dev)
- [RevenueCat Docs](https://docs.revenuecat.com)
