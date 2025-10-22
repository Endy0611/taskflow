// components/chatbot/ChatbotButton.jsx
export function ChatbotButton({ onClick }) {
  return (
    <img
      src="/assets/general/chatbot.png"
      alt="Our Chatbot"
      className="fixed bottom-6 right-6 w-16 h-16 sm:w-20 sm:h-20 z-40 rounded-full shadow-lg cursor-pointer bg-white"
      onClick={onClick}
    />
  );
}