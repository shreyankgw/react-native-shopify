import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { buildAuthorizationUrl, requestAccessToken, generateCodeVerifier } from "@/lib/shopifyClient";
import { WebView }  from 'react-native-webview';
import { fetchCustomerProfile } from "@/lib/shopifyQueries";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

interface Customer{
  firstName: string;
  lastName: string;
  emailAddress: {
    emailAddress: string;
  };
  defaultAddress: {
    address1: string;
    address2: string;
    city: string;
    company: string;
    country: string;
    name: string;
    phoneNumber: string;
    province: string;
    zoneCode: string;
    zip: string;
  };
}

export default function Profile() {
  const [accessToken, setAccessToken] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
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
      <SafeAreaView className="flex-1 bg-white px-4">
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
      </SafeAreaView>
    )
  } else if(accessToken){
    // display customer details and allow them to edit their details and view their order history

    return(
      <SafeAreaView className="bg-white h-full">
      <ScrollView
       className="h-full bg-white"
      >
      <View className="flex flex-row items-center justify-between p-4 border-b-2 border-gray-200 w-full">
               <TouchableOpacity className="text-3xl font-mBold" onPress={() => router.back()}><Ionicons name="arrow-back-outline" size={24} color="black" /></TouchableOpacity>
               <Text className="text-xl font-mBold uppercase">{customer ? "Account" : "Login/Signup" }</Text>
               <TouchableOpacity className="text-3xl font-mBold" onPress={() => console.log("help faq route for general enquiries")}><Ionicons name="information-circle-outline" size={24} color="black" /></TouchableOpacity>
      </View>
      <View className="flex flex-row items-center justify-between p-4">
       <Text className="text-2xl font-mBold">Hi, {customer && customer.firstName ? customer.firstName : customer?.emailAddress?.emailAddress} !</Text>
      </View>

      <View className="px-4">
         <TouchableOpacity className="flex flex-row items-center justify-between p-4 border-b-2 border-gray-200 w-full" onPress={() => router.push("/account/edit")}>
          <Text className="text-lg font-mSemiBold">Edit Profile</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="black" />
         </TouchableOpacity>
         <TouchableOpacity className="flex flex-row items-center justify-between p-4 border-b-2 border-gray-200 w-full" onPress={() => router.push("/account/orders")}>
          <Text className="text-lg font-mSemiBold">Order History</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="black" />
         </TouchableOpacity>
      </View>

      <View className="px-4 mt-12">
         {/* recently viewed products */}
         <Text className="text-xl font-mBold mt-4">Recently Viewed</Text>
         {/* render product grid of recently viewed products that are stored in mmkv local storage */ }
      </View>

      <View className="px-4 mt-12 flex flex-row items-center justify-between">
         <TouchableOpacity className="flex flex-row items-center justify-center gap-1 bg-darkPrimary px-4 py-2 rounded-lg" onPress={() => console.log("logout customer mutation")}>
          <Ionicons name="log-out-outline" size={24} color="white" />
          <Text className="text-lg font-mSemiBold text-white">Logout</Text>
         </TouchableOpacity>

         <TouchableOpacity className="flex flex-row items-center justify-center gap-1 bg-red-500 px-4 py-2 rounded-lg" onPress={() => router.push("/support")}>
         <MaterialIcons name="delete" size={24} color="white" />
          <Text className="text-lg font-mSemiBold text-white">Delete Account</Text>
         </TouchableOpacity>
      </View>
      {/* Add more profile details here */}
      </ScrollView>
      </SafeAreaView>  
    )
  }else if (isLoading) {
    return (
      <SafeAreaView>
       <View className="flex-1 bg-white px-4 justify-center items-center">
        <Text>Processing authentication...</Text>
      </View>
      </SafeAreaView>
    
    );
  }
  else{
    return (
      <SafeAreaView>
      <View
        className="flex-1 bg-white px-4"
      >
           <Text>No profile found. Redirecting to login ....</Text> 
      </View>
      </SafeAreaView>
    );
  }

 
}