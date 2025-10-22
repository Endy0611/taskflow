import { X, Link, UserPlus } from "lucide-react";

export function ShareBoardComponent({ onClose }) {
  return (
    <div className="w-full max-w-xl bg-white rounded-xl p-6 shadow-lg relative space-y-6">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
      >
        <X size={20} />
      </button>

      <h2 className="text-2xl font-semibold">Share board</h2>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Email address or name"
          className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
        />
        <select className="border border-gray-300 rounded-md px-3 py-2">
          <option>Member</option>
          <option>Viewer</option>
        </select>
        <button className="flex items-center gap-1 bg-primary text-white px-4 py-2 rounded-md transition">
          <UserPlus size={16} />
          Share
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Link size={16} />
        <span>Share this board with a link</span>
        <a href="#" className="text-primary underline ml-2">
          Create link
        </a>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <div className="bg-secondary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
          M
        </div>
        <span>User (you)</span>
      </div>
    </div>
  );
}
