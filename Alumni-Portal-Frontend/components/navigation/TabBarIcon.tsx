import { Ionicons } from "@expo/vector-icons";
import React from "react";

interface TabBarIconProps {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}

export const TabBarIcon: React.FC<TabBarIconProps> = ({ name, color }) => {
  return (
    <Ionicons size={24} style={{ marginBottom: 3 }} name={name} color={color} />
  );
};
