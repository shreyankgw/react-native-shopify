import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, ScrollView, Image, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import MainMenu from '@/components/MainMenu';
import { router } from "expo-router";

const { width } = Dimensions.get('window');

export default function TabLayout() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const translateX = useSharedValue(-width);

    const openDrawer = () => {
      translateX.value = withTiming(0, { duration: 500 });
      setDrawerOpen(true);
    }

    const closeDrawer = () => {
      translateX.value = withTiming(-width, { duration: 500});
      setDrawerOpen(false);
    }

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{translateX: translateX.value}],
        zIndex: 10
      }
    });

    return (
        <SafeAreaView className="bg-white h-full">
                 <View
          className="flex items-center justify-between flex-row flex-wrap w-full px-4 border-b-2 border-gray-200 bg-darkPrimary"
        >
          <TouchableOpacity onPress={openDrawer}>
          <Ionicons name="menu-sharp" size={28} color="#ffffff" />
          </TouchableOpacity>         
          <Image source={require("@/assets/images/gw_logo.png")} resizeMode="contain" className="w-[180px] h-[70px]" />
          <TouchableOpacity onPress={() => router.push("/search")}>
          <Ionicons name="search-outline" size={28} color="#ffffff" />
          </TouchableOpacity> 
        </View>
       <Animated.ScrollView
           className="absolute top-0 right-0 bottom-0 bg-darkPrimary shadow-lg" style={[animatedStyle, {width}]}
       >
        <View className="flex flex-row items-center justify-between m-3 p-3">
        <Image source={require("@/assets/images/gw_logo.png")} resizeMode="contain" className="w-[180px] h-[40px]" />
        <TouchableOpacity
          className=""
          onPress={closeDrawer}
        >
          <Ionicons name="close-circle-sharp" size={32} color="#ffffff" />
        </TouchableOpacity>
        </View>
        
        <ScrollView className="flex-1 p-4">
           <MainMenu />
        </ScrollView>
       </Animated.ScrollView>

          <Tabs screenOptions={{ tabBarActiveTintColor: "#046a38", tabBarShowLabel: false, tabBarStyle: { backgroundColor: "#ffffff", paddingTop: 5, paddingBottom: 5, height: 60 } }}>
            <Tabs.Screen name="index" options={{ title: 'Home', headerShown: false, tabBarIcon: ({ color, focused }) => ( <View className="relative items-center justify-center h-full mb-1">{focused && (<View className="absolute -bottom-2 bg-[#046a38] h-1 w-full rounded-b-md" />)}<Ionicons name={focused ? 'home-sharp' : 'home-outline'} size={24} color={color} /></View> ) }} />
            <Tabs.Screen name="search" options={{ title: 'Search', headerShown: false, tabBarIcon: ({ color, focused }) => (<View className="relative items-center justify-center h-full mb-1">{focused && (<View className="absolute -bottom-2 bg-[#046a38] h-1 w-full rounded-b-md" />)}<Ionicons name={focused ? 'search-sharp' : 'search-outline'} size={24} color={color} /></View>) }} />
            <Tabs.Screen name="cart" options={{ title: 'Cart', headerShown: false, tabBarIcon: ({ color, focused }) => (<View className="relative items-center justify-center h-full mb-1">{focused && (<View className="absolute -bottom-2 bg-[#046a38] h-1 w-full rounded-b-md" />)}<Ionicons name={focused ? 'bag-sharp' : 'bag-outline'} size={24} color={color} /></View>), tabBarBadge: 3, tabBarBadgeStyle: { backgroundColor: "#82bc00", color: "#ffffff" } }} />
            <Tabs.Screen name="profile" options={{ title: 'Profile', headerShown: false, tabBarIcon: ({ color, focused }) => (<View className="relative items-center justify-center h-full mb-1">{focused && (<View className="absolute -bottom-2 bg-[#046a38] h-1 w-full rounded-b-md" />)}<Ionicons name={focused ? 'person-sharp' : 'person-outline'} size={24} color={color} /></View>) }} />
        </Tabs>
        </SafeAreaView>
        
    );
}