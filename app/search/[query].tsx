import React,  { useCallback, useState, useEffect } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { searchPageResults } from "@/lib/shopifyQueries";
import { FlashList } from "@shopify/flash-list";

type SearchResult = {
    __typename: 'Product' | 'Page' | 'Article';
    id: string;
    handle: string;
    title: string;
    featuredImage?: { url: string };
  };

export default function Product(){
    const { query } = useLocalSearchParams();
    const [items, setItems] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState<Boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [pageInfo, setPageInfo] = useState<{ hasNextPage: boolean, endCursor?: string }>({ hasNextPage: false });

    const fetchResults = useCallback(async (cursor?: string) => {
        try{
            const decodedQuery = decodeURIComponent(query as string);
            const results = await searchPageResults(decodedQuery, "US", "EN");

            const newItems = results.edges.map((edge: { node: any; }) => edge.node);
            setItems(prev => cursor ? [...prev, ...newItems] : newItems);
            setPageInfo(results.pageInfo);
            setError(null);
        }catch (error){
            setError('Failed to load the results. Please try again later.')
        }finally{
            setLoading(false);
        }
    }, [query]);

    useEffect(() => {
         if(query) {
            setLoading(true);
            fetchResults();
         }
    }, [query]);

    const handleEndReached = () => {
        if(pageInfo.hasNextPage && !loading){
            fetchResults(pageInfo.endCursor);
        }
    }

    const renderItem = ({item}: {item: SearchResult}) => {

        return (
            <TouchableOpacity
        className="flex-1 m-2 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700"
        key={item.handle}
        onPress={() => {item.__typename === 'Product' && router.push(`/products/${item.handle}`) || item.__typename === 'Page' && router.push(`/collections/${item.handle}`) || item.__typename === 'Article' && router.push(`/`)}}
      >
        {item.__typename === 'Product' && item.featuredImage?.url && (
          <Image
            className="w-full aspect-square rounded-lg mb-2"
            source={{ uri: item.featuredImage.url }}
            resizeMode="contain"
          />
        )}
        <Text className="text-sm font-semibold mb-1 dark:text-white">
          {item.title}
        </Text>
        <Text className="text-xs text-gray-500 dark:text-gray-300 capitalize">
          {item.__typename.toLowerCase()}
        </Text>
      </TouchableOpacity>
        )
    }

    if(loading){
        return(
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#24272a" />
            </View>
        )
    }

    if(error){
        return(
            <View className="flex-1 items-center justify-center">
                <Text className="text-red-500">{error}</Text>
                <TouchableOpacity onPress={() => fetchResults()}>
                  <Text className="text-blue-500 text-lg">Try Again</Text>
                </TouchableOpacity>
            </View>
        )
    }
        
    
   return(
     <FlashList 
         data={items}
         renderItem={renderItem}
         keyExtractor={(item) => `${item.__typename}:${item.id}:${item.handle}`}
         numColumns={2}
         estimatedItemSize={200}
         onEndReached={handleEndReached}
         onEndReachedThreshold={0.1}
         ListHeaderComponent={<Text className="text-lg font-bold px-4 py-4">
            Results for "{decodeURIComponent(query as string)}"
          </Text>}
          ListEmptyComponent={<View className="flex-1 items-center justify-center p-4">
            <Text className="text-gray-500 dark:text-gray-300 text-lg">
              No results found
            </Text>
          </View>}
          ListFooterComponent={
            <View className="py-5">
              <ActivityIndicator size="small" color="#24272a" />
            </View> 
          }
          contentContainerStyle={{ paddingBottom: 16 }}
          className="bg-gray-50 flex-1"
     />
   );
}