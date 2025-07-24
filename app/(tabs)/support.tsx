import React from 'react';
import { View, Text, TouchableOpacity, Linking, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Support() {

  const supportWebsite = 'https://www.greenworkstools.ca/pages/support';
  const chatURL = 'https://www.greenworkstools.ca/';
  const hours = [
    { day: 'Monday - Friday', time: '9:00 AM - 7:00 PM EST' },
    { day: 'Saturday', time: 'Closed' },
    { day: 'Sunday', time: 'Closed' },
    { day: 'Chat (Monday - Friday)', time: '9:30 AM - 5:00 PM EST' },

  ];

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="flex-1 bg-white">
        <ScrollView className="bg-white h-full">

          <View className="flex flex-row items-center justify-between p-4 border-b-2 border-gray-200 w-full">
            <TouchableOpacity className="text-3xl font-mBold" onPress={() => router.back()}>
              <Ionicons name="arrow-back-outline" size={24} color="black" />
            </TouchableOpacity>
            <Text className="text-xl font-mBold uppercase flex-1 text-center">Support</Text>
          </View>

          <View className="my-6 px-4">
            <Text className="text-gray-600 text-center mb-8 font-mRegular">
              Need help? Reach our customer support below.
            </Text>

            {/* Call Support */}
            <TouchableOpacity
              className="flex-row items-center bg-brandLight rounded-2xl p-4 mb-4"
              onPress={() => Linking.openURL('tel:18889096757')}
            >
              <Ionicons name="call" size={28} color="#24272a" />
              <View className="ml-4 font-mRegular">
                <Text className="font-mSemiBold text-brandText text-lg">Call Us</Text>
                <Text className="text-gray-700 font-mRegular">1-888-909-6757</Text>
              </View>
            </TouchableOpacity>

            {/* Visit Support Website */}
            <TouchableOpacity
              className="flex-row items-center bg-primary rounded-2xl p-4 mb-4 font-mRegular"
              onPress={() => Linking.openURL(supportWebsite)}
            >
              <Ionicons name="globe" size={28} color="#ffffff" />
              <View className="ml-4">
                <Text className="font-mSemiBold text-white text-lg">Visit Website</Text>
                <Text className="text-gray-100 font-mRegular">{supportWebsite.replace(/^https?:\/\//, '')}</Text>
              </View>
            </TouchableOpacity>

            {/* Chat with Support */}
            <TouchableOpacity
              className="flex-row items-center bg-darkPrimary rounded-2xl p-4 mb-4"
              onPress={() => Linking.openURL(chatURL)}
            >
              <Ionicons name="chatbubbles" size={28} color="#ffffff" />
              <View className="ml-4">
                <Text className="font-mSemiBold text-white text-lg">Chat with Support</Text>
                <Text className="text-gray-100 font-mRegular">Live Chat on Website</Text>
              </View>
            </TouchableOpacity>

            {/* Business Hours */}
            <View className="bg-gray-50 rounded-2xl p-5 mt-6 mb-12 border border-gray-200 shadow-sm">
              <Text className="text-lg font-mSemiBold text-gray-800 mb-3 text-center">
                Customer Support Hours
              </Text>
              {hours.map((h, i) => (
                <View key={i} className="flex-row justify-between mb-1">
                  <Text className="text-gray-700 font-mRegular">{h.day}</Text>
                  <Text className="text-gray-600 font-mRegular">{h.time}</Text>
                </View>
              ))}
            </View>

            {/* Additional Support Info */}
            <View className="bg-white border border-green-100 rounded-2xl p-5 mb-12 shadow-sm">
              <Text className="text-gray-800 mb-4 font-mRegular">
                Our customer service team can help you choose the right GREENWORKS product or help with any issues you are experiencing.
              </Text>
              <Text className="text-gray-800 mb-4 font-mRegular">
                Please have your unit, battery and charger with you along with the model and serial number to complete troubleshooting to ensure quick resolution is provided.
              </Text>
              <Text className="text-gray-800 mb-4 font-mRegular">
                For order cancellations, please send an email with your order information to{' '}
                <Text
                  className="text-blue-600 underline font-mRegular"
                  onPress={() => Linking.openURL('mailto:cancellations@greenworkstools.com')}
                >
                  cancellations@greenworkstools.com
                </Text>
              </Text>
              <Text className="text-gray-800 mb-4 font-mRegular">
                For public relations, partnerships, sponsorships or media requests, please send a direct message with your request and information to{' '}
                <Text
                  className="text-darkPrimary underline font-mBold"
                  onPress={() => Linking.openURL('https://instagram.com/greenworkstoolscanada')}
                >
                  @greenworkstoolscanada
                </Text>{' '}
                on Instagram or{' '}
                <Text
                  className="text-darkPrimary underline font-mBold"
                  onPress={() => Linking.openURL('https://twitter.com/gwtoolscanada')}
                >
                  @gwtoolscanada
                </Text>{' '}
                on Twitter.
              </Text>
              <Text className="text-gray-800 mb-4 font-mRegular">
                Please try our online chat system for questions or product and purchase information!
              </Text>
              <Text className="text-gray-800 mb-4 font-mRegular">
                If you have emailed our team, please allow up to 72hrs for an email response.
              </Text>
              <Text className="text-red-700 font-mSemiBold">
                DUE TO HIGH VOLUME OF ORDERS, SHIPPING MAY BE DELAYED ON NEW ORDERS. WE ARE DOING OUR BEST TO PROCESS AND SHIP ORDERS AS QUICKLY AS POSSIBLE AND WE THANK YOU FOR YOUR PATIENCE AT THIS TIME.
              </Text>
            </View>

          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
