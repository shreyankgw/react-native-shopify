import { Text, View, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Index() {
  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView
        contentContainerStyle={{ height: '100%' }}
      >
        <View
          className="flex items-center justify-between flex-row flex-wrap w-full px-4 border-b-2 border-gray-200"
        >
          <TouchableOpacity>
          <Ionicons name="menu-sharp" size={28} color="#82bc00" />
          </TouchableOpacity>         
          <Image source={require("@/assets/images/gw_green.png")} resizeMode="contain" className="w-[180px] h-[70px] flex-1 border-l-2 border-r-2" />
          <TouchableOpacity>
          <Ionicons name="chatbox-outline" size={28} color="#82bc00" />
          </TouchableOpacity> 
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
