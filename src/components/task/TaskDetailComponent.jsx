import { useEffect, useMemo, useState } from "react";
import {
  Tag,
  CheckSquare,
  Users,
  Paperclip,
  Circle,
  Trash,
  ChartBarDecreasingIcon,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { http } from "../../services/http";

import { DeleteChecklistComponent } from "./DeleteChecklistComponent";
import { ShareBoardComponent } from "./ShareBoardComponent";
import LabelComponent from "./LabelComponent";
import ChecklistComponent from "./ChecklistComponent";
import SearchMemberComponent from "./SearchMemberComponent";
import { AttachFileComponent } from "./AttachFileComponent";

export default function TaskDetailComponent({ card, onClose }) {
  const taskId = card?.id; // <- must be provided when opening the modal

  // -------- Local UI state (members, labels, attachments) -----------
  const [attachments, setAttachments] = useState([]);
  const [labels, setLabels] = useState([
    { title: "Priority", color: "#22c55e" },
  ]);
  const [members, setMembers] = useState([
    { initials: "MS", color: "bg-orange-500" },
  ]);

  // -------- Checklist state -----------------------------------------
  const [checklist, setChecklist] = useState([]); // [{id, text, checked, position}]
  const [hideChecked, setHideChecked] = useState(false);
  const [activePopup, setActivePopup] = useState(null);

  // small flags
  const [loadingList, setLoadingList] = useState(false);
  const [busyIds, setBusyIds] = useState({}); // { [checklistId]: true }

  // Helpers
  const pickChecklistId = (it) =>
    String(
      it?.id ||
        (it?._links?.self?.href || "")
          .split("/checklists/")[1]
          ?.split(/[/?#]/)[0] ||
        ""
    );

  // ---------------------- API: Load ----------------------
  const loadChecklists = async () => {
    if (!taskId) return;
    try {
      setLoadingList(true);
      const res = await http.get(`/tasks/${taskId}/checklists`);
      const apiItems =
        res?._embedded?.checklists ||
        res?.data?._embedded?.checklists ||
        res?.checklists ||
        res?.data?.checklists ||
        [];

      const mapped = apiItems.map((it) => ({
        id: pickChecklistId(it),
        text: it.title || it.name || "",
        checked: !!it.isChecked,
        position: it.position ?? 1,
      }));
      setChecklist(mapped);
    } catch (e) {
      console.error("[Checklist] load error:", e?.response || e);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadChecklists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  // ---------------------- API: Add -----------------------
  const handleAddChecklist = async (text) => {
    if (!text.trim() || !taskId) return;

    try {
      const nextPos =
        (checklist.length
          ? Math.max(...checklist.map((c) => Number(c.position || 0)))
          : 0) + 1;

      const payload = {
        title: text.trim(),
        position: nextPos,
        isChecked: false,
        task: `/tasks/${taskId}`,
      };

      const res = await http.post("/checklists", payload, {
        headers: { "Content-Type": "application/json" },
      });

      const created = res?.data || res || {};
      const newId = pickChecklistId(created);

      setChecklist((prev) => [
        ...prev,
        {
          id: newId || Math.random().toString(36).slice(2, 9),
          text: payload.title,
          checked: false,
          position: payload.position,
        },
      ]);
    } catch (e) {
      console.error("[Checklist] create error:", e?.response || e);
      alert("Failed to add checklist. See console for details.");
    } finally {
      setActivePopup(null);
    }
  };

  // ---------------------- API: Toggle --------------------
  const toggleCheck = async (item) => {
    const id = item.id;
    try {
      setBusyIds((m) => ({ ...m, [id]: true }));
      // optimistic
      setChecklist((prev) =>
        prev.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c))
      );
      await http.patch(`/checklists/${id}`, { isChecked: !item.checked });
    } catch (e) {
      console.error("[Checklist] toggle error:", e?.response || e);
      // rollback
      setChecklist((prev) =>
        prev.map((c) => (c.id === id ? { ...c, checked: item.checked } : c))
      );
    } finally {
      setBusyIds((m) => {
        const { [id]: _, ...rest } = m;
        return rest;
      });
    }
  };

  // ---------------------- API: Delete single -------------
  const deleteOne = async (id) => {
    try {
      setBusyIds((m) => ({ ...m, [id]: true }));
      await http.delete(`/checklists/${id}`);
      setChecklist((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      console.error("[Checklist] delete error:", e?.response || e);
      alert("Failed to delete. See console for details.");
    } finally {
      setBusyIds((m) => {
        const { [id]: _, ...rest } = m;
        return rest;
      });
    }
  };

  // ---------------------- Delete checked (bulk) ----------
  const handleDeleteChecked = async () => {
    const toDelete = checklist.filter((c) => c.checked).map((c) => c.id);
    if (toDelete.length === 0) {
      setActivePopup(null);
      return;
    }
    try {
      // fire deletes in parallel
      await Promise.allSettled(
        toDelete.map((id) => http.delete(`/checklists/${id}`))
      );
      setChecklist((prev) => prev.filter((c) => !toDelete.includes(c.id)));
    } catch (e) {
      console.error("[Checklist] bulk delete error:", e?.response || e);
    } finally {
      setActivePopup(null);
    }
  };

  // ---------------------- Attachments / Labels / Members -
  const handleToggleLabel = (label) => {
    setLabels((prev) => {
      const exists = prev.some((l) => l.title === label.title);
      return exists
        ? prev.filter((l) => l.title !== label.title)
        : [...prev, { title: label.title, color: label.color }];
    });
  };
  const handleAddAttachment = (attached) => {
    // attached comes from AttachFileComponent → { name, url, type }
    if (!attached?.url) {
      console.warn("⚠️ No URL received from attachment:", attached);
      return;
    }

    setAttachments((prev) => [
      ...prev,
      {
        name: attached.name || "Unnamed file",
        url: attached.url,
        type: attached.type || "file",
      },
    ]);

    console.log("📎 Added attachment to list:", attached);
  };

  const handleAddMember = (member) => {
    setMembers((prev) => [...prev, member]);
    setActivePopup(null);
  };

  // ---------------------- Progress -----------------------
  const progress = useMemo(() => {
    if (!checklist.length) return 0;
    const done = checklist.filter((i) => i.checked).length;
    return (done / checklist.length) * 100;
  }, [checklist]);

  // ---------------------- Popups -------------------------
  const renderPopup = () => {
    switch (activePopup) {
      case "delete":
        return (
          <DeleteChecklistComponent
            onConfirm={handleDeleteChecked}
            onCancel={() => setActivePopup(null)}
          />
        );
      case "share":
        return <ShareBoardComponent onClose={() => setActivePopup(null)} />;
      case "labels":
        return (
          <LabelComponent
            selectedLabels={labels}
            onToggleLabel={handleToggleLabel}
            onClose={() => setActivePopup(null)}
          />
        );
      case "checklist":
        return (
          <ChecklistComponent
            onAdd={handleAddChecklist}
            onClose={() => setActivePopup(null)}
          />
        );
      case "members":
        return (
          <SearchMemberComponent
            onSelect={handleAddMember}
            onClose={() => setActivePopup(null)}
          />
        );
      case "attachment":
        return (
          <AttachFileComponent
            onAttach={(data) => {
              console.log("📥 File returned from AttachFileComponent:", data);
              handleAddAttachment(data);
              setActivePopup(null); // close modal after attach
            }}
            onClose={() => setActivePopup(null)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="max-w-xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 relative text-gray-800 dark:text-gray-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <Circle className="mr-2 text-gray-700 dark:text-gray-300" />
            {card?.text || "Feature Details"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { icon: <Tag size={14} />, text: "Labels", action: "labels" },
            {
              icon: <CheckSquare size={14} />,
              text: "Checklist",
              action: "checklist",
            },
            { icon: <Users size={14} />, text: "Members", action: "members" },
            {
              icon: <Paperclip size={14} />,
              text: "Attachment",
              action: "attachment",
            },
          ].map((btn, i) => (
            <button
              key={i}
              onClick={() => setActivePopup(btn.action)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 transition"
            >
              {btn.icon}
              {btn.text}
            </button>
          ))}
        </div>

        {/* Members & Labels */}
        <div className="flex items-start gap-6 mb-6 flex-wrap">
          {/* Members */}
          <div>
            <p className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Members
            </p>
            <div className="flex flex-wrap gap-1 max-w-[210px]">
              {members.map((m, i) => (
                <div
                  key={i}
                  className={`w-9 h-9 rounded-full ${m.color} text-white flex items-center justify-center font-semibold text-sm`}
                >
                  {m.initials}
                </div>
              ))}

              <button
                onClick={() => setActivePopup("members")}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                +
              </button>
            </div>
          </div>

          {/* Labels */}
          <div>
            <p className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Labels
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {labels.map((l, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs rounded-full font-medium text-white"
                  style={{ backgroundColor: l.color }}
                >
                  {l.title}
                </span>
              ))}
              <button
                onClick={() => setActivePopup("labels")}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-sm font-medium mb-2 flex items-center text-gray-700 dark:text-gray-300">
            <ChartBarDecreasingIcon className="mr-2" /> Description
          </p>
          <textarea
            placeholder="Add a more detailed description..."
            className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            rows="3"
          />
        </div>

        {/* Checklist */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium flex items-center text-gray-700 dark:text-gray-300">
              <ChartBarDecreasingIcon className="mr-2" />
              Checklist
              {loadingList ? (
                <span className="ml-2 text-xs opacity-70">loading…</span>
              ) : null}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setHideChecked((prev) => !prev)}
                className="text-xs px-3 py-1 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
              >
                {hideChecked ? "Show checked" : "Hide checked"}
              </button>
              <button
                onClick={() => setActivePopup("delete")}
                className="text-xs px-3 py-1 rounded-lg bg-red-600 text-white flex items-center gap-1 hover:bg-red-700"
              >
                <Trash size={12} /> Delete checked
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-8">
              {progress.toFixed(0)}%
            </span>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
              <motion.div
                className="bg-blue-600 h-2"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2">
            {checklist
              .filter((item) => (hideChecked ? !item.checked : true))
              .map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <label className="flex items-center gap-3 flex-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!item.checked}
                      onChange={() => toggleCheck(item)}
                      disabled={!!busyIds[item.id]}
                      className="w-4 h-4 rounded border-gray-400 text-blue-600 dark:bg-gray-700 dark:border-gray-500"
                    />
                    <span
                      className={`text-sm ${
                        item.checked
                          ? "line-through text-gray-400 dark:text-gray-500"
                          : "text-gray-800 dark:text-gray-100"
                      }`}
                    >
                      {item.text}
                    </span>
                  </label>

                  <button
                    onClick={() => deleteOne(item.id)}
                    disabled={!!busyIds[item.id]}
                    className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                    title="Delete item"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              ))}
          </div>

          {/* Add new item button */}
          <div className="mt-3">
            <button
              onClick={() => setActivePopup("checklist")}
              className="text-xs px-3 py-1.5 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
            >
              + Add checklist item
            </button>
          </div>
        </div>

        {/* 📎 Attachments Section */}
        {attachments?.length > 0 && (
          <div className="mt-4 space-y-2 border-t pt-3">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200">
              Attachments
            </h4>
            <div className="flex flex-col gap-2">
              {attachments.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    {item.type === "image" ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded border border-gray-300"
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    )}
                    <div className="flex flex-col">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline truncate max-w-[200px]"
                      >
                        {item.name}
                      </a>
                      <span className="text-xs text-gray-500">
                        {item.type === "image" ? "Image" : "File"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setAttachments((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-800 rounded-md transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Popup Overlay */}
      <AnimatePresence>
        {activePopup && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePopup(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              {renderPopup()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
