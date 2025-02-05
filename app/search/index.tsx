import React, {useState, useCallback, useRef, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Animated, ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { predictiveSearch } from "@/lib/shopifyQueries";
import debounce from "lodash.debounce";
import SearchResultSection from "@/components/SearchResultSection";
import * as Haptics from 'expo-haptics';
import { FlatList } from "react-native-gesture-handler";

interface SearchResult{
    products?: any[];
    collections?: any[];
    pages?: any[];
}

const TRENDING_SEARCHES = ["Lawn Mowers", "Chainsaws", "Snow Blowers", "Mini Bikes", "Batteries"];

const POPULAR_CATEGORIES = [
    { id: '1', name: 'Lawn Mowers', icon: 'shirt-outline', count: 234 },
    { id: '2', name: 'Chainsaws', icon: 'footsteps-outline', count: 189 },
    { id: '3', name: 'Hedge Trimmers', icon: 'watch-outline', count: 156 },
    { id: '4', name: 'Pressure Washers', icon: 'sparkles-outline', count: 302 },
    { id: '5', name: 'Vacuums', icon: 'home-outline', count: 278 },
    { id: '6', name: 'Batteries & Chargers', icon: 'phone-portrait-outline', count: 415 },
];

export default function Search() {
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState<SearchResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if(!searchQuery){
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            }).start()
        }
    }, []);

    const renderCategoryItem = ({item} : {item: any}) => (
        <TouchableOpacity className="flex-1 m-2 p-4 bg-white rounded-lg border border-gray-100 items-center" onPress={() => router.push(`/search/${item.name}`)}>
            <Ionicons name={item.icon} sise={24} color="#24272a" />
            <Text className="text-base font-mSemiBold mt-2">{item.name}</Text>
            <Text className="text-sm text-gray-500">{item.count}+ results</Text>
        </TouchableOpacity>
    );

    const renderTrendingSearch =(item: string) => (
        <TouchableOpacity
        className="px-4 py-2 mr-3 bg-gray-100 rounded-full"
        key={item}
        onPress={() => {
            setSearchQuery(item);
            fetchSearchResults(item);
        }}
    >
        <Text className="text-brandText">{item}</Text>
    </TouchableOpacity>
    )

    const fetchSearchResults = useCallback(async (query: string) => {
        if(!query){
            setResults(null);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            }).start()
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

    const handleSearchSubmit = useCallback(() => {
       const trimmedQuery = searchQuery.trim();
       if(trimmedQuery){
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        debouncedSearch.cancel();
        setSearchQuery(''); // Clear the search query after submit
        setResults(null);
        router.push(`/search/${encodeURIComponent(trimmedQuery)}`);
       }
    }, [searchQuery]);

    const handleSearchIconPress = () => {
        handleSearchSubmit();
    }


    return (
        <SafeAreaView className="bg-white h-full">
            <View className="flex-1">
                    <View className="flex flex-row items-center justify-between px-4 py-6 border-b-2 border-gray-200 w-full gap-4 bg-brandText">
                        <TouchableOpacity className="text-3xl font-mBold" onPress={() => router.back()}><Ionicons name="arrow-back-outline" size={24} color="#fff" /></TouchableOpacity>
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
                                    onSubmitEditing={handleSearchSubmit}
                                    returnKeyType="search"
                                />
                                {loading ? ( <ActivityIndicator size="small" color="#24272a" /> ) : ( <TouchableOpacity onPress={handleSearchIconPress} disabled={!searchQuery.trim()} accessibilityLabel="Search" accessibilityRole="button"><Ionicons name="search-outline" size={20} color={searchQuery.trim() ? "#24272a" : "#ccc"}  className="mr-2" accessible accessibilityHint="Press to search" /></TouchableOpacity> ) }
                            </View>
                        </View>
                        
                    </View>
                    <Animated.ScrollView className="bg-white pt-4" style={{ opacity: fadeAnim }}>
                        {error && <Text className="text-red-500 text-center">{error}</Text>}

                        {!loading && !error && results ? (
                            <>
                              <SearchResultSection title="Products" items={results.products} type="product" />
                              <SearchResultSection title="Collections" items={results.collections} type="collection" />
                              <SearchResultSection title="Pages" items={results.pages} type="page" />
                            </>
                        ) : (
                            <View className="px-4">
                                {!searchQuery && (
                                    <>
                                      <Text className="text-lg font-mBold px-4 mb-2">Trending Searches</Text>
                                      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                                        {TRENDING_SEARCHES.map(renderTrendingSearch)}
                                      </ScrollView>
                                    </>
                                )}
                                {!searchQuery && (
                                    <>
                                      <Text className="text-lg font-mBold px-4 mb-2">Popular Categories</Text>

                                      <FlatList data={POPULAR_CATEGORIES} 
                                                renderItem={renderCategoryItem} 
                                                keyExtractor={(item) => item.id} 
                                                numColumns={2}
                                                scrollEnabled={false}
                                                contentContainerStyle={{ paddingBottom: 16 }} 
                                       />
                                    </>
                                )}
                            </View>
                        )}

                        {searchQuery && !results && (
                            <Text className="px-4 py-2 text-gray-500">No results for "{searchQuery}"</Text>
                        )}
                    </Animated.ScrollView>
                
            </View>
        </SafeAreaView>
    );
}