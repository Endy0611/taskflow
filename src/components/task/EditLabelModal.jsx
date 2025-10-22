import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function EditLabelModal({ label, onSave, onDelete, onClose }) {
  const [title, setTitle] = useState(label?.title ?? "");
  const [selectedColor, setSelectedColor] = useState(label?.color ?? "");

  useEffect(() => {
    setTitle(label?.title ?? "");
    setSelectedColor(label?.color ?? "");
  }, [label]);

  const colors = [
    "#355E3B", "#6B5500", "#A15300", "#7C2D24", "#5C2A5C",
    "#567D6B", "#BFA935", "#D9822B", "#D95C51", "#A572F0",
    "#7B8AD1", "#3E6379", "#5C7030", "#432742", "#666666",
    "#3A5DB0", "#46718F", "#6D8E2B", "#D986B0", "#A0A0A0",
    "#8FA8F2", "#97C8E7", "#B9DA6D", "#EEA4DE", "#B0B0B0",
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-2xl p-6 w-80 shadow-xl transition-all duration-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          <h3 className="text-lg font-semibold">Edit Label</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Preview */}
        <div className="mb-4">
          <div
            className="px-3 py-2 rounded text-white font-medium text-center"
            style={{ backgroundColor: selectedColor || "#4B5563" }}
          >
            {title || "Label preview"}
          </div>
        </div>

        {/* Title Input */}
        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter label title"
          />
        </div>

        {/* Color Picker */}
        <div className="mb-4">
          <label className="block text-sm mb-2 text-gray-600 dark:text-gray-300">
            Select a color
          </label>

          {/* Preset colors */}
          <div className="grid grid-cols-5 gap-2 mb-3">
            {colors.map((color) => (
              <button
                type="button"
                key={color}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-150 ${
                  selectedColor === color
                    ? "ring-2 ring-blue-400 scale-110"
                    : "hover:scale-105"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>

          {/* Custom color input */}
          <div className="flex items-center gap-3 mb-2">
            <input
              type="color"
              value={selectedColor || "#4B5563"}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Choose your own color
            </span>
          </div>

          <button
            type="button"
            className="mt-2 text-sm text-red-500 hover:text-red-600"
            onClick={() => setSelectedColor("")}
          >
            Remove color
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium"
            onClick={() => onSave({ title, color: selectedColor })}
          >
            Save
          </button>

          <button
            className="px-4 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white font-medium"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
