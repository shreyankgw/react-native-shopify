import { Text, View, ScrollView, TouchableOpacity, Modal, ActivityIndicator, SafeAreaView, Alert, Switch } from "react-native";
import React, { useState, useEffect } from "react";
import { WebView }  from 'react-native-webview';
import { useAuth } from "@/context/authContext";
import * as Linking from "expo-linking";
import { fetchCustomerProfile } from "@/lib/shopifyQueries";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const SHOPIFY_REDIRECT_URL = Linking.createURL("callback");

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
  const { login, logout, isLoading, authUrl, clearAuthAttempt, getValidAccessToken, isLoggedIn } = useAuth();
  const [showWebView, setShowWebView] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const [notificationPrefs, setNotificationPrefs] = useState({
        orderUpdates: true,
        promotions: false,
        restockAlerts: false,
  });

  const toggleNotificationPref = (key: keyof typeof notificationPrefs) => {
      setNotificationPrefs(prev => ({
        ...prev,
        [key]: !prev[key],
      }));
  };

  useEffect(() => {
    if (authUrl) {
      console.log("Auth URL ready, showing WebView.");
      setShowWebView(true);
    } else if (showWebView) {
      console.log("Auth complete or cancelled, hiding WebView.");
      setShowWebView(false);
    }
  }, [authUrl, showWebView]);

  // Load token and log it if available
  useEffect(() => {
    if (isLoggedIn && !customer) {
      const fetchCustomer = async () => {
        try {
          setLoadingCustomer(true);
          const token = await getValidAccessToken();
          console.log("Access token:", token);
          if (token) {
            const profile = await fetchCustomerProfile(token);
            console.log("Customer profile fetched:", profile);
            setCustomer(profile);
          }
        } catch (err) {
          console.error("Failed to fetch customer profile:", err);
        } finally {
          setLoadingCustomer(false);
        }
      };
      fetchCustomer();
    }
  }, [isLoggedIn]);

  const handleNavigationChange = async (navState: any) => {
    const { url } = navState;
    console.log('WebView Nav State Change:', url);
  }

  const handleCloseWebView = () => {
    console.log("WebView Modal closed manually.");
    setShowWebView(false);
    clearAuthAttempt(); // Clear auth state if user closes manually
}

  return (
   <SafeAreaView className="flex-1 items-center justify-center p-5 bg-white">
     {isLoggedIn ? (
        loadingCustomer ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" />
            <Text className="mt-4 text-gray-600">Loading your profile...</Text>
          </View>
        ) : (
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

          <View className="px-4 mt-12">
             {/* recently viewed products */}
             <Text className="text-xl font-mBold mt-4">Notification Preferences</Text>
             <Text className="text-base font-mRegular my-2">Please update your notification prefrences as per your preference.</Text>
             {/* Necessary notification preferences to allow the push notifications to the device */ }
             <View className="flex flex-col gap-4">
              <View className="flex flex-row items-center justify-between py-3">
                  <Text className="text-base font-mSemiBold">Order Updates</Text>
                    <Switch
                      value={notificationPrefs.orderUpdates}
                      onValueChange={() => toggleNotificationPref('orderUpdates')}
                      trackColor={{ false: "rgba(36, 39, 42, 0.6)", true: "rgb(36, 39, 42)" }}
                      thumbColor={notificationPrefs.orderUpdates ? "#f4f4f4" : "#f4f4f4"}
                    />
              </View>

              <View className="flex flex-row items-center justify-between py-3">
                <Text className="text-base font-mSemiBold">Deal / Promotions Alerts</Text>
                <Switch
                    value={notificationPrefs.promotions}
                    onValueChange={() => toggleNotificationPref('promotions')}
                    trackColor={{ false: "rgba(36, 39, 42, 0.6)", true: "rgb(36, 39, 42)" }}
                    thumbColor={notificationPrefs.promotions ? "#f4f4f4" : "#f4f4f4"}
                />
              </View>
              <View className="flex flex-row items-center justify-between py-3">
                <Text className="text-base font-mSemiBold">Shipping / Tracking Alerts</Text>
                <Switch
                  value={notificationPrefs.restockAlerts}
                  onValueChange={() => toggleNotificationPref('restockAlerts')}
                  trackColor={{ false: "rgba(36, 39, 42, 0.6)", true: "rgb(36, 39, 42)" }}
                  thumbColor={notificationPrefs.restockAlerts ? "#f4f4f4" : "#f4f4f4"}
                />
              </View>
             </View>
          </View>
    
          <View className="px-4 mt-12 flex flex-row items-center justify-between">
             <TouchableOpacity className="flex flex-row items-center justify-center gap-1 bg-darkPrimary px-4 py-2 rounded-lg" onPress={logout}>
              <Ionicons name="log-out-outline" size={24} color="white" />
              <Text className="text-lg font-mSemiBold text-white">Logout</Text>
             </TouchableOpacity>
          </View>
          {/* Add more profile details here */}
          </ScrollView>
          </SafeAreaView>  
        )
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-2xl font-bold text-gray-800 mb-8">Welcome, Guest!</Text>
          <TouchableOpacity
            onPress={login}
            disabled={isLoading || showWebView}
            className={`py-3 px-8 rounded-lg bg-darkPrimary ${isLoading || showWebView ? 'opacity-50' : ''}`}
          >
            {isLoading && !showWebView ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text className="text-white font-semibold text-lg">Login / Signup</Text>
            )}
          </TouchableOpacity>
        </View>
      )}


      <Modal
        visible={showWebView}
        onRequestClose={handleCloseWebView} // For Android back button
        animationType="slide"
      >
        <SafeAreaView className="flex-1 bg-white">
          {/* Optional Header for WebView Modal */}
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
             <Text className="text-lg font-semibold">Login/Signup</Text>
             <TouchableOpacity onPress={handleCloseWebView} className="p-2">
                 <Text className="text-blue-600 text-lg">Cancel</Text>
             </TouchableOpacity>
          </View>

          {authUrl ? (
             <WebView
                source={{ uri: authUrl }}
                onNavigationStateChange={handleNavigationChange}
                incognito // Clears cache/cookies for fresh login
                className="flex-1"
                startInLoadingState={true}
                renderLoading={() => (
                    <ActivityIndicator size="large" className="absolute inset-0" />
                )}
                onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn('WebView error: ', nativeEvent);
                    Alert.alert("Error", "Could not load Shopify login page. Please check your connection.");
                    handleCloseWebView(); // Close on error
                  }}
             />
          ) : (
            // Should ideally not be shown if logic is correct, but as fallback
            <View className="flex-1 justify-center items-center">
               <ActivityIndicator size="large" />
               <Text className="mt-4 text-gray-600">Preparing Login...</Text>
            </View>
          )}

        </SafeAreaView>
      </Modal>
   </SafeAreaView>
  )
}