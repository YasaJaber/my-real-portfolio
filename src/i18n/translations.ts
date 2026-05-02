export type Locale = "en" | "ar";

export const translations = {
  // ── Navbar ──
  nav: {
    home: { en: "Home", ar: "الرئيسية" },
    about: { en: "About", ar: "عنّي" },
    projects: { en: "Projects", ar: "المشاريع" },
    contact: { en: "Contact", ar: "تواصل" },
    blog: { en: "Blog", ar: "المدونة" },
  },

  // ── Hero ──
  hero: {
    roles: {
      en: [
        "Front-End Developer",
        "Graphic Designer",
        "WordPress Developer",
        "UI/UX Designer",
        "React Developer",
        "Brand Identity Designer",
      ],
      ar: [
        "مطوّر واجهات أمامية",
        "مصمّم جرافيك",
        "مطوّر ووردبريس",
        "مصمّم UI/UX",
        "مطوّر React",
        "مصمّم هوية بصرية",
      ],
    },
    tagline: {
      en: "I build clean, fast websites and design the visuals that go with them. Based in sohag, available worldwide.",
      ar: "أبني مواقع نظيفة وسريعة وأصمّم المرئيات اللي بتكمّلها. من سوهاج، ومتاح للعمل في أي مكان.",
    },
    viewProjects: { en: "View projects", ar: "شوف المشاريع" },
    getInTouch: { en: "Get in touch", ar: "تواصل معايا" },
    scroll: { en: "Scroll", ar: "انزل" },
    heroName: { en: "Yasa Jaber", ar: "يسي جابر" },
  },

  // ── About ──
  about: {
    label: { en: "01 — About", ar: "01 — عنّي" },
    heading: { en: "About me", ar: "عنّي" },
    p1: {
      en: "I'm <strong>Yasa</strong>, a skilled front-end developer and graphic designer from Sohag, studying at the Egyptian E-Learning University. I specialize in creating responsive and interactive user interfaces with a strong foundation in modern web technologies.",
      ar: "أنا <strong>يسي</strong>، مطوّر واجهات أمامية ومصمّم جرافيك من سوهاج، بدرس في الجامعة المصرية للتعلّم الإلكتروني. متخصص في بناء واجهات تفاعلية ومتجاوبة بأساس قوي في تقنيات الويب الحديثة.",
    },
    p2: {
      en: "I have hands-on experience with React, Next.js, TypeScript, Tailwind CSS, and a variety of CSS preprocessors and state management solutions. My focus is on delivering visually appealing, high-performance, and user-friendly web solutions.",
      ar: "عندي خبرة عملية مع React و Next.js و TypeScript و Tailwind CSS وأدوات CSS preprocessors ومكتبات إدارة الحالة. تركيزي على تقديم حلول ويب جذابة بصريًا وعالية الأداء وسهلة الاستخدام.",
    },
    p3: {
      en: "Beyond development, I bring over three years of graphic design experience — branding, logos, social media content, and marketing materials — ensuring every project achieves aesthetic and functional harmony.",
      ar: "بجانب التطوير، عندي أكتر من تلات سنين خبرة في تصميم الجرافيك — هويات بصرية، شعارات، محتوى سوشيال ميديا، ومواد تسويقية — عشان كل مشروع يطلع متناسق بصريًا ووظيفيًا.",
    },
    showCv: { en: "Show / Download CV", ar: "عرض / تحميل السيرة الذاتية" },
    yearsExp: { en: "Years of experience", ar: "سنوات من الخبرة" },
    frontEndDev: { en: "Front-End Development", ar: "تطوير الواجهات الأمامية" },
    availableForWork: { en: "Available for work", ar: "متاح للعمل" },
    resume: { en: "Resume", ar: "السيرة الذاتية" },
    downloadCv: { en: "Download CV", ar: "تحميل السيرة" },
    close: { en: "Close", ar: "إغلاق" },
  },

  // ── Skills ──
  skills: {
    label: { en: "02 — Skills", ar: "02 — المهارات" },
    heading: { en: "Tools I work with", ar: "الأدوات اللي بشتغل بيها" },
    description: {
      en: "A curated set of technologies and tools I use to build, design, and ship great digital products.",
      ar: "مجموعة منتقاة من التقنيات والأدوات اللي بستخدمها لبناء وتصميم وتسليم منتجات رقمية مميزة.",
    },
    alwaysLearning: { en: "Always learning", ar: "دايمًا بتعلّم" },
    groups: {
      "Front-End": {
        en: { label: "Front-End", description: "Building responsive, pixel-perfect interfaces" },
        ar: { label: "الواجهات الأمامية", description: "بناء واجهات متجاوبة ودقيقة" },
      },
      "State & APIs": {
        en: { label: "State & APIs", description: "Managing data flow and integrations" },
        ar: { label: "إدارة الحالة والـ APIs", description: "إدارة تدفق البيانات والتكاملات" },
      },
      "Design": {
        en: { label: "Design", description: "Crafting visual identities and experiences" },
        ar: { label: "التصميم", description: "صناعة الهويات البصرية والتجارب" },
      },
      "Tools & CMS": {
        en: { label: "Tools & CMS", description: "Streamlining development workflows" },
        ar: { label: "الأدوات وأنظمة المحتوى", description: "تسهيل سير عمل التطوير" },
      },
      "CS Fundamentals": {
        en: { label: "CS Fundamentals", description: "Core computer science knowledge" },
        ar: { label: "أساسيات علوم الحاسب", description: "المعرفة الأساسية في علوم الكمبيوتر" },
      },
    },
  },

  // ── Work ──
  work: {
    label: { en: "03 — Projects", ar: "03 — المشاريع" },
    heading: { en: "Selected projects", ar: "مشاريع مختارة" },
    clickToView: { en: "Click to view details", ar: "اضغط لعرض التفاصيل" },
    highlights: { en: "Highlights", ar: "أبرز المميزات" },
    stack: { en: "Stack", ar: "التقنيات" },
    viewRepo: { en: "View Repo", ar: "عرض الكود" },
    livePreview: { en: "Live Preview", ar: "معاينة مباشرة" },
  },

  // ── Blog ──
  blog: {
    label: { en: "04 — Blog", ar: "04 — المدونة" },
    heading: { en: "Latest articles", ar: "أحدث المقالات" },
    viewAll: { en: "View all", ar: "عرض الكل" },
  },

  // ── Contact ──
  contact: {
    label: { en: "05 — Contact", ar: "05 — تواصل" },
    heading: { en: "Got a project in mind?", ar: "عندك مشروع في بالك؟" },
    description: {
      en: "The fastest way to reach me is by email. I usually reply within 24 hours.",
      ar: "أسرع طريقة تتواصل معايا هي الإيميل. عادةً برد خلال ٢٤ ساعة.",
    },
    namePlaceholder: { en: "Your name", ar: "اسمك" },
    emailPlaceholder: { en: "Your email", ar: "إيميلك" },
    messagePlaceholder: { en: "Tell me about your project", ar: "كلّمني عن مشروعك" },
    sending: { en: "Sending...", ar: "جاري الإرسال..." },
    sendMessage: { en: "Send message", ar: "إرسال الرسالة" },
    errorGeneral: {
      en: "Something went wrong. Please try again in a minute.",
      ar: "حصل خطأ. جرّب تاني بعد شوية.",
    },
    errorNetwork: {
      en: "Could not send your message right now. Please try again later.",
      ar: "مقدرتش أبعت رسالتك دلوقتي. جرّب تاني بعدين.",
    },
    thanksWithName: {
      en: (name: string) => `Thanks, ${name}!`,
      ar: (name: string) => `شكرًا ليك يا ${name}!`,
    },
    thanksGeneric: { en: "Thanks for reaching out!", ar: "شكرًا إنك تواصلت معانا!" },
    thanksBody: {
      en: "We'll be in touch with you soon! Your message has been sent and I'll get back to you within 24 hours.",
      ar: "هنتواصل معاك قريب! رسالتك اتبعتت وهردّ عليك خلال ٢٤ ساعة.",
    },
    urgentNote: {
      en: (email: string) => `Need anything urgent? — ${email}`,
      ar: (email: string) => `محتاج حاجة مستعجلة؟ — ${email}`,
    },
    location: { en: "Location", ar: "الموقع" },
    availability: { en: "Availability", ar: "الإتاحة" },
    availabilityValue: { en: "Open to freelance & contract", ar: "متاح لعمل حر وعقود" },
    responseTime: { en: "Response time", ar: "وقت الرد" },
    responseTimeValue: { en: "Within 24 hours", ar: "خلال ٢٤ ساعة" },
  },

  // ── Footer ──
  footer: {
    builtWith: { en: "", ar: "" },
  },

  // ── Chatbot ──
  chatbot: {
    triggerHints: {
      en: ["Ask me anything", "Explore Yasa's work", "See projects & skills", "Let's talk"],
      ar: ["اسألني أي حاجة", "اكتشف أعمال يسي", "شوف المشاريع والمهارات", "يلا نتكلم"],
    },
    newBadge: { en: "New", ar: "جديد" },
    assistantName: { en: "Yasa's Assistant", ar: "مساعد يسي" },
    onlineNow: { en: "Online now", ar: "متاح الآن" },
    welcomeTitle: { en: "Hey there! 👋", ar: "أهلًا! 👋" },
    welcomeBody: {
      en: "I'm Yasa's personal portfolio assistant. Ask me about his work, skills, projects, or how to get in touch.",
      ar: "أنا المساعد الشخصي لبورتفوليو يسي. اسألني عن شغله، مهاراته، مشاريعه، أو إزاي تتواصل معاه.",
    },
    suggestedQuestions: {
      en: [
        "Who is Yasa?",
        "What are your skills?",
        "Show me your projects",
        "How can I contact you?",
        "What's your experience?",
        "Tell me about Masar project",
        "What technologies do you use?",
        "Are you available for work?",
      ],
      ar: [
        "مين يسي؟",
        "إيه مهاراتك؟",
        "ورّيني مشاريعك",
        "إزاي أتواصل معاك؟",
        "إيه خبرتك؟",
        "كلّمني عن مشروع مسار",
        "بتستخدم إيه تقنيات؟",
        "متاح للشغل؟",
      ],
    },
    inputPlaceholder: { en: "Ask me anything about Yasa...", ar: "اسألني أي حاجة عن يسي..." },
  },

  // ── Language Switcher ──
  langSwitch: {
    switchToArabic: { en: "العربية", ar: "العربية" },
    switchToEnglish: { en: "English", ar: "English" },
  },
} as const;

export type Translations = typeof translations;
