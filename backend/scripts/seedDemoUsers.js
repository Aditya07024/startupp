import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import AIContent from "../models/AIContent.js";
import BrandDeal from "../models/BrandDeal.js";
import Campaign from "../models/Campaign.js";
import CreatorProfile from "../models/CreatorProfile.js";
import InboxMessage from "../models/InboxMessage.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

const DEMO_PASSWORD = "Demo@12345";

const buildHistory = (points) =>
  points.map((followers, index) => ({
    label: `W${index + 1}`,
    followers,
    engagement: Number((6.1 + index * 0.3).toFixed(1)),
    reach: followers * 6,
    views: followers * 3,
  }));

const demoUsers = [
  {
    key: "creator",
    email: "demo.creator@viralboost.local",
    payload: {
      name: "Aarav Demo",
      role: "creator",
      avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=creator-demo",
      bio: "Fitness creator sharing short-form workout and nutrition content.",
      isVerified: true,
      plan: "premium",
      subscriptionStatus: "active",
      trialEndsAt: new Date("2027-01-01T00:00:00.000Z"),
      referralCode: "DEMOCR8",
      wallet: {
        balance: 28450,
        pendingBalance: 6200,
      },
      socialAccounts: [
        {
          platform: "instagram",
          handle: "@aarav.moves",
          isConnected: true,
          connectedAt: new Date("2026-03-10T10:00:00.000Z"),
          metrics: {
            followers: 128400,
            engagement: 8.7,
            reach: 2450000,
            views: 48900,
            change: 12.4,
            history: buildHistory([76400, 82100, 93400, 104800, 116900, 128400]),
            lastSyncedAt: new Date("2026-05-02T16:30:00.000Z"),
          },
        },
        {
          platform: "youtube",
          handle: "@aaravmoves",
          isConnected: true,
          connectedAt: new Date("2026-02-14T10:00:00.000Z"),
          metrics: {
            followers: 38600,
            engagement: 6.2,
            reach: 740000,
            views: 18500,
            change: 7.1,
            history: buildHistory([24100, 26500, 28800, 31200, 34700, 38600]),
            lastSyncedAt: new Date("2026-05-01T09:00:00.000Z"),
          },
        },
        {
          platform: "facebook",
          handle: "Aarav Moves",
          isConnected: true,
          connectedAt: new Date("2026-01-21T10:00:00.000Z"),
          metrics: {
            followers: 21900,
            engagement: 4.9,
            reach: 302000,
            views: 9400,
            change: 3.6,
            history: buildHistory([17400, 18100, 18900, 19700, 20800, 21900]),
            lastSyncedAt: new Date("2026-04-30T18:00:00.000Z"),
          },
        },
      ],
    },
  },
  {
    key: "brand",
    email: "demo.recruiter@viralboost.local",
    payload: {
      name: "Recruiter Demo",
      role: "brand",
      avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=brand-demo",
      bio: "Performance marketing recruiter running creator campaigns.",
      isVerified: true,
      plan: "premium",
      subscriptionStatus: "active",
      trialEndsAt: new Date("2027-01-01T00:00:00.000Z"),
      referralCode: "DEMOBRD",
      wallet: {
        balance: 5000,
        pendingBalance: 0,
      },
      socialAccounts: [],
    },
  },
  {
    key: "admin",
    email: "demo.admin@viralboost.local",
    payload: {
      name: "Admin Demo",
      role: "admin",
      avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=admin-demo",
      bio: "Platform operator account for QA and demos.",
      isVerified: true,
      plan: "premium",
      subscriptionStatus: "active",
      trialEndsAt: new Date("2027-01-01T00:00:00.000Z"),
      referralCode: "DEMOADM",
      wallet: {
        balance: 0,
        pendingBalance: 0,
      },
      socialAccounts: [],
    },
  },
  {
    key: "applicant",
    email: "demo.applicant@viralboost.local",
    payload: {
      name: "Meera Applicant",
      role: "creator",
      avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=applicant-demo",
      bio: "UGC creator focused on skincare and wellness brands.",
      isVerified: true,
      plan: "pro",
      subscriptionStatus: "active",
      trialEndsAt: new Date("2027-01-01T00:00:00.000Z"),
      referralCode: "DEMOAPP",
      wallet: {
        balance: 6200,
        pendingBalance: 1200,
      },
      socialAccounts: [
        {
          platform: "instagram",
          handle: "@meera.madeit",
          isConnected: true,
          connectedAt: new Date("2026-03-02T10:00:00.000Z"),
          metrics: {
            followers: 68400,
            engagement: 7.1,
            reach: 1120000,
            views: 28300,
            change: 5.8,
            history: buildHistory([52200, 55100, 57900, 61100, 64700, 68400]),
            lastSyncedAt: new Date("2026-05-02T11:00:00.000Z"),
          },
        },
      ],
    },
  },
];

