import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { Layout } from 'react-native-reanimated';
import { menuItems } from "@/constants/shopifyConstants";

type MenuItem = {
    title: string;
    subcategories?: SubCategory[];
}

type SubCategory = {
    title: string;
    items?: { name: string; link: string }[];
    subcategories?: SubCategory[];
    link?: string;
};

type SubSubCategory = {
    title: string;
    items?: { name: string; link: string }[];
};

export default function MainMenu() {

    return (
        <View>
            {
                menuItems.map((item, index) => item.subcategories ? (
                    <Accordion key={index} title={item.title} subcategories={item.subcategories} />
                ) : (
                    <TouchableOpacity key={index} className="p-4 bg-gray-200 rounded-md mb-4">
                        <Text className="text-lg font-mSemiBold">{item.title}</Text>
                    </TouchableOpacity>
                )
            )
            }
        </View>
    )
}

const Accordion = ({ title, subcategories }: MenuItem) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleAccordion = () => {
        setIsExpanded((prev) => !prev);
    }

    return (
        <View className="mb-4">
            <TouchableOpacity className="p-4 bg-gray-200 rounded-md" onPress={toggleAccordion}>
                <Text className="text-lg font-mSemiBold">{title}</Text>
            </TouchableOpacity>

            {
                isExpanded && (
                    <Animated.View className="mt-2" layout={Layout.springify()}>
                        {subcategories && subcategories.map((subcategory, index) => (
                            subcategory.items ? (
                                <SubAccordion key={index} title={subcategory.title} items={subcategory.items} />
                            ) : (
                                <TouchableOpacity key={index} className="p-4 bg-gray-200 rounded-md mb-4">
                                    <Text className="text-lg font-mSemiBold">{subcategory.title}</Text>
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
                className="p-3 bg-gray-300 rounded-md"
                onPress={toggleAccordion}
            >
                <Text className="text-base font-medium">{title}</Text>
            </TouchableOpacity>
            {isExpanded && (
                <Animated.View className="mt-2" layout={Layout.springify()}>
                    {items && items.map((item, index) => (
                        <View key={index} className="py-2 px-4 bg-gray-100">
                            <Text className="text-gray-700">{item.name}</Text>
                        </View>
                    ))}
            </Animated.View>
            )}
            
        </View>
    )
}

