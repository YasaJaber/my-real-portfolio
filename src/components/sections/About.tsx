"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Download, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Reveal } from "@/components/visuals/Reveal";
import { CameraShutter } from "@/components/visuals/CameraShutter";
import { useLanguage } from "@/i18n/LanguageContext";

const easeOut = [0.22, 1, 0.36, 1] as const;
const cvFileUrl = "/Yasa%20jaber%27s%20CV.pdf";

export function About() {
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [shutterTrigger, setShutterTrigger] = useState(0);
  const [isCvOpen, setIsCvOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { locale, t } = useLanguage();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isCvOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsCvOpen(false);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isCvOpen]);

  return (
    <>
      <section id="about" className="section-wrapper">
        <div className="grid items-center gap-16 md:grid-cols-2 md:gap-24 lg:gap-32">
        {/* Left: bio text */}
        <div className="flex flex-col">
          <Reveal direction="up" distance={14}>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/45">
              {t.about.label[locale]}
            </span>
          </Reveal>

          <Reveal direction="up" delay={0.08}>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-tight text-white md:text-5xl lg:text-6xl">
              {t.about.heading[locale]}
            </h2>
          </Reveal>

          <Reveal direction="up" delay={0.16}>
            <p className="mt-7 text-pretty text-base leading-relaxed text-white/65 md:text-lg">
              {locale === "en" ? (
                <>
                  I&apos;m <span className="text-white font-medium">Yasa</span>, a
                  skilled front-end developer and graphic designer from Sohag,
                  studying at the Egyptian E-Learning University. I specialize in
                  creating responsive and interactive user interfaces with a strong
                  foundation in modern web technologies.
                </>
              ) : (
                <>
                  أنا <span className="text-white font-medium">يسي</span>، مطوّر
                  واجهات أمامية ومصمّم جرافيك من سوهاج، بدرس في الجامعة المصرية
                  للتعلّم الإلكتروني. متخصص في بناء واجهات تفاعلية ومتجاوبة بأساس
                  قوي في تقنيات الويب الحديثة.
                </>
              )}
            </p>
          </Reveal>

          <Reveal direction="up" delay={0.22}>
            <p className="mt-4 text-pretty text-base leading-relaxed text-white/65 md:text-lg">
              {locale === "en" ? (
                <>
                  I have hands-on experience with React, Next.js, TypeScript,
                  Tailwind CSS, and a variety of CSS preprocessors and state
                  management solutions. My focus is on delivering visually
                  appealing, high-performance, and user-friendly web solutions.
                </>
              ) : (
                <>
                  عندي خبرة عملية مع React و Next.js و TypeScript و Tailwind CSS
                  وأدوات CSS preprocessors ومكتبات إدارة الحالة. تركيزي على تقديم
                  حلول ويب جذابة بصريًا وعالية الأداء وسهلة الاستخدام.
                </>
              )}
            </p>
          </Reveal>

          <Reveal direction="up" delay={0.28}>
            <p className="mt-4 text-pretty text-base leading-relaxed text-white/65 md:text-lg">
              {locale === "en" ? (
                <>
                  Beyond development, I bring over three years of graphic design
                  experience — branding, logos, social media content, and marketing
                  materials — ensuring every project achieves aesthetic and
                  functional harmony.
                </>
              ) : (
                <>
                  بجانب التطوير، عندي أكتر من تلات سنين خبرة في تصميم الجرافيك —
                  هويات بصرية، شعارات، محتوى سوشيال ميديا، ومواد تسويقية — عشان
                  كل مشروع يطلع متناسق بصريًا ووظيفيًا.
                </>
              )}
            </p>
          </Reveal>

            <Reveal direction="up" delay={0.34}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <motion.button
                  type="button"
                  className="btn-primary"
                  data-cursor-grow
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsCvOpen(true)}
                >
                  <span>{t.about.showCv[locale]}</span>
                </motion.button>
              </div>
            </Reveal>

            {/* Experience highlight */}
            <Reveal direction="up" delay={0.36}>
              <div className="mt-10 flex items-center gap-6 border-t border-white/10 pt-7">
                <span className="font-display text-6xl font-semibold leading-none tracking-tight text-white md:text-7xl">
                  3
                </span>
                <span aria-hidden className="h-12 w-px bg-white/15" />
                <div className="flex flex-col gap-2">
                  <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/50">
                    {t.about.yearsExp[locale]}
                  </p>
                  <p className="text-base font-medium text-white md:text-lg">
                    {t.about.frontEndDev[locale]}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: photo */}
          <Reveal direction="up" delay={0.12}>
            <motion.div
              className="group relative mx-auto w-full max-w-sm md:max-w-none"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.5, ease: easeOut }}
              onPointerEnter={() => {
                setIsImageHovered(true);
                setShutterTrigger((trigger) => trigger + 1);
              }}
              onPointerLeave={() => setIsImageHovered(false)}
            >
              {/* Ambient glow — emerald/cyan to complement the B&W portrait */}
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-8 rounded-3xl opacity-60 blur-3xl"
                style={{
                  background:
                    "radial-gradient(ellipse at 55% 40%, rgba(52,211,153,0.18), rgba(6,182,212,0.12) 55%, transparent 80%)",
                }}
              />

              {/* Subtle corner accent glow top-right */}
              <span
                aria-hidden
                className="pointer-events-none absolute -top-6 -right-6 h-40 w-40 rounded-full opacity-40 blur-2xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(99,102,241,0.3), transparent 70%)",
                }}
              />

              {/* Outer decorative border */}
              <span
                aria-hidden
                className="absolute -inset-[3px] rounded-2xl border border-white/[0.07]"
              />

              {/* Photo container */}
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]">
                {/* B&W portrait — already dark bg, just brighten slightly */}
                <Image
                  src="/yasa-jaber-hero.jpg"
                  alt="Yasa Jaber"
                  width={600}
                  height={750}
                  priority
                  className="w-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  style={{
                    aspectRatio: "4/5",
                    filter: "brightness(1.05) contrast(1.05)",
                  }}
                />

                {/* Subtle cyan-emerald colour-grade on the B&W photo */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 mix-blend-color"
                  style={{
                    background:
                      "linear-gradient(160deg, rgba(52,211,153,0.12) 0%, rgba(6,182,212,0.08) 50%, transparent 100%)",
                  }}
                />

                {/* Bottom vignette fade into page bg */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(3,3,3,0.65) 0%, rgba(3,3,3,0.15) 30%, transparent 55%)",
                  }}
                />

                {/* Edge vignette — blends dark photo bg with site bg seamlessly */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    boxShadow: "inset 0 0 80px 20px rgba(3,3,3,0.55)",
                  }}
                />

                {/* Camera shutter sits above every image grade/vignette layer. */}
                <CameraShutter
                  isHovered={isImageHovered}
                  triggerKey={shutterTrigger}
                  className="z-30"
                />
              </div>

              {/* Available badge */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4, ease: easeOut }}
                className="absolute -bottom-4 -left-4 flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2.5 backdrop-blur-md rtl:-left-auto rtl:-right-4"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                <span className="text-xs font-medium text-white/80">
                  {t.about.availableForWork[locale]}
                </span>
              </motion.div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {isMounted
        ? createPortal(
            <AnimatePresence>
              {isCvOpen ? (
                <motion.div
                  className="fixed inset-0 z-[999] overflow-y-auto bg-black/80 backdrop-blur-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsCvOpen(false)}
                >
                  <div className="flex min-h-dvh items-center justify-center px-4 py-6">
                    <motion.div
                      className="glass-strong relative flex h-[85dvh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl"
                      initial={{ opacity: 0, y: 24, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 24, scale: 0.98 }}
                      transition={{ duration: 0.3, ease: easeOut }}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4 md:px-6">
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
                            {t.about.resume[locale]}
                          </p>
                          <h3 className="mt-1 text-lg font-medium text-white">
                            Yasa Jaber CV
                          </h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <motion.a
                            href={cvFileUrl}
                            download="Yasa-Jaber-CV.pdf"
                            className="btn-ghost !px-4 !py-2.5"
                            data-cursor-grow
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <Download size={16} />
                            <span>{t.about.downloadCv[locale]}</span>
                          </motion.a>

                          <motion.button
                            type="button"
                            onClick={() => setIsCvOpen(false)}
                            className="btn-ghost !px-4 !py-2.5"
                            aria-label="Close CV preview"
                            data-cursor-grow
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <X size={16} />
                            <span>{t.about.close[locale]}</span>
                          </motion.button>
                        </div>
                      </div>

                      <div className="min-h-0 flex-1 bg-black/30 p-3 md:p-4">
                        <iframe
                          src={`${cvFileUrl}#view=FitH`}
                          title="Yasa Jaber CV Preview"
                          className="h-full w-full rounded-2xl border border-white/10 bg-white"
                        />
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}
