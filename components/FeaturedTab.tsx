import React from "react";
import { Text, View, TouchableOpacity, Dimensions } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const { width } = Dimensions.get('window');
export default function FeaturedTab({title, iconName,size, handlePress}: {title: string, iconName: any, size: number, handlePress?: () => void}){
   return(
     <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <View className="flex flex-row items-center justify-center border border-gray-200 bg-white rounded-lg py-2 px-4 gap-3" style={{ width: width / 2 - 20 }}>
         <Ionicons name={iconName} size={size} color="black" />
         <Text className="text-sm font-mSemiBold">{title}</Text>
        </View>
     </TouchableOpacity>
   )
}