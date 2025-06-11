import { MMKV } from "react-native-mmkv";

export const storage = new MMKV();

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const EXPIRES_AT_KEY = 'expires_at';
const ID_TOKEN_KEY = 'id_token';


export const storeTokens = async (accessToken, refreshToken, expiresIn, id_token) => {
    try {

        if (typeof accessToken !== "string" || typeof refreshToken !== "string" || typeof expiresIn !== "number") {
           throw new Error("Invalid types for tokens!");
        }

        const expiresAt = Date.now() + expiresIn * 1000;
        storage.set(ACCESS_TOKEN_KEY, accessToken);
        storage.set(REFRESH_TOKEN_KEY, refreshToken);
        storage.set(EXPIRES_AT_KEY, expiresAt.toString());
        storage.set(ID_TOKEN_KEY, typeof id_token === "string" ? id_token : "");
        console.log('✅ Tokens stored successfully');
      } catch (error) {
        console.error('❌ Error storing tokens:', error);
        throw new Error("Failed to set!");
    }
}

export const getTokens = () => {
    try {
        const accessToken = storage.getString(ACCESS_TOKEN_KEY) ?? null;
        const refreshToken = storage.getString(REFRESH_TOKEN_KEY) ?? null;
        const expiresAtString = storage.getString(EXPIRES_AT_KEY);
        const expiresAt = expiresAtString ? parseInt(expiresAtString, 10) : null;
        const idToken = storage.getString(ID_TOKEN_KEY) ?? null;
        return { accessToken, refreshToken, expiresAt, idToken };
      } catch (error) {
        console.error("❌ Error reading tokens:", error);
        return { accessToken: null, refreshToken: null, expiresAt: null };
      }
}

export const clearTokens = () => {
    storage.delete(ACCESS_TOKEN_KEY);
    storage.delete(REFRESH_TOKEN_KEY);
    storage.delete(EXPIRES_AT_KEY);
    storage.delete(ID_TOKEN_KEY);
    console.log('Tokens deleted successfully');
}