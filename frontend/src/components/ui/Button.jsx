export default function Button({ className = "", variant = "primary", ...props }) {
  const classes = variant === "secondary" ? "btn-secondary" : variant === "ghost" ? "btn-ghost" : variant === "danger" ? "btn-danger" : "btn-primary";
  return <button className={`${classes} ${className}`} {...props} />;
}
