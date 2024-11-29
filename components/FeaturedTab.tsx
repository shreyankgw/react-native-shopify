import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function FeaturedTab({title, iconName, handlePress}: {title: string, iconName: any, handlePress?: () => void}){
   return(
     <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <View className="flex-1 items-center justify-center rounded-md bg-white border border-gray-200 p-2 gap-2">
         <Ionicons name={iconName} size={14} color="black" />
         <Text className="text-sm font-mSemiBold">{title}</Text>
        </View>
     </TouchableOpacity>
   )
}