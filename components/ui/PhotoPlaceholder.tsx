interface PhotoPlaceholderProps {
  label?: string;
  className?: string;
  aspectRatio?: string;
  rounded?: boolean;
}

export function PhotoPlaceholder({
  label = "PHOTO",
  className = "",
  aspectRatio = "4 / 3",
  rounded = true,
}: PhotoPlaceholderProps) {
  return (
    <div
      className={`photo-placeholder ${rounded ? "rounded-[14px]" : ""} ${className}`}
      style={{ aspectRatio, width: "100%" }}
      aria-hidden
    >
      <span className="photo-placeholder-label">{label}</span>
    </div>
  );
}
