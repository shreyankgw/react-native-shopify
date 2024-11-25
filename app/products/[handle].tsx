import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function Product(){
    const { handle } = useLocalSearchParams();
   return(
    <View>
        <Text>Product {handle}</Text>
    </View>
   );
}