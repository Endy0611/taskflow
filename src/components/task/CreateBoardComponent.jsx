import { useState } from "react";
import { X } from "lucide-react";
import { http } from "../../services/http"; // API helper

export function CreateBoardComponent({ onClose, onSuccess, workspaceId }) {
  const [boardTitle, setBoardTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Use workspaceId from props, fallback to localStorage
  const wsId = workspaceId || localStorage.getItem("current_workspace_id");

  const handleCreateBoard = async (e) => {
    e.preventDefault();

    if (!boardTitle.trim()) {
      setError("Board title is required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Send request to create the board in the selected workspace
      const data = await http.post("/boards", {
        title: boardTitle,
        workspace: `/workspaces/${wsId}`,
      });

      // console.log("✅ Board created response:", data);

      // ✅ Call onSuccess with the created board data
      if (onSuccess) {
        onSuccess(data);
      }

      // Reset and close
      setBoardTitle("");
      // Don't call onClose here - let the parent handle it after onSuccess
    } catch (err) {
      // Handle error
      const status = err?.response?.status ?? err?.status;
      const message =
        status
          ? `Error ${status}: ${err?.response?.data?.message || err?.statusText || "Request failed"}`
          : err?.message || "Network error";
      setError(message);
      console.error("❌ Board creation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 dark:text-white rounded-lg p-6 shadow-lg relative space-y-6">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"
      >
        <X size={20} />
      </button>

      <h2 className="text-2xl font-semibold text-center text-primary">
        Create Board
      </h2>

      {/* Board Title */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Board Title</label>
        <input
          type="text"
          value={boardTitle}
          onChange={(e) => setBoardTitle(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md bg-white dark:bg-gray-700 dark:text-white focus:outline-none"
          placeholder="e.g., Marketing Campaign"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={handleCreateBoard}
          disabled={loading}
          className="bg-primary text-white px-4 py-2 rounded-md flex-1 disabled:opacity-60 hover:opacity-90"
        >
          {loading ? "Creating..." : "Create"}
        </button>
        <button 
          onClick={onClose}
          className="bg-secondary text-white px-4 py-2 rounded-md flex-1 hover:opacity-90"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}