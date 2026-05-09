"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema, leadServiceOptions, type LeadInput } from "@/lib/leads/schema";
import { Button, ButtonLink } from "@/components/ui/Button";
import { phone, phoneTel } from "@/lib/config/site";
import { trackLeadConversion } from "@/lib/analytics/conversion";

type Variant = "modal" | "inline";
type Step = 1 | 2 | "success";

interface BookingFormProps {
  variant?: Variant;
  prefilledService?: string;
  onClose?: () => void;
}

const todayIso = () => {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Australia/Melbourne",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(new Date());
};

export function BookingForm({
  variant = "modal",
  prefilledService,
  onClose,
}: BookingFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    mode: "onBlur",
    defaultValues: {
      service: (prefilledService as LeadInput["service"]) || "",
      name: "",
      phone: "",
      email: "",
      suburb: "",
      preferredDate: todayIso(),
      preferredTime: "",
      notes: "",
      honeypot: "",
    },
  });

  useEffect(() => {
    if (prefilledService) {
      setValue("service", prefilledService as LeadInput["service"]);
    }
  }, [prefilledService, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.ok !== true) {
        const kind = json?.error?.kind;
        if (kind === "rate-limited") {
          setServerError("You just submitted a request. Please wait a minute and try again.");
        } else if (kind === "validation") {
          setServerError("Please double-check your details and try again.");
        } else {
          setServerError("Something went wrong. Please try again or call us directly.");
        }
        return;
      }
      setSubmitted(true);
      trackLeadConversion({
        email: data.email,
        phone: data.phone,
        name: data.name,
        suburb: data.suburb,
      });
    } catch {
      setServerError("Network error. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  });

  const wrapperPadding =
    variant === "modal" ? "p-8 sm:p-10" : "p-8 sm:p-10 bg-white rounded-[14px] shadow-card";

  if (submitted) {
    return (
      <div className={wrapperPadding}>
        <div className="text-center py-5">
          <div
            className="mx-auto flex items-center justify-center rounded-full bg-teal text-white mb-5"
            style={{ width: 64, height: 64, fontSize: 28 }}
            aria-hidden
          >
            ✓
          </div>
          <h3
            className="font-display text-navy text-[1.3rem] font-bold mb-2"
          >
            Quote Request Received!
          </h3>
          <p className="text-muted mb-6">
            Thank you! Our team will call you within 30 minutes during business hours. For urgent jobs, call us directly:
          </p>
          <div className="flex flex-col gap-4 items-center">
            <ButtonLink variant="primary-lg" href={phoneTel}>
              📞 {phone}
            </ButtonLink>
            {variant === "modal" && onClose && (
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const inputClass = "w-full border-2 border-border-soft rounded-[9px] px-3.5 py-3 text-base text-text-primary mb-3.5 focus:border-teal outline-none transition-all placeholder:text-muted/40 hover:border-border-soft/80";
  const selectClass = `${inputClass} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%235e7080%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10`;
  const errorClass = "text-[12px] text-[#b3261e] mt-[-10px] mb-3.5 px-1 font-semibold";

  return (
    <form noValidate onSubmit={onSubmit} className={wrapperPadding}>
      <header className="mb-7">
        <h2
          className="font-display text-navy text-[1.5rem] font-extrabold mb-1.5"
        >
          Get Your Free Quote
        </h2>
        <p className="text-muted text-[14px] leading-relaxed">
          Fill in your details and we&rsquo;ll call you within 30 minutes with a no-obligation price.
        </p>
      </header>

      <div className="flex flex-col">
        <select
          {...register("service")}
          className={selectClass}
          aria-invalid={!!errors.service}
        >
          <option value="" disabled>Select a service</option>
          {leadServiceOptions.map(opt => (
            <option key={opt.slug} value={opt.slug}>{opt.name}</option>
          ))}
        </select>
        {errors.service && <p className={errorClass}>{errors.service.message}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="Full name *"
              {...register("name")}
              className={inputClass}
              aria-invalid={!!errors.name}
            />
            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
          </div>
          <div className="flex flex-col">
            <input
              type="tel"
              placeholder="Phone number *"
              {...register("phone")}
              className={inputClass}
              aria-invalid={!!errors.phone}
            />
            {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
          </div>
        </div>

        <input
          type="email"
          placeholder="Email address"
          {...register("email")}
          className={inputClass}
          aria-invalid={!!errors.email}
        />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="Suburb / Postcode *"
              {...register("suburb")}
              className={inputClass}
              aria-invalid={!!errors.suburb}
            />
            {errors.suburb && <p className={errorClass}>{errors.suburb.message}</p>}
          </div>
          <div className="flex flex-col">
            <select
              {...register("preferredTime")}
              className={selectClass}
            >
              <option value="" disabled>When?</option>
              <option value="today">Today (Same-day)</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="this-week">This week</option>
              <option value="next-week">Next week</option>
              <option value="flexible">I&rsquo;m flexible</option>
            </select>
          </div>
        </div>

        <textarea
          placeholder="Anything else? (e.g. property size, special requests)"
          rows={3}
          {...register("notes")}
          className={`${inputClass} resize-y min-h-22.5`}
        />

        {/* Honeypot */}
        <div className="sr-only-honeypot" aria-hidden="true">
          <input type="text" tabIndex={-1} {...register("honeypot")} />
        </div>

        {serverError && (
          <p role="alert" className="text-sm text-[#b3261e] text-center mb-4 font-semibold">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-navy text-white text-[16px] font-bold rounded-[11px] py-3.75 mt-2 transition-colors flex items-center justify-center gap-2 hover:bg-teal disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {submitting ? (
            "Sending..."
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 9h12M10 5l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Get My Free Quote Now
            </>
          )}
        </button>

        <p className="text-[12px] text-muted text-center mt-4">
          🔒 Your details are 100% safe and never shared. No spam.
        </p>
      </div>
    </form>
  );
}

