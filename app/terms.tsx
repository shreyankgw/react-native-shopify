import React from 'react';
import { ScrollView, Text, View, Linking, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


const sections = [
  {
    title: "1. USER ELIGIBILITY",
    content: `The Websites are available only to residents of Canada who are over the age of 18 and can form legally binding agreements. The products and services available on the Websites are available only in Canada. If you do not qualify, do not use the Websites... (see full content above)`
  },
  {
    title: "2. OWNERSHIP AND PERMITTED USE OF WEBSITES AND CONTENT",
    content: `We provide the Websites and their content for your information, education and shopping pleasure. Please feel free to browse the Websites...`
  },
  {
    title: "3. CERTAIN RESTRICTIONS ON USE",
    content: `You may not: post, transmit, redistribute, upload, or promote any communications, content or materials that are illegal, obscene, vulgar...`
  },
  {
    title: "4. ERRORS ON THE WEBSITES",
    content: `We shall have no responsibility for errors of any kind on the Websites. Errors may include incorrect product and service descriptions...`
  },
  {
    title: "5. FEEDBACK AND SUBMISSIONS TO THE WEBSITES",
    content: `We welcome your comments regarding the products and services offered on the Websites. From time to time you may be given the opportunity to respond to surveys...`
  },
  {
    title: "6. DISCLAIMER OF WARRANTY",
    content: `THESE WEBSITES, LINKED WEBSITES, AND ALL CONTENT INCLUDED ON OR OTHERWISE MADE AVAILABLE TO YOU THROUGH THESE WEBSITES OR ANY LINKED WEBSITES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS...`
  },
  {
    title: "9. ORDER FULFILLMENT",
    content: `We reserve the right in its sole discretion, without prior notice and for any reason, including but not limited to unavailability of products...`
  },
  {
    title: "10. TERMINATION",
    content: `We may, in our sole discretion, terminate your use of the Websites or terminate your rights under these Terms for any reason, without prior notice...`
  },
  {
    title: "11. LINKS",
    content: `The Websites may from time to time display links to other websites or resources sponsored by third parties as a convenience to you...`
  },
  {
    title: "12. DISPUTES",
    content: `This Agreement and its performance shall be governed by the laws of the Province of Ontario, Canada. You consent and submit to the exclusive jurisdiction of the courts located in the City of Toronto...`
  },
  {
    title: "13. AMENDMENTS",
    content: `We reserve the right, at our sole discretion, to revise, change, or modify these Terms and our Privacy Policy at any time by updating this posting...`
  },
  {
    title: "14. CONTACT US",
    content: `If you have any questions or concerns about these Terms, the practices of the Websites, or your experiences with the Websites, please contact us at:\n\ninfo@greenworkstools.com or at 1-888-909-6757`
  },
];

export default function Terms() {
  return (
    <SafeAreaView className="bg-white h-full">
      <View className="flex-1 bg-white">
        <ScrollView className="bg-white h-full">
          <View className="flex flex-row items-center justify-between p-4 border-b-2 border-gray-200 w-full">
            <TouchableOpacity className="text-3xl font-mBold" onPress={() => router.back()}>
              <Ionicons name="arrow-back-outline" size={24} color="black" />
            </TouchableOpacity>
            <Text className="text-xl font-mBold uppercase flex-1 text-center">Terms Of Service</Text>
          </View>

          <View className="my-6 px-4">
          
          <Text className="mb-6 text-xs text-center text-gray-500 font-mRegular">
            PLEASE READ THE FOLLOWING TERMS AND CONDITIONS OF USE CAREFULLY BEFORE USING THIS WEBSITE.
          </Text>
          <Text className="mb-8 text-gray-700 font-mRegular">
            Greenworks Tools Canada Inc. licensee of the Greenworks Tools brand Greenworks Tools, operates our websites, microsites, mobile versions of these websites and mobile applications that expressly adopt and display or link to these Terms and that are owned, operated or controlled by Greenworks Tools Canada Inc. or any of its affiliates “Websites” as a service to its customers residing in Canada. We provide these Websites to you, and all users of these Websites agree that access to and use of the Websites are, subject to the following terms and conditions and other applicable law. All users of the Websites agree that access to and use of the Websites are subject to the following Terms. If you do not agree to the Terms, please do not use the Websites.
          </Text>
          {sections.map((section, idx) => (
            <View key={idx} className="mb-8">
              <Text className="text-lg font-mSemiBold mb-2 text-darkPrimary">{section.title}</Text>
              <Text className="text-base text-gray-800 font-mRegular">{section.content}</Text>
            </View>
          ))}
          <View className="mb-12">
            <Text className="text-xs text-gray-400 font-mRegular">Effective April 1, 2014</Text>
            <TouchableOpacity
              className="mt-3"
              onPress={() => Linking.openURL('mailto:info@greenworkstools.com')}
            >
              <Text className="text-blue-600 underline font-mRegular">Contact us: info@greenworkstools.com</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="mt-1"
              onPress={() => Linking.openURL('tel:18889096757')}
            >
              <Text className="text-blue-600 underline font-mRegular">1-888-909-6757</Text>
            </TouchableOpacity>
          </View>

          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
