import { Text, View, ScrollView } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { buildAuthorizationUrl, requestAccessToken, generateCodeVerifier } from "@/lib/shopifyClient";
import { WebView }  from 'react-native-webview';
import { fetchCustomerProfile } from "@/lib/shopifyQueries";

export default function Profile() {
  const [accessToken, setAccessToken] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [codeVerifier, setCodeVerifier] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const webViewRef = useRef<WebView>(null);

  useEffect(() => {

    if(!accessToken){
      async function initiateAuth() {
        try {
          const verifier = await generateCodeVerifier();
          const { url, codeverifier: generatedCodeVerifier } = await buildAuthorizationUrl(verifier);
          console.log('initial access token', accessToken);
          setAuthUrl(url);
          setCodeVerifier(generatedCodeVerifier);
        } catch (error) {
          console.error('Error during authorization initiation:', error);
        }
      }
  
      initiateAuth();
    }else{
      
      async function fetchCustomer() {
        console.log('fetch customer profile');
        try{
          const customerData = await fetchCustomerProfile(accessToken);
          setCustomer(customerData);
        }catch(error){
          console.error('Error fetching customer profile:', error);
        }
      }

      fetchCustomer();
    }
    
  }, [accessToken]);


  const handleLoadEnd = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    const { url } = nativeEvent;
    const configuredRedirectUri = 'shop.63263310018.app://callback';

    console.log('WebView Load Ended:', nativeEvent);

    // Check if the load ended with the callback URL
    if (url && url.startsWith(configuredRedirectUri)) {
      console.log('Callback URL Detected in LoadEnd:', url);
      const code = new URL(url).searchParams.get('code');
      console.log('Extracted Code from LoadEnd:', code);

      if (code && codeVerifier) {
        // Stop WebView navigation to prevent further errors
        if (webViewRef.current) {
          webViewRef.current.stopLoading();
          console.log('Stopped WebView Loading from LoadEnd');
        }

        // Request access token using the code from LoadEnd
        requestAccessToken(code, codeVerifier)
          .then((tokenResponse) => {
            console.log('Token Response from LoadEnd:', tokenResponse);
            setAccessToken(tokenResponse?.access_token);
            setIdToken(tokenResponse?.id_token);
            setRefreshToken(tokenResponse?.refresh_token);
            // Further processing: store token, navigate, etc.
            console.log('Further Processing: Access Token Set -', tokenResponse?.access_token);
            setIsLoading(false);
            // Example: If using React Navigation, navigate to profile screen
            // navigation.navigate('ProfileScreen', { token: accessToken });
          })
          .catch((error) => {
            console.error('Token Request Error from LoadEnd:', error)
            setIsLoading(false);
          });
      }
    }
  };

  if(!accessToken && authUrl && !isLoading){
    return (
      <WebView 
        ref={webViewRef}
        source={{ uri: authUrl }}
        className="flex-1 bg-white px-4"
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.log('WebView Error:', nativeEvent);
        }}
        onLoadEnd={handleLoadEnd}
        onLoad={(syntheticEvent) => {
          console.log('WebView Load:', syntheticEvent.nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          console.log('WebView HTTP Error:', syntheticEvent.nativeEvent);
        }}
      />
    )
  } else if(accessToken){
    // fetch customer details from the API

    return(
      <View
      className="flex-1 bg-white px-4"
    >
      <Text>Welcome, {customer?.firstName}! Your access token is {accessToken}.</Text>
      <Text>Your Email is : {customer?.emailAddress?.emailAddress}</Text>
      {customer?.orders?.edges?.map((order) => (
        <View key={order.node.id}>
          <Text>Order ID: {order.node.name}</Text>
        </View>
      ))}
      {/* Add more profile details here */}
    </View>
    )
  }else if (isLoading) {
    return (
      <View className="flex-1 bg-white px-4 justify-center items-center">
        <Text>Processing authentication...</Text>
      </View>
    );
  }
  else{
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

 
}