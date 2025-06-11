import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";

export interface PickerOption {
  label: string;
  value: string;
}

interface CustomPickerProps {
  label?: string;
  options: PickerOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export default function CustomPicker({
  label,
  options,
  selectedValue,
  onValueChange,
  placeholder = "Select...",
}: CustomPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedLabel = options.find(opt => opt.value === selectedValue)?.label || placeholder;

  return (
    <View style={{ marginBottom: 12 }}>
      {label && <Text style={{ marginBottom: 4, color: "#4b5563" }}>{label}</Text>}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          borderWidth: 1,
          borderColor: "#d1d5db",
          borderRadius: 8,
          paddingVertical: 12,
          paddingHorizontal: 14,
          backgroundColor: "#f3f4f6",
        }}
      >
        <Text style={{ color: selectedValue ? "#222" : "#9ca3af" }}>{selectedLabel}</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setModalVisible(false)}
          activeOpacity={1}
        >
          <View style={{
            width: "85%",
            maxHeight: 400,
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 10,
            elevation: 6
          }}>
            <ScrollView>
              {options.map(option => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => {
                    onValueChange(option.value);
                    setModalVisible(false);
                  }}
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 6,
                    borderBottomWidth: 1,
                    borderBottomColor: "#e5e7eb"
                  }}
                >
                  <Text style={{
                    fontWeight: option.value === selectedValue ? "bold" : "normal",
                    color: "#222"
                  }}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
