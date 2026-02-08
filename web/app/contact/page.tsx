"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Profile, Contact, defaultProfile } from "@/lib/utils";
import { loadNbcardLocalState, saveNbcardLocalState } from "./lib/nbcard-storage";
import styles from "./contact.module.css";
import { ProfileManager } from "./components/profile-manager";
import { TurnstileWidget } from "@/components/security/turnstile-widget";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { toast } from "sonner";

const SOCIAL_PLACEHOLDER_VALUES = new Set([
  "https://instagram.com/username",
  "https://facebook.com/username",
  "https://tiktok.com/username",
  "https://linkedin.com/username",
  "https://twitter.com/username",
  "https://website.com/username",
]);

function sanitizeSocialUrl(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (SOCIAL_PLACEHOLDER_VALUES.has(trimmed)) return undefined;
  return trimmed;
}

function sanitizeProfile(profile: Profile): Profile {
  const social = profile.socialMedia || {};

  return {
    ...profile,
    socialMedia: {
      instagram: sanitizeSocialUrl(social.instagram),
      facebook: sanitizeSocialUrl(social.facebook),
      tiktok: sanitizeSocialUrl(social.tiktok),
      linkedin: sanitizeSocialUrl(social.linkedin),
      twitter: sanitizeSocialUrl(social.twitter),
    },
  };
}

