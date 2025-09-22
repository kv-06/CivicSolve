// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

// Import screens
import HomeScreen from "./screens/HomeScreen";
import DiscoverScreen from "./screens/DiscoverScreen";
import ReportScreen from "./screens/ReportScreen";
import MyIssuesScreen from "./screens/MyIssuesScreen";
import ProfileScreen from "./screens/ProfileScreen";
import IssueDetailScreen from "./screens/IssueDetailScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator for Home (includes issue details)
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="IssueDetail"
        component={IssueDetailScreen}
        options={{
          headerTitle: "Issue Details",
          headerStyle: { backgroundColor: "#2196F3" },
          headerTintColor: "#fff",
        }}
      />
    </Stack.Navigator>
  );
}

// Stack Navigator for Discover (includes issue details)
function DiscoverStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="IssueDetail"
        component={IssueDetailScreen}
        options={{
          headerTitle: "Issue Details",
          headerStyle: { backgroundColor: "#2196F3" },
          headerTintColor: "#fff",
        }}
      />
    </Stack.Navigator>
  );
}

// Stack Navigator for My Issues (includes issue details)
function MyIssuesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyIssues"
        component={MyIssuesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="IssueDetail"
        component={IssueDetailScreen}
        options={{
          headerTitle: "Issue Details",
          headerStyle: { backgroundColor: "#2196F3" },
          headerTintColor: "#fff",
        }}
      />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "HomeStack") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "DiscoverStack") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Report") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "MyIssuesStack") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2196F3",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{ tabBarLabel: "Home" }}
      />
      <Tab.Screen
        name="DiscoverStack"
        component={DiscoverStack}
        options={{ tabBarLabel: "Discover" }}
      />
      <Tab.Screen
        name="Report"
        component={ReportScreen}
        options={{ tabBarLabel: "Report" }}
      />
      <Tab.Screen
        name="MyIssuesStack"
        component={MyIssuesStack}
        options={{ tabBarLabel: "My Issues" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: "Profile" }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#1976D2" />
      <TabNavigator />
    </NavigationContainer>
  );
}
