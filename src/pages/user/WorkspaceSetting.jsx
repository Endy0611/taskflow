import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, PencilRuler, Plus } from "lucide-react";
import { NavLink, useParams } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import TaskFlowChatbot from "../../components/chatbot/Chatbot";
import toast from "react-hot-toast";

import {
  fetchWorkspaceMembers,
  removeMember,
  addMemberByUsername,
} from "../../services/workspaceService";
import InviteMemberModal from "../../components/workspace/InviteMemberModal";
import { http } from "../../services/http";

/* ---------------- Helper Component ---------------- */
function UserCard({ name, initials, color, role, onRemove }) {
  return (
    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-300 dark:border-gray-600 relative">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 ${color} text-white flex items-center justify-center rounded-full font-medium`}
        >
          {initials}
        </div>
        <div>
          <p className="font-medium text-sm md:text-base">{name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-300">{role}</p>
        </div>
      </div>

      <button
        onClick={onRemove}
        className="absolute top-2 right-3 text-xs text-gray-500 hover:text-red-600"
      >
        ✖
      </button>
    </div>
  );
}

/* ---------------- Main Component ---------------- */
export default function WorkspaceSetting() {
  const { id } = useParams();
  const workspaceId = Number(
    id || localStorage.getItem("current_workspace_id") || 1
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [workspace, setWorkspace] = useState({});
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- Fetch Workspace Info ---------------- */
  async function fetchWorkspaceInfo() {
    try {
      const res = await http.get(`/workspaces/${workspaceId}`);
      setWorkspace(res);
      localStorage.setItem("current_workspace_name", res.name);
      localStorage.setItem("current_workspace_theme", res.theme);
      // console.log("✅ Workspace info:", res);
    } catch (error) {
      console.error("❌ Error fetching workspace:", error);
      toast.error("Failed to load workspace");
    }
  }

  /* ---------------- Fetch Members ---------------- */
  async function loadMembers() {
    try {
      setLoading(true);
      const list = await fetchWorkspaceMembers(workspaceId);
      setMembers(list);
    } catch (error) {
      console.error("❌ Error fetching members:", error);
      toast.error("Failed to load workspace members");
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- Invite New Member ---------------- */
  async function handleInvite(username, permission) {
    try {
      const newMember = await addMemberByUsername({
        username,
        workspaceId,
        permission,
      });

      if (newMember) {
        toast.success(`Invited ${username} as ${permission}!`);

        // ✅ Instantly show new member (optimistic update)
        const newUser = {
          username,
          initials: username.slice(0, 2).toUpperCase(),
          color: "bg-yellow-500",
          permission,
          membershipId: newMember.id || Math.random(),
        };
        setMembers((prev) => [...prev, newUser]);
      }
    } catch (error) {
      console.error("❌ Invite failed:", error);
      toast.error("Failed to invite member");
    }
  }

  /* ---------------- Remove Member ---------------- */
  async function handleRemove(membershipId) {
    try {
      await removeMember({ membershipId });
      toast.success("Member removed!");
      setMembers((prev) => prev.filter((m) => m.membershipId !== membershipId));
    } catch (error) {
      console.error("❌ Failed to remove member:", error);
      toast.error("Failed to remove member");
    }
  }

  /* ---------------- Initial Load ---------------- */
  useEffect(() => {
    fetchWorkspaceInfo();
    loadMembers();
  }, [workspaceId]);

  /* ---------------- UI ---------------- */
  return (
    <div className="h-screen flex flex-col dark:bg-gray-900 dark:text-white">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar overlay (mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content */}
        <main className="flex-1 p-5 sm:p-8 md:p-10 bg-white dark:bg-gray-800 overflow-y-auto">
          <button
            className="md:hidden p-2 mb-4 rounded hover:bg-blue-600"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 flex-wrap mb-8">
            <div className="w-12 h-12 bg-orange-500 text-white flex items-center justify-center text-2xl font-bold rounded">
              {(workspace?.name || "W").charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-semibold flex items-center gap-2">
                {workspace?.name || "Workspace"} <PencilRuler />
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                🔒 Private Workspace
              </p>
            </div>
          </div>

          {/* Visibility */}
          <section className="mb-6">
            <h2 className="font-semibold text-base md:text-lg mb-1">
              Workspace visibility
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              🔒 Private – visible only to its members.
            </p>
          </section>

          {/* Members */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-base md:text-lg">
                Workspace Members
              </h2>
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-1 bg-blue-600 text-white text-sm px-3 py-1.5 rounded hover:bg-blue-700 transition"
              >
                <Plus size={14} /> Invite
              </button>
            </div>

            {loading ? (
              <p className="text-sm text-gray-500">Loading members…</p>
            ) : members.length === 0 ? (
              <p className="text-sm text-gray-500">No members found</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {members.map((m, index) => {
                  const keyParts = [
                    m.membershipId,
                    m.id,
                    m.userId,
                    m.username,
                    index,
                  ].filter(Boolean);

                  const key = keyParts.join("-"); // guaranteed unique combo like "12-userA-0"

                  return (
                    <UserCard
                      key={key}
                      name={m.username || "Unknown"}
                      initials={m.initials || "U"}
                      color={m.color || "bg-indigo-600"}
                      role={m.permission || "VIEWER"}
                      onRemove={() => handleRemove(m.membershipId ?? m.id)}
                    />
                  );
                })}
              </div>
            )}
          </section>

          {/* Continue */}
          <NavLink
            to={`/board/${workspaceId}`}
            className="inline-block mt-6 bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow hover:bg-blue-700"
          >
            Continue
          </NavLink>

          {/* Chatbot */}
          <img
            src="/assets/general/chatbot.png"
            alt="Chatbot"
            className="fixed bottom-6 right-6 w-14 h-14 z-40 rounded-full shadow-lg cursor-pointer bg-white dark:bg-gray-700"
            onClick={() => setShowChatbot(true)}
          />
        </main>
      </div>

      {/* Chatbot Modal */}
      <AnimatePresence>
        {showChatbot && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowChatbot(false)}
            />
            <motion.div
              className="fixed bottom-24 right-8 z-50"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <TaskFlowChatbot onClose={() => setShowChatbot(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <InviteMemberModal
            workspaceId={workspaceId}
            onClose={() => setShowInviteModal(false)}
            onInvite={handleInvite}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
