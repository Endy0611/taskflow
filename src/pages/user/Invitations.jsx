import { useEffect, useState } from "react";
import { Check, X, Mail } from "lucide-react";
import Sidebar from "../../components/sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import { http } from "../../services/http";
import { getCurrentUser } from "../../Implement/api";

const API_BASE = import.meta.env.VITE_API_BASE || "https://taskflow-api.istad.co";

export default function Invitations() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = getCurrentUser();

  /* -------------------------------------------------------------------------- */
  /* 📨 Fetch Pending Invitations (Fixed endpoint)                              */
  /* -------------------------------------------------------------------------- */
  async function fetchPendingInvitations() {
    if (!user?.id) return [];

    // ✅ Fetch all memberships of current user
    const res = await http.get(`${API_BASE}/workspaceMembers?userId=${user.id}`);

    // Normalize list
    const list = Array.isArray(res)
      ? res
      : res?.content ||
        res?._embedded?.workspaceMembers ||
        [];

    // ✅ Keep only those not yet accepted
    return list
      .filter((m) => m.isAccepted === false)
      .map((m) => ({
        membershipId: m.id,
        workspaceId: Number(String(m.workspaceId || m.workspace)?.match(/(\d+)$/)?.[1] || 0),
        workspaceName: m.workspaceName ?? `Workspace #${m.id}`,
        permission: m.permission ?? "VIEWER",
        isAccepted: m.isAccepted ?? false,
      }));
  }

  async function load() {
    setLoading(true);
    setError("");
    try {
      const list = await fetchPendingInvitations();
      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error("❌ Failed to fetch invitations:", e);
      setError("Failed to load invitations. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();

    // 🔁 Auto refresh when workspace or invitations change
    const refresh = () => load();
    window.addEventListener("invitation:new", refresh);
    window.addEventListener("invitation:updated", refresh);
    window.addEventListener("workspace:changed", refresh);

    return () => {
      window.removeEventListener("invitation:new", refresh);
      window.removeEventListener("invitation:updated", refresh);
      window.removeEventListener("workspace:changed", refresh);
    };
  }, []);

  /* -------------------------------------------------------------------------- */
  /* ✅ Accept Invitation (use PATCH /updateByIdPartially)                      */
  /* -------------------------------------------------------------------------- */
  async function acceptInvitation(membershipId) {
    return await http.patch(
      `${API_BASE}/workspaceMembers/${membershipId}/updateByIdPartially`,
      { isAccepted: true }
    );
  }

  /* -------------------------------------------------------------------------- */
  /* ❌ Reject Invitation (use DELETE /workspaceMembers/{id})                   */
  /* -------------------------------------------------------------------------- */
  async function rejectInvitation(membershipId) {
    return await http.delete(`${API_BASE}/workspaceMembers/${membershipId}`);
  }

  /* -------------------------------------------------------------------------- */
  /* ⚙️ Event Handlers                                                          */
  /* -------------------------------------------------------------------------- */
  async function onAccept(membershipId, workspaceId) {
    try {
      setProcessingId(membershipId);
      await acceptInvitation(membershipId);

      // 🔄 Sync with other components
      window.dispatchEvent(new CustomEvent("workspace:changed"));
      window.dispatchEvent(new CustomEvent("invitation:updated"));

      await load();
      navigate(`/board/${workspaceId}`);
    } catch (e) {
      console.error("❌ Accept error:", e);
      alert("Could not accept invitation. Please try again.");
    } finally {
      setProcessingId(null);
    }
  }

  async function onReject(membershipId) {
    try {
      setProcessingId(membershipId);
      await rejectInvitation(membershipId);
      window.dispatchEvent(new CustomEvent("invitation:updated"));
      await load();
    } catch (e) {
      console.error("❌ Reject error:", e);
      alert("Could not reject invitation. Please try again.");
    } finally {
      setProcessingId(null);
    }
  }

  /* -------------------------------------------------------------------------- */
  /* 🧠 UI Render                                                              */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900 dark:text-white">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setShowModal={() => {}}
      />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Mail className="w-7 h-7 text-indigo-600" />
            <h1 className="text-2xl font-bold">Pending Invitations</h1>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-sm text-gray-500">Loading invitations…</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : items.length === 0 ? (
            <div className="text-gray-500">
              You have no pending workspace invitations.
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((inv) => (
                <div
                  key={inv.membershipId}
                  className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition"
                >
                  <div>
                    <p className="font-semibold text-lg">
                      {inv.workspaceName || "Workspace"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Role:{" "}
                      <span className="font-medium text-indigo-600">
                        {inv.permission}
                      </span>
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onAccept(inv.membershipId, inv.workspaceId)}
                      disabled={processingId === inv.membershipId}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-green-600 text-green-700 hover:bg-green-50 dark:hover:bg-green-900/40 transition disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      {processingId === inv.membershipId
                        ? "Accepting..."
                        : "Accept"}
                    </button>
                    <button
                      onClick={() => onReject(inv.membershipId)}
                      disabled={processingId === inv.membershipId}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40 transition disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      {processingId === inv.membershipId
                        ? "Rejecting..."
                        : "Reject"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
