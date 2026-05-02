"use client";

import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { BookingForm } from "@/components/booking/BookingForm";
import { leadNotifyEmail, phone, phoneTel } from "@/lib/config/site";

export function ContactHero() {
  return (
    <section
      className="hero-navy hero-grid-2 align-end"
      style={{ padding: "80px 5vw 0" }}
    >
      <div
        className="hero-inner"
        style={{ paddingBottom: 80 }}
      >
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
        />

        <h1 className="hero-h1">
          Let&rsquo;s get your <em>space sparkling</em>.
        </h1>

        <p className="hero-desc">
          Whether you need a quick quote, same-day booking, or have a question —
          we&rsquo;re here. Our team responds within one business day, and our
          phone is answered seven days a week.
        </p>

        <div className="contact-methods">
          <a href={phoneTel} className="contact-method">
            <div className="contact-method-icon" aria-hidden>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path
                  d="M3 3h5.5l2 4.5-2.8 1.6C9 11 11 13 12.9 14.3l2.8-1.6 4.5 2V20C9 20 2 13 2 3h1z"
                  stroke="#fff"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <div className="contact-method-label">Phone — fastest response</div>
              <div className="contact-method-value">{phone}</div>
              <div className="contact-method-sub">
                Mon–Fri 7am–6pm · Sat 8am–4pm · Sun by appointment
              </div>
            </div>
          </a>

          <a href={`mailto:${leadNotifyEmail}`} className="contact-method">
            <div className="contact-method-icon" aria-hidden>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect
                  x="2"
                  y="4"
                  width="18"
                  height="14"
                  rx="2"
                  stroke="#fff"
                  strokeWidth="1.6"
                />
                <path
                  d="M2 6l9 6 9-6"
                  stroke="#fff"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <div className="contact-method-label">Email — for longer requests</div>
              <div className="contact-method-value">{leadNotifyEmail}</div>
              <div className="contact-method-sub">Replies within one business day</div>
            </div>
          </a>

          <div className="contact-method" style={{ cursor: "default" }}>
            <div className="contact-method-icon" aria-hidden>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path
                  d="M11 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z"
                  stroke="#fff"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <circle
                  cx="11"
                  cy="9"
                  r="2.5"
                  stroke="#fff"
                  strokeWidth="1.6"
                />
              </svg>
            </div>
            <div>
              <div className="contact-method-label">Service area</div>
              <div className="contact-method-value">Greater Melbourne</div>
              <div className="contact-method-sub">
                120+ inner &amp; middle suburbs covered
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="contact-form-panel">
        <BookingForm variant="inline" />
      </div>
    </section>
  );
}
