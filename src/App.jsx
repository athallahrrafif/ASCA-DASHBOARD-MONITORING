import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Interactions from "@/pages/Interactions";
import Analytics from "@/pages/Analytics";
import Feedback from "@/pages/Feedback";
import BotMonitoring from "@/pages/BotMonitoring";
import AcademicInfo from "@/pages/AcademicInfo";
import Courses from "@/pages/Courses";
import Documents from "@/pages/Documents";
import KnowledgeBase from "@/pages/KnowledgeBase";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

function CheckingSession() {
  return (
    <div className="grid min-h-screen place-items-center bg-canvas px-5 text-sm text-muted">
      Memeriksa sesi administrator ASCA…
    </div>
  );
}

function RequireAuth() {
  const { user, checking } = useAuth();
  const location = useLocation();
  if (checking) return <CheckingSession />;
  if (!user)
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

function GuestOnly({ children }) {
  const { user, checking } = useAuth();
  if (checking) return <CheckingSession />;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/login"
          element={
            <GuestOnly>
              <Login />
            </GuestOnly>
          }
        />

        <Route element={<RequireAuth />}>
          <Route path="/" element={<Landing />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/interactions" element={<Interactions />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/bot-monitoring" element={<BotMonitoring />} />
            <Route path="/academic-info" element={<AcademicInfo />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/knowledge-base" element={<KnowledgeBase />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}
