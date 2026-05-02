export const planLimits = {
  basic: { trackedKeywords: 5, competitors: 3, mediaKit: false, aiReply: false, contentGap: false },
  pro: { trackedKeywords: 15, competitors: 10, mediaKit: true, aiReply: true, contentGap: false },
  premium: { trackedKeywords: Number.POSITIVE_INFINITY, competitors: Number.POSITIVE_INFINITY, mediaKit: true, aiReply: true, contentGap: true },
};

export const getPlanLimits = (plan = "basic") => planLimits[plan] || planLimits.basic;

export const formatFollowerRange = (count = 0) => {
  if (count >= 1_000_000) return "1M+";
  if (count >= 100_000) return "100K+";
  if (count >= 10_000) return "10K+";
  if (count > 0) return `${Math.floor(count / 1000)}K+`;
  return "N/A";
};
