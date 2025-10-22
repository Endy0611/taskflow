import React, { useEffect, useState } from "react";
import { http } from "../../services/http";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    workspaces: 0,
    boards: 0,
    tasks: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [recent, setRecent] = useState({
    users: [],
    workspaces: [],
    boards: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        /* ---------------- COUNT STATISTICS ---------------- */
        const [usersRes, wsRes, boardsRes, tasksRes] = await Promise.all([
          http.get("/users?page=0&size=100&sort=username,desc&sort=createdAt,desc"),
          http.get("/workspaces?page=0&size=20&sort=name,asc"),
          http.get("/boards?page=0&size=20&sort=createdAt,desc"),
          http.get("/tasks?page=0&size=20"),
        ]);

        const users = usersRes?.page?.totalElements || 0;
        const workspaces = wsRes?.page?.totalElements || 0;
        const boards = boardsRes?.page?.totalElements || 0;
        const tasks = tasksRes?.page?.totalElements || 0;

        setStats({ users, workspaces, boards, tasks });
        setChartData([
          { name: "Users", count: users, color: "#8B5CF6" },
          { name: "Workspaces", count: workspaces, color: "#EC4899" },
          { name: "Boards", count: boards, color: "#F59E0B" },
          { name: "Tasks", count: tasks, color: "#10B981" },
        ]);

        /* ---------------- RECENT RECORDS ---------------- */
        const [recentUsers, recentWs, recentBoards] = await Promise.all([
          http.get("/users?page=0&size=5&sort=createdAt,desc"),
          http.get("/workspaces?page=0&size=5&sort=name,asc"),
          http.get("/boards?page=0&size=5&sort=createdAt,desc"),
        ]);

        setRecent({
          users:
            recentUsers?._embedded?.users?.map((u) => ({
              id: u.id,
              username: u.username,
              email: u.email,
              createdAt: u.createdAt,
            })) || [],
          workspaces:
            recentWs?._embedded?.workspaces?.map((w) => ({
              id: w.id,
              name: w.name,
              createdBy: w.createdBy,
              createdAt: w.createdAt,
            })) || [],
          boards:
            recentBoards?._embedded?.boards?.map((b) => ({
              id: b.id,
              title: b.title,
              createdAt: b.createdAt,
            })) || [],
        });
      } catch (err) {
        console.error("❌ Admin fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 p-6 flex justify-center items-center">
        <div className="flex flex-col items-center text-gray-500">
          <div className="h-12 w-12 border-4 border-violet-500 border-t-transparent animate-spin rounded-full mb-4"></div>
          <p className="text-lg font-medium">Loading admin analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Monitor your system at a glance
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Users"
                value={stats.users}
                gradient="from-violet-500 to-purple-600"
              />
              <StatCard
                title="Workspaces"
                value={stats.workspaces}
                gradient="from-pink-500 to-rose-600"
              />
              <StatCard
                title="Boards"
                value={stats.boards}
                gradient="from-amber-500 to-orange-600"
              />
              <StatCard
                title="Tasks"
                value={stats.tasks}
                gradient="from-emerald-500 to-teal-600"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
                  System Overview
                </h2>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                    <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: "12px" }} />
                    <YAxis allowDecimals={false} stroke="#6b7280" style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "none",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
                  Distribution
                </h2>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "none",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {chartData.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Recent Activity
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <RecentTable
                  title="New Users"
                  color="violet"
                  columns={["Username", "Email", "Created At"]}
                  data={recent.users.map((u) => [
                    u.username,
                    u.email,
                    formatDate(u.createdAt),
                  ])}
                />
                <RecentTable
                  title="New Workspaces"
                  color="pink"
                  columns={["Name", "Created By", "Created At"]}
                  data={recent.workspaces.map((w) => [
                    w.name,
                    w.createdBy,
                    formatDate(w.createdAt),
                  ])}
                />
                <RecentTable
                  title="New Boards"
                  color="amber"
                  columns={["Title", "Created At"]}
                  data={recent.boards.map((b) => [b.title, formatDate(b.createdAt)])}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Helper Components ---------------- */

function StatCard({ title, value, icon, gradient }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all transform hover:scale-105">
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full -mr-16 -mt-16`}
      ></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
          <span className="text-3xl">{icon}</span>
        </div>
        <p
          className={`text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function RecentTable({ title, icon, color, columns, data }) {
  const colorClasses = {
    violet: "from-violet-500 to-purple-600",
    pink: "from-pink-500 to-rose-600",
    amber: "from-amber-500 to-orange-600",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-2xl">{icon}</span>
        <h3
          className={`text-lg font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`}
        >
          {title}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200 dark:border-gray-700">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="py-3 px-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent dark:hover:from-gray-700/50 dark:hover:to-transparent transition-all"
                >
                  {row.map((cell, j) => (
                    <td key={j} className="py-3 px-3 text-gray-700 dark:text-gray-300">
                      {cell || "-"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-8 text-center text-gray-400"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* Utility: Date formatting */
function formatDate(dateString) {
  if (!dateString) return "-";
  const d = new Date(dateString);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
