import { useState } from "react";
import { addMemberByUsername } from "../../services/workspaceService";

export default function InviteMemberModal({ workspaceId, onClose, onAdded }) {
  const [username, setUsername] = useState("");
  const [permission, setPermission] = useState("VIEWER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleInvite() {
    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // ✅ Invite and auto-join immediately (no pending)
      await addMemberByUsername({
        username,
        workspaceId,
        permission,
      });

      alert(
        `✅ Invitation sent to "${username}". They can accept or reject it.`
      );

      // 🔔 Notify all UI components to refresh (Navbar + Sidebar + Members)
      window.dispatchEvent(new CustomEvent("invitation:new"));
      window.dispatchEvent(new CustomEvent("workspace:changed"));

      // 🔄 Trigger refresh in parent if needed
      onAdded?.();

      // ✅ Close modal
      onClose?.();
    } catch (err) {
      console.error("❌ Invite failed:", err);
      setError(
        "Network or CORS error — please check connection or credentials."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-sm relative">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Invite Member by Username
        </h2>

        {/* Username Input */}
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 mb-3 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Permission Selector */}
        <select
          value={permission}
          onChange={(e) => setPermission(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 mb-3 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="OWNER">Owner</option>
          <option value="EDITOR">Editor</option>
          <option value="VIEWER">Viewer</option>
        </select>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleInvite}
            disabled={loading}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Inviting..." : "Invite"}
          </button>
        </div>
      </div>
    </div>
  );
}
