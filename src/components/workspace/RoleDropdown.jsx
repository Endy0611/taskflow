import { useState } from "react";
import { updateMemberRole } from "../../services/workspaceService";

export default function RoleDropdown({
  membershipId,
  initial,
  disabled,
  onChanged,
}) {
  const [val, setVal] = useState(initial ?? "VIEWER");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(next) {
    if (next === val || busy) return;
    setBusy(true);
    setError("");

    try {
      setVal(next); // Optimistic UI
      await updateMemberRole({ membershipId, permission: next });
      onChanged?.(next);
    } catch (err) {
      console.error("❌ Role update failed:", err);
      setError("Failed to update role");
      setVal(initial); // Revert if failed
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative">
      <select
        disabled={disabled || busy}
        value={val}
        onChange={(e) => handleChange(e.target.value)}
        className={`px-3 py-1.5 text-sm border rounded-lg transition-colors duration-150
          ${busy ? "opacity-70 cursor-wait" : "cursor-pointer"}
          bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600
          hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
      >
        <option value="OWNER">Owner</option>
        <option value="EDITOR">Editor</option>
        <option value="VIEWER">Viewer</option>
      </select>

      {error && (
        <p className="absolute text-xs text-red-500 mt-1 w-max whitespace-nowrap">
          {error}
        </p>
      )}
    </div>
  );
}
