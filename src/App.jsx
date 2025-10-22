import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";

/* Admin pages */
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import WorkspaceManagement from "./pages/admin/WorkspaceManagement";
import BoardManagement from "./pages/admin/BoardManagement";
import Analytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/AdminSettings";
/* Layouts */
import RootLayout from "./components/layout/RootLayout";
import UserLayout from "./components/layout/UserLayout";
import WorkspaceLayout from "./components/layout/WorkspaceLayout";

/* Guest pages */
import GuestHomePage from "./pages/GuestUser/HomePage";
import FeaturePage from "./pages/GuestUser/FeaturePage";
import TemplatePage from "./pages/GuestUser/TemplatePage";
import AboutUs from "./pages/GuestUser/AboutUs";

/* Auth pages */
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

/* User pages */
import HomeUser from "./pages/user/HomeUser";
import TemplateUser from "./pages/user/TemplateUser";
import Board from "./pages/user/Board"; // Single dynamic Board file
import WorkspaceBoard from "./pages/user/WorkspaceBoard";
import WorkspaceMember from "./pages/user/WorkspaceMember";
import WorkspaceSetting from "./pages/user/WorkspaceSetting";
import Invitations from "./pages/user/Invitations";

/* Profile & Switch Account */
import ProfilePage from "./pages/profile/ProfilePage";
import SwitchAccountPage from "./pages/profile/SwitchAccountPage";

/* Settings / Project pages */
import SettingWorkspace from "./pages/user/SettingWorkspace";
import ProjectManagement from "./pages/user/ProjectManagement";

/* Offline / Error */
import OfflineMode from "./utils/OfflineMode";

/* 404 fallback */
function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-50 dark:bg-gray-900">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <button
        onClick={() => navigate(-1)}
        className="text-white bg-blue-600 px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
      >
        Go Back
      </button>
    </div>
  );
}

/* ------------------------------------ APP ------------------------------------ */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ------------------------- Admin Routes ------------------------- */}
        <Route
          path="/admin"
          element={<ProtectedRoute allowedRoles={["admin"]} />}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="workspaces" element={<WorkspaceManagement />} />
          <Route path="boards" element={<BoardManagement />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* ------------------------- Guest Routes ------------------------- */}
        <Route element={<RootLayout />}>
          <Route path="/" element={<GuestHomePage />} />
          <Route path="/features" element={<FeaturePage />} />
          <Route path="/templates" element={<TemplatePage />} />
          <Route path="/about" element={<AboutUs />} />
        </Route>

        {/* -------------------------- Auth Routes ------------------------- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* -------------------------- User Routes ------------------------- */}
        <Route element={<UserLayout />}>
          <Route path="/homeuser" element={<HomeUser />} />
          <Route path="/templateuser" element={<TemplateUser />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/switch-account" element={<SwitchAccountPage />} />
          <Route path="/invitations" element={<Invitations />} />
        </Route>

        {/* ----------------------- Workspace Routes ----------------------- */}
        <Route element={<WorkspaceLayout />}>
          <Route path="/board" element={<Board />} />
          <Route path="/board/:workspaceId" element={<Board />} />
          <Route path="/workspaceboard" element={<WorkspaceBoard />} />
          <Route
            path="/workspacemember/:workspaceId"
            element={<WorkspaceMember />}
          />
          <Route
            path="/projectmanagement/:boardId"
            element={<ProjectManagement />}
          />
          <Route path="/workspacesetting/:id" element={<WorkspaceSetting />} />
          <Route path="/settingworkspace" element={<SettingWorkspace />} />
          <Route
            path="/workspaces/:id/settings"
            element={<SettingWorkspace />}
          />
        </Route>

        {/* ---------------------- Offline & NotFound ---------------------- */}
        <Route path="/offline" element={<OfflineMode />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
