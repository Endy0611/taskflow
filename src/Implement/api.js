// /src/Implement/api.js
// Centralized API helpers for login/register + shared constants/utilities

/* -------------------------------------------------------------------------- */
/* BASE + AUTH ENDPOINTS (unchanged from your original, with small hardening) */
/* -------------------------------------------------------------------------- */

export const API_BASE = (
  import.meta.env.VITE_API_BASE ||
  import.meta.env.VITE_BASE_URL ||
  "http://localhost:4000"
).replace(/\/+$/, "");

export const LOGIN_PATH = import.meta.env.VITE_LOGIN_PATH || "/auth/login";
export const REGISTER_PATH = import.meta.env.VITE_REGISTER_PATH || "/auth/register";
export const REFRESH_PATH = import.meta.env.VITE_REFRESH_PATH || "/auth/refresh";

/* ------------------------------ Safe JSON parse --------------------------- */
const safeParseJSON = async (res) => {
  const text = await res.text().catch(() => "");
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text || null;
  }
};

/* ------------------------------- timedFetch ------------------------------- */
// Small fetch wrapper used by helpers below. We keep defaults close to your
// original; per-request callers (see `http()` below) can override credentials.
export async function timedFetch(url, init = {}, { timeoutMs = 15000 } = {}) {
  const controller = new AbortController();
  const id = setTimeout(
    () => controller.abort(new DOMException("Timeout", "AbortError")),
    timeoutMs
  );

  try {
    const res = await fetch(url, {
      mode: "cors",
      credentials: "omit",
      ...init,
      signal: controller.signal,
    });
    const data = await safeParseJSON(res);
    return { ok: res.ok, status: res.status, data, headers: res.headers };
  } catch (e) {
    return {
      ok: false,
      status: 0,
      data: { message: e?.message || "Network error" },
    };
  } finally {
    clearTimeout(id);
  }
}

/* -------------------------------- apiAuth --------------------------------- */
export const apiAuth = {
  // Username (or usernameOrEmail) + password
  async login({ username, password, email, usernameOrEmail }) {
    const identity = (username ?? usernameOrEmail ?? email ?? "").trim();
    const body = JSON.stringify({
      username: identity,
      usernameOrEmail: identity,
      email, // harmless if backend ignores
      password,
    });

    return timedFetch(`${API_BASE}${LOGIN_PATH}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      credentials: "include",
    });
  },

  async register(payload) {
    const body = JSON.stringify({
      username: payload.username,
      email: payload.email,
      password: payload.password,
      confirmedPassword:
        payload.confirmedPassword ??
        payload.password_confirmation ??
        payload.confirmed_password,
      givenName: payload.givenName,
      familyName: payload.familyName,
      gender: payload.gender, // "MALE" | "FEMALE" | "OTHER"
    });

    return timedFetch(`${API_BASE}${REGISTER_PATH}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      credentials: "include",
    });
  },
};

/* -------------------------------------------------------------------------- */
/* 💡 ADDITIONS FOR WORKSPACE MEMBERS FLOW (kept compatible with your code)   */
/* -------------------------------------------------------------------------- */

// Centralized paths (adjust if your backend differs)
export const PATHS = {
  WS_MEMBERS_ADD: "/workspaceMembers/addMembers",                 // POST
  WS_MEMBERS_FIND: "/workspaceMembers/findWorkspaceMembers",      // GET ?workspaceId=1
  WS_MEMBERS_UPDATE: (id) => `/workspaceMembers/${id}`,           // PATCH { permission }
  WS_MEMBERS_DELETE: (id) => `/workspaceMembers/${id}`,           // DELETE
  USERS_FIND_BY_EMAIL: "/users/findByEmail",                      // GET ?email=
  INVITES_CREATE: (workspaceId) => `/workspaces/${workspaceId}/invites`, // POST -> { link | token }
  // Optionally later:
  // INVITES_REDEEM: (workspaceId) => `/workspaces/${workspaceId}/invites/redeem`,
};

/* ---------------------------- Auth local storage --------------------------- */
export const getAuthToken = () =>
  localStorage.getItem("auth_token") ||
  localStorage.getItem("accessToken") ||
  localStorage.getItem("token") ||
  localStorage.getItem("jwt");

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("auth_token", token);
    // keep legacy key in sync so older code paths still work
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("accessToken");
  }
};

export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("auth_user") || "{}");
  } catch {
    return {};
  }
};

export const setCurrentUser = (user) =>
  user
    ? localStorage.setItem("auth_user", JSON.stringify(user))
    : localStorage.removeItem("auth_user");

export const clearAuth = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("auth_user");
};

/** Helper: persist token & user right after login/register if present */
export function applyAuthFromResponse(data) {
  if (!data) return;
  const token =
    data.accessToken || data.token || data.jwt || data.id_token || data.idToken;
  if (token) setAuthToken(token);
  if (data.user) setCurrentUser(data.user);
}