const aiHistory = [
  {
    topic: "7-day ab challenge reel",
    hook: "Most people train abs wrong for 7 straight days.",
    script: "Day-by-day reel outline showing one movement, one cue, one mistake, and one visible improvement.",
    caption: "A week of focused ab work with cleaner form and better retention hooks. Save this before your next workout.",
    hashtags: ["#fitnesscreator", "#reelideas", "#viralcontent", "#abworkout"],
  },
  {
    topic: "high-protein breakfast ideas",
    hook: "Three breakfasts that hit protein fast without killing prep time.",
    script: "Quick cuts of each meal, macro callouts, and a CTA asking followers which one they want next.",
    caption: "Fast breakfast content always performs when the recipe is realistic. Which one would you actually make?",
    hashtags: ["#mealprep", "#creatorgrowth", "#proteinbreakfast", "#healthyhabits"],
  },
  {
    topic: "gym myth busting carousel",
    hook: "Stop repeating these three gym myths.",
    script: "Slide-by-slide myth, correction, and one proof point with creator commentary.",
    caption: "Simple myth-busting content builds saves and shares when the correction is direct.",
    hashtags: ["#gymtips", "#contentstrategy", "#fitnessmyths", "#socialgrowth"],
  },
];

const inboxMessages = [
  {
    platform: "instagram",
    type: "dm",
    senderName: "PeakFuel India",
    content: "We liked your transformation reel. Are you open to a paid 2-reel campaign this month?",
    isRead: false,
  },
  {
    platform: "youtube",
    type: "mention",
    senderName: "FitStack",
    content: "We featured your shorts channel in our top fitness creators roundup.",
    isRead: true,
  },
  {
    platform: "facebook",
    type: "comment",
    senderName: "BodyCore Labs",
    content: "Can you DM your rate card for branded workout integrations?",
    isRead: false,
  },
];

const transactions = [
  { amount: 18000, type: "credit", description: "PeakFuel campaign payout" },
  { amount: 7200, type: "credit", description: "Affiliate revenue payout" },
  { amount: 3500, type: "debit", description: "Withdrawal requested" },
];

async function upsertDemoUser({ email, payload }) {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const existing = await User.findOne({ email });

  if (existing) {
    existing.set({ ...payload, email, passwordHash });
    await existing.save();
    return existing;
  }

  return User.create({ ...payload, email, passwordHash });
}

