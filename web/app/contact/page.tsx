"use client";

import { useEffect, useState, type FormEvent } from "react";
import styles from "./contact.module.css";
import { NBCardPanel } from "@/components/nbcard/NBCardPanel";
import { TurnstileWidget } from "@/components/security/turnstile-widget";
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";

export default function ContactPage() {
  const [mounted, setMounted] = useState(false);
  const [contactSubmitStatus, setContactSubmitStatus] = useState<
    { state: "idle" | "submitting" | "success" | "error"; message?: string }
  >({ state: "idle" });
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);

  // Ensure browser-only APIs render safely
  useEffect(() => {
    setMounted(true);
  }, []);

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

    const data = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
      organization: String(formData.get("organization") ?? ""),
      phone: String(formData.get("phone") ?? ""),

      // Honeypot (bots fill it)
      company: String(formData.get("company") ?? ""),
      website: String(formData.get("website") ?? ""),

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
            NBCard - Digital Business Card
          </h1>
          <p className="text-gray-600 text-lg">Create, manage, and share your professional profile</p>
        </div>

        {/* Section A: Main Contact Page */}
        <section aria-label="Contact Us" className="mb-12">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Contact Us</h2>
            <p className="text-gray-600">Have questions? We'd love to hear from you!</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <form onSubmit={handleContactFormSubmit} className="space-y-4">
              {/* Honeypot field: bots often fill it, humans never see it */}
              <div className={styles.honeypot}>
                <label htmlFor="company">Company</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />
              </div>
              <div className={styles.honeypot}>
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
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
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
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
                <label htmlFor="organization" className="block text-sm font-semibold text-gray-700 mb-2">
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
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
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
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
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
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
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
                    <p className="text-sm text-green-700">{contactSubmitStatus.message}</p>
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
                        <a href="mailto:support@nbcard.app" className="text-purple-600 hover:text-purple-700">
                          support@nbcard.app
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

        {/* Gradient Divider */}
        <div className="my-12" aria-hidden="true">
          <div className="h-[2px] w-full bg-gradient-to-r from-purple-300 via-blue-300 to-pink-300 opacity-70" />
          <div className="mt-4 h-4 w-full rounded-full bg-gradient-to-r from-purple-100 via-blue-100 to-pink-100 opacity-90 shadow-sm" />
        </div>

        {/* Section B: NBCard Profile & Contact Capture */}
        <section aria-labelledby="nbcard-profile-heading" className="mt-4">
          <div className="text-center mb-6">
            <h2 id="nbcard-profile-heading" className="text-3xl font-bold text-gray-800 mb-2">NBCard Profile</h2>
            <p className="text-gray-600">Manage your profile, share your card, and capture contacts.</p>
          </div>

          <NBCardPanel />
        </section>
      </div>
    </div>
  );
}
