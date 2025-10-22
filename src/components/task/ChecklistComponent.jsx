import { useState } from "react";
import { X } from "lucide-react";

export default function ChecklistComponent({ onAdd, onClose }) {
  const [text, setText] = useState("");

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd(text);
    setText(""); // clear input after add
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg shadow-lg w-80 p-5 relative transition-all duration-200">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-3 p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >
        <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      <h2 className="text-lg font-semibold mb-4 text-center">Checklist</h2>

      <label className="text-sm text-gray-700 dark:text-gray-300 block mb-1">
        Title
      </label>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Checklist name..."
        className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleAdd}
        className="bg-primary text-white rounded-md w-full py-2 mt-4 hover:bg-primary/90 transition"
      >
        Add
      </button>
    </div>
  );
}
