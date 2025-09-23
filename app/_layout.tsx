// app/_layout.tsx
import { Stack } from "expo-router";
import { ChatProvider } from "../components/ChatContext";

export default function RootLayout() {
  return (
    <ChatProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="chat"
          options={{
            headerShown: false,
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
      </Stack>
    </ChatProvider>
  );
}
