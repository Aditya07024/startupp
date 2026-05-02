import { AnimatePresence } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { useAuthStore } from "./store/authStore";

const LoginPage = lazy(() => import("./pages/Auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/Auth/RegisterPage"));
const CreatorDashboard = lazy(() => import("./pages/Dashboard/CreatorDashboard"));
const BrandDashboard = lazy(() => import("./pages/Dashboard/BrandDashboard"));
const AdminDashboard = lazy(() => import("./pages/Dashboard/AdminDashboard"));
const AIContentPage = lazy(() => import("./pages/AIContent/AIContentPage"));
const AnalyticsPage = lazy(() => import("./pages/Analytics/AnalyticsPage"));
const ConnectedAccountsPage = lazy(() => import("./pages/ConnectedAccounts/ConnectedAccountsPage"));
const TrendRadarPage = lazy(() => import("./pages/TrendRadar/TrendRadarPage"));
const RepurposeStudioPage = lazy(() => import("./pages/Repurpose/RepurposeStudioPage"));
const DealsPage = lazy(() => import("./pages/Deals/DealsPage"));
const InboxPage = lazy(() => import("./pages/Inbox/InboxPage"));
const CampaignsPage = lazy(() => import("./pages/Campaigns/CampaignsPage"));
const ChatPage = lazy(() => import("./pages/Chat/ChatPage"));
const WalletPage = lazy(() => import("./pages/Wallet/WalletPage"));
const SchedulePage = lazy(() => import("./pages/Schedule/SchedulePage"));
const ReferralPage = lazy(() => import("./pages/Referral/ReferralPage"));
const SubscriptionPage = lazy(() => import("./pages/Subscription/SubscriptionPage"));
const AdminPage = lazy(() => import("./pages/Admin/AdminPage"));
const BioBuilderPage = lazy(() => import("./pages/BioBuilder/BioBuilderPage"));
const PublicBioPage = lazy(() => import("./pages/BioBuilder/PublicBioPage"));
const CompetitorWatchPage = lazy(() => import("./pages/Competitor/CompetitorWatchPage"));
const LeaderboardPage = lazy(() => import("./pages/Leaderboard/LeaderboardPage"));
const PublicProfilePage = lazy(() => import("./pages/Profile/PublicProfilePage"));
const MediaKitPage = lazy(() => import("./pages/Profile/MediaKitPage"));

function PrivateRoute({ children }) {
  const { user } = useAuthStore();
  return user ? children : <Navigate to="/login" replace />;
}

function RootRedirect() {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={`/dashboard/${user.role}`} replace />;
}

export default function App() {
  const { fetchMe } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem("viralboost_token")) {
      fetchMe();
    }
  }, [fetchMe]);

  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-bgPrimary text-textMuted">Loading...</div>}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard/creator" element={<PrivateRoute><CreatorDashboard /></PrivateRoute>} />
          <Route path="/dashboard/brand" element={<PrivateRoute><BrandDashboard /></PrivateRoute>} />
          <Route path="/dashboard/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="/ai-content" element={<PrivateRoute><AIContentPage /></PrivateRoute>} />
          <Route path="/repurpose" element={<PrivateRoute><RepurposeStudioPage /></PrivateRoute>} />
          <Route path="/analytics" element={<PrivateRoute><AnalyticsPage /></PrivateRoute>} />
          <Route path="/connected-accounts" element={<PrivateRoute><ConnectedAccountsPage /></PrivateRoute>} />
          <Route path="/trend-radar" element={<PrivateRoute><TrendRadarPage /></PrivateRoute>} />
          <Route path="/competitors" element={<PrivateRoute><CompetitorWatchPage /></PrivateRoute>} />
          <Route path="/deals" element={<PrivateRoute><DealsPage /></PrivateRoute>} />
          <Route path="/inbox" element={<PrivateRoute><InboxPage /></PrivateRoute>} />
          <Route path="/campaigns" element={<PrivateRoute><CampaignsPage /></PrivateRoute>} />
          <Route path="/chat" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
          <Route path="/wallet" element={<PrivateRoute><WalletPage /></PrivateRoute>} />
          <Route path="/schedule" element={<PrivateRoute><SchedulePage /></PrivateRoute>} />
          <Route path="/bio-builder" element={<PrivateRoute><BioBuilderPage /></PrivateRoute>} />
          <Route path="/leaderboard" element={<PrivateRoute><LeaderboardPage /></PrivateRoute>} />
          <Route path="/dashboard/media-kit" element={<PrivateRoute><MediaKitPage /></PrivateRoute>} />
          <Route path="/referral" element={<PrivateRoute><ReferralPage /></PrivateRoute>} />
          <Route path="/subscription" element={<PrivateRoute><SubscriptionPage /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
          <Route path="/profile/:username" element={<PublicProfilePage />} />
          <Route path="/bio/:slug" element={<PublicBioPage />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}
