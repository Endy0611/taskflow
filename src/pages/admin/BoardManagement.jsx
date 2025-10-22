import React, { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import toast from "react-hot-toast";

export default function BoardManagement() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  /* ---------------- Load boards with workspace info ---------------- */
  async function loadBoards(page = 0) {
    try {
      setLoading(true);
      setError("");

      const res = await adminService.getBoards(page, itemsPerPage, "createdAt,desc");
      const data = res?._embedded?.boards || [];
      const pageInfo = res?.page || { totalPages: 1 };

      // 🧠 Attach workspace info
      const boardsWithWorkspace = await Promise.all(
        data.map(async (b) => {
          let workspaceName = "—";
          let workspaceId = null;
          const wsHref = b?._links?.workspace?.href;

          if (wsHref) {
            try {
              const ws = await adminService.getWorkspaceByBoard(wsHref);
              workspaceName = ws?.name || "—";

              // extract ID from href (e.g., ".../workspaces/284")
              const parts = ws?._links?.self?.href?.split("/") || [];
              workspaceId = parts.pop() || null;
            } catch (err) {
              console.warn("❌ Failed to fetch workspace for board:", b.id);
            }
          }
          return { ...b, workspaceName, workspaceId };
        })
      );

      setBoards(boardsWithWorkspace);
      setTotalPages(pageInfo.totalPages || 1);
    } catch (err) {
      console.error("❌ Failed to load boards:", err);
      setError("Failed to load boards");
      toast.error("Failed to load boards");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBoards(currentPage);
  }, [currentPage]);

  /* ---------------- Pagination ---------------- */
  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  /* ---------------- Render ---------------- */
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <div className="p-6 md:p-8 lg:p-10">
          {/* Header Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Board Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and monitor all boards across workspaces
            </p>
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
                <p className="text-gray-500 dark:text-gray-400">Loading boards...</p>
              </div>
            ) : boards.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400 text-lg">No boards found</p>
              </div>
            ) : (
              <>
                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-600">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Workspace
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Created At
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {boards.map((b, i) => (
                        <tr
                          key={b.id || i}
                          className="hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                {b.title || "-"}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            {b.workspaceId ? (
                              <a
                                href={`/admin/workspaces/${b.workspaceId}`}
                                className="inline-flex items-center px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-150 font-medium text-sm"
                              >
                                {b.workspaceName}
                                <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </a>
                            ) : (
                              <span className="text-gray-400 dark:text-gray-500">—</span>
                            )}
                          </td>

                          <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">
                            {b.createdAt
                              ? new Date(b.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : "-"}
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
                        Showing page <span className="font-semibold text-gray-900 dark:text-gray-100">{currentPage + 1}</span> of{" "}
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{totalPages}</span>
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <button
                          disabled={currentPage === 0}
                          onClick={() => handlePageChange(currentPage - 1)}
                          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 shadow-sm"
                        >
                          Previous
                        </button>

                        <button
                          disabled={currentPage + 1 >= totalPages}
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