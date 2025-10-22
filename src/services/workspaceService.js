// src/services/workspaceService.js
import { http } from "./http";
import * as Api from "../Implement/api.js";

/* ----------------------------- BASE PREFIX --------------------------------- */
// ⚠️ Your backend base is https://taskflow-api.istad.co (no /api prefix)
const BASE_PREFIX = "";

/* ----------------------------- API PATHS ---------------------------------- */
const defaultPaths = {
  // Workspaces
  WORKSPACES_CREATE_NEW: `${BASE_PREFIX}/workspaces/createNew`,
  WORKSPACES_FIND_BY_ID: (id) => `${BASE_PREFIX}/workspaces/${id}`,
  WORKSPACES_UPDATE: (id) => `${BASE_PREFIX}/workspaces/${id}`,
  WORKSPACES_DELETE: (id) => `${BASE_PREFIX}/workspaces/${id}`,

  // ✅ Workspace Members (fixed)
  WS_MEMBERS_ADD: `${BASE_PREFIX}/workspaceMembers`, // ✅ correct endpoint
  WS_MEMBERS_FIND: (workspaceId) =>
    `${BASE_PREFIX}/workspaces/${workspaceId}/workspaceMembers`,
  WS_MEMBERS_UPDATE: (id) => `${BASE_PREFIX}/workspaceMembers/${id}`,
  WS_MEMBERS_DELETE: (id) => `${BASE_PREFIX}/workspaceMembers/${id}`,

  // Users
  USERS_FIND_BY_ID: (id) => `${BASE_PREFIX}/users/${id}`,
  USERS_SEARCH_BY_USERNAME: (username) =>
    `${BASE_PREFIX}/users/search/findByUsername?username=${encodeURIComponent(
      username
    )}`,

  // Boards
  BOARDS_CREATE_NEW: `${BASE_PREFIX}/boards/createNew`,
  BOARDS_FIND_BY_WS_ID: (workspaceId) =>
    `${BASE_PREFIX}/workspaces/${workspaceId}/boards`,

  // User → Workspaces
  USER_WORKSPACES_BY_USERID: (userId) =>
    `${BASE_PREFIX}/user-workspaces/${userId}`,
};

export const PATHS = { ...(Api.PATHS || {}), ...defaultPaths };

/* ------------------------------- HELPERS ---------------------------------- */
const idFromHref = (href, key) => {
  const m = String(href || "").match(new RegExp(`/${key}/([^/]+)`, "i"));
  return m ? (isNaN(m[1]) ? m[1] : Number(m[1])) : undefined;
};

const normalizeWorkspace = (raw = {}, fallbackId) => {
  const id =
    raw.id ?? idFromHref(raw?._links?.self?.href, "workspaces") ?? fallbackId;

  return {
    id,
    name: raw.name ?? raw.title ?? "Workspace",
    theme: raw.theme ?? "ANGKOR",
    visibility: raw.visibility ?? "PRIVATE",
    _raw: raw,
  };
};

/* -------------------- USER / INVITE / MEMBERSHIP FLOW --------------------- */

// ✅ Find user by username before inviting
export async function searchUserByUsername(username) {
  if (!username) throw new Error("Username required");
  const res = await http.get(PATHS.USERS_SEARCH_BY_USERNAME(username));

  const user =
    res?._embedded?.users?.[0] ||
    res?._embedded?.user ||
    (res?.username ? res : null);

  if (!user) throw new Error("User not found");
  return user;
}

// ✅ Invite (POST /workspaceMembers) with isAccepted = false
export async function addMemberByUsername({ username, workspaceId, permission }) {
  if (!username || !workspaceId)
    throw new Error("Username and workspaceId are required");

  // 🔍 1️⃣ Find the user first
  const userRes = await searchUserByUsername(username);
  const userHref =
    userRes?._links?.self?.href ||
    userRes?._links?.user?.href ||
    `${BASE_PREFIX}/users/${userRes.id}`;

  // 🔍 2️⃣ Check if this user is already a member (pending or accepted)
  const existing = await http.get(
    `${BASE_PREFIX}/workspaces/${workspaceId}/workspaceMembers`
  );

  const members = existing?._embedded?.workspaceMembers ?? [];
  const alreadyInvited = members.some(
    (m) => String(m.user).includes(`/users/${userRes.id}`)
  );

  if (alreadyInvited) {
    alert(`⚠️ ${username} is already invited or a member of this workspace.`);
    return null;
  }

  // ✅ 3️⃣ Create invite (pending until accepted)
  const payload = {
    user: userHref,
    workspace: `${BASE_PREFIX}/workspaces/${workspaceId}`,
    permission: permission ?? "VIEWER",
    isAccepted: false,
  };

  return await http.post(PATHS.WS_MEMBERS_ADD, payload);
}

