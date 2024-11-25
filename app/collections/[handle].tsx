import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function Collection(){
    const {handle} = useLocalSearchParams();
   return(
    <View>
        <Text>Collection {handle}</Text>
    </View>
   );
}