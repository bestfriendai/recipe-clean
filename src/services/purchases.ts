// RevenueCat Service Stub
// To enable: Install RevenueCat SDK and configure API keys

import AsyncStorage from '@react-native-async-storage/async-storage';

const PREMIUM_KEY = '@premium_status';

export interface PurchasePackage {
  identifier: string;
  productId: string;
  priceString: string;
  price: number;
  currency: string;
}

export async function getPremiumStatus(): Promise<boolean> {
  try {
    const status = await AsyncStorage.getItem(PREMIUM_KEY);
    return status === 'premium';
  } catch (e) {
    console.error('Failed to get premium status', e);
    return false;
  }
}

export async function setPremiumStatus(isPremium: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(PREMIUM_KEY, isPremium ? 'premium' : 'free');
  } catch (e) {
    console.error('Failed to set premium status', e);
  }
}

export async function purchasePackage(
  packageType: 'monthly' | 'annual'
): Promise<boolean> {
  // Stub: Replace with RevenueCat implementation
  // import { Purchases } from '@react-native-purchases/purchases';
  // 
  // try {
  //   const { productIdentifier } = packageType === 'annual' 
  //     ? { productIdentifier: 'com.recipeclean.annual' }
  //     : { productIdentifier: 'com.recipeclean.monthly' };
  //   
  //   const { product } = await Purchases.getProducts([productIdentifier]);
  //   await Purchases.purchaseProduct(product[0].identifier);
  //   await setPremiumStatus(true);
  //   return true;
  // } catch (e) {
  //   console.error('Purchase failed', e);
  //   return false;
  // }
  
  // For now, just set premium for demo
  await setPremiumStatus(true);
  return true;
}

export async function restorePurchases(): Promise<boolean> {
  // Stub: Replace with RevenueCat implementation
  // import { Purchases } from '@react-native-purchases/purchases';
  //
  // try {
  //   const result = await Purchases.restoreTransactions();
  //   if (result.customerInfo.entitlements.active['premium']) {
  //     await setPremiumStatus(true);
  //     return true;
  //   }
  // } catch (e) {
  //   console.error('Restore failed', e);
  // }
  
  return false;
}
