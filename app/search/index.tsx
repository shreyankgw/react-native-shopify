import React from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

export default function Search(){
    
   return(
    <SafeAreaView className="bg-white h-full">
    <View>
       <ScrollView className="bg-white h-full"> 
    <View className="flex flex-row items-center justify-between p-4 border-b-2 border-gray-200 w-full">
        <TouchableOpacity className="text-3xl font-mBold" onPress={() => router.back()}><Ionicons name="arrow-back-outline" size={24} color="black" /></TouchableOpacity>
        <Text className="text-xl font-mBold uppercase">Search Box</Text>
        <TouchableOpacity className="text-3xl font-mBold" onPress={() => router.push("/(tabs)/cart")}><Ionicons name="bag-outline" size={24} color="black" /></TouchableOpacity>
    </View>
    <View>
        <View className="w-full">
            <Text>Search Options</Text>
        </View>
    </View>
    </ScrollView>
    </View>
    </SafeAreaView>
   );
}