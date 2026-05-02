import type { FaqItem } from "@/lib/content/types";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <ul className="list-none p-0 m-0 flex flex-col gap-3">
      {items.map((item) => (
        <li
          key={item.q}
          className="bg-white border border-border-soft rounded-[12px] overflow-hidden"
        >
          <details>
            <summary
              className="cursor-pointer flex items-center justify-between gap-3 text-navy font-semibold"
              style={{ padding: "16px 18px", listStyle: "none" }}
            >
              <span style={{ fontSize: 16 }}>{item.q}</span>
              <span className="text-teal" aria-hidden style={{ fontSize: 22, lineHeight: 1 }}>+</span>
            </summary>
            <div
              className="text-muted border-t border-border-soft"
              style={{ padding: "14px 18px 18px", fontSize: 15, lineHeight: 1.65 }}
            >
              {item.a}
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
}
