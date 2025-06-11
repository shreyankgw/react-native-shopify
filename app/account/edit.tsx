import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView, Modal, Alert, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useAuth } from "@/context/authContext";
import { fetchCustomerProfile } from "@/lib/shopifyQueries";
import { createCustomerAddress, updateCustomerAddress, deleteCustomerAddress, updateCustomerName } from "@/lib/shopifyMutations";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Switch } from "react-native";
import { CANADIAN_PROVINCES } from "@/constants/shopifyConstants";
import CustomPicker from "@/components/CustomPicker";

interface Address {
  id?: string;
  address1: string;
  address2?: string;
  city: string;
  company?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  territoryCode: string; // e.g., 'CA'
  zip: string;
  zoneCode: string; // Province code (e.g., 'ON')
  defaultAddress?: boolean;
}

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: {
    emailAddress: string;
  };
  phoneNumber: {
    phoneNumber: string;
  }
  defaultAddress: Address | null;
  addresses: {
    edges: { node: Address }[];
  }
}

export default function AccountEdit() {
  const { isLoggedIn, getValidAccessToken } = useAuth();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Modal controls for profile fields (name, email, etc)
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState<string | null>(null);

  // Address modal controls
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [addressModalMode, setAddressModalMode] = useState<"add" | "edit">("add");
  const [addressEditIdx, setAddressEditIdx] = useState<string | null>(null);
  const [addressEditData, setAddressEditData] = useState<Address | null>(null);

  const [nameForm, setNameForm] = useState({ firstName: "", lastName: "" });
  const [savingName, setSavingName] = useState(false);


  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const token = await getValidAccessToken();
        if (!token) throw new Error("Not authenticated");
        const profile = await fetchCustomerProfile(token);
        setCustomer(profile);
      } catch (err: any) {
        setLoadError(err?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    if (isLoggedIn) {
      fetchProfile();
    }
  }, [isLoggedIn]);

  // Profile field editing modal
    const openEditModal = (field: string) => {
      setEditField(field);
      if (field === "firstName" || field === "lastName") {
        setNameForm({
          firstName: customer?.firstName || "",
          lastName: customer?.lastName || "",
        });
      }
      setEditModalVisible(true);
    };
  

  const closeEditModal = () => {
    setEditModalVisible(false);
    setEditField(null);
  };

  // Address Add/Edit/Delete handlers
  const handleAddAddress = () => {
    setAddressModalMode("add");
    setAddressEditData(null);
    setAddressEditIdx(null);
    setAddressModalVisible(true);
  };

  const handleEditAddress = (address: Address, idx: string) => {
    setAddressModalMode("edit");
    setAddressEditData({
      ...address,
      firstName: address.firstName ?? customer?.firstName ?? "",
      lastName: address.lastName ?? customer?.lastName ?? "",
      company: address.company ?? "",
      phoneNumber: address.phoneNumber ?? customer?.phoneNumber?.phoneNumber ?? "",
    });
    setAddressEditIdx(idx);
    setAddressModalVisible(true);
  };

  const handleDeleteAddress = (address: Address, idx: number) => {
    Alert.alert(
      "Remove Address?",
      "Are you sure you want to remove this address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove", style: "destructive", onPress: async () => {
            try {
              const token = await getValidAccessToken();

              console.log("remove address", address);
              await deleteCustomerAddress(token, address.id);
              refreshProfile();
            } catch (error: any) {
              throw new Error("Failed To delete the address, please try again later.")
            }
          }
        }
      ]
    );
  };

  const handleSaveAddress = async (address: Address) => {
    try {
      const token = await getValidAccessToken();
      if (!token) throw new Error("Not Authenticated");

      if (addressModalMode === "add") {
        // TODO: Add mutation
        console.log("Add address:", address);
        await createCustomerAddress(token, address);

      } else if (addressModalMode === "edit" && addressEditData) {
        // TODO: Edit mutation
        console.log("Edit address at", address);
        await updateCustomerAddress(token, address);
      }

      setAddressModalVisible(false);
      refreshProfile();

    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update address.");
    }
  };

  //refresh profile
  const refreshProfile = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const token = await getValidAccessToken();
      if (!token) throw new Error("Not authenticated");
      const profile = await fetchCustomerProfile(token);
      setCustomer(profile);
    } catch (err: any) {
      setLoadError(err?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveName = async () => {
  setSavingName(true);
  try {
    const token = await getValidAccessToken();
    if (!token) throw new Error("Not authenticated");
    await updateCustomerName(token, nameForm.firstName, nameForm.lastName);
    setEditModalVisible(false);
    await refreshProfile();
  } catch (err: any) {
    Alert.alert("Error", err?.message || "Failed to update name.");
  } finally {
    setSavingName(false);
  }
};


  // Address Modal UI component
  function AddressModal({
    visible,
    onClose,
    onSave,
    initialData,
    mode = "add"
  }: {
    visible: boolean;
    onClose: () => void;
    onSave: (address: Address) => void;
    initialData?: Address | null;
    mode?: "add" | "edit";
  }) {
    const [address, setAddress] = useState<Address>({
      address1: "",
      address2: "",
      city: "",
      company: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      territoryCode: "CA",
      zip: "",
      zoneCode: "ON",
      defaultAddress: false,
    });

    useEffect(() => {
      if (initialData) setAddress({
        address1: initialData.address1 ?? "",
        address2: initialData.address2 ?? "",
        city: initialData.city ?? "",
        company: initialData.company ?? "",
        firstName: initialData.firstName ?? "",
        lastName: initialData.lastName ?? "",
        phoneNumber: initialData.phoneNumber ?? "",
        territoryCode: initialData.territoryCode ?? "CA",
        zip: initialData.zip ?? "",
        zoneCode: initialData.zoneCode ?? "ON",
        defaultAddress: initialData.defaultAddress ?? false,
        id: initialData.id
      })
      else setAddress({
        address1: "",
        address2: "",
        city: "",
        company: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        territoryCode: "CA",
        zip: "",
        zoneCode: "ON",
        defaultAddress: false,
      });
    }, [visible, initialData]);

    return (
      <Modal visible={visible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.25)", justifyContent: "center", alignItems: "center" }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View className="bg-white rounded-2xl p-6 min-w-[320px] w-11/12 max-w-xl shadow-lg">
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text className="text-xl font-mBold mb-4">
                {mode === "edit" ? "Edit" : "Add"} Address
              </Text>

              <TextInput
                value={address.firstName ?? ""}
                onChangeText={text => setAddress(prev => ({ ...prev, firstName: text }))}
                placeholder="First Name"
                className="border border-gray-300 rounded-md p-2 mb-4 focus:border-gray-500"
              />
              <TextInput
                value={address.lastName ?? ""}
                onChangeText={text => setAddress(prev => ({ ...prev, lastName: text }))}
                placeholder="Last Name"
                className="border border-gray-300 rounded-md p-2 mb-4 focus:border-gray-500"
              />
              <TextInput
                value={address.address1 ?? ""}
                onChangeText={text => setAddress(prev => ({ ...prev, address1: text }))}
                placeholder="Address"
                className="border border-gray-300 rounded-md p-2 mb-4 focus:border-gray-500"
              />
              <TextInput
                value={address.address2 ?? ""}
                onChangeText={text => setAddress(prev => ({ ...prev, address2: text }))}
                placeholder="Apt/Suit/Unit (Optional)"
                className="border border-gray-300 rounded-md p-2 mb-4 focus:border-gray-500"
              />
              <TextInput
                value={address.city ?? ""}
                onChangeText={text => setAddress(prev => ({ ...prev, city: text }))}
                placeholder="City"
                className="border border-gray-300 rounded-md p-2 mb-4 focus:border-gray-500"
              />

              <TextInput
                value={address.zip ?? ""}
                onChangeText={text => setAddress(prev => ({ ...prev, zip: text }))}
                placeholder="Postal Code"
                className="border border-gray-300 rounded-md p-2 mb-4 focus:border-gray-500"
              />

              <CustomPicker
                label="Province"
                options={CANADIAN_PROVINCES}
                selectedValue={address.zoneCode}
                onValueChange={value => setAddress(prev => ({ ...prev, zoneCode: value }))}
              />

              <CustomPicker
                label="Country"
                options={[{ label: "Canada", value: "CA" }]}
                selectedValue={address.territoryCode}
                onValueChange={value => setAddress(prev => ({ ...prev, territoryCode: value }))}
              />


              <TextInput
                value={address.company ?? ""}
                onChangeText={text => setAddress(prev => ({ ...prev, company: text }))}
                placeholder="Company"
                className="border border-gray-300 rounded-md p-2 mb-4 focus:border-gray-500"
              />
              <TextInput
                value={address.phoneNumber ?? ""}
                onChangeText={text => setAddress(prev => ({ ...prev, phoneNumber: text }))}
                placeholder="Phone Number (Without country code)"
                keyboardType="phone-pad"
                className="border border-gray-300 rounded-md p-2 mb-4 focus:border-gray-500"
              />

              <View className="flex-row items-center mb-2 mt-3">
                <Switch
                  value={!!address.defaultAddress}
                  onValueChange={v => setAddress(prev => ({ ...prev, defaultAddress: v }))}
                  trackColor={{ false: "#ccc", true: "#2563eb" }}
                  thumbColor={address.defaultAddress ? "#fff" : "#fff"}
                />
                <Text className="ml-3 text-base">Set as default address</Text>
              </View>

              <View className="flex-row justify-between mt-4">
                <TouchableOpacity
                  onPress={onClose}
                  className="bg-gray-300 py-2 px-4 rounded-lg"
                >
                  <Text>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onSave(address)}
                  className="bg-darkPrimary py-2 px-4 rounded-lg"
                >
                  <Text className="text-white font-bold">{mode === "edit" ? "Save" : "Add"}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }

  // Address List section UI
  function AddressSection({ addresses }: { addresses: Address[] }) {
    return (
      <View className="mt-8">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-lg font-mBold">All Addresses</Text>
          <TouchableOpacity
            onPress={handleAddAddress}
            className="bg-darkPrimary px-3 py-1 rounded-lg flex-row items-center"
          >
            <Ionicons name="add-outline" size={18} color="#fff" />
            <Text className="text-white ml-1">Add</Text>
          </TouchableOpacity>
        </View>
        {addresses.length === 0 ? (
          <Text className="text-gray-500">No addresses added yet.</Text>
        ) : (
          addresses.map((address, idx) => (
            <View
              key={idx}
              className="mb-4 p-3 rounded-xl border border-gray-200 bg-gray-50 flex-row justify-between items-start"
            >
              <View className="flex-1 pr-2">
                <Text className="font-mBold text-base">
                  {address.address1}
                  {address.address2 ? `, ${address.address2}` : ""}
                </Text>
                <Text className="text-sm text-gray-600">
                  {address.city}, {address.province}, {address.country}
                  {"\n"}
                  {address.zip}
                </Text>
                {address.company ? (
                  <Text className="text-xs text-gray-500 mt-1">Company: {address.company}</Text>
                ) : null}
              </View>
              <View className="flex-row gap-2 ml-2">
                <TouchableOpacity
                  onPress={() => handleEditAddress(address, address.id ?? "")}
                  className="p-1"
                >
                  <Ionicons name="pencil-outline" size={18} color="#24272a" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteAddress(address, idx)}
                  className="p-1"
                >
                  <Ionicons name="trash" size={18} color="#e11d48" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="flex flex-row items-center justify-between p-4 border-b-2 border-gray-200 w-full">
          <TouchableOpacity className="text-3xl font-mBold" onPress={() => router.back()}>
            <Ionicons name="arrow-back-outline" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-mBold uppercase">Profile Details</Text>
          <TouchableOpacity className="text-3xl font-mBold" onPress={() => router.push("/(tabs)/cart")}>
            <Ionicons name="bag-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {!isLoggedIn ? (
          <View className="flex-1 items-center justify-center p-10">
            <Text className="text-lg text-gray-500">You are Logged out, Please login again!</Text>
          </View>
        ) : loading ? (
          <View className="flex-1 items-center justify-center p-10">
            <ActivityIndicator size="large" />
            <Text className="mt-4 text-gray-500">Loading profile...</Text>
          </View>
        ) : loadError ? (
          <View className="flex-1 items-center justify-center p-10">
            <Text className="text-red-600">{loadError}</Text>
          </View>
        ) : customer && (
          <View className="p-6">
            {/* --- Name --- */}
            <View className="flex-row justify-between items-center py-4 border-b border-gray-200">
              <View>
                <Text className="text-base text-gray-600">First Name</Text>
                <Text className="text-xl font-mBold">{customer.firstName || <Text className="text-gray-400">Anonymous</Text>}</Text>
              </View>
              <TouchableOpacity onPress={() => openEditModal("firstName")}>
                <Ionicons name="pencil" size={18} color="#24272a" />
              </TouchableOpacity>
            </View>
            <View className="flex-row justify-between items-center py-4 border-b border-gray-200">
              <View>
                <Text className="text-base text-gray-600">Last Name</Text>
                <Text className="text-xl font-mBold">{customer.lastName || <Text className="text-gray-400">Anonymous</Text>}</Text>
              </View>
              <TouchableOpacity onPress={() => openEditModal("lastName")}>
                <Ionicons name="pencil" size={18} color="#24272a" />
              </TouchableOpacity>
            </View>
            {/* --- Email --- */}
            <View className="flex-row justify-between items-center py-4 border-b border-gray-200">
              <View>
                <Text className="text-base text-gray-600">Email</Text>
                <Text className="text-xl font-mBold">{customer.emailAddress?.emailAddress || <Text className="text-gray-400">Not set</Text>}</Text>
              </View>

            </View>
            {/* --- Phone Number --- */}
            <View className="flex-row justify-between items-center py-4 border-b border-gray-200">
              <View>
                <Text className="text-base text-gray-600">Phone Number</Text>
                <Text className="text-xl font-mBold">{customer?.phoneNumber.phoneNumber || <Text className="text-gray-400">Not set</Text>}</Text>
              </View>

            </View>
            {/* --- Default Address --- */}
            <View className="flex-row justify-between items-center py-4 border-b border-gray-200">
              <View>
                <Text className="text-base text-gray-600">Default Address</Text>
                {customer.defaultAddress ? (
                  <Text className="text-base font-mBold">
                    {customer.defaultAddress.address1}{customer.defaultAddress.address2 ? `, ${customer.defaultAddress.address2}` : ""}
                    {`\n`}
                    {customer.defaultAddress.city}, {customer.defaultAddress.province}, {customer.defaultAddress.country}
                    {`\n`}
                    {customer.defaultAddress.zip}
                    {customer.defaultAddress.phoneNumber ? `\n${customer.defaultAddress.phoneNumber}` : ""}
                  </Text>
                ) : (
                  <Text className="text-gray-400">No address set</Text>
                )}
              </View>
              <TouchableOpacity onPress={() => openEditModal("address")}>
                <Ionicons name="pencil" size={18} color="#24272a" />
              </TouchableOpacity>
            </View>
            {/* --- All Addresses --- */}
            <AddressSection addresses={customer.addresses?.edges.map(e => e.node) || []} />
          </View>
        )}
      </ScrollView>

      {/* --- Edit Profile Modal (fields: name, email, etc.) --- */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        onRequestClose={closeEditModal}
        transparent
      >
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className="bg-white rounded-2xl p-6 min-w-[320px] shadow-lg">
            <Text className="text-xl font-bold mb-4 capitalize">Edit {editField}</Text>
            {/* Render form for the selected field here */}
            <Text className="text-gray-500">Updating {editField} coming soon...</Text>
            <TouchableOpacity
              onPress={closeEditModal}
              className="mt-6 py-2 px-4 bg-darkPrimary rounded-lg"
            >
              <Text className="text-white text-lg font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- Address Add/Edit Modal --- */}
      <AddressModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        onSave={handleSaveAddress}
        initialData={addressEditData}
        mode={addressModalMode}
      />
    </SafeAreaView>
  );
}