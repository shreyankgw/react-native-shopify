import React, { useLayoutEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { storage } from '@/lib/storage';

export default function WelcomeScreen() {
  const router = useRouter();
  
  return (   
    <View className="flex-1 bg-white px-4 justify-between">
      {/* Header Section */}
      <View className="flex items-center pt-8">
        <Image source={require("@/assets/images/gw_green.png")} resizeMode="contain" className="w-[300px] h-[80px]" />
      </View>

      {/* Features Section */}
      <View className="flex flex-col gap-8">
        {/* Shop Feature */}
        <View className="flex-row items-center">
          <View className="w-12 h-12 bg-green-50 rounded-full items-center justify-center">
            <Ionicons name="cart-outline" size={24} color="#046a38" />
          </View>
          <View className="ml-4 flex-1">
            <Text className="font-mSemiBold text-lg text-darkPrimary">
              Shop Products
            </Text>
            <Text className="font-mRegular text-gray-600">
              Browse and shop from our curated collection of products
            </Text>
          </View>
        </View>

        {/* Orders Feature */}
        <View className="flex-row items-center">
          <View className="w-12 h-12 bg-green-50 rounded-full items-center justify-center">
            <Ionicons name="receipt-outline" size={24} color="#046a38" />
          </View>
          <View className="ml-4 flex-1">
            <Text className="font-mSemiBold text-lg text-darkPrimary">
              Track Orders
            </Text>
            <Text className="font-mRegular text-gray-600">
              Monitor your orders and delivery status in real-time
            </Text>
          </View>
        </View>

        {/* Profile Feature */}
        <View className="flex-row items-center">
          <View className="w-12 h-12 bg-green-50 rounded-full items-center justify-center">
            <Ionicons name="chatbox-outline" size={24} color="#046a38" />
          </View>
          <View className="ml-4 flex-1">
            <Text className="font-mSemiBold text-lg text-darkPrimary">
              Chat with support
            </Text>
            <Text className="font-mRegular text-gray-600">
              Chat with our friendly customer support team for any queries
            </Text>
          </View>
        </View>
      </View>

      {/* Footer Section */}
      <View className="pb-8 flex flex-col gap-2">
        <Ionicons name="people-sharp" size={24} color="#046a38" className='mx-auto'/>
        <Text className="text-center text-gray-500 font-mLight text-sm">
          By continuing, you agree to our <Link href="/terms" className='text-darkPrimary'>Terms of Service</Link> and <Link href="/policy" className='text-darkPrimary'>Privacy Policy</Link>.
        </Text>
        <TouchableOpacity
          className="bg-darkPrimary py-4 rounded-xl"
          onPress={() => {
            storage.set("onboarding", true);
            router.replace("/(tabs)");
          }}
        >
          <Text className="text-center text-white font-mSemiBold text-lg">
            Continue
          </Text>
        </TouchableOpacity>     
      </View>
    </View>
  );
}