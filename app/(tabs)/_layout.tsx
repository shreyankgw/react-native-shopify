import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from "react-native";

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: "#046a38", tabBarShowLabel: false, tabBarStyle: { backgroundColor: "#ffffff" } }}>
            <Tabs.Screen name="index" options={{ title: 'Home', headerShown: false, tabBarIcon: ({ color, focused }) => ( <View className="relative items-center justify-center h-full mb-1">{focused && (<View className="absolute -bottom-2 bg-[#046a38] h-1 w-full rounded-b-md" />)}<Ionicons name={focused ? 'home-sharp' : 'home-outline'} size={24} color={color} /></View> ) }} />
            <Tabs.Screen name="search" options={{ title: 'Search', headerShown: false, tabBarIcon: ({ color, focused }) => (<View className="relative items-center justify-center h-full mb-1">{focused && (<View className="absolute -bottom-2 bg-[#046a38] h-1 w-full rounded-b-md" />)}<Ionicons name={focused ? 'search-sharp' : 'search-outline'} size={24} color={color} /></View>) }} />
            <Tabs.Screen name="cart" options={{ title: 'Cart', headerShown: false, tabBarIcon: ({ color, focused }) => (<View className="relative items-center justify-center h-full mb-1">{focused && (<View className="absolute -bottom-2 bg-[#046a38] h-1 w-full rounded-b-md" />)}<Ionicons name={focused ? 'bag-sharp' : 'bag-outline'} size={24} color={color} /></View>), tabBarBadge: 3, tabBarBadgeStyle: { backgroundColor: "#82bc00", color: "#ffffff" } }} />
            <Tabs.Screen name="profile" options={{ title: 'Profile', headerShown: false, tabBarIcon: ({ color, focused }) => (<View className="relative items-center justify-center h-full mb-1">{focused && (<View className="absolute -bottom-2 bg-[#046a38] h-1 w-full rounded-b-md" />)}<Ionicons name={focused ? 'person-sharp' : 'person-outline'} size={24} color={color} /></View>) }} />
        </Tabs>
    );
}