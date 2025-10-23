import React, { useState, useRef, useEffect } from "react";
import { X, Send, Loader2 } from "lucide-react";
const Chatbot="/assets/general/chatbotWhite.png";

const TaskFlowChatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hello, I'm TaskFlowBot. I can help you with TaskFlow questions or chat about anything!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Call Google Gemini API
  const callGeminiAPI = async (userMessage) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyA_cG2TqgUkCzzVXevIgMt62nSGO_085XE`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are TaskFlowBot, a helpful AI assistant for a task management application called TaskFlow. 
                Help users with both TaskFlow-specific questions and general inquiries in a friendly, professional manner.
                
                User question: ${userMessage}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 200,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Google Gemini API error: ${response.status} - ${
            errorData.error?.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();

      // Handle Gemini response format
      if (
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts[0]
      ) {
        return data.candidates[0].content.parts[0].text.trim();
      } else {
        throw new Error("Unexpected response format from Gemini API");
      }
    } catch (error) {
      console.error("Google Gemini API Error:", error);
      // Fallback to TaskFlow responses
      return getTaskFlowResponse(userMessage);
    }
  };

  // Enhanced TaskFlow-specific responses (fallback)
  const getTaskFlowResponse = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();

    if (
      lowerMsg.includes("hello") ||
      lowerMsg.includes("hi") ||
      lowerMsg.includes("hey")
    ) {
      const greetings = [
        "Hi there! How can I help you with TaskFlow today?",
        "Hello! Ready to boost your productivity?",
        "Hey! What would you like to know about TaskFlow?",
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    if (lowerMsg.includes("create") && lowerMsg.includes("task")) {
      return "To create a task in TaskFlow:\n1. Go to your workspace\n2. Select a project\n3. Click '+ Add Task'\n4. Fill in title, deadline, and assignee\n5. Set priority level\n\nNeed help with anything else?";
    }

    if (lowerMsg.includes("workspace")) {
      return "Workspaces are your main organizational hubs in TaskFlow! You can:\n• Create multiple workspaces for different teams\n• Invite team members\n• Organize projects within each workspace\n• Set workspace-level permissions\n\nWant to know more about projects or tasks?";
    }

    if (lowerMsg.includes("project")) {
      return "Projects help organize your tasks! Here's what you can do:\n• Create projects within workspaces\n• Add multiple tasks to each project\n• Track project progress\n• Set project deadlines\n• Assign project managers\n\nThink of workspaces as your office and projects as filing cabinets!";
    }

    if (lowerMsg.includes("assign") && lowerMsg.includes("task")) {
      return "Absolutely! To assign tasks:\n1. Open the task you want to assign\n2. Click 'Edit Task'\n3. Select 'Assign To' dropdown\n4. Choose a team member\n5. They'll get notified automatically!\n\nYou can also assign multiple people to one task.";
    }

    if (lowerMsg.includes("priority")) {
      return "TaskFlow supports 3 priority levels:\n🔴 High Priority - Urgent tasks\n🟡 Medium Priority - Important tasks\n🟢 Low Priority - When you have time\n\nYou can filter and sort tasks by priority to stay focused on what matters most!";
    }

    if (lowerMsg.includes("notification") || lowerMsg.includes("reminder")) {
      return "TaskFlow keeps you on track with:\n• Deadline reminders (1 day, 1 hour before)\n• Task assignment notifications\n• Project milestone alerts\n• Email digests (daily/weekly)\n\nYou can customize all notifications in your settings!";
    }

    if (lowerMsg.includes("guest") || lowerMsg.includes("trial")) {
      return "Guest users can:\n✅ View shared projects\n✅ Browse tasks\n✅ Leave comments\n\n❌ Cannot create tasks or projects\n❌ Limited workspace access\n\nUpgrade to unlock full features! Want to know about our plans?";
    }

    if (
      lowerMsg.includes("price") ||
      lowerMsg.includes("cost") ||
      lowerMsg.includes("plan")
    ) {
      return "TaskFlow offers:\n🆓 Free Plan - Up to 3 projects, 5 team members\n💼 Pro Plan - Unlimited projects, advanced features\n🏢 Enterprise - Custom solutions, priority support\n\nWhich plan interests you most?";
    }

    if (lowerMsg.includes("help") || lowerMsg.includes("support")) {
      return "I'm here to help! I can assist with:\n• Creating and managing tasks\n• Setting up workspaces and projects\n• User account questions\n• Feature explanations\n• Best practices\n\nWhat specific area would you like help with?";
    }

    if (lowerMsg.includes("thanks") || lowerMsg.includes("thank you")) {
      return "You're very welcome! I'm always here to help make your TaskFlow experience better. Is there anything else you'd like to know?";
    }

    // General responses for other queries
    const generalResponses = [
      "That's interesting! While I specialize in TaskFlow, I'm happy to chat. How can I help you be more productive today?",
      "I'd love to help with that! Is this related to task management or would you like to know more about TaskFlow features?",
      "Great question! I'm here to help with TaskFlow and productivity. What would you like to explore?",
      "I'm not sure about that specific topic, but I'm great with TaskFlow questions! What would you like to accomplish today?",
    ];

    return generalResponses[
      Math.floor(Math.random() * generalResponses.length)
    ];
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { type: "user", text: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      // Try AI API first, fall back to TaskFlow responses
      let botResponse;

      // Using Google Gemini AI with your API key
      botResponse = await callGeminiAPI(userMessage);

      // If AI API fails, fall back to TaskFlow responses
      if (!botResponse || botResponse.length < 10) {
        botResponse = getTaskFlowResponse(userMessage);
      }

      // Simulate API delay for better UX
      setTimeout(() => {
        setMessages((prev) => [...prev, { type: "bot", text: botResponse }]);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error:", error);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: "Sorry, I'm experiencing some technical difficulties. Let me help you with TaskFlow using my built-in knowledge!",
          },
        ]);
        setIsLoading(false);
      }, 500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  const [showChat, setShowChat] = useState(true);
  if (!showChat) {
    return null;
  }

  return (
    <div
      className="
      fixed bottom-3 right-3 z-50
      w-[90%] max-w-[380px] sm:max-w-md
      h-[60vh] sm:h-[600px]
      bg-white dark:bg-gray-900 rounded-xl shadow-2xl flex flex-col 
      overflow-hidden transition-colors
    "
    >
      {/* Header */}
      <div
        className="flex items-center justify-between 
      bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4"
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={Chatbot}
              alt="TaskFlow Bot"
              className="w-10 h-7 sm:w-12 sm:h-8 object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-900"></div>
          </div>
          <div>
            <span className="font-bold text-base sm:text-lg">TaskFlowBot</span>
            <div className="text-[10px] sm:text-xs text-blue-100">
              Always ready to help
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div
        className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 
      bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 transition-colors"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] p-2 sm:p-3 rounded-2xl shadow-sm ${
                msg.type === "user"
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-md"
                  : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-md"
              }`}
            >
              <div className="whitespace-pre-wrap break-words text-xs sm:text-sm leading-relaxed">
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div
              className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 
            border border-gray-200 dark:border-gray-700 p-2 sm:p-3 rounded-2xl 
            rounded-bl-md flex items-center space-x-2 shadow-sm"
            >
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-xs sm:text-sm">
                TaskFlowBot is thinking...
              </span>
            </div>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      {/* Quick Actions */}
      <div
        className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-50 dark:bg-gray-800 
      border-t border-gray-200 dark:border-gray-700 transition-colors"
      >
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {["Create Task", "Workspace Help", "Support"].map((action) => (
            <button
              key={action}
              onClick={() => setInput(action)}
              className="text-[10px] sm:text-xs bg-blue-100 dark:bg-blue-900 
              text-blue-700 dark:text-blue-200 
              px-2 py-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 
              transition-colors"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div
        className="p-3 sm:p-4 bg-white dark:bg-gray-900 
      border-t border-gray-200 dark:border-gray-700 transition-colors"
      >
        <div className="flex items-center space-x-2 sm:space-x-3">
          <input
            type="text"
            placeholder="Ask about TaskFlow or anything else..."
            className="flex-1 p-2 sm:p-3 border-2 border-gray-200 dark:border-gray-700 
            rounded-xl bg-white dark:bg-gray-800 
            text-gray-900 dark:text-gray-100 
            focus:outline-none focus:ring-2 focus:ring-blue-500 
            focus:border-transparent transition-all text-sm sm:text-base"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading}
            className={`p-2 sm:p-3 rounded-xl transition-all transform hover:scale-105 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg"
            } text-white`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskFlowChatbot;
