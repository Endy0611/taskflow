import { useState, useEffect } from "react";
import { Pencil, X } from "lucide-react";
import EditLabelModal from "./EditLabelModal";

export default function LabelComponent({
  onToggleLabel,
  onClose,
  selectedLabels = [],
}) {
  const [labels, setLabels] = useState([
    { id: 1, title: "Important", color: "#22c55e" },
    { id: 2, title: "Pending", color: "#facc15" },
    { id: 3, title: "In Progress", color: "#f97316" },
    { id: 4, title: "Urgent", color: "#dc2626" },
  ]);

  const [editingLabelId, setEditingLabelId] = useState(null);
  const [editingLabelData, setEditingLabelData] = useState(null);
  const [creatingLabel, setCreatingLabel] = useState(false);
  const [newLabel, setNewLabel] = useState({ title: "", color: "#22c55e" });
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 Search state

  // 🔁 Update checked state based on TaskDetail selection
  useEffect(() => {
    setLabels((prev) =>
      prev.map((l) => ({
        ...l,
        checked: selectedLabels.some((s) => s.title === l.title),
      }))
    );
  }, [selectedLabels]);

  const openEditor = (label) => {
    setEditingLabelId(label.id);
    setEditingLabelData({ ...label });
  };

  const handleSave = (updated) => {
    setLabels((prev) =>
      prev.map((l) => (l.id === editingLabelId ? { ...l, ...updated } : l))
    );
    setEditingLabelId(null);
    setEditingLabelData(null);
  };

  const handleDelete = (id) => {
    setLabels((prev) => prev.filter((l) => l.id !== id));
  };

  const handleCreate = () => {
    if (!newLabel.title.trim()) return;
    const newId = Date.now();
    const label = { id: newId, ...newLabel };
    setLabels([...labels, label]);
    setCreatingLabel(false);
    setNewLabel({ title: "", color: "#22c55e" });
  };

  const toggleLabel = (label) => {
    onToggleLabel(label);
  };

  // 🔍 Filter labels based on search
  const filteredLabels = labels.filter((l) =>
    l.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-80 p-4 relative border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300"
      >
        <X className="w-5 h-5" />
      </button>

      <h2 className="text-lg font-semibold mb-3 text-center">Labels</h2>

      {/* 🔍 Search Input */}
      <input
        type="text"
        placeholder="Search labels..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
      />

      <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-2">Labels</h3>

      <div className="space-y-2">
        {filteredLabels.length > 0 ? (
          filteredLabels.map((l) => (
            <div key={l.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={l.checked}
                onChange={() => toggleLabel(l)}
                className="w-4 h-4 rounded border-gray-400 text-blue-600 dark:bg-gray-700 dark:border-gray-500 cursor-pointer"
              />
              <div
                className="h-6 flex-1 rounded-sm flex items-center justify-center text-white text-sm font-medium"
                style={{ backgroundColor: l.color }}
              >
                {l.title}
              </div>
              <Pencil
                className="w-4 h-4 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                onClick={() => openEditor(l)}
              />
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400 italic">No matching labels found</p>
        )}

        {creatingLabel && (
          <div className="flex flex-col gap-2 mt-4">
            <input
              type="text"
              placeholder="Label title"
              value={newLabel.title}
              onChange={(e) =>
                setNewLabel((prev) => ({ ...prev, title: e.target.value }))
              }
              className="border border-gray-300 dark:border-gray-600 px-2 py-1 rounded bg-white dark:bg-gray-700"
            />
            <h2 className="text-sm text-gray-500">Choose your label color:</h2>
            <input
              type="color"
              value={newLabel.color}
              onChange={(e) =>
                setNewLabel((prev) => ({ ...prev, color: e.target.value }))
              }
              className="h-8 w-full rounded cursor-pointer bg-transparent"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
              >
                Add
              </button>
              <button
                onClick={() => setCreatingLabel(false)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {!creatingLabel && (
        <button
          onClick={() => setCreatingLabel(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 mt-3 transition"
        >
          Create a new label
        </button>
      )}

      {editingLabelData && (
        <EditLabelModal
          label={editingLabelData}
          onSave={handleSave}
          onDelete={() => handleDelete(editingLabelId)}
          onClose={() => {
            setEditingLabelId(null);
            setEditingLabelData(null);
          }}
        />
      )}
    </div>
  );
}
