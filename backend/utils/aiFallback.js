const hashtagify = (topic) =>
  topic
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => `#${word.replace(/[^a-z0-9]/g, "")}`);

export const buildFallbackAIContent = (topic) => ({
  hook: `Stop scrolling: ${topic} can grow faster when you fix this one mistake.`,
  script: `Start: Call out the audience struggling with ${topic}. Problem: Explain the common mistake holding results back. Solution: Share three clear steps to improve it today. Result: End with the outcome they can expect in 7 days if they apply it.`,
  caption: `Sharper strategy, faster growth. Use this ${topic} framework today.`,
  hashtags: [...new Set([...hashtagify(topic), "#viral", "#reels", "#creator", "#growth", "#socialmedia", "#contentstrategy"])].slice(0, 10),
  reelIdeas: [
    `${topic}: 3 mistakes beginners make`,
    `How I would grow with ${topic} from zero`,
    `${topic} before vs after transformation`,
  ],
  analyzer: {
    score: 78,
    summary: `Strong topic angle. Improve retention by adding a sharper first 2 seconds and one clearer CTA.`,
  },
});
