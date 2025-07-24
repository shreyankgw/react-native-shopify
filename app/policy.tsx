import React from 'react';
import { ScrollView, Text, View, TouchableOpacity, Linking, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const sections = [
  {
    title: "OUR COMMITMENT TO PRIVACY",
    content: `Our Privacy Policy was developed as an extension of our commitment to combine the highest quality products and services with the highest level of integrity in dealing with our clients and partners. Our Policy is designed to assist you in understanding how we collect, use and safeguard the personal information you provide to us and to assist you in making informed decisions when using our site and our products and services. This statement will be continuously assessed against new technologies, business practices and our customers’ needs.`
  },
  {
    title: "USER ELIGIBILITY",
    content: `Our site is available only to residents of Canada who are over the age of 18 and can form legally binding agreements. The products and services available on our site is available only in Canada. Special Note regarding Children: Our site is not intended for use by children under the age of 18 and, therefore, children under the age of 18 should not use our site. We will comply with the Children’s Online Privacy Protection Act and will not knowingly collect information from children under the age of 18. If you have children under the age of 18, you should not allow those children to use the Websites and you should always monitor your children’s use of the Internet. You should make your children aware that providing information about them over the Internet could be dangerous. Furthermore, parental control software is available to help you monitor your children’s use of the Internet and to block your children’s access to particular Internet sites.`
  },
  {
    title: "WE DO NOT SELL OUR LIST",
    content: `We will not sell your name to a third party for the purposes of their advertising to you.`
  },
  {
    title: "WHAT INFORMATION DO WE COLLECT AND WHY?",
    content: `When you visit our Website you may provide us with two types of information: personal information you knowingly choose to disclose that is collected on an individual basis and Website use information collected on an aggregate basis as you and others browse our Website.`
  },
  {
    title: "1) PERSONAL INFORMATION YOU CHOOSE TO PROVIDE",
    content: `EMAIL DOCUMENTS: In addition to providing the foregoing information to our partners, if you choose to correspond further with us through email, we may retain the content of your email messages together with your email address and our responses. We provide the same protections for these electronic communications that we employ in the maintenance of information received by mail and telephone.

HOW DO WE USE THE INFORMATION THAT YOU PROVIDE TO US? Broadly speaking, we use personal information for purposes of administering our business activities, providing customer service and making available other products and services to our customers and prospective customers. Occasionally, we may also use the information we collect to notify you about important changes to our Website, new services and special offers we think you will find valuable. The lists used to send you product and service offers are developed and managed under our traditional corporate standards designed to safeguard the security and privacy of our customers’ personal information. As a customer, you will be given the opportunity, at least once per contact, to notify us of your desire not to receive these offers.`
  },
  {
    title: "2) WEBSITE INFORMATION",
    content: `WHAT ARE COOKIES? Cookies are a feature of Web browser software that allows Web servers to recognize the computer used to access a Website. Cookies are small pieces of data that are stored by your Web browser on your hard drive. Cookies can remember what information you accessed on one Web page to simplify your subsequent interactions with that Website or to use the information to streamline your transactions on related Web pages. This makes it easier for you to move from Web page to Web page and to complete commercial transactions over the Internet. When you use the same computer to return to our site at a later time we will recognize you as a previous guest. We use cookies to make your online experience easier and more personalized. Cookies may permit us to send focused online content to you.

WEB SERVER LOGS: Server logs help us collect important business and technical statistics. The information in the logs lets us trace the paths followed by users to our Website as they move from one page to another. Web server logs allow us to count how many people visit our Website and evaluate our Website’s visitor capacity. We do not use these logs to capture your individual email address or any personally identifying information about you.

HOW DO WE USE INFORMATION WE COLLECT FROM COOKIES AND LOGS? We use Website browser software tools such as cookies and Web server logs to gather information about our Website users browsing activities, in order to constantly improve our Website and better serve our customers. This information assists us to design and arrange our Web pages in the most user-friendly manner and to continually improve our Website to better meet the needs of our customers and prospective customers.

HOW DO WE SECURE INFORMATION TRANSMISSIONS? When you send confidential personal information including credit card numbers to us on our Website, secure server software that we have licensed, encrypts all information you input before it is sent to use. The information is scrambled en route and decoded once it reaches our Website. Other email that you may send to us may not be secure unless we advise you that security measures will be in place prior to you transmitting the information. For that reason, we ask that you do not send confidential information such as credit card or account numbers to use through an unsecured email.`
  },
  {
    title: "3) HOW DO WE PROTECT YOUR INFORMATION?",
    content: `INFORMATION SECURITY: We utilize encryption/security software to safeguard the confidentiality of personal information we collect from unauthorized access or disclosure and accidental loss, alteration or destruction.

EMPLOYEE ACCESS, TRAINING, AND EXPECTATIONS: Our corporate values, ethical standards, policies and practices are committed to the protections of customer information. In general, our business practices limit the use and disclosure of such information only to authorized persons, processes and transactions.

WHAT ABOUT LEGALLY COMPELLED DISCLOSURE OF INFORMATION? We may disclose information when legally compelled to do so, in other words, when we, in good faith, believe that the law requires it or for the protection of our legal rights.

WHAT ABOUT WEBSITES LINKED TO OUR WEBSITE? We are not responsible for the practices employed by Websites linked to or from our Website nor the information or content contained therein. Often links to other Websites are provided solely as pointers to information on topics that may be useful to the users of our Website. Please remember that when you use a link to go from our Website to another Website, our Privacy Policy is no longer in effect. Your browsing and interaction on any other Website, including Websites that have a link on our Website, is subject to that Website’s own rules and policies. Please read over those rules and policies before proceeding.`
  },
  {
    title: "4) SHIPPING POLICY",
    content: `Business or Residential Address: Orders shipping to a business or residential address via Economy or Standard shipping will be delivered Monday through Friday (excluding holidays). Your order may ship in multiple packages depending on the quantity or size of the items.

Carriers Used: We do not ship to other countries at this time. For security purposes, we do not ship to P.O. Boxes.

You can also call us at 888.909.6757 for more information about our Shipping Policy and or Terms and Conditions.`
  },
  {
    title: "5) UPDATES AND CHANGES TO POLICY",
    content: `We may change the terms of use policies from time to time by posting updated versions of the terms here. As we may make changes to these terms at any time without notifying you, we suggest that you review the Terms of Use each time you access or use our site.`
  }
];

export default function Policy() {
  return (
    <SafeAreaView className="bg-white h-full">
    <View className="flex-1 bg-white">
      <ScrollView className="bg-white h-full">

        <View className="flex flex-row items-center justify-between p-4 border-b-2 border-gray-200 w-full">
          <TouchableOpacity className="text-3xl font-mBold" onPress={() => router.back()}>
            <Ionicons name="arrow-back-outline" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-mBold uppercase flex-1 text-center">Privacy Policy</Text>
        </View>


        <View className="my-6 px-4">
        <Text className="mb-6 text-xs text-center text-gray-500 font-mRegular">
          By using our Website you consent to our collection and use of your personal information as described in this Privacy Policy. If we change our privacy policies and procedures, we will post those changes on our Website to keep you aware of what information we collect, how we use it and under what circumstances we may disclose it.
        </Text>
        {sections.map((section, idx) => (
          <View key={idx} className="mb-8">
            <Text className="text-lg font-mSemiBold mb-2 text-darkPrimary">{section.title}</Text>
            <Text className="text-base text-gray-800 whitespace-pre-line font-mRegular">{section.content}</Text>
          </View>
        ))}
        <View className="mb-12">
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
