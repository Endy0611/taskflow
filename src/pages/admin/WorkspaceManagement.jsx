import React, { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import toast from "react-hot-toast";

export default function WorkspaceManagement() {
  const [workspaces, setWorkspaces] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // backend pages are 0-indexed
  const itemsPerPage = 10;

  /* ==================== LOAD WORKSPACES ==================== */
  useEffect(() => {
    async function loadWorkspaces() {
      try {
        setLoading(true);
        const res = await adminService.getWorkspaces(currentPage, itemsPerPage, "name,asc");

        // ✅ Properly extract array and total
        setWorkspaces(res?._embedded?.workspaces || []);
        setTotal(res?.page?.totalElements || 0);
      } catch (err) {
        console.error("❌ Failed to load workspaces:", err);
        setError("Failed to load workspaces");
        toast.error("Failed to load workspaces");
      } finally {
        setLoading(false);
      }
    }

    loadWorkspaces();
  }, [currentPage]); // ✅ reload when page changes

  /* ==================== PAGINATION ==================== */
  const totalPages = Math.ceil(total / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  // Theme color mapping
  const getThemeColor = (theme) => {
    const colors = {
      light: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
      dark: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300",
      blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    };
    return colors[theme?.toLowerCase()] || "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />

        <div className="p-6 md:p-8 lg:p-10">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Workspace Management
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage and organize all workspaces
                </p>
              </div>
              <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-5 py-3 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Workspaces</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{total}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg shadow-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Content Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading workspaces...</p>
              </div>
            ) : workspaces.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400 text-lg">No workspaces found</p>
              </div>
            ) : (
              <>
                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-600">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Workspace
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Theme
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Created At
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {workspaces.map((w, index) => (
                        <tr
                          key={w.id || index}
                          className="hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-medium text-sm">
                            {currentPage * itemsPerPage + index + 1}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                              </div>
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                {w.name || "-"}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-lg font-medium text-sm ${getThemeColor(w.theme)}`}>
                              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                              </svg>
                              {w.theme || "-"}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {w.createdAt
                                ? new Date(w.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "-"}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-5 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Showing <span className="font-semibold text-gray-900 dark:text-gray-100">{workspaces.length}</span> of{" "}
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{total}</span> total workspaces
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <button
                          disabled={currentPage === 0}
                          onClick={() => handlePageChange(currentPage - 1)}
                          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 shadow-sm"
                        >
                          Previous
                        </button>

                        <span className="px-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                          Page {currentPage + 1} of {totalPages}
                        </span>

                        <button
                          disabled={currentPage === totalPages - 1}
                          onClick={() => handlePageChange(currentPage + 1)}
                          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 shadow-sm"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}