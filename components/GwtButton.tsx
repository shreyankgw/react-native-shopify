import React from "react";
import { Text, View, TouchableOpacity } from "react-native";

export default function GwtButton({title, handlePress, containerStyles, textStyles, isLoading}: {title: string, handlePress?: () => void, containerStyles?: string, textStyles?: string, isLoading?: boolean}){
    return(
        <TouchableOpacity onPress={handlePress} activeOpacity={0.7} className={`bg-darkPrimary rounded-xl flex justify-center items-center min-h-[44px] ${containerStyles} ${isLoading ? "opacity-50" : ""}`} disabled={isLoading}>
         <Text className={`text-white font-mSemiBold text-lg ${textStyles}`}>{title}</Text>
        </TouchableOpacity>
    )
}