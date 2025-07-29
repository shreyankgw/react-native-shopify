import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons";
import CustomPicker from "@/components/CustomPicker";

type RegistrationForm = {
  type: string;
  modelNumber: string;
  serialNumber: string;
  placePurchased: string;
  receipt: ReceiptAsset | null;
  firstName: string;
  lastName: string;
  address: string;
  aptSuite: string;
  province: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  termsAccepted: boolean;
};

type ReceiptAsset = {
  uri: string;
  fileName?: string;
  mimeType?: string;
};

const initialState: RegistrationForm = {
  type: "",
  modelNumber: "",
  serialNumber: "",
  placePurchased: "",
  receipt: null,
  firstName: "",
  lastName: "",
  address: "",
  aptSuite: "",
  province: "",
  city: "",
  postalCode: "",
  phone: "",
  email: "",
  termsAccepted: false,
};

const PROVINCE_OPTIONS = [
  { label: "ON", value: "ON" },
  { label: "QC", value: "QC" },
  { label: "BC", value: "BC" },
  { label: "AB", value: "AB" },
  { label: 'NS', value: "NS" },
  { label: 'MB', value: "MB" },
  { label: "NL", value: "NL" },
  { label: 'NB', value: "NB" },
  { label: 'PE', value: "PE" },
  { label: 'NT', value: "NT" },
  { label: 'SK', value: "SK" },
  { label: 'NU', value: "NU" },
  { label: 'YT', value: "YT" }
];

const PRODUCT_TYPE_OPTIONS = [
  { label: "Accessories", value: "Accessories" },
  { label: "Batteries & Chargers", value: "Batteries & Chargers" },
  { label: "Chainsaws/Polesaws", value: "Chainsaws/polesaws" },
  { label: "Cultivators & Dethatchers", value: "cultivators-dethatchers" },
  { label: "Hedge Trimmers", value: "Hedge Trimmers" },
  { label: "Home (Vaccum, etc.)", value: "Home" },
  { label: "Leaf Blowers", value: "Leaf Blowers" },
  { label: "Powerhub", value: "Powerhub" },
  { label: "Power Tools", value: "Power Tools" },
  { label: "Pressure Washers", value: "Pressure Washers" },
  { label: "Ride On Mowers", value: "Ride On Mowers" },
  { label: "Robotics", value: "Robotics" },
  { label: "Snow", value: "Snow" },
  { label: "String Trimmers & Edgers", value: "String Trimmers & Edgers" },
  { label: "Walk Behind Lawn Mowers", value: "Walk Behind Lawn Mowers" },
  { label: "Other", value: "Other" },
  { label: "Tool Combo Kit", value: "Tool Combo Kit" },
  { label: "Trolling Motor", value: "Trolling Motor" }
];


