"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { phone, phoneTel } from "@/lib/config/site";
import { leadSchema, type LeadInput } from "@/lib/leads/schema";
import type { ReviewStats } from "@/lib/reviews/getReviewStats";
import { trackLeadConversion } from "@/lib/analytics/conversion";

type Step = 1 | 2 | 3;


const heroChips: { slug: LeadInput["service"]; label: string; icon: React.ReactNode }[] = [
    {
        slug: "carpet-cleaning",
        label: "Carpet Cleaning",
        icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <rect x="2" y="4" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.4" />
                <path d="M5 7h6M5 9.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        slug: "upholstery-cleaning",
        label: "Upholstery",
        icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 11h10v2H3z" stroke="currentColor" strokeWidth="1.3" />
                <path d="M4 11V7a1.5 1.5 0 011.5-1.5h5A1.5 1.5 0 0112 7v4" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        slug: "mattress-cleaning",
        label: "Mattress",
        icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <rect x="2" y="6" width="12" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                <rect x="2" y="11" width="12" height="2" rx="0.7" stroke="currentColor" strokeWidth="1.2" />
            </svg>
        ),
    },
    {
        slug: "rug-cleaning",
        label: "Rug Cleaning",
        icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <rect x="3" y="4" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1.3" />
                <path d="M3 7h10M3 9h10M5 4v8M11 4v8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
            </svg>
        ),
    },
    {
        slug: "tile-and-grout-cleaning",
        label: "Tile & Grout",
        icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
                <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
                <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
                <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
            </svg>
        ),
    },
    {
        slug: "deep-cleaning",
        label: "Deep Clean",
        icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M2 13V7l6-4 6 4v6H2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                <rect x="6" y="9" width="4" height="4" stroke="currentColor" strokeWidth="1.2" />
            </svg>
        ),
    },
    {
        slug: "end-of-lease-cleaning",
        label: "End of Lease",
        icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <rect x="3" y="3" width="10" height="11" rx="1" stroke="currentColor" strokeWidth="1.3" />
                <path d="M5 2h6v3H5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                <path d="M5 8h6M5 11h4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.6" />
            </svg>
        ),
    },
    {
        slug: "emergency-flood-restoration",
        label: "Flood Restoration",
        icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M8 2c-1.5 2.5-4 4.5-4 7a4 4 0 008 0c0-2.5-2.5-4.5-4-7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
        ),
    },
];


const todayIso = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
};

interface HomeHeroProps {
    reviewStats: ReviewStats | null;
}



