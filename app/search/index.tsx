import React from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

export default function Search() {

    return (
        <SafeAreaView className="bg-white h-full">
            <View>
                <ScrollView className="bg-white h-full">
                    <View className="flex flex-row items-center justify-between p-4 border-b-2 border-gray-200 w-full gap-4">
                        <TouchableOpacity className="text-3xl font-mBold" onPress={() => router.back()}><Ionicons name="arrow-back-outline" size={24} color="black" /></TouchableOpacity>
                        <View className="flex-1">
                            <View className="flex-row items-center justify-between bg-gray-50 rounded-lg border border-brandText px-4 py-2">
                                <TextInput
                                    className="text-base text-brandText"
                                    placeholder="Search products..."
                                    placeholderTextColor="#24272a"
                                    accessibilityLabel="Search"
                                    onFocus={() => { }}
                                />
                                <TouchableOpacity onPress={() => { }} className="pl-2">
                                    <Ionicons name="search-outline" size={20} color="#24272a" className="mr-2" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity className="text-3xl font-mBold" onPress={() => router.push("/(tabs)/cart")}><Ionicons name="bag-outline" size={24} color="black" /></TouchableOpacity>
                    </View>
                    <View>
                        <View className="w-full">
                               
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}