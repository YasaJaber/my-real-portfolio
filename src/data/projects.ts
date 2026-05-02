export type Project = {
  slug: string;
  title: string;
  titleAr: string;
  category: "Web App" | "Branding" | "WordPress" | "Motion";
  categoryAr: string;
  year: number;
  /** Optional cover image — leave empty for the text-only card layout. */
  cover?: string;
  summary: string;
  summaryAr: string;
  description: string;
  descriptionAr: string;
  features: string[];
  featuresAr: string[];
  stack: string[];
  repoUrl: string;
  liveUrl?: string;
  /** Hex color used for the accent halo / glow */
  accent: string;
  /** Optional role label for collaborative projects */
  role?: string;
  roleAr?: string;
  roleLink?: {
    label: string;
    href: string;
  };
};

export const projects: Project[] = [
  {
    slug: "masar-e-learning-platform",
    title: "Masar — E-Learning Platform",
    titleAr: "مسار — منصة تعليمية",
    category: "Web App",
    categoryAr: "تطبيق ويب",
    year: 2026,
    cover: "/projects/masar learning.png",
    summary:
      "A full-stack Arabic-first e-learning platform with three roles, DRM-ready video delivery, certificates, and a 4-layer device-protection system.",
    summaryAr:
      "منصة تعليمية متكاملة بالعربي فيها 3 أدوار، فيديوهات محمية، شهادات، ونظام حماية من 4 طبقات.",
    description:
      "Masar is a production-grade MERN e-learning platform with a full Arabic RTL interface and three role-tailored dashboards (Student, Instructor, Admin). It covers the entire learning lifecycle — course creation, dual-provider video delivery (YouTube for the demo, Bunny.net DRM for production), payment & order management, progress tracking, auto-generated PDF certificates, reviews, comments, coupons, wishlist, and a real-time notification system. A custom 4-layer device-protection layer (device agreement, monthly limit, cooldown, single active session) prevents account sharing.",
    descriptionAr:
      "مسار منصة تعليمية احترافية مبنية بـ MERN مع واجهة عربية كاملة و3 لوحات تحكم (طالب، مدرس، أدمن). بتغطي كل حاجة في التعليم — إنشاء الكورسات، فيديوهات من مصدرين (YouTube للتجربة، Bunny.net للإنتاج)، الدفع والطلبات، متابعة التقدم، شهادات PDF أوتوماتيك، تقييمات، تعليقات، كوبونات، wishlist، وإشعارات لحظية. فيه نظام حماية من 4 طبقات (موافقة الجهاز، حد شهري، فترة انتظار، جلسة واحدة نشطة) عشان محدش يشارك حسابه.",
    features: [
      "Three role dashboards: Student, Instructor, Admin",
      "JWT auth with HttpOnly cookies + refresh-token rotation",
      "4-layer device protection with SHA-256 fingerprinting",
      "Dual video provider system (YouTube + Bunny.net DRM-ready)",
      "Manual & sandbox payment flows + coupon engine",
      "Auto PDF certificates (pdf-lib) with public verification",
      "Real-time notification bell + dedicated notifications page",
      "80+ REST endpoints across 16 route modules, 11 Mongoose models",
    ],
    featuresAr: [
      "3 لوحات تحكم: طالب، مدرس، أدمن",
      "مصادقة JWT مع كوكيز آمنة + تجديد تلقائي للتوكن",
      "حماية أجهزة من 4 طبقات مع بصمة SHA-256",
      "نظام فيديو مزدوج (YouTube + Bunny.net محمي)",
      "دفع يدوي واختباري + محرك كوبونات",
      "شهادات PDF أوتوماتيك مع تحقق عام",
      "جرس إشعارات لحظي + صفحة إشعارات مخصصة",
      "+80 نقطة REST عبر 16 وحدة، 11 نموذج Mongoose",
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind v4",
      "Node.js",
      "Express",
      "MongoDB",
      "Cloudinary",
      "JWT",
    ],
    repoUrl: "https://github.com/Mo7amed-3bnaser/e-learning-platform",
    liveUrl: "https://masar-zsel.onrender.com/",
    role: "Full-Stack Developer · Co-built with",
    roleAr: "مطور Full-Stack · بالتعاون مع",
    roleLink: {
      label: "Mohamed Abdelnaser",
      href: "https://3bnaser.tech/",
    },
    accent: "#A855F7",
  },
  {
    slug: "church-management-system",
    title: "Church Management System",
    titleAr: "نظام إدارة الكنيسة",
    category: "Web App",
    categoryAr: "تطبيق ويب",
    year: 2026,
    cover: "/projects/church management system.png",
    summary:
      "A bilingual Arabic/English platform for Sunday Schools with attendance, pastoral follow-up, exports, and full audit logging.",
    summaryAr:
      "منصة بالعربي والإنجليزي لمدارس الأحد مع حضور، متابعة رعوية، تصدير، وتسجيل كامل.",
    description:
      "A comprehensive management system built for Saint George Church (Sunday Schools / مدارس الأحد) with full Arabic RTL support. It handles multi-role authentication (Admin / Service Leader / Teacher / Servant), class & children management, attendance tracking for both children and servants, pastoral follow-up workflows, gift delivery for streaks, advanced analytics dashboards, role-based PDF/Excel exports, and a complete audit trail with full device fingerprinting on every login.",
    descriptionAr:
      "نظام إدارة شامل لكنيسة مارجرجس (مدارس الأحد) بدعم عربي كامل. بيتعامل مع أدوار متعددة (أدمن / قائد خدمة / مدرس / خادم)، إدارة الفصول والأطفال، تتبع حضور الأطفال والخدام، متابعة رعوية، هدايا للحضور المتتالي، تحليلات متقدمة، تصدير PDF/Excel حسب الدور، ومسار تدقيق كامل مع بصمة جهاز في كل دخول.",
    features: [
      "Multi-role auth with JWT + RBAC (Admin / Leader / Teacher / Servant)",
      "Attendance tracking with consecutive-week streaks & gift eligibility",
      "Pastoral care follow-up with call tracking & auto removal on attendance",
      "PDF & Excel exports with Arabic RTL formatting",
      "Audit trail with full device fingerprint on every login (IP, OS, browser, geo)",
      "Dark mode, error boundary, and bilingual Arabic/English content",
    ],
    featuresAr: [
      "أدوار متعددة مع JWT + RBAC (أدمن / قائد / مدرس / خادم)",
      "تتبع حضور مع سلاسل أسابيع متتالية وهدايا",
      "متابعة رعوية مع تتبع مكالمات وإزالة تلقائية عند الحضور",
      "تصدير PDF و Excel بتنسيق عربي",
      "مسار تدقيق مع بصمة جهاز كاملة (IP، نظام، متصفح، موقع)",
      "وضع داكن، حدود خطأ، ومحتوى عربي/إنجليزي",
    ],
    stack: [
      "Next.js 14",
      "TypeScript",
      "Tailwind",
      "MongoDB",
      "JWT",
      "Chart.js",
      "Helmet",
      "Winston",
    ],
    repoUrl: "https://github.com/YasaJaber/Church-Management-System",
    liveUrl: "https://church-management-system-1-i51l.onrender.com",
    accent: "#06B6D4",
  },
  {
    slug: "my-real-portfolio",
    title: "Yasa Jaber — Real Portfolio",
    titleAr: "يسي جابر — البورتفوليو",
    category: "Web App",
    categoryAr: "تطبيق ويب",
    year: 2026,
    cover: "/projects/real portfolio.png",
    summary:
      "This very site — a high-performance SPA portfolio bridging front-end engineering and graphic design with cinematic transitions.",
    summaryAr:
      "الموقع ده نفسه — بورتفوليو SPA سريع بيجمع بين البرمجة والتصميم مع انتقالات سينمائية.",
    description:
      "My current production portfolio: a high-performance Single Page Application built around an animated Aurora Mesh Gradient, interactive per-letter typography, and cinematic page transitions. Includes an MDX-powered blog with categories, dynamic Open Graph metadata, and reading-time. Designed with accessibility in mind — honors prefers-reduced-motion, fully keyboard-reachable.",
    descriptionAr:
      "البورتفوليو الحالي بتاعي: تطبيق صفحة واحدة سريع مبني حوالين خلفية Aurora Mesh متحركة، كل حرف بيتحرك لوحده، وانتقالات صفحات سينمائية. فيه مدونة بـ MDX مع فئات، بيانات Open Graph ديناميكية، ووقت قراءة. مصمم مع مراعاة إمكانية الوصول — بيحترم prefers-reduced-motion، وقابل للوصول بالكامل من الكيبورد.",
    features: [
      "Interactive Hero — every letter is its own DOM node (magnetize on hover, explode on click)",
      "Aurora Mesh Background — pure 2D Canvas with cursor-following blobs & click ripples",
      "Cinematic page transitions via Framer Motion AnimatePresence",
      "Glassmorphism navbar & cards over the live mesh",
      "MDX blog with categories, reading-time, and dynamic OG images per post",
      "Accessible: respects prefers-reduced-motion, fully keyboard navigable",
    ],
    featuresAr: [
      "Hero تفاعلي — كل حرف عقدة DOM لوحده (مغناطيس لما تحوم، ينفجر لما تدوس)",
      "خلفية Aurora Mesh — Canvas 2D نقي مع كرات بتتبع الماوس وتموجات",
      "انتقالات صفحات سينمائية بـ Framer Motion",
      "شريط تنقل وكروت Glassmorphism فوق الشبكة الحية",
      "مدونة MDX مع فئات، وقت قراءة، وصور OG ديناميكية",
      "قابل للوصول: بيحترم prefers-reduced-motion، تنقل كامل بالكيبورد",
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind",
      "GSAP",
      "Framer Motion",
      "Lenis",
      "MDX",
    ],
    repoUrl: "https://github.com/YasaJaber/my-real-portfolio",
    liveUrl: "https://yasajaber.me",
    accent: "#F43F5E",
  },
  {
    slug: "login-register-system",
    title: "Login / Register System",
    titleAr: "نظام تسجيل دخول",
    category: "Web App",
    categoryAr: "تطبيق ويب",
    year: 2025,
    cover: "/projects/login_register system.png",
    summary:
      "A secure user authentication platform with email/password and Google + GitHub OAuth 2.0.",
    summaryAr:
      "منصة مصادقة آمنة بإيميل/باسورد و Google + GitHub OAuth 2.0.",
    description:
      "A production-ready authentication system supporting traditional email/password and social login via Google and GitHub OAuth 2.0. Built security-first — JWT sessions, bcrypt-hashed passwords, IP-based rate limiting, CORS protection, full input validation, email verification, and a secure password recovery flow.",
    descriptionAr:
      "نظام مصادقة جاهز للإنتاج بيدعم إيميل/باسورد العادي وتسجيل دخول اجتماعي من Google و GitHub OAuth 2.0. مبني بالأمان أولاً — جلسات JWT، باسوردات مشفرة bcrypt، تحديد معدل بالـ IP، حماية CORS، تحقق كامل من الإدخال، تحقق من الإيميل، واسترداد باسورد آمن.",
    features: [
      "Email/password + Google & GitHub OAuth 2.0",
      "JWT-based sessions with configurable expiration",
      "Email verification & secure password recovery",
      "IP-based rate limiting + CORS + XSS / CSRF protection",
      "RESTful API with MongoDB & Mongoose",
      "Mobile-first responsive UI",
    ],
    featuresAr: [
      "إيميل/باسورد + Google و GitHub OAuth 2.0",
      "جلسات JWT مع انتهاء قابل للتعديل",
      "تحقق من الإيميل واسترداد باسورد آمن",
      "تحديد معدل بالـ IP + CORS + حماية XSS / CSRF",
      "API RESTful مع MongoDB و Mongoose",
      "واجهة متجاوبة تعطي الأولوية للموبايل",
    ],
    stack: ["Node.js", "Express", "MongoDB", "Passport.js", "JWT", "OAuth 2.0"],
    repoUrl: "https://github.com/YasaJaber/login-register--system",
    liveUrl: "https://login-register-system-sxto.onrender.com/",
    accent: "#22D3EE",
  },
  {
    slug: "yasa-portfolio-v1",
    title: "Yasa — Portfolio (v1)",
    titleAr: "يسي — البورتفوليو الأول",
    category: "Web App",
    categoryAr: "تطبيق ويب",
    year: 2025,
    cover: "/projects/demo portfolio.png",
    summary:
      "My first personal portfolio, hand-built from scratch in pure HTML, CSS & vanilla JavaScript — zero frameworks.",
    summaryAr:
      "أول بورتفوليو ليا، مبني يدوي من الصفر بـ HTML و CSS و JavaScript نقي — بدون أي فريموركات.",
    description:
      "The first iteration of my personal portfolio, built as a deliberate challenge to push my fundamentals: every animation, transition, and interaction was written from scratch in vanilla HTML, CSS, and JavaScript — no frameworks, no libraries. Fully responsive across all devices and showcases my work as a graphic designer & front-end developer.",
    descriptionAr:
      "أول نسخة من البورتفوليو بتاعي، اتبنى كتحدي عشان أقوي الأساسيات: كل أنيميشن، انتقال، وتفاعل اتكتب من الصفر بـ HTML و CSS و JavaScript نقي — بدون فريموركات، بدون مكتبات. متجاوب بالكامل على كل الأجهزة وبيعرض شغلي كمصمم جرافيك ومطور واجهات.",
    features: [
      "Fully responsive across all devices",
      "Custom CSS animations & scroll-driven effects",
      "About / Work / Contact sections",
      "Zero dependencies — pure HTML / CSS / JS",
    ],
    featuresAr: [
      "متجاوب بالكامل على كل الأجهزة",
      "أنيميشنز CSS مخصصة وتأثيرات بالسكرول",
      "أقسام عني / الشغل / التواصل",
      "بدون تبعيات — HTML / CSS / JS نقي",
    ],
    stack: ["HTML5", "CSS3", "Vanilla JS"],
    repoUrl: "https://github.com/YasaJaber/yasa-portfolio",
    liveUrl: "https://yasajaber.github.io/yasa-portfolio/",
    accent: "#8B5CF6",
  },
];
