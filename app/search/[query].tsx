import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function Product(){
    const { query } = useLocalSearchParams();
   return(
    <View>
        <Text>Search Query: {query}</Text>
    </View>
   );
}