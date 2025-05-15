import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { useAuth } from '@/context/authContext'; // Assuming useAuth is accessible
import * as Linking from "expo-linking";

export default function CallbackScreen() {

  const {code, state } = useLocalSearchParams();
  const SHOPIFY_REDIRECT_URL_BASE = Linking.createURL("callback");
  const { handleRedirect, clearAuthAttempt } = useAuth();

  useEffect(() => {
    const handleAuth = async () => {
      if(code){
        console.log("Code parameter found, reconstructing and handling redirect URL.");      
        const incomingUrl = `${SHOPIFY_REDIRECT_URL_BASE}?code=${code}${state ? `&state=${state}` : ''}`;
        console.log("Code parameter found, reconstructing and handling redirect URL.");      
       
        console.log("Reconstructed URL:", incomingUrl);
        console.log("now back to profile route and close modal and go to profile route");

        try {
          await handleRedirect(incomingUrl);
          console.log("Token exchange successful.");
          clearAuthAttempt(); // optional here
          router.replace("/profile"); // ✅ navigate away
        } catch (error) {
          console.error("Error during handleRedirect:", error);
          clearAuthAttempt();
          router.replace("/"); // or show error screen
        }
      }else{
        console.log("No code found, redirecting to home.");
        router.replace("/");
      }
    }
    
    handleAuth();
  }, [code, state]); // Dependency array

  // Render a loading state or nothing while processing
  return null;
}