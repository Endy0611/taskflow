import { http } from "./http"; // ✅ using your custom fetch wrapper

export const adminService = {
  /* ================= USERS ================= */
  async getUsers(page = 0, size = 100, sort = "username,desc,createdAt,desc") {
    try {
      const res = await http.get(`/users?page=${page}&size=${size}&sort=${sort}`);
      return res?._embedded?.users || [];
    } catch (err) {
      console.error("❌ getUsers failed:", err);
      return [];
    }
  },

  // ✅ Search user by username
  async searchUserByUsername(username) {
    try {
      const encoded = encodeURIComponent(username.trim());
      const url = `/users/search/findByUsername?username=${encoded}`;
      console.log("🔍 Searching user via:", url);

      const res = await http.get(url);
      if (res && res.username) return res; // backend returns single user object

      console.warn("⚠️ No user found for:", username);
      return null;
    } catch (err) {
      console.error("❌ searchUserByUsername failed:", err);
      return null;
    }
  },

  // ✅ Get all workspaces linked to a specific user
  async getUserWorkspaces(userId) {
    try {
      if (!userId) throw new Error("Missing userId");
      console.log("📂 Fetching workspaces for userId:", userId);

      const res = await http.get(`/user-workspaces/${userId}`);
      console.log("🟢 Workspaces response:", res);
      return Array.isArray(res) ? res : [];
    } catch (err) {
      console.error("❌ getUserWorkspaces failed:", err);
      return [];
    }
  },

  // ✅ Update user role
  async updateUserRole(userId, role) {
    try {
      if (!userId || !role) throw new Error("Missing parameters");
      return http.patch(`/users/${userId}`, { role });
    } catch (err) {
      console.error("❌ updateUserRole failed:", err);
      throw err;
    }
  },

  // ✅ Delete user
  async deleteUser(userId) {
    try {
      if (!userId) throw new Error("Missing userId");
      return http.delete(`/users/${userId}`);
    } catch (err) {
      console.error("❌ deleteUser failed:", err);
      throw err;
    }
  },

  /* ================= WORKSPACES ================= */
  async getWorkspaces(page = 0, size = 10, sort = "name,asc") {
    try {
      const res = await http.get(`/workspaces?page=${page}&size=${size}&sort=${sort}`);

      // ✅ Ensure the structure always exists even if backend sends empty
      return {
        _embedded: {
          workspaces: res?._embedded?.workspaces || [],
        },
        page: res?.page || { totalElements: 0 },
      };
    } catch (err) {
      console.error("❌ getWorkspaces failed:", err);
      return { _embedded: { workspaces: [] }, page: { totalElements: 0 } };
    }
  },

  async deleteWorkspace(id) {
    try {
      if (!id) throw new Error("Missing workspace id");
      return http.delete(`/workspaces/${id}`);
    } catch (err) {
      console.error("❌ deleteWorkspace failed:", err);
      throw err;
    }
  },

  /* ================= BOARDS ================= */
  async getBoards(page = 0, size = 10, sort = "createdAt,desc") {
    try {
      const res = await http.get(`/boards?page=${page}&size=${size}&sort=${sort}`);

      return {
        _embedded: {
          boards: res?._embedded?.boards || [],
        },
        page: res?.page || { totalElements: 0 },
      };
    } catch (err) {
      console.error("❌ getBoards failed:", err);
      return { _embedded: { boards: [] }, page: { totalElements: 0 } };
    }
  },

  async deleteBoard(id) {
    try {
      if (!id) throw new Error("Missing board id");
      return http.delete(`/boards/${id}`);
    } catch (err) {
      console.error("❌ deleteBoard failed:", err);
      throw err;
    }
  },

  // ✅ Fetch workspace via board’s workspace link (HAL structure)
  async getWorkspaceByBoard(workspaceHref) {
    try {
      if (!workspaceHref) return null;
      console.log("🔗 Fetching workspace via:", workspaceHref);
      const res = await http.get(workspaceHref);
      return res;
    } catch (err) {
      console.error("❌ getWorkspaceByBoard failed:", err);
      return null;
    }
  },

  /* ================= TASKS (NEWLY ADDED) ================= */
  async getTasks(page = 0, size = 10, sort = "createdAt,desc") {
    try {
      const res = await http.get(`/tasks?page=${page}&size=${size}&sort=${sort}`);
      return {
        _embedded: {
          tasks: res?._embedded?.tasks || [],
        },
        page: res?.page || { totalElements: 0 },
      };
    } catch (err) {
      console.warn("⚠️ getTasks failed (endpoint may not exist):", err);
      return { _embedded: { tasks: [] }, page: { totalElements: 0 } };
    }
  },

  /* ================= ANALYTICS ================= */
  async getAnalytics() {
    try {
      const res = await http.get("/analytics/system");
      return res;
    } catch (err) {
      console.warn("⚠️ /analytics/system not found, returning empty stats");
      return {
        data: {
          users: 0,
          workspaces: 0,
          boards: 0,
          tasks: 0,
        },
      };
    }
  },
};
