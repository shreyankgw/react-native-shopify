import * as SecureStore from 'expo-secure-store';
import { MMKV } from "react-native-mmkv";
import extractProductId from '@/utilities/extractProductId';

export const storage = new MMKV();

const RECENTLY_VIEWED_KEY = "recently_viewed_products";
const MAX_PRODUCTS = 10;

// Add a product ID (move to front, max 10, no duplicates)
export function addRecentlyViewedProduct(gid) {
  const id = extractProductId(gid);
  let current = getRecentlyViewedProducts();
  // Remove if already in list
  current = current.filter(pid => pid !== id);
  
  current.unshift(id);
  
  if (current.length > MAX_PRODUCTS) current = current.slice(0, MAX_PRODUCTS);
  storage.set(RECENTLY_VIEWED_KEY, JSON.stringify(current));
}

// Get IDs as array for recently viewed products
export function getRecentlyViewedProducts() {
  const stored = storage.getString(RECENTLY_VIEWED_KEY);
  try {
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}



const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const EXPIRES_AT_KEY = 'expires_at';
const ID_TOKEN_KEY = 'id_token';

// Store tokens securely
export const storeTokens = async (accessToken, refreshToken, expiresIn, id_token) => {
  try {
    if (typeof accessToken !== "string" || typeof refreshToken !== "string" || typeof expiresIn !== "number") {
      throw new Error("Invalid types for tokens!");
    }
    const expiresAt = Date.now() + expiresIn * 1000;
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    await SecureStore.setItemAsync(EXPIRES_AT_KEY, expiresAt.toString());
    await SecureStore.setItemAsync(ID_TOKEN_KEY, typeof id_token === "string" ? id_token : "");
    console.log('✅ Tokens stored securely');
  } catch (error) {
    console.error('❌ Error storing tokens:', error);
    throw new Error("Failed to set!");
  }
}

// Get tokens securely
export const getTokens = async () => {
  try {
    const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    const expiresAtString = await SecureStore.getItemAsync(EXPIRES_AT_KEY);
    const expiresAt = expiresAtString ? parseInt(expiresAtString, 10) : null;
    const idToken = await SecureStore.getItemAsync(ID_TOKEN_KEY);
    return { accessToken, refreshToken, expiresAt, idToken };
  } catch (error) {
    console.error("❌ Error reading tokens:", error);
    return { accessToken: null, refreshToken: null, expiresAt: null, idToken: null };
  }
}

// Clear tokens securely
export const clearTokens = async () => {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(EXPIRES_AT_KEY);
  await SecureStore.deleteItemAsync(ID_TOKEN_KEY);
  console.log('Tokens deleted successfully');
}
