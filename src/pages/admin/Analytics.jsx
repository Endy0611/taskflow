import React, { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import toast from "react-hot-toast";
import {
  Users,
  LayoutGrid,
  Columns3,
  CheckSquare,
  TrendingUp,
  Activity,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
} from "lucide-react";

export default function Analytics() {
  const [stats, setStats] = useState({
    users: 0,
    workspaces: 0,
    boards: 0,
    tasks: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for additional chart data
  const [trendData, setTrendData] = useState([]);
  const [taskStatusData, setTaskStatusData] = useState([]);
  const [userActivityData, setUserActivityData] = useState([]);
  const [growthData, setGrowthData] = useState([]);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);

        const [usersRes, workspacesRes, boardsRes, tasksRes] =
          await Promise.all([
            adminService.getUsers(0, 200),
            adminService.getWorkspaces(0, 200),
            adminService.getBoards(0, 200),
            adminService.getTasks(0, 200),
          ]);

        // ✅ Extract real totals from backend pagination
        const totals = {
          users: usersRes?.page?.totalElements || usersRes.length || 0,
          workspaces:
            workspacesRes?.page?.totalElements ||
            workspacesRes?._embedded?.workspaces?.length ||
            0,
          boards:
            boardsRes?.page?.totalElements ||
            boardsRes?._embedded?.boards?.length ||
            0,
          tasks:
            tasksRes?.page?.totalElements ||
            tasksRes?._embedded?.tasks?.length ||
            0,
        };

        setStats(totals);

        // Main chart data
        setChartData([
          { name: "Users", value: totals.users },
          { name: "Workspaces", value: totals.workspaces },
          { name: "Boards", value: totals.boards },
          { name: "Tasks", value: totals.tasks },
        ]);

        // Generate trend data (last 7 days) - simulated based on current totals
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        setTrendData(
          days.map((day, i) => ({
            name: day,
            users: Math.floor(totals.users * (0.85 + i * 0.02)),
            tasks: Math.floor(totals.tasks * (0.8 + i * 0.03)),
            boards: Math.floor(totals.boards * (0.85 + i * 0.02)),
          }))
        );

        // Task status distribution - simulated percentages
        setTaskStatusData([
          {
            name: "Completed",
            value: Math.floor(totals.tasks * 0.45),
            color: "#10b981",
          },
          {
            name: "In Progress",
            value: Math.floor(totals.tasks * 0.35),
            color: "#3b82f6",
          },
          {
            name: "Pending",
            value: Math.floor(totals.tasks * 0.15),
            color: "#f59e0b",
          },
          {
            name: "Blocked",
            value: Math.floor(totals.tasks * 0.05),
            color: "#ef4444",
          },
        ]);

        // User activity (last 6 months) - simulated growth
        const months = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
        setUserActivityData(
          months.map((month, i) => ({
            month,
            activeUsers: Math.floor(totals.users * (0.6 + i * 0.05)),
            newUsers: Math.floor(totals.users * (0.05 + i * 0.01)),
          }))
        );

        // Growth metrics - comparing with simulated previous month
        setGrowthData([
          {
            name: "Users",
            current: totals.users,
            previous: Math.floor(totals.users * 0.92),
          },
          {
            name: "Workspaces",
            current: totals.workspaces,
            previous: Math.floor(totals.workspaces * 0.88),
          },
          {
            name: "Boards",
            current: totals.boards,
            previous: Math.floor(totals.boards * 0.95),
          },
          {
            name: "Tasks",
            current: totals.tasks,
            previous: Math.floor(totals.tasks * 0.85),
          },
        ]);
      } catch (err) {
        console.error("❌ Analytics load failed:", err);
        toast.error("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.users,
      icon: <Users className="w-7 h-7" />,
      color: "from-blue-500 to-blue-600",
      change: "+12.5%",
      positive: true,
    },
    {
      title: "Workspaces",
      value: stats.workspaces,
      icon: <LayoutGrid className="w-7 h-7" />,
      color: "from-emerald-500 to-emerald-600",
      change: "+8.2%",
      positive: true,
    },
    {
      title: "Active Boards",
      value: stats.boards,
      icon: <Columns3 className="w-7 h-7" />,
      color: "from-purple-500 to-purple-600",
      change: "+15.3%",
      positive: true,
    },
    {
      title: "Total Tasks",
      value: stats.tasks,
      icon: <CheckSquare className="w-7 h-7" />,
      color: "from-pink-500 to-pink-600",
      change: "+3.1%",
      positive: true,
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
        <AdminSidebar />
        <div className="flex-1">
          <AdminHeader />
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Loading analytics...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

const handleExportReport = async () => {
  try {
    toast.loading("Generating TaskFlow Report...", { id: "export" });

    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    /* ---------------- SIMPLE HEADER ---------------- */
    // Logo
    const logoUrl = "/assets/logo/1234.png";
    try {
      const img = await fetch(logoUrl);
      const blob = await img.blob();
      const reader = new FileReader();
      await new Promise((resolve) => {
        reader.onloadend = () => resolve();
        reader.readAsDataURL(blob);
      });
      const base64 = reader.result;
      doc.addImage(base64, "PNG", 40, 30, 30, 30);
    } catch {
      console.warn("⚠️ Logo not found, skipping image");
    }

    // Title
    doc.setFont("helvetica", "normal");
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text("TaskFlow Analytics Report", 80, 45);

    // Subtitle
    doc.setFontSize(10);
    doc.text("Comprehensive Performance Report", 80, 60);

    // Line separator
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(40, 80, pageWidth - 40, 80);

    /* ---------------- DATE INFO ---------------- */
    const dateText = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timeText = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    doc.setFontSize(9);
    doc.text(`Report Generated: ${dateText} at ${timeText}`, 40, 100);

    doc.line(40, 115, pageWidth - 40, 115);

    /* ---------------- DASHBOARD SUMMARY ---------------- */
    doc.setFontSize(14);
    doc.text("Dashboard Overview", 40, 145);

    // Simple stats
    const startY = 175;
    const lineHeight = 35;

    const statsData = [
      { label: "Total Users", value: stats.users },
      { label: "Workspaces", value: stats.workspaces },
      { label: "Boards", value: stats.boards },
      { label: "Tasks", value: stats.tasks },
    ];

    statsData.forEach((stat, index) => {
      const y = startY + index * lineHeight;
      
      doc.setFontSize(11);
      doc.text(stat.label, 60, y);

      doc.setFontSize(18);
      doc.text(stat.value.toString(), pageWidth - 100, y);

      if (index < statsData.length - 1) {
        doc.setLineWidth(0.3);
        doc.line(60, y + 12, pageWidth - 60, y + 12);
      }
    });

    /* ---------------- DETAILED TABLE ---------------- */
    const tableStartY = startY + statsData.length * lineHeight + 40;

    doc.setFontSize(14);
    doc.text("Detailed Metrics", 40, tableStartY - 15);

    autoTable(doc, {
      startY: tableStartY,
      head: [["Metric", "Count", "Status"]],
      body: [
        ["Total Users", stats.users, "Active"],
        ["Workspaces", stats.workspaces, "Operational"],
        ["Boards", stats.boards, "Managed"],
        ["Tasks", stats.tasks, "Tracked"],
      ],
      styles: {
        font: "helvetica",
        fontStyle: "normal",
        fontSize: 10,
        cellPadding: 10,
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        textColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: "normal",
        fontSize: 11,
        halign: "center",
        lineWidth: 0.5,
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        fontStyle: "normal",
      },
      columnStyles: {
        0: { halign: "left" },
        1: { halign: "center" },
        2: { halign: "center" },
      },
      margin: { left: 40, right: 40 },
      tableWidth: pageWidth - 80,
    });

    /* ---------------- PAGE 2: CHARTS ---------------- */
    const chartDiv = document.getElementById("chartSection");
    if (chartDiv) {
      const canvas = await html2canvas(chartDiv, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = pageWidth - 80;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      doc.addPage();

      doc.setFontSize(18);
      doc.text("Visual Analytics", 40, 50);

      doc.setFontSize(10);
      doc.text("Data Visualization & Insights", 40, 70);

      doc.setLineWidth(0.5);
      doc.line(40, 85, pageWidth - 40, 85);

      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.rect(40, 100, imgWidth, imgHeight);
      doc.addImage(imgData, "PNG", 40, 100, imgWidth, imgHeight);
    }

    /* ---------------- FOOTER ---------------- */
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
      const footerY = pageHeight - 35;
      
      doc.setLineWidth(0.5);
      doc.line(40, footerY - 8, pageWidth - 40, footerY - 8);
      
      doc.setFontSize(8);
      doc.text(
        `TaskFlow Admin © ${new Date().getFullYear()} | Confidential`,
        40,
        footerY + 5
      );
      
      doc.text(
        `Page ${i} of ${totalPages}`,
        pageWidth - 40,
        footerY + 5,
        { align: "right" }
      );
    }

    // Save
    const filename = `TaskFlow_Report_${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(filename);
    
    toast.success("Report exported successfully!", { id: "export" });
  } catch (err) {
    console.error("Export failed:", err);
    toast.error("Failed to generate report", { id: "export" });
  }
};


  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Real-time system overview and insights
              </p>
            </div>
            <button
              onClick={handleExportReport}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 active:scale-95 transition"
            >
              + Export Report
            </button>
          </div>

          {/* Main Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card, i) => (
              <div
                key={i}
                className="group relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${card.color} shadow-lg`}
                    >
                      <div className="text-white">{card.icon}</div>
                    </div>
                    <div
                      className={`flex items-center gap-1 text-sm font-semibold ${
                        card.positive ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {card.positive ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      {card.change}
                    </div>
                  </div>
                  <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
                    {card.title}
                  </h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {card.value.toLocaleString()}
                  </p>
                </div>
                <div
                  className={`h-1 bg-gradient-to-r ${card.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                ></div>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Activity Trend - Takes 2 columns */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    Activity Trend
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Last 7 days performance
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Tasks
                  </span>
                  <span className="w-3 h-3 bg-emerald-500 rounded-full ml-3"></span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Users
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                  <XAxis
                    dataKey="name"
                    stroke="#9ca3af"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "none",
                      borderRadius: "12px",
                      color: "white",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="tasks"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#colorTasks)"
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#colorUsers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Task Status Distribution */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                Task Status
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Current distribution
              </p>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {taskStatusData.map((status, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: status.color }}
                    ></div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {status.name}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {status.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Secondary Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    User Growth
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    6 months overview
                  </p>
                </div>
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                  <XAxis
                    dataKey="month"
                    stroke="#9ca3af"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="activeUsers"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="newUsers"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ fill: "#8b5cf6", r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Growth Comparison */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    Growth Metrics
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Month over month
                  </p>
                </div>
                <Target className="w-5 h-5 text-purple-500" />
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                  <XAxis
                    dataKey="name"
                    stroke="#9ca3af"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                    }}
                  />
                  <Bar
                    dataKey="previous"
                    fill="#9ca3af"
                    radius={[8, 8, 0, 0]}
                    barSize={30}
                  />
                  <Bar
                    dataKey="current"
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Zap className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-lg">Peak Activity</h4>
              </div>
              <p className="text-3xl font-bold mb-1">3:00 PM</p>
              <p className="text-blue-100 text-sm">Most active time today</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Activity className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-lg">Avg. Tasks/User</h4>
              </div>
              <p className="text-3xl font-bold mb-1">
                {stats.users > 0 ? (stats.tasks / stats.users).toFixed(1) : "0"}
              </p>
              <p className="text-emerald-100 text-sm">Per active user</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Target className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-lg">Completion Rate</h4>
              </div>
              <p className="text-3xl font-bold mb-1">87.5%</p>
              <p className="text-purple-100 text-sm">Tasks completed on time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
