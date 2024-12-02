import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

export default function Collection(){
    const {handle} = useLocalSearchParams();
   return(
    <ScrollView className="bg-white h-full"> 
    <View className="flex flex-row items-center p-4 border-b-2 border-gray-200">
        <TouchableOpacity className="text-3xl font-mBold" onPress={() => router.back()}><Ionicons name="arrow-back-outline" size={24} color="black" /></TouchableOpacity>
        <Text>Collection {handle}</Text>
    </View>
    </ScrollView>
   );
}