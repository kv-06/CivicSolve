// components/ChatContext.tsx
import React, { createContext, useContext, useState } from "react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  type?: "text" | "quick_reply" | "suggestion";
}

interface ChatContextType {
  messages: Message[];
  isTyping: boolean;
  sendMessage: (text: string) => void;
  clearChat: () => void;
  isChatVisible: boolean;
  setChatVisible: (visible: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your civic assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
    {
      id: "2",
      text: "You can ask me about:\n• How to report issues\n• Issue status updates\n• Community guidelines\n• Contact information",
      sender: "bot",
      timestamp: new Date(),
      type: "suggestion",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isChatVisible, setChatVisible] = useState(false);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Simple rule-based responses
    if (lowerMessage.includes("report") || lowerMessage.includes("issue")) {
      return "To report an issue, go to the Report tab and fill out the form with details, photos, and location. Your report will be reviewed by our team within 24 hours.";
    }

    if (lowerMessage.includes("status") || lowerMessage.includes("update")) {
      return 'You can check the status of your reported issues in the "My Issues" tab. Issues go through these stages: Reported → Under Review → In Progress → Completed.';
    }

    if (
      lowerMessage.includes("contact") ||
      lowerMessage.includes("phone") ||
      lowerMessage.includes("email")
    ) {
      return "You can contact our support team:\n📞 Phone: 1800-CIVIC-HELP\n📧 Email: support@civicreporter.gov\n🕒 Hours: 9 AM - 6 PM, Mon-Fri";
    }

    if (lowerMessage.includes("emergency") || lowerMessage.includes("urgent")) {
      return "🚨 For emergencies, please call:\n• Police: 100\n• Fire: 101\n• Ambulance: 102\n\nThis app is for non-emergency civic issues only.";
    }

    if (
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hi") ||
      lowerMessage.includes("hey")
    ) {
      return "Hello! I'm here to help you with civic issues and app navigation. What would you like to know?";
    }

    if (lowerMessage.includes("thank") || lowerMessage.includes("thanks")) {
      return "You're welcome! I'm glad I could help. Is there anything else you'd like to know about reporting civic issues?";
    }

    if (lowerMessage.includes("category") || lowerMessage.includes("type")) {
      return "We have 8 issue categories:\n• Road & Transport\n• Water & Sanitation\n• Electricity\n• Garbage & Waste\n• Public Safety\n• Health & Medical\n• Education\n• Others\n\nChoose the most relevant category when reporting.";
    }

    // Default response
    return (
      "I understand you're asking about \"" +
      userMessage +
      '". Let me help you with that. You can:\n\n• Report civic issues using the Report tab\n• Track your issues in My Issues\n• Contact support if you need immediate assistance\n\nWhat specific help do you need?'
    );
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(text),
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // 1-2 seconds delay
  };

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        text: "Hello! I'm your civic assistant. How can I help you today?",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        isTyping,
        sendMessage,
        clearChat,
        isChatVisible,
        setChatVisible,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
