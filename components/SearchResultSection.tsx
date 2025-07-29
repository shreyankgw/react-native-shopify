import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";

export default function SearchResultSection({title, items, type}: {title: string, items: any[] | undefined, type: string}){
 if(items && !items.length) return null;

 return(
       <View className="mb-6">
            <Text className="text-lg font-mBold px-4 mb-2">{title}</Text>
            {items && items.map((item) => (
                <TouchableOpacity key={item.id} className="px-4 py-3 flex-row items-center" onPress={() => router.push(type === "product" ? `/products/${item.handle}` : `/collections/${item.handle}`)}>
                    {item.featuredImage && item.featuredImage.url && <View className="w-12 h-12 rounded-md mr-3"><Image source={{ uri: item.featuredImage.url }} contentFit="contain" style={{ width: '100%', height: '100%' }} accessibilityRole="image" /></View> }
                    <Text className="text-base flex-1">{item.title}</Text>
                    <Ionicons name="chevron-forward" size={18} color="#666" />
                </TouchableOpacity>
            ))}
       </View>
 )
}