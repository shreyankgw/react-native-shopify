import React,  { useCallback, useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

export default function Product(){
    const { query } = useLocalSearchParams();
    const [items, setItems] = useState([]);
    const [pageInfo, setPageInfo] = useState({hasNextPage: false});
   return(
    <View>
        <Text>Search Query: {query}</Text>
    </View>
   );
}