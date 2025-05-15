import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView } from "react-native";
import { useAuth } from "@/context/authContext";
import { fetchCustomerProfile } from "@/lib/shopifyQueries";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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

export default function AccountEdit(){
   const { login, logout, isLoading, authUrl, clearAuthAttempt, getValidAccessToken, isLoggedIn } = useAuth();
   const [customer, setCustomer] = useState<Customer | null>(null);
   const [loadingCustomer, setLoadingCustomer] = useState(false);

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


   return(
     <SafeAreaView className="flex-1 items-center justify-center p-5 bg-white">
         {
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
            
         }
     </SafeAreaView>
   )
}