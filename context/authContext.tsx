import React, { createContext, useContext, useCallback, useEffect, ReactNode, useState } from "react";
import * as Crypto from "expo-crypto";
import * as Linking from "expo-linking";
import { storeTokens, getTokens, clearTokens } from "@/lib/storage";
import { shopConfig } from "@/lib/shopifyClient";
import { Buffer } from "buffer";

export interface AuthContextType{
    isLoggedIn: boolean;
    login: () => Promise<void>;
    logout: () => void;
    getValidAccessToken: () => Promise<string | null>;
    isLoading: boolean;
    isRefreshing: boolean;
    authUrl: string | null;
    pkceState: { codeVerifier: string; state: string; } | null;
    handleRedirect: (url: string) => Promise<void>;
    clearAuthAttempt: () => void //to clear the auth url after webview closes
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const generateState = () => {
    const timeStamp = Date.now().toString();
    const randomString = Math.random().toString(36).substring(2);
    return timeStamp + randomString;
}

const encodeBase64 = async (bytes: any) => {
    return Buffer.from(await bytes).toString("base64");
}

// PKCE Helper Functions
const base64UrlEncode = (input: Uint8Array): string => {
    let str = '';
    input.forEach(byte => {
        str += String.fromCharCode(byte);
    });
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
};

const generateCodeVerifier = async () => {
    // Generate 32 bytes of random data
   const bytes = await Crypto.getRandomBytesAsync(32)
    // Base64url encode the random data
    return encodeBase64(bytes);
};

const generateCodeChallenge = async (verifier: string) => {
    const digestString = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, verifier);

    return Buffer.from(digestString, 'hex').toString("base64").replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [pkceState, setPkceState] = useState<{ codeVerifier: string; state: string } | null>(null);

