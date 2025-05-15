import { Stack, SplashScreen, useRootNavigationState, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect} from "react";
import "@/global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {storage} from "@/lib/storage";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/context/authContext";
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter()
  const navigationState = useRootNavigationState();
  

  const [fontsLoaded, error] = useFonts({
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-SemiBold": require("../assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),
    "Montserrat-Black": require("../assets/fonts/Montserrat-Black.ttf"),
    "Montserrat-Medium": require("../assets/fonts/Montserrat-Medium.ttf")
  });

  // Get initial route from storage
  const storageValue = storage.getBoolean("onboarding");
  const initialRoute = storageValue ? "/(tabs)" : "/welcome";

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  // Handle redirection after fonts load and navigation is ready
  useEffect(() => {
    if (fontsLoaded && navigationState?.stale) {
      router.replace(initialRoute);
    }
  }, [fontsLoaded, navigationState?.stale]);

  if (!fontsLoaded && !error) return null;
   
  return (
    <SafeAreaProvider>
    <AuthProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
    <Stack>
       <Stack.Screen name="welcome" options={{ headerShown: false }}></Stack.Screen>
       <Stack.Screen name="(tabs)" options={{ headerShown: false }}></Stack.Screen>
       <Stack.Screen name="products/[handle]" options={{ headerShown: false }}></Stack.Screen>
       <Stack.Screen name="collections/[handle]" options={{ headerShown: false }}></Stack.Screen>
       <Stack.Screen name="search/index" options={{ headerShown: false }}></Stack.Screen>
       <Stack.Screen name="search/[query]" options={{ headerShown: false }}></Stack.Screen>
       <Stack.Screen name="account/edit" options={{ headerShown: false }}></Stack.Screen>
    </Stack>
    </GestureHandlerRootView>
    </AuthProvider>
    </SafeAreaProvider>
  );
}