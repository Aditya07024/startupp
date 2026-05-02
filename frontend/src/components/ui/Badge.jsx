export default function Badge({ children, tone = "default" }) {
  const toneClass = {
    default: "badge-violet",
    success: "badge-green",
    danger: "badge-red",
    warning: "badge-yellow",
    blue: "badge-blue",
    cyan: "badge-cyan",
  }[tone];

  return <span className={`badge ${toneClass}`}>{children}</span>;
}
