export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Memorly",
  tagline: "Your AI-Powered Memory Companion",
  description:
    "Store, organize, and understand your memories with AI. Secure end-to-end encrypted storage for images, videos, notes, and voice records. Lightning-fast access to your life's moments.",
  keywords: [
    "memory app",
    "AI memory storage",
    "digital journal",
    "life logging",
    "personal memory assistant",
    "encrypted memory storage",
    "photo organization",
    "voice notes",
    "AI-powered notes",
    "secure cloud storage",
    "life timeline",
    "digital memories",
    "memory keeper",
    "smart notes app",
    "personal knowledge management",
  ],
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://memorly.app",
  ogImage: "/og-image.png",
  author: {
    name: "Memorly Team",
    url: "https://memorly.app",
  },
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Features",
      href: "/features",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  authItems: [
    {
      label: "Login",
      href: "/login",
    },
    {
      label: "Sign Up",
      href: "/register",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Memories",
      href: "/memories",
    },
    {
      label: "Collections",
      href: "/collections",
    },
    {
      label: "Timeline",
      href: "/timeline",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/memorly",
    twitter: "https://twitter.com/memorly_app",
    support: "mailto:support@memorly.app",
    privacy: "/privacy",
    terms: "/terms",
  },
  features: [
    {
      title: "AI-Powered Memory",
      description:
        "Store and understand your memories from images, videos, text, notes, and voice records with advanced AI",
      keywords: ["AI memory", "smart storage", "intelligent organization"],
    },
    {
      title: "End-to-End Encryption",
      description:
        "Your privacy matters. Complete end-to-end encryption with the option to permanently delete your data",
      keywords: ["encrypted storage", "privacy", "secure memories"],
    },
    {
      title: "Lightning Fast",
      description:
        "Experience blazing-fast performance that outpaces other memory apps. Your memories, instantly accessible",
      keywords: ["fast search", "instant access", "quick retrieval"],
    },
    {
      title: "Multi-Format Support",
      description:
        "Store images, videos, text, notes, voice recordings, and more in one secure place",
      keywords: ["multimedia storage", "photo storage", "voice notes"],
    },
  ],
};