export default function ProductRegistrationForm() {
  const [form, setForm] = useState<RegistrationForm>(initialState);
  const [loading, setLoading] = useState(false);

  // Validation helper
  function validate(): string | null {
    if (!form.modelNumber.trim()) return "Model Number is required";
    if (!form.serialNumber.trim()) return "Serial Number is required";
    if (!form.placePurchased.trim()) return "Place Purchased is required";
    if (!form.firstName.trim()) return "First Name is required";
    if (!form.lastName.trim()) return "Last Name is required";
    if (!form.address.trim()) return "Address is required";
    if (!form.province.trim()) return "Province is required";
    if (!form.city.trim()) return "City is required";
    if (!form.postalCode.trim()) return "Postal Code is required";
    if (!form.phone.trim()) return "Phone Number is required";
    if (!form.email.trim()) return "Email is required";
    if (!form.termsAccepted) return "You must accept the Terms and Conditions";
    return null;
  }

  // Image picker
  async function handleChooseReceipt() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      const uri = asset.uri;
      const info = await FileSystem.getInfoAsync(uri);
      if (info.exists && typeof info.size === "number" && info?.size > 2.4 * 1024 * 1024) {
        Alert.alert("File too large", "Max file size is 2.4MB");
        return;
      }
      setForm(f => ({
        ...f,
        receipt: {
          uri,
          fileName: asset.fileName || "receipt.jpg",
          mimeType: asset.mimeType || "image/jpeg",
        },
      }));
    }
  }

  // Submit
  async function handleSubmit() {
    const error = validate();
    if (error) {
      Alert.alert("Validation Error", error);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "receipt" && value) {
          formData.append("receipt", {
            uri: (value as ReceiptAsset).uri,
            name: (value as ReceiptAsset).fileName || "receipt.jpg",
            type: (value as ReceiptAsset).mimeType || "image/jpeg",
          } as any);
        } else if (typeof value === "boolean") {
          formData.append(key, value ? "true" : "false");
        } else if (typeof value === "string") {
          formData.append(key, value);
        }
      });

      // --- REPLACE THIS URL WITH YOUR API ENDPOINT ---
      const response = await fetch("https://your-api-endpoint.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to register product");

      Alert.alert("Success", "Product registered successfully!");
      setForm(initialState);
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // Checkbox rendering
  function Checkbox({ checked }: { checked: boolean }) {
    return (
      <View
        style={{
          width: 20,
          height: 20,
          borderWidth: 2,
          borderColor: checked ? "#059669" : "#ccc",
          backgroundColor: checked ? "#059669" : "#fff",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 4,
          marginRight: 8,
        }}
      >
        {checked && <Text style={{ color: "#fff", fontWeight: "bold" }}>✓</Text>}
      </View>
    );
  }

  // Province dropdown alternative (simple TextInput)
  // To use dropdown: swap TextInput with a Picker or Select

  return (
    <SafeAreaView className="bg-white flex-1">
      <View>
        <View className="flex flex-row items-center justify-between p-4 border-b-2 border-gray-200 w-full">
          <TouchableOpacity className="text-3xl font-mBold" onPress={() => router.back()}>
            <Ionicons name="arrow-back-outline" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-mBold uppercase flex-1 text-center">
            Product Registration
          </Text>
        </View>
      </View>

      <ScrollView className="bg-white flex-1" contentContainerStyle={{ padding: 18 }}>
        {/* Product Info */}
        <Text className="text-xl font-mBold mb-3">Product Information</Text>
        <View className="flex flex-row gap-2">
          <View className="flex-1">
            {/* Product Type Picker */}
            <CustomPicker
              label="Product Type*"
              options={PRODUCT_TYPE_OPTIONS}
              selectedValue={form.type}
              onValueChange={(val) => setForm((prev) => ({ ...prev, type: val }))}
              placeholder="Select product type"
            />
          </View>
          <View className="flex-1">
            <Text className="font-mRegular mb-1">
              Model Number <Text className="text-red-600">*</Text>
            </Text>
            <TextInput
              className="border rounded-lg px-4 py-2 mb-3 bg-gray-50 border-gray-300 focus:border-gray-500"
              value={form.modelNumber}
              onChangeText={text => setForm(f => ({ ...f, modelNumber: text }))}
              placeholder="Model Number"
            />
          </View>
        </View>
        <View className="flex flex-row gap-2">
          <View className="flex-1">
            <Text className="font-mRegular mb-1">
              Serial Number <Text className="text-red-600">*</Text>
            </Text>
            <TextInput
              className="border rounded-lg px-3 py-2 mb-3 bg-gray-50 border-gray-300 focus:border-gray-500"
              value={form.serialNumber}
              onChangeText={text => setForm(f => ({ ...f, serialNumber: text }))}
              placeholder="Serial Number"
            />
          </View>
          <View className="flex-1">
            <Text className="font-mRegular mb-1">
              Place Purchased <Text className="text-red-600">*</Text>
            </Text>
            <TextInput
              className="border rounded-lg px-3 py-2 mb-3 bg-gray-50 border-gray-300 focus:border-gray-500"
              value={form.placePurchased}
              onChangeText={text => setForm(f => ({ ...f, placePurchased: text }))}
              placeholder="Place Purchased"
            />
          </View>
        </View>

        <Text className="font-mRegular mb-1">
          Receipt Upload (jpg/png/gif, max 2.4MB)
        </Text>
        <TouchableOpacity
          className={`flex-row items-center border rounded-lg px-3 py-2 mb-3 ${form.receipt ? "border-darkPrimary" : "border-gray-300"}`}
          onPress={handleChooseReceipt}
        >
          {form.receipt ? (
            <>
              <Image
                source={{ uri: form.receipt.uri }}
                className="w-12 h-12 rounded mr-2"
              />
              <Text className="flex-1">{form.receipt.fileName || "receipt.jpg"}</Text>
              <Text className="text-darkPrimary">Change</Text>
            </>
          ) : (
            <Text className="text-gray-600">Choose File</Text>
          )}
        </TouchableOpacity>

        {/* Owner Info */}
        <Text className="text-xl font-mBold my-4">
          Owner Information
        </Text>
        <View className="flex flex-row gap-2">
          <View className="flex-1">
            <Text className="font-mRegular mb-1">
              First Name <Text className="text-red-600">*</Text>
            </Text>
            <TextInput
              className="border rounded-lg px-3 py-2 mb-3 bg-gray-50 border-gray-300 focus:border-gray-500"
              value={form.firstName}
              onChangeText={text => setForm(f => ({ ...f, firstName: text }))}
              placeholder="First Name"
            />
          </View>
          <View className="flex-1">
            <Text className="font-mRegular mb-1">
              Last Name <Text className="text-red-600">*</Text>
            </Text>
            <TextInput
              className="border rounded-lg px-3 py-2 mb-3 bg-gray-50 border-gray-300 focus:border-gray-500"
              value={form.lastName}
              onChangeText={text => setForm(f => ({ ...f, lastName: text }))}
              placeholder="Last Name"
            />
          </View>
        </View>
        <Text className="font-mRegular mb-1">
          Address <Text className="text-red-600">*</Text>
        </Text>
        <TextInput
          className="border rounded-lg px-3 py-2 mb-3 bg-gray-50 border-gray-300 focus:border-gray-500"
          value={form.address}
          onChangeText={text => setForm(f => ({ ...f, address: text }))}
          placeholder="Address"
        />
        <Text className="font-mRegular mb-1">Apt/Suite</Text>
        <TextInput
          className="border rounded-lg px-3 py-2 mb-3 bg-gray-50 border-gray-300 focus:border-gray-500"
          value={form.aptSuite}
          onChangeText={text => setForm(f => ({ ...f, aptSuite: text }))}
          placeholder="Apt/Suite"
        />
        <View className="flex flex-row gap-2">
          <View className="flex-1">
            {/* Province Picker */}
            <CustomPicker
              label="Province*"
              options={PROVINCE_OPTIONS}
              selectedValue={form.province}
              onValueChange={(val) => setForm((prev) => ({ ...prev, province: val }))}
              placeholder="Select province"
            />
          </View>
          <View className="flex-1">
            <Text className="font-mRegular mb-1">
              City <Text className="text-red-600">*</Text>
            </Text>
            <TextInput
              className="border rounded-lg px-3 py-2 mb-3 bg-gray-50 border-gray-300 focus:border-gray-500"
              value={form.city}
              onChangeText={text => setForm(f => ({ ...f, city: text }))}
              placeholder="City"
            />
          </View>
        </View>
        <View className="flex flex-row gap-2">
          <View className="flex-1">
            <Text className="font-mRegular mb-1">
              Postal Code <Text className="text-red-600">*</Text>
            </Text>
            <TextInput
              className="border rounded-lg px-3 py-2 mb-3 bg-gray-50 border-gray-300 focus:border-gray-500"
              value={form.postalCode}
              onChangeText={text => setForm(f => ({ ...f, postalCode: text }))}
              placeholder="Postal Code"
            />
          </View>
          <View className="flex-1">
            <Text className="font-mRegular mb-1">
              Phone Number <Text className="text-red-600">*</Text>
            </Text>
            <TextInput
              className="border rounded-lg px-3 py-2 mb-3 bg-gray-50 border-gray-300 focus:border-gray-500"
              value={form.phone}
              onChangeText={text => setForm(f => ({ ...f, phone: text }))}
              placeholder="Phone Number"
              keyboardType="phone-pad"
            />
          </View>
        </View>
        <Text className="font-mRegular mb-1">
          Email Address <Text className="text-red-600">*</Text>
        </Text>
        <TextInput
          className="border rounded-lg px-3 py-2 mb-3 bg-gray-50 border-gray-300 focus:border-gray-500"
          value={form.email}
          onChangeText={text => setForm(f => ({ ...f, email: text }))}
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          className="flex-row items-center my-2"
          onPress={() =>
            setForm(f => ({ ...f, termsAccepted: !f.termsAccepted }))
          }
          activeOpacity={0.7}
        >
          <Checkbox checked={form.termsAccepted} />
          <Text className="text-sm font-mSemiBold">
            I accept the terms and conditions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`mt-4 py-3 rounded-xl items-center ${form.termsAccepted && !loading
            ? "bg-darkPrimary"
            : "bg-gray-400"
            }`}
          disabled={!form.termsAccepted || loading}
          onPress={handleSubmit}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text className="text-white font-mBold text-base">Register Product</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
