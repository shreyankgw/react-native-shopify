import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useCart } from '@/context/cartContext';


export default function TabLayout() {
   const { totalQuantity } = useCart();

    return (
        <GestureHandlerRootView>
        <SafeAreaView className="bg-white h-full">
          <Tabs screenOptions={{ tabBarActiveTintColor: "#046a38", tabBarStyle: { backgroundColor: "#ffffff", paddingTop: 5, paddingBottom: 5, height: 60 }, tabBarLabelStyle: { fontFamily: "Montserrat-Bold" } }}>
            <Tabs.Screen name="index" options={{ title: 'Home', headerShown: false, tabBarIcon: ({ color, focused }) => (<View className="relative items-center justify-center h-full mb-1"><Ionicons name={focused ? 'home-sharp' : 'home-outline'} size={24} color={color} /></View> ) }} />
            <Tabs.Screen name="catalog" options={{ title: 'Catalog', headerShown: false, tabBarIcon: ({ color, focused }) => (<View className="relative items-center justify-center h-full mb-1"><AntDesign name={focused ? 'appstore1' : 'appstore-o'} size={24} color={color} /></View>) }} />
            <Tabs.Screen name="cart" options={{ title: 'Cart', headerShown: false, tabBarIcon: ({ color, focused }) => (<View className="relative items-center justify-center h-full mb-1"><Ionicons name={focused ? 'bag-sharp' : 'bag-outline'} size={24} color={color} /></View>), tabBarBadge: totalQuantity > 0 ? totalQuantity : 0, tabBarBadgeStyle: { backgroundColor: "#82bc00", color: "#ffffff" } }} />
            <Tabs.Screen name="support" options={{ title: 'Support', headerShown: false, tabBarIcon: ({ color, focused }) => (<View className="relative items-center justify-center h-full mb-1"><Ionicons name={focused ? 'chatbox-ellipses-sharp' : 'chatbox-ellipses-outline'} size={24} color={color} /></View>) }} />
            <Tabs.Screen name="profile" options={{ title: 'Profile', headerShown: false, tabBarIcon: ({ color, focused }) => (<View className="relative items-center justify-center h-full mb-1"><Ionicons name={focused ? 'person-sharp' : 'person-outline'} size={24} color={color} /></View>) }} />
        </Tabs>
        </SafeAreaView>  
        </GestureHandlerRootView>      
    );
}