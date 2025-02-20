import { Text, View, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { buildAuthorizationUrl, requestAccessToken, generateCodeVerifier } from "@/lib/shopifyClient";
import { WebView }  from 'react-native-webview';

export default function Profile() {
  const [accessToken, setAccessToken] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [codeVerifier, setCodeVerifier] = useState<string | null>(null);

  useEffect(() => {
    async function initiateAuth() {
      try {
        const verifier = await generateCodeVerifier();
        const { url, codeverifier: generatedCodeVerifier } = await buildAuthorizationUrl(verifier);
        console.log(url, generatedCodeVerifier);
        setAuthUrl(url);
        setCodeVerifier(generatedCodeVerifier);
      } catch (error) {
        console.error('Error during authorization initiation:', error);
      }
    }

    initiateAuth();
  }, []);
  

  function handleNavigationStateChange(navState: any) {
    const { url } = navState;
    const configuredRedirectUri = 'shop.63263310018.app://callback'

    if(url?.startsWith(configuredRedirectUri)){
      const code = new URL(url).searchParams.get('code');

      if(code && codeVerifier){
        // use the code and cancel the navigation since we have handled the callback
       requestAccessToken(code, codeVerifier).then((tokenResponse) => {
        console.log(tokenResponse);
        setAccessToken(tokenResponse.access_token);
       }).catch(console.error);

        return false;
      }
    }
    return true;
  }

  if(!accessToken && authUrl){
    return (
      <WebView 
        source={{ uri: authUrl }}
        className="flex-1 bg-white px-4"
        onNavigationStateChange={handleNavigationStateChange}
      />
    )
  } 

  return (
    <View
      className="flex-1 bg-white px-4"
    >
      {authUrl && <Text>{authUrl}</Text>}
       <ScrollView>
         <Text>No access token found. Redirecting to login ....</Text>
       </ScrollView>
    </View>
  );
}