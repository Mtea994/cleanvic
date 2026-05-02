import { getReviewStats } from "@/lib/reviews/getReviewStats";

// WARNING: Replace before launch — fake review counts violate ACL §29 and
// Google's structured-data policy. The visible badge ships with whatever values
// `NEXT_PUBLIC_REVIEW_COUNT` / `NEXT_PUBLIC_REVIEW_AVERAGE` are set to. The
// JSON-LD AggregateRating is gated separately (only emits when stats are real).
export async function ReviewBadge({
  variant = "dark",
}: {
  variant?: "dark" | "light";
}) {
  const stats = await getReviewStats();
  if (!stats) return null;

  const color = variant === "dark" ? "text-white/90" : "text-text-primary";

  return (
    <div
      className={`inline-flex items-center gap-2 ${color}`}
      style={{ fontSize: 14, fontWeight: 600 }}
    >
      <span className="text-gold" aria-hidden style={{ fontSize: 18, lineHeight: 1 }}>
        ★★★★★
      </span>
      <span>
        {stats.average.toFixed(1)}/5 from {stats.count.toLocaleString()}+ reviews
      </span>
    </div>
  );
}
