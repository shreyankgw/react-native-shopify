import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: "#046a38", tabBarStyle: { borderTopWidth: 1, borderTopColor: "#046a38" }, tabBarShowLabel: false }}>
            <Tabs.Screen name="index" options={{ title: 'Home', headerShown: false, tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'home-sharp' : 'home-outline'} size={24} color={color} /> }} />
            <Tabs.Screen name="search" options={{ title: 'Search', headerShown: false, tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'search-sharp' : 'search-outline'} size={24} color={color} /> }} />
            <Tabs.Screen name="cart" options={{ title: 'Cart', headerShown: false, tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'bag-sharp' : 'bag-outline'} size={24} color={color} />, tabBarBadge: 3, tabBarBadgeStyle: { backgroundColor: "#82bc00", color: "#ffffff" } }} />
            <Tabs.Screen name="profile" options={{ title: 'Profile', headerShown: false, tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'person-sharp' : 'person-outline'} size={24} color={color} /> }} />
        </Tabs>
    );
}