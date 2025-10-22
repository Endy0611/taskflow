import React, { useState } from "react";
import { X } from "lucide-react";

export default function SearchMemberComponent({ onSelect, onClose }) {
  const members = [
    { name: "Dara Dorn", initials: "DD", color: "bg-blue-500" },
    { name: "Mon Sreyneat", initials: "MS", color: "bg-orange-500" },
    { name: "Ong Endy", initials: "OE", color: "bg-purple-500" },
    { name: "Rith Saramanith", initials: "RS", color: "bg-green-500" },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg shadow-lg w-80 p-5 relative transition-all duration-200">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-3 p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >
        <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      <h2 className="text-lg font-semibold mb-4 text-center">Members</h2>

      <input
        type="text"
        placeholder="Search members..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 mb-3 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        Board members
      </h3>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((m, idx) => (
            <div
              key={idx}
              onClick={() => onSelect && onSelect(m)}
              className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md p-2 transition cursor-pointer"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${m.color}`}
              >
                {m.initials}
              </div>
              <span className="text-gray-800 dark:text-gray-200">{m.name}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm text-center py-4">
            No members found
          </p>
        )}
      </div>
    </div>
  );
}
