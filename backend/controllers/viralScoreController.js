const gradeScore = (score) => {
  if (score >= 90) return "S";
  if (score >= 75) return "A";
  if (score >= 60) return "B";
  return "C";
};

export const predictViralScore = async (req, res) => {
  try {
    const { caption = "", hashtags = [], scheduledTime, followerCount = 0 } = req.body;
    const score =
      Math.min(
        98,
        45 +
          Math.min(caption.length / 4, 20) +
          Math.min(hashtags.length * 3, 18) +
          (scheduledTime ? 6 : 0) +
          Math.min(Number(followerCount) / 5000, 9)
      );
    const strengths = ["Clear hook angle", "Relevant hashtags", "Strong platform fit"].slice(0, hashtags.length ? 3 : 2);
    const improvements = ["Tighten the first line", "Add stronger CTA", "Test a sharper emotional trigger"];
    res.json({
      success: true,
      prediction: {
        score: Math.round(score),
        grade: gradeScore(score),
        strengths,
        improvements,
        predictedReach: Math.round(Number(followerCount) * (1.6 + score / 100)),
        confidenceRange: `${Math.round(score - 8)}-${Math.round(score + 6)}`,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
