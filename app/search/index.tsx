import React, {useState, useCallback, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Animated, ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { predictiveSearch } from "@/lib/shopifyQueries";
import debounce from "lodash.debounce";
import SearchResultSection from "@/components/SearchResultSection";

interface SearchResult{
    products?: any[];
    collections?: any[];
    pages?: any[];
}

export default function Search() {
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState<SearchResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const fetchSearchResults = useCallback(async (query: string) => {
        if(!query){
            setResults(null);
            return;
        }
       setLoading(true);
       setError(null);

       try{
        const data = await predictiveSearch(query, "US", "EN");

        setResults(data);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true
        }).start()
       }catch(error){
        setError("Error fetching search results");
        console.error(error);
       }finally{
        setLoading(false);
       }

    }, []);

    const debouncedSearch = useCallback(debounce((query: string) => fetchSearchResults(query), 300), []);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        debouncedSearch(query);
    }


    return (
        <SafeAreaView className="bg-white h-full">
            <View className="flex-1">
                    <View className="flex flex-row items-center justify-between p-4 border-b-2 border-gray-200 w-full gap-4">
                        <TouchableOpacity className="text-3xl font-mBold" onPress={() => router.back()}><Ionicons name="arrow-back-outline" size={24} color="black" /></TouchableOpacity>
                        <View className="flex-1">
                            <View className="flex-row items-center justify-between bg-gray-50 rounded-lg border border-brandText px-4 py-2">
                                <TextInput
                                    className="text-base text-brandText flex-1"
                                    placeholder="Search products..."
                                    placeholderTextColor="#24272a"
                                    accessibilityLabel="Search"
                                    value={searchQuery}
                                    onChangeText={handleSearch}
                                    autoFocus
                                />
                                {loading ? ( <ActivityIndicator size="small" color="#24272a" /> ) : ( <Ionicons name="search-outline" size={20} color="#24272a" className="mr-2" /> ) }
                            </View>
                        </View>
                        <TouchableOpacity className="text-3xl font-mBold" onPress={() => router.push("/(tabs)/cart")}>
                            <Ionicons name="bag-outline" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <Animated.ScrollView className="bg-white" style={{ opacity: fadeAnim }}>
                        {error && <Text className="text-red-500 text-center">{error}</Text>}

                        {!loading && !error && results && (
                            <>
                              <SearchResultSection title="Products" items={results.products} type="product" />
                              <SearchResultSection title="Collections" items={results.collections} type="collection" />
                              <SearchResultSection title="Pages" items={results.pages} type="page" />
                            </>
                        )}

                        {!loading && !error && searchQuery && !results && (
                            <Text className="px-4 py-2 text-gray-500">No results for "{searchQuery}"</Text>
                        )}
                    </Animated.ScrollView>
                
            </View>
        </SafeAreaView>
    );
}