// components/chatbot/ChatbotOverlay.jsx
import { AnimatePresence, motion } from "framer-motion";
import TaskFlowChatbot from "./Chatbot";
import { ChatbotButton } from "./ChatbotButton";

export default function ChatbotOverlay({ showChatbot, setShowChatbot }) {
  return (
    <>
      <ChatbotButton onClick={() => setShowChatbot(true)} />
      
      <AnimatePresence>
        {showChatbot && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowChatbot(false)}
            />
            <motion.div
              className="fixed bottom-24 right-8 z-50"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <TaskFlowChatbot onClose={() => setShowChatbot(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}