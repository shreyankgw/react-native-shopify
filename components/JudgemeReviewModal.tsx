import React, { useReducer, useState } from "react";
import { View, Text, TextInput, Modal, Pressable, ActivityIndicator, Alert } from "react-native";
import { submitJudgeMeReview } from "@/utilities/submitJudgemeReview";

// --- Reducer for form state ---
const initialForm = {
  name: "",
  email: "",
  title: "",
  body: "",
  rating: 5,
};
type FormAction =
  | { type: "SET_FIELD"; field: keyof typeof initialForm; value: string | number }
  | { type: "RESET" };

function formReducer(state: typeof initialForm, action: FormAction) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return { ...initialForm };
    default:
      return state;
  }
}

type JudgeMeWriteReviewModalProps = {
  visible: boolean;
  onClose: () => void;
  productId: number; // Shopify Product Id
};

export default function JudgeMeWriteReviewModal({
  visible,
  onClose,
  productId,
}: JudgeMeWriteReviewModalProps) {
  const [form, dispatch] = useReducer(formReducer, initialForm);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // Validation logic
  const validate = () => {
    const errs: { [k: string]: string } = {};
    if (!form.name.trim()) errs.name = "Name required";
    if (!form.email.trim()) errs.email = "Email required";
    else if (!/\S+@\S+\.\S+/.test(form.email.trim())) errs.email = "Invalid email";
    if (!form.title.trim()) errs.title = "Title required";
    if (!form.body.trim() || form.body.length < 10) errs.body = "Review must be at least 10 characters";
    if (form.rating < 1 || form.rating > 5) errs.rating = "Rating required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit logic
  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await submitJudgeMeReview({
        productId: productId,
        reviewerName: form.name,
        reviewerEmail: form.email,
        rating: form.rating,
        title: form.title,
        body: form.body,
      });
      Alert.alert("Thank you!", "Your review has been submitted successfully.");
      onClose();
      dispatch({ type: "RESET" });
      setErrors({});
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-center items-center bg-black/30">
        <View className="bg-white rounded-2xl p-6 w-[90%] max-w-xl">
          <Text className="text-xl font-bold mb-4">Write a Review</Text>
          <Text className="mb-2 mt-2 font-bold">Name:</Text>
          <TextInput
            className="mb-4 border border-gray-300 p-2 "
            placeholder="Your name"
            value={form.name}
            onChangeText={(val) => dispatch({ type: "SET_FIELD", field: "name", value: val })}
            editable={!loading}
          />
          {errors.name && <Text className="text-xs text-red-500 mb-1">{errors.name}</Text>}

          <Text className="mb-2 mt-2 font-bold">Email:</Text>
          <TextInput
            className="mb-4 border border-gray-300 p-2"
            placeholder="Your email"
            value={form.email}
            onChangeText={(val) => dispatch({ type: "SET_FIELD", field: "email", value: val })}
            keyboardType="email-address"
            editable={!loading}
            autoCapitalize="none"
          />
          {errors.email && <Text className="text-xs text-red-500 mb-1">{errors.email}</Text>}

          <Text className="mb-2 mt-2 font-bold">Review Title:</Text>
          <TextInput
            className="mb-4 border border-gray-300 p-2"
            placeholder="Review title"
            value={form.title}
            onChangeText={(val) => dispatch({ type: "SET_FIELD", field: "title", value: val })}
            editable={!loading}
          />
          {errors.title && <Text className="text-xs text-red-500 mb-1">{errors.title}</Text>}

          <Text className="mb-2 mt-2 font-bold">Description:</Text>
          <TextInput
            className="mb-4 border border-gray-300 p-2"
            placeholder="Write your review..."
            value={form.body}
            onChangeText={(val) => dispatch({ type: "SET_FIELD", field: "body", value: val })}
            multiline
            editable={!loading}
            style={{ minHeight: 60, textAlignVertical: "top" }}
          />
          {errors.body && <Text className="text-xs text-red-500 mb-1">{errors.body}</Text>}

          <Text className="mb-2 mt-2">Rating:</Text>
          <View className="flex-row mb-4">
            {[1, 2, 3, 4, 5].map((val) => (
              <Pressable key={val} onPress={() => dispatch({ type: "SET_FIELD", field: "rating", value: val })} disabled={loading}>
                <Text style={{ fontSize: 32, color: val <= form.rating ? "#82bc00" : "#ddd" }}>★</Text>
              </Pressable>
            ))}
          </View>
          {errors.rating && <Text className="text-xs text-red-500 mb-1">{errors.rating}</Text>}

          <View className="flex flex-row justify-end mt-2 gap-4 items-center">
            <Pressable onPress={onClose} disabled={loading}>
              <Text className="text-base text-gray-500">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleSubmit}
              className="px-5 py-2 rounded-xl bg-[#82bc00]"
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-base text-white font-bold">Submit</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
