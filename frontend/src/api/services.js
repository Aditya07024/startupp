import api from "./axios";

export const authApi = {
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) => api.post("/auth/login", payload),
  me: () => api.get("/auth/me"),
};

export const aiApi = {
  generate: (payload) => api.post("/ai/generate", payload),
  reelIdeas: (payload) => api.post("/ai/reel-ideas", payload),
  analyze: (payload) => api.post("/ai/analyze", payload),
  history: () => api.get("/ai/history"),
};

export const analyticsApi = {
  overview: () => api.get("/analytics/overview"),
  bestTime: () => api.get("/analytics/best-time"),
};

export const trendsApi = {
  live: () => api.get("/trends/live"),
  mentions: (keyword) => api.get(`/trends/mentions?keyword=${encodeURIComponent(keyword)}`),
  track: (payload) => api.post("/trends/track", payload),
  alerts: () => api.get("/trends/alerts"),
};

export const repurposeApi = {
  create: (payload) => api.post("/repurpose", payload),
  history: () => api.get("/repurpose/history"),
};

export const viralScoreApi = {
  predict: (payload) => api.post("/viralscore/predict", payload),
};

export const dealsApi = {
  list: () => api.get("/deals"),
  create: (payload) => api.post("/deals", payload),
  apply: (id) => api.post(`/deals/${id}/apply`),
  applications: () => api.get("/deals/applications"),
  updateApplication: (id, payload) => api.patch(`/deals/applications/${id}`, payload),
};

export const campaignsApi = {
  create: (payload) => api.post("/campaigns", payload),
  dashboard: () => api.get("/campaigns/dashboard"),
  my: () => api.get("/campaigns/my"),
  update: (id, payload) => api.patch(`/campaigns/${id}`, payload),
};

export const walletApi = {
  get: () => api.get("/wallet"),
  withdraw: (payload) => api.post("/wallet/withdraw", payload),
  claimReferral: () => api.post("/wallet/referral/claim"),
};

export const subscriptionApi = {
  plans: () => api.get("/subscription/plans"),
  status: () => api.get("/subscription/status"),
  createOrder: (payload) => api.post("/subscription/create-order", payload),
  verifyPayment: (payload) => api.post("/subscription/verify-payment", payload),
};

export const socialApi = {
  accounts: () => api.get("/social"),
  instructions: () => api.get("/social/instructions"),
  connect: (payload) => api.post("/social/connect", payload),
  sync: (platform) => api.post(`/social/${platform}/sync`),
  disconnect: (platform) => api.delete(`/social/${platform}`),
};

export const profileApi = {
  mine: () => api.get("/profile/me"),
  public: (username) => api.get(`/profile/${username}`),
  addPortfolio: (payload) => api.post("/profile/portfolio", payload),
  removePortfolio: (id) => api.delete(`/profile/portfolio/${id}`),
  generateMediaKit: () => api.post("/profile/mediakit/generate"),
};

export const inboxApi = {
  list: (params = "") => api.get(`/inbox${params}`),
  stats: () => api.get("/inbox/stats"),
  markRead: (id) => api.patch(`/inbox/${id}/read`),
  reply: (id, payload) => api.post(`/inbox/${id}/reply`, payload),
  bulkRead: () => api.post("/inbox/bulk-read"),
  suggestReply: (id) => api.get(`/inbox/${id}/suggest-reply`),
};

export const bioPageApi = {
  mine: () => api.get("/biopage/mine"),
  save: (payload) => api.post("/biopage", payload),
  addLink: (payload) => api.post("/biopage/links", payload),
  updateLink: (id, payload) => api.patch(`/biopage/links/${id}`, payload),
  removeLink: (id) => api.delete(`/biopage/links/${id}`),
  public: (slug) => api.get(`/biopage/public/${slug}`),
  trackClick: (slug, linkId) => api.post(`/biopage/public/${slug}/click/${linkId}`),
};

export const competitorApi = {
  track: (payload) => api.post("/competitor/track", payload),
  list: () => api.get("/competitor/list"),
  analysis: (id) => api.get(`/competitor/${id}/analysis`),
  remove: (id) => api.delete(`/competitor/${id}`),
};

export const leaderboardApi = {
  list: (query = "") => api.get(`/leaderboard${query}`),
};

export const adminApi = {
  dashboard: () => api.get("/admin/dashboard"),
  users: () => api.get("/admin/users"),
  campaigns: () => api.get("/admin/campaigns"),
  verifyUser: (id) => api.patch(`/admin/users/${id}/verify`),
};

export const chatApi = {
  conversations: () => api.get("/chat/conversations"),
  messages: (id) => api.get(`/chat/conversations/${id}/messages`),
  send: (id, payload) => api.post(`/chat/conversations/${id}/messages`, payload),
};

export const scheduleApi = {
  list: () => api.get("/schedule"),
  create: (payload) => api.post("/schedule", payload),
  remove: (id) => api.delete(`/schedule/${id}`),
};
