import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Monday",
          tabBarIcon: ({ focused, color, size }) => {
            const iconName = focused ? "location" : "location-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="tdNotifications"
        options={{
          title: "Wednesday",
          tabBarIcon: ({ focused, color, size }) => {
            const iconName = focused ? "notifications" : "notifications-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="mapSearch"
        options={{
          title: "Friday",
          tabBarIcon: ({ focused, color, size }) => {
            const iconName = focused ? "search" : "search-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({});