  const loadTokens = useCallback(async () => {
    setIsLoading(true);
    try{
        const tokens = getTokens();
        if (tokens.accessToken && tokens.refreshToken && tokens.expiresAt) {
            setAccessToken(tokens.accessToken);
            setRefreshToken(tokens.refreshToken);
            setExpiresAt(tokens.expiresAt);
            setIdToken(tokens.idToken);
            console.log('Tokens loaded from storage.');
            // Optional: Validate token immediately or fetch user data
          } else {
              console.log('No tokens found in storage.');
          }
    }catch(error){
        console.error('Failed to load tokens', error);
        clearTokens();
    }finally{
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTokens();
  }, [loadTokens]);

  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
          const currentTokens = getTokens();
          if (!currentTokens.refreshToken) {
            console.error('No refresh token available.');
            logout(); // Force logout if refresh fails
            return null;
          }

          console.log('Attempting to refresh access token...');
          setIsLoading(true); // Indicate loading during refresh
          setIsRefreshing(true);

          try {
            const response = await fetch(shopConfig.TOKEN_ENDPOINT, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    grant_type: 'refresh_token',
                    client_id: shopConfig.CLIENT_ID,
                    refresh_token: currentTokens.refreshToken
                }).toString()
            });

            const data = await response.json();
            if (!response.ok) {
                console.error('Token refresh failed:', data);
                logout(); // Log out if refresh fails
                throw new Error(data.error_description || 'Failed to refresh token');
            }

            console.log('token refresh successful.', data);
            storeTokens(data.access_token, data.refresh_token, data.expires_in, data.id_token);
            setAccessToken(data.access_token);
            setRefreshToken(data.refresh_token);
            setIdToken(data.id_token);
            setExpiresAt(Date.now() + data.expires_in * 1000);
            return data.access_token;
          } catch(error){
            console.error('Error refreshing token:', error);
            logout(); // Ensure logout on error
            return null;
          } finally{
            setIsLoading(false);
            setIsRefreshing(false);
          }
  }, []);

  const getValidAccessToken = useCallback(async (): Promise<string | null> => {
    // Use state values first, but double-check expiry
    const currentExpiresAt = expiresAt; // Read from state
    const currentAccessToken = accessToken; // Read from state

    console.log('token expiry time', new Date(currentExpiresAt).toISOString());
    console.log('current time', new Date(Date.now()).toISOString());

    if (currentAccessToken && currentExpiresAt && Date.now() < currentExpiresAt - 60000) { // 60 seconds buffer
      console.log("Using existing valid access token.");
      return currentAccessToken;
    } else if (refreshToken) {
        console.log("Access token expired or missing, attempting refresh...");
      return await refreshAccessToken();
    } else {
        console.log("No valid access token or refresh token available.");
      return null;
    }
  }, [accessToken, refreshToken, expiresAt, refreshAccessToken]);

  const login = async (): Promise<void> => {
    try{
        setIsLoading(true);
        const state = generateState();
        const codeVerifier = await generateCodeVerifier();
        const codeChallenge = await generateCodeChallenge(codeVerifier);

        setPkceState({ codeVerifier, state });
        
        const params = new URLSearchParams({
            client_id: shopConfig.CLIENT_ID,
            scope: shopConfig.SCOPES,
            response_type: 'code',
            redirect_uri: shopConfig.REDIRECT_URI,
            state: state,
            code_challenge: codeChallenge,
            code_challenge_method: 'S256',
          });
    
          const url = `${shopConfig.AUTHORIZATION_ENDPOINT}?${params.toString()}`;
          console.log('Generated Auth URL:', url); // Log for debugging
          setAuthUrl(url);
    }catch(error){
      console.error("Failed to initiate login:", error);
      setIsLoading(false);
      setAuthUrl(null);
      setPkceState(null);
    }
  }

  const handleRedirect = async (url: string): Promise<void> => {
    console.log('Handling redirect URL:', url);
    if (!pkceState) {
        console.error("PKCE state is missing, cannot handle redirect.");
        clearAuthAttempt();
        return;
    }
    const { codeVerifier, state: originalState } = pkceState;

    const parsedUrl = Linking.parse(url);
    const code = parsedUrl.queryParams?.code as string | undefined;
    const returnedState = parsedUrl.queryParams?.state as string | undefined;
    const error = parsedUrl.queryParams?.error as string | undefined;

    
    if (error) {
        console.error('Authorization error:', error, parsedUrl.queryParams?.error_description);
        setIsLoading(false);
        // Show error message to user
        return;
    }

    if (!code || !returnedState) {
        console.error('Authorization code or state missing in redirect URL.');
        setIsLoading(false);
        return;
      }
  
      if (returnedState !== originalState) {
        console.error('State mismatch! Potential CSRF attack.');
        setIsLoading(false);
        return;
      }
  
      console.log('Authorization code received:', code);
      console.log('Exchanging code for tokens...');
      setIsLoading(true); // Indicate token exchange process

      try{
        const response = await fetch(shopConfig.TOKEN_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              grant_type: 'authorization_code',
              client_id: shopConfig.CLIENT_ID,
              redirect_uri: shopConfig.REDIRECT_URI,
              code: code,
              code_verifier: codeVerifier, // Send the verifier!
            }).toString(),
          });
    
          const data = await response.json();

          if (!response.ok) {
            console.error('Token exchange failed:', data);
            throw new Error(data.error_description || 'Failed to exchange code for token');
          }
    
          console.log('Token exchange successful:', data);
          storeTokens(data.access_token, data.refresh_token, data.expires_in, data.id_token);
          setAccessToken(data.access_token);
          setRefreshToken(data.refresh_token);
          setExpiresAt(Date.now() + data.expires_in * 1000);
          setIdToken(data.id_token);
          clearAuthAttempt();
      }catch(error){
        console.error('Error exchanging code for tokens:', error);
     
      clearTokens(); // Ensure clean state on failure
      setAccessToken(null);
      setRefreshToken(null);
      setExpiresAt(null);
      }finally{
        setIsLoading(false);
      }
  }

  const clearAuthAttempt = () => {
    setAuthUrl(null);
    setPkceState(null);
    // Keep isLoading true if token exchange is next, otherwise set false if user cancelled
  };

  const logout = async (): Promise<void> => {
    try{
      if(idToken){
        const logoutUrl = `https://shopify.com/authentication/${shopConfig.SHOP_ID}/logout?id_token_hint=${idToken}`;
        await fetch(logoutUrl);
      }
    }
    catch(error){
        console.error("Error during logout:", error);
    }finally{
        console.log('Logging out...');
        clearTokens();
        setAccessToken(null);
        setRefreshToken(null);
        setIdToken(null);
        setExpiresAt(null);
        setAuthUrl(null);
        setPkceState(null);
        setIsLoading(false); // Ensure loading is false after logout
      }
  }

  const isLoggedIn =
                        (!!accessToken && !!expiresAt && Date.now() < expiresAt)
                    ||   (isRefreshing)
                    ||  (!!refreshToken && !!expiresAt && Date.now() >= expiresAt);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        getValidAccessToken,
        isLoading,
        isRefreshing,
        authUrl,
        pkceState,
        handleRedirect,
        clearAuthAttempt,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};