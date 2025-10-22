import React, { useState } from "react";
import { adminService } from "../../services/adminService";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { Search, Users, Briefcase, ChevronLeft, ChevronRight } from "lucide-react";

export default function UserManagement() {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setUser(null);
    setWorkspaces([]);
    setCurrentPage(1);

    try {
      // Step 1: Find user by username
      const res = await adminService.searchUserByUsername(query.trim());

      if (!res || Object.keys(res).length === 0) {
        setError("User not found.");
        setLoading(false);
        return;
      }

      setUser(res);

      // Step 2: Extract userId
      let userId = null;
      if (res._links?.self?.href) {
        userId = res._links.self.href.split("/").pop();
      } else if (res.id) {
        userId = res.id;
      }

      if (!userId) {
        setError("Could not determine user ID.");
        setLoading(false);
        return;
      }

      // Step 3: Fetch workspaces
      const wsRes = await adminService.getUserWorkspaces(userId);
      setWorkspaces(wsRes || []);
    } catch (err) {
      console.error("❌ Failed to fetch user/workspaces:", err);
      setError("User not found or failed to fetch workspaces.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Pagination logic ---------------- */
  const totalPages = Math.ceil(workspaces.length / itemsPerPage);
  const currentWorkspaces = workspaces.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <div className="p-8 max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Search and manage user accounts</p>
            </div>
          </div>

          {/* Modern Search Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by username..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none text-gray-900 dark:text-white placeholder-gray-400"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Searching...
                  </span>
                ) : (
                  "Search"
                )}
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold mt-0.5">!</div>
              <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          {/* User Info Card */}
          {user && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Information
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Username</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">{user.username}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">{user.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Full Name</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                      {user.givenName} {user.familyName}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Gender</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">{user.gender}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Workspaces Table */}
          {workspaces.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Workspaces ({workspaces.length})
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Theme</th>
                      <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {currentWorkspaces.map((ws) => (
                      <tr
                        key={ws.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-mono text-gray-600 dark:text-gray-400">{ws.id}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{ws.name || "-"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-medium">
                            {ws.theme || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => (window.location.href = `/admin/boards?workspace=${ws.id}`)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-medium rounded-lg transition shadow-sm hover:shadow-md"
                          >
                            View Boards
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Modern Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, workspaces.length)} of {workspaces.length} workspaces
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      </button>

                      <span className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {currentPage} / {totalPages}
                      </span>

                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && user && workspaces.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Workspaces Found</h3>
              <p className="text-gray-500 dark:text-gray-400">This user hasn't created or joined any workspaces yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}