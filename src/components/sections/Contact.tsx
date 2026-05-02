"use client";

import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, MailCheck } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Reveal, Stagger, RevealItem } from "@/components/visuals/Reveal";
import { useLanguage } from "@/i18n/LanguageContext";

const easeOut = [0.22, 1, 0.36, 1] as const;
const CONTACT_SENT_STORAGE_KEY = "portfolio_contact_form_sent_v1";

const WEB3FORMS_ACCESS_KEY = "11c8af9a-fbb6-4f19-a177-9c32d90defe0";

export function Contact() {
  const { locale, t } = useLanguage();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitState, setSubmitState] = useState<{
    status: "idle" | "loading" | "error";
    message: string;
  }>({
    status: "idle",
    message: "",
  });
  const [hasSent, setHasSent] = useState(false);
  const [senderName, setSenderName] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sentFlag = window.localStorage.getItem(CONTACT_SENT_STORAGE_KEY);
    const savedName = window.localStorage.getItem(
      `${CONTACT_SENT_STORAGE_KEY}_name`,
    );

    if (sentFlag === "true") {
      setHasSent(true);
      if (savedName) {
        setSenderName(savedName);
      }
    }
  }, []);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState({ status: "loading", message: "" });

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: "New Portfolio Contact Message",
          from_name: formState.name,
          name: formState.name,
          email: formState.email,
          message: formState.message,
        }),
      });

      const result = (await response.json()) as { success?: boolean };

      if (result.success) {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(CONTACT_SENT_STORAGE_KEY, "true");
          window.localStorage.setItem(
            `${CONTACT_SENT_STORAGE_KEY}_name`,
            formState.name,
          );
        }
        setSenderName(formState.name);
        setFormState({ name: "", email: "", message: "" });
        setSubmitState({ status: "idle", message: "" });
        setHasSent(true);
        return;
      }

      setSubmitState({
        status: "error",
        message: t.contact.errorGeneral[locale],
      });
    } catch {
      setSubmitState({
        status: "error",
        message: t.contact.errorNetwork[locale],
      });
    }
  };

  return (
     <section id="contact" className="section-wrapper overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: easeOut }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-8 md:p-12 lg:p-16"
      >
        {/* Subtle ambient glow inside card */}
        <span
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.18), transparent 70%)",
          }}
        />

        <Reveal direction="up" distance={14}>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/45">
            {t.contact.label[locale]}
          </span>
        </Reveal>

        <Reveal direction="up" delay={0.08}>
          <h2 className="mt-5 max-w-3xl font-display text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
            {t.contact.heading[locale]}
          </h2>
        </Reveal>

        <Reveal direction="up" delay={0.16}>
          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/65">
            {t.contact.description[locale]}
          </p>
        </Reveal>

        <div
          className="relative mt-8"
          style={{ perspective: "1200px" }}
        >
          <AnimatePresence mode="wait">
            {!hasSent ? (
              <motion.form
                key="contact-form"
                onSubmit={handleSubmit}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{
                  scaleX: [1, 1.03, 0.08],
                  scaleY: [1, 0.5, 0.04],
                  rotateX: [0, 50, 82],
                  rotateY: [0, -8, -18],
                  rotate: [0, 2, 14],
                  x: [0, 30, 580],
                  y: [0, -30, -480],
                  opacity: [1, 0.9, 0],
                  borderRadius: ["0.75rem", "0px", "0px"],
                }}
                transition={{
                  duration: 1.4,
                  times: [0, 0.35, 1],
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                style={{
                  transformOrigin: "center bottom",
                  transformStyle: "preserve-3d",
                  willChange: "transform, opacity",
                }}
                className="grid w-full gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 md:p-6"
              >
                <input
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  placeholder={t.contact.namePlaceholder[locale]}
                  required
                  className="rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-white/25"
                />
                <input
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  placeholder={t.contact.emailPlaceholder[locale]}
                  required
                  className="rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-white/25"
                />
                <textarea
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  placeholder={t.contact.messagePlaceholder[locale]}
                  required
                  rows={5}
                  className="resize-none rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-white/25"
                />

                <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <button
                    type="submit"
                    className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    disabled={submitState.status === "loading"}
                  >
                    <Send size={16} />
                    <span>
                      {submitState.status === "loading"
                        ? t.contact.sending[locale]
                        : t.contact.sendMessage[locale]}
                    </span>
                  </button>

                  {submitState.status === "error" ? (
                    <p className="text-sm text-red-300" role="status">
                      {submitState.message}
                    </p>
                  ) : null}
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="thanks-card"
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.7,
                  delay: 0.9,
                  ease: easeOut,
                }}
                className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 md:p-10"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full opacity-40 blur-3xl"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(16,185,129,0.18), transparent 70%)",
                  }}
                />

                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 1.05,
                    ease: easeOut,
                  }}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                >
                  <MailCheck size={22} />
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2, ease: easeOut }}
                  className="mt-5 font-display text-2xl font-semibold text-white md:text-3xl"
                >
                  {senderName
                    ? t.contact.thanksWithName[locale](senderName.split(" ")[0])
                    : t.contact.thanksGeneric[locale]}
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.3, ease: easeOut }}
                  className="mt-3 max-w-xl text-pretty text-base leading-relaxed text-white/65"
                >
                  {t.contact.thanksBody[locale]}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.45, ease: easeOut }}
                  className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-white/40"
                >
                  {t.contact.urgentNote[locale](siteConfig.author.email)}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Stagger
          className="mt-10 grid gap-6 border-t border-white/10 pt-8 text-sm md:mt-12 md:grid-cols-3"
          stagger={0.12}
          delay={0.05}
        >
          <RevealItem>
            <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
              {t.contact.location[locale]}
            </div>
            <p className="text-white/85">{siteConfig.author.location}</p>
          </RevealItem>
          <RevealItem>
            <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
              {t.contact.availability[locale]}
            </div>
            <p className="text-white/85">{t.contact.availabilityValue[locale]}</p>
          </RevealItem>
          <RevealItem>
            <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
              {t.contact.responseTime[locale]}
            </div>
            <p className="text-white/85">{t.contact.responseTimeValue[locale]}</p>
          </RevealItem>
        </Stagger>
      </motion.div>
    </section>
  );
}
