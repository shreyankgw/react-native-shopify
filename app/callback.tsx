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
         
        const incomingUrl = `${SHOPIFY_REDIRECT_URL_BASE}?code=${code}${state ? `&state=${state}` : ''}`;

        try {
          await handleRedirect(incomingUrl);
  
          clearAuthAttempt(); 
          router.replace("/profile"); 
        } catch (error) {
          console.error("Error during handleRedirect:", error);
          clearAuthAttempt();
          router.replace("/");
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