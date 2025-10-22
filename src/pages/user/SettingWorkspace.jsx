import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import {
  Lock,
  Globe,
  Users,
  ShieldAlert,
  X,
  Edit2,
  Check,
  ChevronDown,
} from "lucide-react";
import { fetchWorkspaceById, updateWorkspace } from "../../services/workspaceService";

const initialsFromName = (name) =>
  (name || "WS")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export default function SettingWorkspace() {
  const { id: routeId } = useParams();
  const navigate = useNavigate();

  const workspaceId = useMemo(
    () => routeId || localStorage.getItem("current_workspace_id"),
    [routeId]
  );

  const [modal, setModal] = useState(null); // 'visibility'|'membership'|'creation'|'deletion'|'sharing'
  const [visibility, setVisibility] = useState("PRIVATE"); // "PRIVATE" | "PUBLIC"
  const [workspaceName, setWorkspaceName] = useState("TaskFlow Workspace");
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(workspaceName);
  const [loading, setLoading] = useState(true);
  const [savingName, setSavingName] = useState(false);
  const [savingVisibility, setSavingVisibility] = useState(false);

  const openModal = (type) => setModal(type);
  const closeModal = () => setModal(null);

  const isPrivate = visibility === "PRIVATE";
  const VisibilityIcon = isPrivate ? Lock : Globe;
  const visibilityLabel = isPrivate ? "Private" : "Public";
  const visibilityColor = isPrivate ? "text-red-500" : "text-green-500";

  // Load workspace
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        if (!workspaceId) return;
        const ws = await fetchWorkspaceById(workspaceId);
        if (!mounted) return;
        const name = ws.name ?? "Workspace";
        setWorkspaceName(name);
        setTempName(name);
        setVisibility(ws.visibility ?? "PRIVATE");
      } catch (e) {
        console.error("Failed to load workspace", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [workspaceId]);

  // Rename
  const saveName = useCallback(async () => {
    const next = (tempName || "").trim();
    if (!next || savingName) {
      setIsEditingName(false);
      return;
    }
    if (next === workspaceName) {
      setIsEditingName(false);
      return;
    }
    try {
      setSavingName(true);
      const updated = await updateWorkspace(workspaceId, { name: next });
      setWorkspaceName(updated.name);
      setVisibility(updated.visibility ?? visibility);
      setIsEditingName(false);
      window.dispatchEvent(new CustomEvent("workspace:updated", { detail: updated }));
    } catch (e) {
      console.error("Rename failed", e);
      alert(
        e?.message ||
          "Failed to rename workspace. If this is a 403, your session/permissions or CSRF token may be missing."
      );
    } finally {
      setSavingName(false);
    }
  }, [workspaceId, tempName, savingName, workspaceName, visibility]);

  // Empty state when no workspaceId
  if (!workspaceId) {
    return (
      <div className="min-h-screen bg-[#f6f7f8] dark:bg-gray-900 text-gray-800 dark:text-gray-200 grid place-items-center p-8">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 max-w-lg w-full text-center">
          <h2 className="text-xl font-semibold mb-2">No workspace selected</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We couldn’t find a current workspace. Pick one from your workspace list.
          </p>
          <button
            onClick={() => navigate("/workspaceboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
          >
            Go to Workspace Board
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7f8] dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex justify-center py-10 px-6 transition-colors">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
        {/* Sidebar mimic (SPA links now) */}
        <aside className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 h-fit">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">
            Personal Settings
          </h3>
          <nav className="flex flex-col text-sm space-y-2">
            <NavLink
              to="/profile"
              className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" /> Profile
            </NavLink>
            <NavLink
              to={`/workspaces/${workspaceId}/settings`}
              className="px-3 py-2 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium flex items-center gap-2"
            >
              <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Setting
            </NavLink>
          </nav>
        </aside>

        {/* Main */}
        <main className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-orange-500 text-white font-bold text-2xl rounded-lg grid place-items-center">
                {initialsFromName(workspaceName)}
              </div>
              <div>
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveName()}
                      autoFocus
                      onBlur={saveName}
                      disabled={savingName}
                      className="border-b border-blue-500 text-lg font-semibold px-1 bg-transparent focus:outline-none dark:text-white"
                    />
                    <button
                      onClick={saveName}
                      disabled={savingName}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:opacity-60"
                      title="Save"
                    >
                      <Check size={16} />
                    </button>
                  </div>
                ) : (
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    {loading ? "Loading…" : workspaceName}
                    <button
                      onClick={() => {
                        setTempName(workspaceName);
                        setIsEditingName(true);
                      }}
                      title="Rename"
                      className="p-1 border dark:border-gray-700 rounded-md text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <Edit2 size={15} />
                    </button>
                  </h2>
                )}

                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                  <VisibilityIcon className={`w-4 h-4 ${visibilityColor}`} /> {visibilityLabel}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 px-3 py-1.5 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Back <ChevronDown className="w-4 h-4 rotate-90" />
            </button>
          </div>

          {/* Sections */}
          <SettingSection
            title="Workspace visibility"
            value={
              <>
                <VisibilityIcon className={`inline w-4 h-4 ${visibilityColor} mr-1`} />
                {visibilityLabel} – This Workspace is{" "}
                {isPrivate
                  ? "private and not indexed or visible to outsiders."
                  : "public and visible to anyone with the link."}
              </>
            }
            onChange={() => openModal("visibility")}
          />

          <SettingSection
            title="Workspace membership restriction"
            value="Anyone can be added to this Workspace."
            onChange={() => openModal("membership")}
          />

          <SettingSection
            title="Board creation restrictions"
            custom={
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <p>
                  Any Workspace member can create{" "}
                  <Globe className="inline w-4 h-4 text-green-500" /> public boards.
                </p>
                <p>
                  Any Workspace member can create{" "}
                  <Users className="inline w-4 h-4 text-orange-500" /> Workspace visible boards.
                </p>
                <p>
                  Any Workspace member can create{" "}
                  <Lock className="inline w-4 h-4 text-red-500" /> private boards.
                </p>
              </div>
            }
            onChange={() => openModal("creation")}
          />

          <SettingSection
            title="Board deletion restrictions"
            custom={
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <p>
                  Any Workspace member can delete{" "}
                  <Globe className="inline w-4 h-4 text-green-500" /> public boards.
                </p>
                <p>
                  Any Workspace member can delete{" "}
                  <Users className="inline w-4 h-4 text-orange-500" /> Workspace visible boards.
                </p>
                <p>
                  Any Workspace member can delete{" "}
                  <Lock className="inline w-4 h-4 text-red-500" /> private boards.
                </p>
              </div>
            }
            onChange={() => openModal("deletion")}
          />

          <SettingSection
            title="Sharing boards with guests"
            value="Anybody can send or receive invitations to boards in this Workspace."
            onChange={() => openModal("sharing")}
          />

          <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            Need to delete your Workspace? Please cancel your subscription on the billing tab first.
          </p>
        </main>
      </div>

      {/* Modal */}
      <PopupModal
        type={modal}
        close={closeModal}
        visibility={visibility}
        saving={savingVisibility}
        onConfirm={async (nextVisibility) => {
          if (!nextVisibility || nextVisibility === visibility || savingVisibility) {
            closeModal();
            return;
          }
          try {
            setSavingVisibility(true);
            const updated = await updateWorkspace(workspaceId, {
              visibility: nextVisibility, // "PRIVATE" | "PUBLIC"
            });
            setVisibility(updated.visibility);
            setWorkspaceName(updated.name ?? workspaceName);
            window.dispatchEvent(new CustomEvent("workspace:updated", { detail: updated }));
            closeModal();
          } catch (e) {
            console.error("Update visibility failed", e);
            alert(
              e?.message ||
                "Failed to update visibility. If this is a 403, your session/permissions or CSRF token may be missing."
            );
          } finally {
            setSavingVisibility(false);
          }
        }}
      />
    </div>
  );
}

