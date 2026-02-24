import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import WorkspaceHome from "./pages/WorkspaceHome";
import ExplorePage from "./pages/ExplorePage";
import CategoryPage from "./pages/CategoryPage";
import WatchPage from "./pages/WatchPage";
import ReadPage from "./pages/ReadPage";
import CoursesPage from "./pages/CoursesPage";
import CourseLandingPage from "./pages/CourseLandingPage";
import LessonPage from "./pages/LessonPage";
import PricingPage from "./pages/PricingPage";
import LoginPage from "./pages/LoginPage";
import AccountPage from "./pages/AccountPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminWorkspaces from "./pages/admin/AdminWorkspaces";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminContent from "./pages/admin/AdminContent";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminHomeLayout from "./pages/admin/AdminHomeLayout";
import AdminPlans from "./pages/admin/AdminPlans";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public: Workspace Selector */}
          <Route path="/" element={<Index />} />

          {/* Public: Workspace-scoped */}
          <Route path="/w/:workspaceSlug" element={<WorkspaceHome />} />
          <Route path="/w/:workspaceSlug/explore" element={<ExplorePage />} />
          <Route path="/w/:workspaceSlug/category/:catSlug" element={<CategoryPage />} />
          <Route path="/w/:workspaceSlug/watch/:videoSlug" element={<WatchPage />} />
          <Route path="/w/:workspaceSlug/read/:contentSlug" element={<ReadPage />} />
          <Route path="/w/:workspaceSlug/courses" element={<CoursesPage />} />
          <Route path="/w/:workspaceSlug/course/:courseSlug" element={<CourseLandingPage />} />
          <Route path="/w/:workspaceSlug/course/:courseSlug/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/w/:workspaceSlug/pricing" element={<PricingPage />} />
          <Route path="/w/:workspaceSlug/login" element={<LoginPage />} />
          <Route path="/w/:workspaceSlug/account" element={<AccountPage />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/workspaces" element={<AdminWorkspaces />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/content" element={<AdminContent />} />
          <Route path="/admin/videos" element={<AdminContent />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/home-layout" element={<AdminHomeLayout />} />
          <Route path="/admin/plans" element={<AdminPlans />} />
          <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