async function seedCreatorProfile(creatorId) {
  await CreatorProfile.findOneAndUpdate(
    { userId: creatorId },
    {
      userId: creatorId,
      username: "aarav-demo",
      niche: "fitness",
      followerRanges: {
        instagram: "100K-250K",
        facebook: "10K-50K",
        youtube: "10K-50K",
      },
      portfolio: [
        {
          title: "PeakFuel protein reel",
          platform: "instagram",
          link: "https://example.com/peakfuel-reel",
          thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
          metrics: { views: 210000, likes: 18200, comments: 641 },
        },
        {
          title: "Meal prep shorts",
          platform: "youtube",
          link: "https://example.com/meal-prep-shorts",
          thumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80",
          metrics: { views: 128000, likes: 9400, comments: 318 },
        },
      ],
      stats: {
        avgEngagement: 8.7,
        totalReach: 3490000,
        dealsCompleted: 12,
      },
      mediaKit: {
        generated: true,
        downloadUrl: "/media-kit/aarav-demo.pdf",
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function seedCreatorAIAndInbox(creatorId) {
  await AIContent.deleteMany({ userId: creatorId });
  await AIContent.insertMany(
    aiHistory.map((item, index) => ({
      userId: creatorId,
      ...item,
      createdAt: new Date(Date.now() - index * 86400000),
    }))
  );

  await InboxMessage.deleteMany({ userId: creatorId });
  await InboxMessage.insertMany(
    inboxMessages.map((item, index) => ({
      userId: creatorId,
      ...item,
      createdAt: new Date(Date.now() - index * 43200000),
    }))
  );

  await Transaction.deleteMany({ userId: creatorId });
  await Transaction.insertMany(
    transactions.map((item, index) => ({
      userId: creatorId,
      ...item,
      createdAt: new Date(Date.now() - index * 172800000),
    }))
  );
}

async function seedBrandData(brandId, creatorId, applicantId) {
  await Campaign.deleteMany({ brandId });
  await BrandDeal.deleteMany({ brandId });

  const campaigns = await Campaign.insertMany([
    {
      brandId,
      title: "PeakFuel Summer Shred",
      platform: ["instagram", "youtube"],
      budget: 120000,
      status: "active",
      reach: 410000,
      engagement: 8.2,
      clicks: 12800,
      targetAudience: "18-34 fitness enthusiasts",
      requirements: "2 reels, 3 stories, nutrition CTA",
      followerRequirement: 50000,
      applications: [creatorId, applicantId],
      createdAt: new Date("2026-04-16T09:00:00.000Z"),
      updatedAt: new Date("2026-04-20T09:00:00.000Z"),
    },
    {
      brandId,
      title: "FitStack App Launch",
      platform: ["instagram"],
      budget: 80000,
      status: "open",
      reach: 265000,
      engagement: 6.9,
      clicks: 9400,
      targetAudience: "Working professionals starting gym routines",
      requirements: "1 reel, 1 static post, trial signup CTA",
      followerRequirement: 25000,
      applications: [applicantId],
      createdAt: new Date("2026-04-24T09:00:00.000Z"),
      updatedAt: new Date("2026-04-24T09:00:00.000Z"),
    },
    {
      brandId,
      title: "BodyCore Recovery Pack",
      platform: ["facebook", "instagram"],
      budget: 60000,
      status: "completed",
      reach: 198000,
      engagement: 5.8,
      clicks: 5300,
      targetAudience: "Home workout and recovery audience",
      requirements: "1 testimonial reel and comments moderation",
      followerRequirement: 15000,
      applications: [creatorId],
      createdAt: new Date("2026-03-02T09:00:00.000Z"),
      updatedAt: new Date("2026-03-20T09:00:00.000Z"),
    },
  ]);

  await BrandDeal.insertMany([
    {
      campaignId: campaigns[0]._id,
      creatorId,
      brandId,
      status: "active",
      payoutAmount: 24000,
      createdAt: new Date("2026-04-18T09:00:00.000Z"),
      updatedAt: new Date("2026-04-18T09:00:00.000Z"),
    },
    {
      campaignId: campaigns[1]._id,
      creatorId: applicantId,
      brandId,
      status: "pending",
      payoutAmount: 16000,
      createdAt: new Date("2026-04-25T09:00:00.000Z"),
      updatedAt: new Date("2026-04-25T09:00:00.000Z"),
    },
    {
      campaignId: campaigns[2]._id,
      creatorId,
      brandId,
      status: "completed",
      payoutAmount: 12000,
      createdAt: new Date("2026-03-05T09:00:00.000Z"),
      updatedAt: new Date("2026-03-18T09:00:00.000Z"),
    },
  ]);

  await Transaction.insertMany([
    {
      userId: brandId,
      type: "credit",
      amount: 95000,
      description: "Campaign budget funded",
      createdAt: new Date("2026-04-10T09:00:00.000Z"),
    },
    {
      userId: brandId,
      type: "debit",
      amount: 36000,
      description: "Creator payouts released",
      createdAt: new Date("2026-04-28T09:00:00.000Z"),
    },
  ]);
}

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const users = {};
  for (const entry of demoUsers) {
    users[entry.key] = await upsertDemoUser(entry);
  }

  await CreatorProfile.deleteMany({ userId: { $in: [users.creator._id, users.applicant._id] } });
  await Transaction.deleteMany({ userId: { $in: [users.brand._id, users.admin._id, users.applicant._id] } });

  await seedCreatorProfile(users.creator._id);
  await seedCreatorAIAndInbox(users.creator._id);
  await seedBrandData(users.brand._id, users.creator._id, users.applicant._id);

  await CreatorProfile.findOneAndUpdate(
    { userId: users.applicant._id },
    {
      userId: users.applicant._id,
      username: "meera-applicant",
      niche: "ugc",
      followerRanges: { instagram: "50K-100K", facebook: "", youtube: "" },
      stats: { avgEngagement: 7.1, totalReach: 1120000, dealsCompleted: 4 },
      mediaKit: { generated: true, downloadUrl: "/media-kit/meera-applicant.pdf" },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log("Demo accounts ready:");
  console.log(`- Recruiter/Brand: demo.recruiter@viralboost.local / ${DEMO_PASSWORD}`);
  console.log(`- Creator: demo.creator@viralboost.local / ${DEMO_PASSWORD}`);
  console.log(`- Admin: demo.admin@viralboost.local / ${DEMO_PASSWORD}`);
  console.log(`- Extra creator applicant: demo.applicant@viralboost.local / ${DEMO_PASSWORD}`);

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("Failed to seed demo users:", error.message);
  if (mongoose.connection.readyState) {
    await mongoose.disconnect();
  }
  process.exit(1);
});