/* ---------- Setting Section ---------- */
function SettingSection({ title, value, custom, onChange }) {
  return (
    <div className="py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-start">
      <div>
        <h3 className="font-semibold text-sm mb-1">{title}</h3>
        <div className="text-sm text-gray-700 dark:text-gray-300">{custom || value}</div>
      </div>
      <button
        onClick={onChange}
        className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600"
      >
        Change
      </button>
    </div>
  );
}

/* ---------- Popup Modal & Options ---------- */
function PopupModal({ type, close, visibility, saving, onConfirm }) {
  const [draftVisibility, setDraftVisibility] = useState(visibility);

  useEffect(() => {
    setDraftVisibility(visibility);
  }, [visibility, type]);

  // Close on Esc
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && close();
    if (type) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [type, close]);

  if (!type) return null;

  const modalTitle = {
    visibility: "Select Workspace visibility",
    membership: "Workspace membership restriction",
    creation: "Board creation restrictions",
    deletion: "Board deletion restrictions",
    sharing: "Inviting guests",
  }[type];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-[540px] relative border border-gray-200 dark:border-gray-700">
        <button
          onClick={close}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-base font-semibold mb-5">{modalTitle}</h2>

        <OptionGroup
          type={type}
          draftVisibility={draftVisibility}
          setDraftVisibility={setDraftVisibility}
        />

        <div className="flex justify-end mt-6">
          <button
            disabled={saving}
            onClick={() =>
              type === "visibility" ? onConfirm?.(draftVisibility) : close()
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-medium disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function OptionGroup({ type, draftVisibility, setDraftVisibility }) {
  const [selectedOptions, setSelectedOptions] = useState({
    public: 0,
    visible: 0,
    private: 0,
  });

  if (type === "creation" || type === "deletion") {
    const action = type === "creation" ? "create" : "delete";
    const categories = [
      { key: "public", icon: <Globe className="text-green-500" />, label: "public" },
      { key: "visible", icon: <Users className="text-orange-500" />, label: "workspace visible" },
      { key: "private", icon: <Lock className="text-red-500" />, label: "private" },
    ];

    const setOption = (category, value) =>
      setSelectedOptions((prev) => ({ ...prev, [category]: value }));

    return (
      <div className="bg-[#f9fafb] dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 space-y-6 shadow-sm">
        {categories.map((cat, idx) => (
          <div key={idx} className={idx !== 0 ? "pt-5 border-t border-gray-200 dark:border-gray-700" : ""}>
            <div className="flex items-center gap-2 mb-2">
              {cat.icon}
              <p className="font-medium text-sm text-gray-800 dark:text-gray-200">
                Who can {action} {cat.label} boards?
              </p>
            </div>

            <div className="flex flex-col gap-2 pl-6">
              {["Any Workspace member", "Only Workspace admins", "Nobody"].map(
                (option, i) => {
                  const isSelected = selectedOptions[cat.key] === i;
                  return (
                    <label
                      key={i}
                      onClick={() => setOption(cat.key, i)}
                      className={`flex items-center gap-2 rounded-md cursor-pointer transition-all border px-3 py-2 ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 font-medium"
                          : "border-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`${cat.key}-radio`}
                        checked={isSelected}
                        onChange={() => setOption(cat.key, i)}
                        className="accent-blue-600"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  );
                }
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "visibility") {
    const options = [
      {
        icon: <Lock className="text-red-500" />,
        title: "Private",
        desc: "This Workspace is private. It’s not indexed or visible to those outside the Workspace.",
        value: "PRIVATE",
      },
      {
        icon: <Globe className="text-green-500" />,
        title: "Public",
        desc: "This Workspace is public. It’s visible to anyone with the link and may show up in search engines.",
        value: "PUBLIC",
      },
    ];
    const selected = draftVisibility === "PRIVATE" ? 0 : 1;

    return (
      <div className="space-y-3">
        {options.map((o, i) => {
          const active = selected === i;
          return (
            <label
              key={o.value}
              onClick={() => setDraftVisibility(o.value)}
              className={`flex items-start gap-3 border rounded-lg p-3 cursor-pointer transition ${
                active
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                  : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <input
                type="radio"
                checked={active}
                onChange={() => setDraftVisibility(o.value)}
                className="mt-1 accent-blue-600"
              />
              <div>
                <p className="font-medium flex items-center gap-2">
                  {o.icon} {o.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{o.desc}</p>
              </div>
            </label>
          );
        })}
      </div>
    );
  }

  if (type === "membership") {
    const options = [
      { icon: <Users className="text-blue-500" />, title: "Anybody", desc: "Anybody can be added to this Workspace." },
      { icon: <ShieldAlert className="text-orange-500" />, title: "Only specific email domains", desc: "Only members with approved email domains can be added to this Workspace." },
    ];
    return <RadioList options={options} />;
  }

  if (type === "sharing") {
    const options = [
      { title: "Anybody", desc: "Workspace boards can be shared with anybody." },
      { title: "Only Workspace members", desc: "Workspace boards can only be shared with members of this Workspace." },
    ];
    return <RadioList options={options} />;
  }

  return null;
}

function RadioList({ options }) {
  const [selected, setSelected] = useState(0);
  return (
    <div className="space-y-3">
      {options.map((o, i) => {
        const active = selected === i;
        return (
          <label
            key={i}
            onClick={() => setSelected(i)}
            className={`flex items-start gap-3 border rounded-lg p-3 cursor-pointer transition ${
              active
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <input
              type="radio"
              checked={active}
              onChange={() => setSelected(i)}
              className="mt-1 accent-blue-600"
            />
            <div>
              <p className="font-medium flex items-center gap-2">
                {o.icon} {o.title}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{o.desc}</p>
            </div>
          </label>
        );
      })}
    </div>
  );
}