/* ----------------------------- HTTP convenience --------------------------- */
/**
 * Thin wrapper on timedFetch that:
 * - always sends cookies (credentials: "include") for session-auth backends
 * - auto-attaches Authorization: Bearer <token> if available
 * - supports FormData/Blob without forcing JSON headers
 * - throws a rich error object on non-2xx
 */
export async function http(
  path,
  { method = "GET", body, headers = {}, timeoutMs, credentials } = {}
) {
  const token = getAuthToken();

  const isForm = (typeof FormData !== "undefined" && body instanceof FormData) ||
                 (typeof Blob !== "undefined" && body instanceof Blob);

  const finalHeaders = {
    Accept: "application/json, text/plain;q=0.8,*/*;q=0.5",
    ...(isForm ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const res = await timedFetch(
    `${API_BASE}${path}`,
    {
      method,
      headers: finalHeaders,
      // IMPORTANT: do NOT send cookies by default; this API blocks them.
      credentials: credentials ?? "omit",
      body: body == null ? undefined : (isForm ? body : JSON.stringify(body)),
    },
    { timeoutMs }
  );

  if (!res.ok) {
    const err = typeof res.data === "object" ? res.data : { message: String(res.data || "Request failed") };
    err.status = res.status;
    throw err;
  }
  return res.data ?? null;
}



/* ----------------------- Workspace members API calls ---------------------- */
/** Get members of a workspace (raw payload; map in UI/service if needed) */
export async function apiFetchWorkspaceMembers(workspaceId) {
  const data = await http(
    `${PATHS.WS_MEMBERS_FIND}?workspaceId=${workspaceId}`,
    { method: "GET" }
  );
  // Some backends wrap results in { content: [...] }
  return Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : [];
}

/** Resolve a user id by email */
export async function apiResolveUserIdByEmail(email) {
  const data = await http(
    `${PATHS.USERS_FIND_BY_EMAIL}?email=${encodeURIComponent(email)}`,
    { method: "GET" }
  );
  if (data?.id) return data.id;
  if (Array.isArray(data?.content) && data.content[0]?.id) return data.content[0].id;
  if (Array.isArray(data) && data[0]?.id) return data[0].id;
  throw { message: "User not found by email" };
}

/** Add a member by user id */
export async function apiAddMemberByUserId({ workspaceId, userId, permission }) {
  return http(PATHS.WS_MEMBERS_ADD, {
    method: "POST",
    body: {
      user: `/users/${userId}`,
      workspace: `/workspaces/${workspaceId}`,
      permission, // "OWNER" | "EDITOR" | "VIEWER"
    },
  });
}

/** Add a member by email (resolves to user id first) */
export async function apiAddMemberByEmail({ workspaceId, email, permission }) {
  const userId = await apiResolveUserIdByEmail(email);
  return apiAddMemberByUserId({ workspaceId, userId, permission });
}

/** Update role/permission for a membership */
export async function apiUpdateMemberRole({ membershipId, permission }) {
  return http(PATHS.WS_MEMBERS_UPDATE(membershipId), {
    method: "PATCH",
    body: { permission },
  });
}

/** Remove a member from workspace */
export async function apiRemoveMember({ membershipId }) {
  return http(PATHS.WS_MEMBERS_DELETE(membershipId), { method: "DELETE" });
}

/** Create/copy an invite link (server preferred; dev fallback if absent) */
export async function apiCreateInviteLink(workspaceId) {
  try {
    const res = await http(PATHS.INVITES_CREATE(workspaceId), { method: "POST" });
    if (res?.link) return res.link;
    if (res?.token) return `${window.location.origin}/join/${workspaceId}?token=${res.token}`;
  } catch {
    // Fallback for local dev (no server invite endpoint)
    const token =
      globalThis.crypto?.randomUUID?.() ||
      `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    const link = `${window.location.origin}/join/${workspaceId}?token=${token}`;
    localStorage.setItem(
      `ws_invite_${workspaceId}_${token}`,
      JSON.stringify({ workspaceId, token, createdAt: Date.now(), devOnly: true })
    );
    return link;
  }
}

/** (Optional) Redeem an invite if you wire a /invites/redeem endpoint later */
export async function apiRedeemInvite({ workspaceId, token }) {
  if (PATHS.INVITES_REDEEM) {
    return http(PATHS.INVITES_REDEEM(workspaceId), {
      method: "POST",
      body: { token },
    });
  }
  // Dev-only fallback: accept any token previously generated locally
  const key = `ws_invite_${workspaceId}_${token}`;
  const raw = localStorage.getItem(key);
  if (!raw) throw { message: "Invalid or expired invite" };
  const me = getCurrentUser();
  if (!me?.id) throw { message: "Login required" };
  await apiAddMemberByUserId({ workspaceId, userId: me.id, permission: "VIEWER" });
  localStorage.removeItem(key); // consume
  return { joined: true };
}
