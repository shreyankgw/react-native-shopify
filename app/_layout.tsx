import { Stack, SplashScreen } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import "@/global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {storage} from "@/lib/storage";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const storageValue = storage.getBoolean("onboarding");
   console.log(storageValue);
  const intitalRoute = storageValue ? "(tabs)" : "welcome";
    console.log(intitalRoute);
  

  const [fontsLoaded, error] = useFonts({
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-SemiBold": require("../assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),
    "Montserrat-Black": require("../assets/fonts/Montserrat-Black.ttf"),
    "Montserrat-Medium": require("../assets/fonts/Montserrat-Medium.ttf")
  });

   useEffect(() => {
       if(error) throw error;
       if(fontsLoaded) SplashScreen.hideAsync();
   }, [fontsLoaded, error]);

   if(!fontsLoaded) return null;
   
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <Stack initialRouteName={intitalRoute}>
       <Stack.Screen name="welcome" options={{ headerShown: false }}></Stack.Screen>
       <Stack.Screen name="(tabs)" options={{ headerShown: false }}></Stack.Screen>
       <Stack.Screen name="products/[handle]" options={{ headerShown: false }}></Stack.Screen>
       <Stack.Screen name="collections/[handle]" options={{ headerShown: false }}></Stack.Screen>
       <Stack.Screen name="search/index" options={{ headerShown: false }}></Stack.Screen>
       <Stack.Screen name="search/[query]" options={{ headerShown: false }}></Stack.Screen>
    </Stack>
    </GestureHandlerRootView>
  );
}
