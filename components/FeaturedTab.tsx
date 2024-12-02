import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function FeaturedTab({title, iconName,size, handlePress}: {title: string, iconName: any, size: number, handlePress?: () => void}){
   return(
     <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <View className="flex flex-row items-center justify-center border border-gray-200 bg-white rounded-lg py-2 px-4 gap-3">
         <Ionicons name={iconName} size={size} color="black" />
         <Text className="text-sm font-mSemiBold">{title}</Text>
        </View>
     </TouchableOpacity>
   )
}