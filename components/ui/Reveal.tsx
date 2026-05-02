"use client";

import { useEffect } from "react";

/**
 * Mounts a single IntersectionObserver that adds `is-visible` to any
 * `.fade-in-up` element when it enters the viewport. Drop one <Reveal/>
 * once per page and any number of fade-in-up cards animate in on scroll.
 */
export function Reveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document
        .querySelectorAll(".fade-in-up")
        .forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    document.querySelectorAll(".fade-in-up").forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return null;
}