/* -------------------------- Invite Link Creation -------------------------- */
export async function createInviteLink(workspaceId) {
  try {
    const res = await http.post(`/workspaces/${workspaceId}/invite-link`);
    return res?.link || res?.inviteLink || "";
  } catch (err) {
    console.error("❌ Failed to create invite link:", err);
    throw err;
  }
}

/* ------------------------------- WORKSPACES -------------------------------- */
export async function createWorkspace({ name, theme = "ANGKOR" }) {
  if (!name) throw new Error("Workspace name required");
  const created = await http.post(PATHS.WORKSPACES_CREATE_NEW, { name, theme });
  return normalizeWorkspace(created);
}

export async function fetchWorkspaceById(id) {
  if (!id) throw new Error("Workspace ID required");
  const raw = await http.get(PATHS.WORKSPACES_FIND_BY_ID(id));
  return normalizeWorkspace(raw, id);
}

export async function updateWorkspace(id, payload) {
  if (!id) throw new Error("Workspace ID required");
  return await http.patch(PATHS.WORKSPACES_UPDATE(id), payload);
}

export async function deleteWorkspace(id) {
  if (!id) throw new Error("Workspace ID required");
  return await http.delete(PATHS.WORKSPACES_DELETE(id));
}

// ✅ Create workspace + add creator as OWNER
export async function createWorkspaceAndLinkUser({ name, theme = "ANGKOR" }) {
  const userId = localStorage.getItem("user_id");
  if (!userId) throw new Error("User ID missing — please log in again.");

  const workspace = await createWorkspace({ name, theme });

  await http.post(PATHS.WS_MEMBERS_ADD, {
    user: `${BASE_PREFIX}/users/${userId}`,
    workspace: `${BASE_PREFIX}/workspaces/${workspace.id}`,
    permission: "OWNER",
    isAccepted: false,
  });

  return workspace;
}

/* --------------------------------- BOARDS ---------------------------------- */
export async function createBoard(workspaceId, title) {
  if (!workspaceId || !title)
    throw new Error("Workspace ID and title required");
  const payload = {
    title,
    workspace: `${BASE_PREFIX}/workspaces/${workspaceId}`,
  };
  const res = await http.post(PATHS.BOARDS_CREATE_NEW, payload);
  return {
    id: res.id ?? idFromHref(res?._links?.self?.href, "boards"),
    title: res.title ?? "Untitled Board",
    workspaceId,
    _raw: res,
  };
}

export async function fetchBoardsByWorkspaceId(workspaceId) {
  if (!workspaceId) throw new Error("Workspace ID required");
  const res = await http.get(PATHS.BOARDS_FIND_BY_WS_ID(workspaceId));
  const boards =
    res?._embedded?.boards ?? res?.content ?? (Array.isArray(res) ? res : []);
  return boards.map((b) => ({
    id: b.id ?? idFromHref(b?._links?.self?.href, "boards"),
    title: b.title ?? b.name ?? "Board",
    workspaceId,
  }));
}

/* --------------------------- USER → WORKSPACES ----------------------------- */
export async function fetchUserWorkspacesByUserId(userId) {
  if (!userId) throw new Error("User ID required");
  const res = await http.get(PATHS.USER_WORKSPACES_BY_USERID(userId));
  const list = Array.isArray(res)
    ? res
    : res?._embedded?.workspaces ?? res?.content ?? [];

  const unique = new Map(
    list.map((w) => [
      w.id ?? idFromHref(w?._links?.self?.href, "workspaces"),
      w,
    ])
  );
  return Array.from(unique.values()).map((w) => normalizeWorkspace(w));
}