export default function ContactPage() {
  const [mounted, setMounted] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([defaultProfile]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showProfileManager, setShowProfileManager] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [isNewProfile, setIsNewProfile] = useState(false);
  const [contactSubmitStatus, setContactSubmitStatus] = useState<
    { state: "idle" | "submitting" | "success" | "error"; message?: string }
  >({ state: "idle" });
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);

  // Load NBCard state
  useEffect(() => {
    let cancelled = false;
    setMounted(true);

    (async () => {
      const state = await loadNbcardLocalState([defaultProfile], []);
      if (cancelled) return;
      const sanitizedProfiles = state.profiles.map(sanitizeProfile);
      setProfiles(sanitizedProfiles);
      setContacts(state.contacts);

      // Support deep-linking to a specific profile via /resources/nb-card?profile=<id>
      try {
        const params = new URLSearchParams(window.location.search);
        const profileId = params.get("profile");
        if (profileId) {
          const index = sanitizedProfiles.findIndex((p) => p.id === profileId);
          if (index >= 0) setCurrentProfileIndex(index);
        }
      } catch {
        // ignore
      }

      // Register NBCard service worker (offline-ready for /contact)
      try {
        if ("serviceWorker" in navigator) {
          // Keep NB-Card SW strictly scoped so it cannot control the full site origin.
          await navigator.serviceWorker.register("/nbcard-sw.js", { scope: "/resources/nb-card/" });
        }
      } catch {
        // Don't block page; SW is best-effort
      }
    })().catch((e) => console.error("Failed to load NBCard state", e));

    return () => {
      cancelled = true;
    };
  }, []);

  // Persist profiles + contacts (local-first)
  useEffect(() => {
    if (mounted) {
      saveNbcardLocalState({ profiles, contacts }).catch((e) => console.error("Failed to persist NBCard state", e));
    }
  }, [profiles, contacts, mounted]);

  const currentProfile = profiles?.[currentProfileIndex] ?? defaultProfile;

  const handleSaveProfile = (profile: Profile) => {
    if (isNewProfile) {
      setProfiles([...profiles, { ...profile, id: Date.now().toString() }]);
      setCurrentProfileIndex(profiles.length);
    } else {
      const updated = profiles.map((p) => (p.id === profile.id ? profile : p));
      setProfiles(updated);
    }
    setShowProfileManager(false);
    setEditingProfile(null);
    setIsNewProfile(false);
  };

  const handleDeleteProfile = () => {
    if (profiles.length === 1) {
      toast.error("Cannot delete the last profile");
      return;
    }
    if (confirm("Are you sure you want to delete this profile?")) {
      const updated = profiles.filter((p) => p.id !== currentProfile.id);
      setProfiles(updated);
      setCurrentProfileIndex(0);
      setShowProfileManager(false);
    }
  };

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  const handleContactFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (contactSubmitStatus.state === "submitting") return;

    // Capture the form element synchronously. In some React/event implementations,
    // `e.currentTarget` can become null after awaiting.
    const form = e.currentTarget;

    if (!turnstileSiteKey) {
      setContactSubmitStatus({
        state: "error",
        message: "Spam protection is not configured yet. Please try again later.",
      });
      return;
    }

    if (!turnstileToken) {
      setContactSubmitStatus({ state: "error", message: "Please complete the verification check." });
      return;
    }

    const formData = new FormData(form);

    // Use non-obvious honeypot field names to reduce accidental autofill by browsers/password managers.
    // These are still sent to the API as `company` and `website`.
    const honeypotCompany = String(formData.get("nb_hp_company") ?? "");
    const honeypotWebsite = String(formData.get("nb_hp_website") ?? "");

    const data = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
      organization: String(formData.get("organization") ?? ""),
      phone: String(formData.get("phone") ?? ""),

      // Honeypot (bots fill it)
      company: honeypotCompany,
      website: honeypotWebsite,

      turnstileToken,
    };

    setContactSubmitStatus({ state: "submitting" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });

      const json: unknown = await res.json().catch(() => null);
      const maybeError =
        json && typeof json === "object" && "error" in json
          ? String((json as { error?: unknown }).error ?? "")
          : "";

      const maybeIssues =
        json && typeof json === "object" && json !== null && "issues" in json
          ? (json as { issues?: unknown }).issues
          : undefined;

      const issuesMessage = (() => {
        if (!maybeIssues || typeof maybeIssues !== "object" || maybeIssues === null) return "";

        const entries = Object.entries(maybeIssues as Record<string, unknown>)
          .map(([field, messages]) => {
            if (!Array.isArray(messages)) return null;
            const first = messages.find((m) => typeof m === "string" && m.trim().length > 0);
            if (typeof first !== "string") return null;
            return field === "_form" ? first : `${field}: ${first}`;
          })
          .filter((v): v is string => typeof v === "string" && v.length > 0);

        return entries.length > 0 ? entries.join("\n") : "";
      })();
      const isDev = json && typeof json === "object" && "dev" in json;
      const okFlag =
        json && typeof json === "object" && "ok" in json
          ? Boolean((json as { ok?: unknown }).ok)
          : false;

      if (!res.ok || !okFlag) {
        const vercelId = res.headers.get("x-vercel-id");
        const statusHint = `Request failed (${res.status}${res.statusText ? ` ${res.statusText}` : ""})`;

        setContactSubmitStatus({
          state: "error",
          message:
            maybeError ||
            issuesMessage ||
            (vercelId ? `${statusHint}. Reference: ${vercelId}` : `${statusHint}. Please try again.`),
        });
        return;
      }

      const successMessage = isDev 
        ? "Thanks! Your message was received. (Development mode - email not sent)" 
        : "Thanks! We'll get back to you soon.";
      
      setContactSubmitStatus({ state: "success", message: successMessage });
      form.reset();
      setTurnstileToken("");
      setTurnstileResetKey((prev) => prev + 1);
    } catch (err) {
      console.error("Contact submit failed:", err);

      const message =
        err instanceof Error && err.message
          ? err.message
          : "Network error. Please try again.";

      const likelyBlocked =
        typeof message === "string" &&
        (message.toLowerCase().includes("failed to fetch") ||
          message.toLowerCase().includes("networkerror") ||
          message.toLowerCase().includes("load failed"));

      setContactSubmitStatus({
        state: "error",
        message: likelyBlocked
          ? "We couldn’t reach the server. If you’re using an ad-blocker, VPN, or strict privacy mode, try disabling it for this site and retry."
          : message,
      });
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-3">
            Contact Us
          </h1>
          <p className="text-gray-600 text-lg">Have questions? We'd love to hear from you!</p>
        </div>

        <div className="w-full px-0 xl:flex xl:justify-center xl:px-4">
          <div className="relative w-full max-w-none rounded-none bg-transparent border-0 shadow-none ring-0 overflow-visible xl:max-w-[1040px] xl:rounded-[2.75rem] xl:bg-gradient-to-b xl:from-zinc-900/90 xl:to-black/90 xl:border xl:border-white/15 xl:shadow-[0_50px_140px_rgba(0,0,0,0.45)] xl:ring-1 xl:ring-black/30 xl:overflow-hidden">
            <div
              aria-hidden="true"
              className="hidden xl:block pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_circle_at_20%_10%,rgba(255,255,255,0.12),transparent_40%),radial-gradient(1200px_circle_at_80%_15%,rgba(255,255,255,0.10),transparent_45%)] opacity-70"
            />

            <div
              aria-hidden="true"
              className="hidden xl:block absolute left-1/2 top-4 -translate-x-1/2 h-3.5 w-24 rounded-full bg-black/70 border border-white/10 shadow-[0_10px_24px_rgba(0,0,0,0.50)]"
            />

            <div aria-hidden="true" className="hidden xl:block absolute left-0 top-20 h-20 w-1.5 rounded-r bg-white/10" />
            <div aria-hidden="true" className="hidden xl:block absolute right-0 top-28 h-24 w-1.5 rounded-l bg-white/10" />

            <div className="relative m-0 rounded-none overflow-visible border-0 shadow-none xl:m-3 xl:sm:m-4 xl:md:m-5 xl:rounded-[2.25rem] xl:overflow-hidden xl:border xl:border-white/10 xl:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <div
                aria-hidden="true"
                className="hidden xl:block absolute inset-0 bg-[radial-gradient(1200px_circle_at_18%_10%,rgba(168,85,247,0.34),transparent_55%),radial-gradient(900px_circle_at_85%_20%,rgba(59,130,246,0.28),transparent_52%),radial-gradient(1000px_circle_at_55%_95%,rgba(236,72,153,0.18),transparent_58%),linear-gradient(180deg,rgba(245,245,250,0.55),rgba(245,245,250,0.38))]"
              />

              <div
                aria-hidden="true"
                className="hidden xl:block absolute -inset-24 rotate-[-10deg] bg-gradient-to-r from-white/18 via-white/0 to-white/0 blur-2xl"
              />

              <div className="relative p-0 xl:p-4 xl:sm:p-6 xl:md:p-8 xl:lg:p-10">
                {/* Section A: Main Contact Page */}
                <section
                  aria-label="Contact Us"
                  className="mb-0"
                  data-tour="nb:contact:contact-form"
                  data-tour-order="1"
                  data-tour-title="Contact form"
                >
                <div className="rounded-2xl p-4 sm:p-6 md:p-8 mb-8 bg-white shadow-xl xl:bg-white/72 xl:dark:bg-zinc-950/55 xl:backdrop-blur-2xl xl:border xl:border-white/40 xl:dark:border-white/12 xl:shadow-[0_26px_80px_rgba(0,0,0,0.22)] xl:ring-1 xl:ring-black/10 xl:dark:ring-white/10">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <form
              onSubmit={handleContactFormSubmit}
              className="space-y-4 [&_input::placeholder]:text-gray-500 [&_textarea::placeholder]:text-gray-500 dark:[&_input::placeholder]:text-gray-300 dark:[&_textarea::placeholder]:text-gray-300"
            >
              {/* Honeypot field: bots often fill it, humans never see it */}
              <div className={styles.honeypot} aria-hidden="true">
                <input
                  id="nb_hp_company"
                  name="nb_hp_company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="new-password"
                  inputMode="none"
                  spellCheck={false}
                  data-1p-ignore="true"
                  data-lp-ignore="true"
                  data-bwignore="true"
                />
              </div>
              <div className={styles.honeypot} aria-hidden="true">
                <input
                  id="nb_hp_website"
                  name="nb_hp_website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="new-password"
                  inputMode="none"
                  spellCheck={false}
                  data-1p-ignore="true"
                  data-lp-ignore="true"
                  data-bwignore="true"
                />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-900 xl:text-white mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  minLength={2}
                  maxLength={80}
                  autoComplete="name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Moe Koroma"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 xl:text-white mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="organization" className="block text-sm font-semibold text-gray-900 xl:text-white mb-2">
                  Organisation (optional)
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  maxLength={200}
                  autoComplete="organization"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="NeuroBreath"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 xl:text-white mb-2">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  maxLength={50}
                  autoComplete="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="+44 7xxx xxxxxx"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 xl:text-white mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  minLength={2}
                  maxLength={120}
                  autoComplete="off"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-900 xl:text-white mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  minLength={5}
                  maxLength={4000}
                  rows={5}
                  autoComplete="off"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                  placeholder="Your message here..."
                />
              </div>

              <div className="pt-2 flex flex-col gap-2">
                {turnstileSiteKey ? (
                  <TurnstileWidget
                    siteKey={turnstileSiteKey}
                    onVerify={setTurnstileToken}
                    onError={() => setTurnstileToken("")}
                    onExpire={() => setTurnstileToken("")}
                    action="contact"
                    theme="light"
                    resetKey={turnstileResetKey}
                  />
                ) : (
                  <p className="text-sm text-amber-700">
                    Turnstile is not configured yet (missing NEXT_PUBLIC_TURNSTILE_SITE_KEY).
                  </p>
                )}

                <div aria-live="polite" aria-atomic="true">
                  {contactSubmitStatus.state === "error" && contactSubmitStatus.message ? (
                    <p className="text-sm text-red-600">{contactSubmitStatus.message}</p>
                  ) : null}
                  {contactSubmitStatus.state === "success" && contactSubmitStatus.message ? (
                    <p className="text-sm text-green-700 xl:text-white">{contactSubmitStatus.message}</p>
                  ) : null}
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  contactSubmitStatus.state === "submitting" ||
                  !turnstileSiteKey ||
                  (turnstileSiteKey ? !turnstileToken : false)
                }
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <FaEnvelope />
                {contactSubmitStatus.state === "submitting"
                  ? "Sending..."
                  : turnstileSiteKey && !turnstileToken
                    ? "Complete verification to send"
                    : "Send Message"}
              </button>
            </form>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Get In Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-600 text-white p-3 rounded-lg">
                      <FaEnvelope className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Email:</h4>
                      <div className="flex flex-col">
                        <a href="mailto:admin@neurobreath.co.uk" className="text-purple-600 hover:text-purple-700">
                          admin@neurobreath.co.uk
                        </a>
                        <a href="mailto:info@neurobreath.co.uk" className="text-purple-600 hover:text-purple-700">
                          info@neurobreath.co.uk
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-600 text-white p-3 rounded-lg">
                      <FaPhone className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Phone</h4>
                      <a href="tel:+44232567890" className="text-purple-600 hover:text-purple-700">
                        +44 (232) 567-890
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-indigo-600 text-white p-3 rounded-lg">
                      <FaMapMarkerAlt className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Location</h4>
                      <div className="text-gray-600">
                        <p>SE 15</p>
                        <p>London United Kingdom</p>
                        <p>England.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
                </section>

                <section
                  aria-label="Trust and safety"
                  className="mt-6"
                  data-tour="nb:contact:trust-safety"
                  data-tour-order="2"
                  data-tour-title="Trust & safety"
                  data-tour-placement="bottom"
                >
                  <div className="rounded-2xl p-4 sm:p-6 bg-white/60 dark:bg-zinc-950/45 backdrop-blur border border-white/30 dark:border-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
                    <h2 className="text-lg font-semibold text-gray-900 xl:text-white">Before you send</h2>
                    <p className="mt-2 text-sm text-gray-700 xl:text-white/90">
                      We only use this form to respond to your message. Educational information only — not medical advice.
                    </p>
                    <p className="mt-2 text-sm text-gray-700 xl:text-white/80">
                      If you or someone else is in immediate danger or needs urgent help, contact your local emergency services.
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>

        {/* Gradient Divider */}
        <div className="my-12" aria-hidden="true">
          <div className="h-[2px] w-full bg-gradient-to-r from-purple-300 via-blue-300 to-pink-300 opacity-70" />
          <div className="mt-4 h-4 w-full rounded-full bg-gradient-to-r from-purple-100 via-blue-100 to-pink-100 opacity-90 shadow-sm" />
        </div>

      </div>

      {/* Profile Manager Modal */}
      {showProfileManager && editingProfile && (
        <ProfileManager
          profile={editingProfile}
          onSave={handleSaveProfile}
          onDelete={!isNewProfile ? handleDeleteProfile : undefined}
          onClose={() => {
            setShowProfileManager(false);
            setEditingProfile(null);
            setIsNewProfile(false);
          }}
          isNew={isNewProfile}
        />
      )}
    </div>
  );
}
