import { formatNumber } from "@/utils/format";
import { categoryColor } from "@/data/categories";

export default function CategoryCard({
  categoryId,
  label,
  questions,
  total,
  color,
}) {
  const share = total ? (questions / total) * 100 : 0;
  const fillColor = color ?? categoryColor(categoryId);

  return (
    <article className="card p-5 transition-shadow duration-300 ease-calm hover:shadow-lift">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-[19px] text-ink">{label}</h3>
        <span className="tabular text-[13px] font-semibold text-muted">
          {share.toFixed(1)}%
        </span>
      </div>

      <p className="mt-2 font-mono text-[26px] leading-none tabular text-ink">
        {formatNumber(questions)}
      </p>
      <p className="mt-1 text-[13px] text-muted">pertanyaan</p>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-ink/[0.07] dark:bg-white/[0.07]">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-calm"
          style={{
            width: `${Math.max(share, 2)}%`,
            backgroundColor: fillColor,
          }}
        />
      </div>
    </article>
  );
}