/* --------------------------- MEMBERS: READ/MODIFY -------------------------- */
export async function fetchWorkspaceMembers(workspaceId) {
  if (!workspaceId) throw new Error("Workspace ID required");

  // Step 1: get members list
  const res = await http.get(`/workspaces/${workspaceId}/workspaceMembers`);
  const rawMembers = Array.isArray(res)
    ? res
    : res?._embedded?.workspaceMembers ?? res?.content ?? [];

  // Step 2: fetch user info for each member
  const members = await Promise.all(
    rawMembers.map(async (m) => {
      let user = {};
      let userId = null;

      try {
        // Try to extract userId from object or href
        if (m.user) {
          if (typeof m.user === "object") {
            userId = m.user.id;
            user = m.user;
          } else if (typeof m.user === "string") {
            userId = m.user.match(/\/(\d+)$/)?.[1];
          }
        }

        if (!userId && m._links?.user?.href) {
          userId = m._links.user.href.match(/\/(\d+)$/)?.[1];
        }

        // Fetch username if not embedded
        if (userId && !user.username) {
          const fetched = await http.get(`/users/${userId}`);
          user = fetched || {}; // ✅ your http() already returns plain JSON
        }
      } catch (err) {
        console.warn(`⚠️ Failed to fetch user for member ${m.id}`, err);
      }

      // Pick username or fallback
      const username =
        user.username ||
        user.fullName ||
        user.name ||
        user.email?.split("@")[0] ||
        "Unknown";

      const initials = username
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      return {
        membershipId: m.id ?? m.membershipId,
        userId: Number(user.id || userId || 0),
        username, // ✅ finally shows username
        permission: m.permission ?? "VIEWER",
        isAccepted: m.isAccepted ?? false,
        color: m.isAccepted ? "bg-indigo-600" : "bg-yellow-500",
        initials,
        lastActive: m.lastActive ?? (m.isAccepted ? "—" : "Invited"),
      };
    })
  );

  return members;
}

export async function updateMemberRole({ membershipId, permission }) {
  if (!membershipId) throw new Error("membershipId required");
  if (!permission) throw new Error("permission required");
  return await http.patch(PATHS.WS_MEMBERS_UPDATE(membershipId), {
    permission,
  });
}

export async function removeMember({ membershipId }) {
  if (!membershipId) throw new Error("Missing membershipId");
  return await http.delete(`/workspaceMembers/${membershipId}`);
}


/* --------------------------- INVITE: PENDING LIST -------------------------- */
// ✅ Use the real backend search path
export async function fetchPendingInvitations(userId) {
  const uid = userId ?? localStorage.getItem("user_id");
  if (!uid) throw new Error("Missing user_id");

  const res = await http.get(
    `${BASE_PREFIX}/workspaceMembers/search/findByUserAndIsAcceptedFalse?user=/users/${uid}`
  );



  const list = Array.isArray(res)
    ? res
    : res?._embedded?.workspaceMembers ?? res?.content ?? [];

  return list.map((m) => ({
    membershipId: m.id ?? m.membershipId,
    workspaceId:
      m.workspace?.id ||
      Number(String(m.workspace).match(/(\d+)$/)?.[1]) ||
      undefined,
    workspaceName: m.workspace?.name || m.workspace?.title || `Workspace`,
    permission: m.permission ?? "VIEWER",
  }));
}

export const fetchPendingInvites = fetchPendingInvitations;

// ✅ Accept invitation
export async function acceptInvitation(membershipId) {
  if (!membershipId) throw new Error("membershipId required");
  return http.patch(`${BASE_PREFIX}/workspaceMembers/${membershipId}`, {
    isAccepted: true,
  });
}

// ✅ Reject invitation
export async function rejectInvitation(membershipId) {
  if (!membershipId) throw new Error("membershipId required");
  return http.delete(`${BASE_PREFIX}/workspaceMembers/${membershipId}`);
}

/* --------------------------- LOCAL STORAGE HELPERS ------------------------- */
export const getCurrentWorkspaceId = () =>
  localStorage.getItem("current_workspace_id");

export const setCurrentWorkspaceId = (id) => {
  if (!id) return;
  localStorage.setItem("current_workspace_id", String(id));
};

export async function ensureCurrentWorkspaceForUser(userId) {
  const list = await fetchUserWorkspacesByUserId(userId);
  if (!list.length) return { list, current: null };

  const stored = getCurrentWorkspaceId();
  const keep = list.find((w) => String(w.id) === String(stored));
  const current = keep || list[0];
  setCurrentWorkspaceId(current.id);
  return { list, current };
}
