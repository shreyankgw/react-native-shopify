import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { Layout } from 'react-native-reanimated';
import { menuItems } from "@/constants/shopifyConstants";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

type MenuItem = {
    title: string;
    subcategories?: SubCategory[];
    link?: any;
}

type SubCategory = {
    title: string;
    items?: { name: string; link: any }[];
    subcategories?: SubCategory[];
    link?: any;
};

type SubSubCategory = {
    title: string;
    items?: { name: string; link: any }[];
};

export default function MainMenu() {

    return (
        <View>
            {
                menuItems.map((item, index) => item.subcategories ? (
                    <Accordion key={index} title={item.title} subcategories={item.subcategories} />
                ) : (
                    <SingleLink key={index} title={item.title} link={item.link} />
                )
            )
            }
        </View>
    )
}

const SingleLink = ({title, link}: MenuItem) => {
    return (
        <TouchableOpacity className="p-4 border-b-2 border-gray-200 mb-4" onPress={() => router.push(link)}>
          <Text className="text-lg font-mSemiBold text-gray-200">{title}</Text>
        </TouchableOpacity>
    )
};

const Accordion = ({ title, subcategories }: MenuItem) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleAccordion = () => {
        setIsExpanded((prev) => !prev);
    }

    return (
        <View className="mb-4">
            <TouchableOpacity className="p-4 border-b-2 border-gray-200 flex items-center justify-between flex-row" onPress={toggleAccordion}>
                <Text className="text-lg font-mSemiBold text-gray-200">{title}</Text>
                <Ionicons name={isExpanded ? 'remove-sharp' : 'add-sharp'} size={24} color="#f3f4f6" />
            </TouchableOpacity>

            {
                isExpanded && (
                    <Animated.View className="mt-2" layout={Layout.springify()}>
                        {subcategories && subcategories.map((subcategory, index) => (
                            subcategory.items ? (
                                <SubAccordion key={index} title={subcategory.title} items={subcategory.items} />
                            ) : (
                                <TouchableOpacity key={index} className="py-2 px-4 rounded-md mb-4" onPress={() => router.push(subcategory.link)}>
                                    <Text className="text-gray-200">{subcategory.title}</Text>
                                </TouchableOpacity>
                            )       
                        ))}
                    </Animated.View>
                )
            }
        </View>
    )
}

const SubAccordion = ({ title, items }: SubSubCategory) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleAccordion = () => {
        setIsExpanded((prev) => !prev);
    };

    return (
        <View className="mb-2">
            <TouchableOpacity
                className="p-3 flex items-center justify-between flex-row"
                onPress={toggleAccordion}
            >
                <Text className="text-base font-medium text-gray-200">{title}</Text>
                <Ionicons name={isExpanded ? 'remove-sharp' : 'add-sharp'} size={24} color="#f3f4f6" />
            </TouchableOpacity>
            {isExpanded && (
                <Animated.View className="mt-2" layout={Layout.springify()}>
                    {items && items.map((item, index) => (
                        <TouchableOpacity key={index} className="py-2 px-4" onPress={() => router.push(item.link)}>
                            <Text className="text-gray-200">{item.name}</Text>
                        </TouchableOpacity>
                    ))}
            </Animated.View>
            )}
        </View>
    )
}