export function HeroFunnel({ reviewStats }: HomeHeroProps) {

    const [step, setStep] = useState<Step>(1);
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        trigger,
        watch,
        formState: { errors },
    } = useForm<LeadInput>({
        resolver: zodResolver(leadSchema),
        mode: "onBlur",
        defaultValues: {
            service: undefined,
            name: "",
            phone: "",
            suburb: "",
            preferredDate: "",
            honeypot: "",
        },
    });

    const selectedService = watch("service");

    const goToStep2 = async () => {
        const ok = await trigger("service");
        if (ok) setStep(2);
    };

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
                    setServerError("You just submitted a request. Please wait a minute.");
                } else if (kind === "validation") {
                    setServerError("Please double-check your details.");
                } else {
                    setServerError("Something went wrong. Please call us instead.");
                }
                return;
            }
            setStep(3);
            trackLeadConversion({
                phone: data.phone,
                name: data.name,
                suburb: data.suburb,
            });
        } catch {
            setServerError("Network error. Please call us instead.");
        } finally {
            setSubmitting(false);
        }
    });

    return (<div
        className="hidden md:flex relative items-center justify-center"
        style={{ zIndex: 2 }}
    >
        <div className="relative w-full" style={{ maxWidth: 420, margin: "0 auto" }}>
            <form
                noValidate
                onSubmit={onSubmit}
                style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 20,
                    padding: 32,
                    backdropFilter: "blur(12px)",
                }}
            >
                <div
                    className="text-white"
                    style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: 20 }}
                >
                    ⚡ Book in 60 Seconds
                </div>
                <div
                    className="flex"
                    style={{
                        background: "rgba(255,255,255,0.06)",
                        borderRadius: 10,
                        overflow: "hidden",
                        marginBottom: 20,
                    }}
                >
                    {[
                        { n: 1, label: "Service" },
                        { n: 2, label: "Details" },
                        { n: 3, label: "Confirm" },
                    ].map((s, i) => {
                        const active = step === s.n;
                        const done = step > s.n;
                        return (
                            <div
                                key={s.n}
                                className="flex-1 text-center"
                                style={{
                                    padding: "10px 4px",
                                    fontSize: 12,
                                    fontWeight: 700,
                                    background: active
                                        ? "var(--color-teal)"
                                        : done
                                            ? "rgba(255,255,255,0.08)"
                                            : "transparent",
                                    color: active
                                        ? "#fff"
                                        : done
                                            ? "rgba(255,255,255,0.6)"
                                            : "rgba(255,255,255,0.45)",
                                    borderRight: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none",
                                }}
                            >
                                <span style={{ display: "block", fontSize: 16, marginBottom: 2 }}>
                                    {s.n === 1 ? "①" : s.n === 2 ? "②" : "③"}
                                </span>
                                {s.label}
                            </div>
                        );
                    })}
                </div>
                {step === 1 && (
                    <div>
                        <div
                            style={{
                                color: "rgba(255,255,255,0.65)",
                                fontSize: 13,
                                fontWeight: 600,
                                marginBottom: 12,
                            }}
                        >
                            What do you need cleaned?
                        </div>
                        <div
                            className="grid"
                            style={{ gridTemplateColumns: "1fr 1fr", gap: 8 }}
                            role="radiogroup"
                            aria-label="Service"
                        >
                            {heroChips.map((c) => {
                                const checked = selectedService === c.slug;
                                return (
                                    <label
                                        key={c.slug}
                                        className="cursor-pointer flex items-center gap-2 select-none"
                                        style={{
                                            background: checked
                                                ? "rgba(78,146,218,0.15)"
                                                : "rgba(255,255,255,0.07)",
                                            border: `1px solid ${checked ? "var(--color-teal)" : "rgba(255,255,255,0.12)"
                                                }`,
                                            borderRadius: 10,
                                            padding: "10px",
                                            color: checked ? "#fff" : "rgba(255,255,255,0.8)",
                                            fontSize: 13,
                                            fontWeight: 600,
                                            transition: "all 0.15s",
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            value={c.slug}
                                            {...register("service")}
                                            className="sr-only-honeypot"
                                        />
                                        <span
                                            className="shrink-0"
                                            style={{ color: "var(--color-teal)" }}
                                        >
                                            {c.icon}
                                        </span>
                                        {c.label}
                                    </label>
                                );
                            })}
                        </div>
                        {errors.service && (
                            <p
                                role="alert"
                                style={{ color: "#ffb4a8", fontSize: 13, marginTop: 10 }}
                            >
                                {errors.service.message}
                            </p>
                        )}
                        <button
                            type="button"
                            onClick={goToStep2}
                            style={{
                                width: "100%",
                                background: "var(--color-teal)",
                                color: "#fff",
                                fontSize: 16,
                                fontWeight: 700,
                                border: 0,
                                borderRadius: 10,
                                padding: 15,
                                marginTop: 16,
                                minHeight: 44,
                            }}
                        >
                            Next Step →
                        </button>
                    </div>
                )}
                {step === 2 && (
                    <div>
                        <div
                            style={{
                                color: "rgba(255,255,255,0.65)",
                                fontSize: 13,
                                fontWeight: 600,
                                marginBottom: 12,
                            }}
                        >
                            Tell us about your space
                        </div>
                        <DarkInput
                            id="hh-name"
                            type="text"
                            placeholder="Your name"
                            autoComplete="name"
                            register={register("name")}
                            error={errors.name?.message}
                        />
                        <DarkInput
                            id="hh-phone"
                            type="tel"
                            placeholder="Phone number"
                            autoComplete="tel"
                            register={register("phone")}
                            error={errors.phone?.message}
                        />
                        <DarkInput
                            id="hh-suburb"
                            type="text"
                            placeholder="Suburb / postcode"
                            autoComplete="address-level2"
                            register={register("suburb")}
                            error={errors.suburb?.message}
                        />
                        <DarkInput
                            id="hh-date"
                            type="date"
                            placeholder="Preferred date"
                            min={todayIso()}
                            register={register("preferredDate")}
                            error={errors.preferredDate?.message}
                        />
                        <div className="sr-only-honeypot" aria-hidden="true">
                            <label>
                                Leave this empty
                                <input
                                    type="text"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    {...register("honeypot")}
                                />
                            </label>
                        </div>
                        {serverError && (
                            <p
                                role="alert"
                                style={{ color: "#ffb4a8", fontSize: 13, marginBottom: 10 }}
                            >
                                {serverError}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                width: "100%",
                                background: "var(--color-teal)",
                                color: "#fff",
                                fontSize: 16,
                                fontWeight: 700,
                                border: 0,
                                borderRadius: 10,
                                padding: 15,
                                marginTop: 4,
                                minHeight: 44,
                                opacity: submitting ? 0.6 : 1,
                            }}
                        >
                            {submitting ? "Sending…" : "Confirm Booking →"}
                        </button>
                    </div>
                )}
                {step === 3 && (
                    <div className="text-center" style={{ padding: "16px 0" }}>
                        <div
                            className="mx-auto flex items-center justify-center bg-teal text-white rounded-full"
                            style={{ width: 56, height: 56, fontSize: 26, marginBottom: 16 }}
                            aria-hidden
                        >
                            ✓
                        </div>
                        <h3
                            className="text-white"
                            style={{ fontSize: "1.1rem", marginBottom: 8 }}
                        >
                            You&rsquo;re all booked in!
                        </h3>
                        <p
                            style={{
                                color: "rgba(255,255,255,0.6)",
                                fontSize: 14,
                                marginTop: 8,
                            }}
                        >
                            Our team will call you within 30 minutes to confirm details and pricing.
                        </p>
                        <div
                            style={{
                                marginTop: 20,
                                padding: 14,
                                background: "rgba(255,255,255,0.07)",
                                borderRadius: 10,
                                fontSize: 13,
                                color: "rgba(255,255,255,0.7)",
                            }}
                        >
                            📞 Or call us right now:
                            <br />
                            <a
                                href={phoneTel}
                                style={{
                                    color: "var(--color-teal)",
                                    fontWeight: 700,
                                    fontSize: 16,
                                }}
                            >
                                {phone}
                            </a>
                        </div>
                    </div>
                )}
                {reviewStats && (
                    <div
                        className="absolute whitespace-nowrap"
                        style={{
                            right: 113,
                            bottom: -18,
                            background: "var(--color-gold)",
                            color: "var(--color-navy)",
                            fontSize: 12,
                            fontWeight: 800,
                            padding: "8px 14px",
                            borderRadius: 100,
                            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                        }}
                    >
                        ⭐ {reviewStats.average.toFixed(1)}/5 · {reviewStats.count.toLocaleString()}+ Reviews
                    </div>
                )}
            </form>
        </div>
    </div>)
}

interface DarkInputProps {
    id: string;
    type: string;
    placeholder: string;
    autoComplete?: string;
    min?: string;
    register: ReturnType<ReturnType<typeof useForm<LeadInput>>["register"]>;
    error?: string;
}

function DarkInput({
    id,
    type,
    placeholder,
    autoComplete,
    min,
    register,
    error,
}: DarkInputProps) {
    return (
        <div style={{ marginBottom: 12 }}>
            <label htmlFor={id} className="sr-only-honeypot">
                {placeholder}
            </label>
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                min={min}
                {...register}
                aria-invalid={!!error}
                style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.08)",
                    border: `1.5px solid ${error ? "#ffb4a8" : "rgba(255,255,255,0.15)"}`,
                    borderRadius: 10,
                    padding: "13px 16px",
                    color: "#fff",
                    fontFamily: "inherit",
                    fontSize: 15,
                    outline: "none",
                }}
            />
            {error && (
                <p role="alert" style={{ color: "#ffb4a8", fontSize: 12, marginTop: 4 }}>
                    {error}
                </p>
            )}
        </div>
    );
}