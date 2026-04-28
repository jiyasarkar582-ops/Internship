"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n-context";
import {
  Server, ArrowRight, Code2, Zap, Shield, Database,
  Layers, Globe, ChevronRight, Star, Check, Menu, X
} from "lucide-react";

const FEATURES = [
  { icon: Zap, title: "Instant Generation", desc: "Drop a JSON config → get a full-stack app with DB, API routes, and UI in milliseconds.", color: "blue" },
  { icon: Database, title: "Dynamic Schema", desc: "Tables are auto-created and evolved as you change your config. Never write a migration again.", color: "purple" },
  { icon: Shield, title: "Auth Out of the Box", desc: "NextAuth is wired in from day one. Secure sessions, credential login, and route protection.", color: "green" },
  { icon: Layers, title: "Modular UI", desc: "Smart FormRenderer and TableRenderer components adapt to any field type you define.", color: "orange" },
  { icon: Code2, title: "GitHub Export", desc: "Push your generated app directly to a new GitHub repo with a single click.", color: "pink" },
  { icon: Globe, title: "i18n Built-in", desc: "Ship in English, Hindi, Bengali, Spanish and more — toggle language anywhere in the app.", color: "teal" },
];

const STEPS = [
  { n: "01", title: "Write a JSON Config", desc: "Define your app name, entities, fields, and theme in a single app_config.json file." },
  { n: "02", title: "Engine Processes It", desc: "The C2A engine auto-creates DB tables, REST APIs, and React UI components on the fly." },
  { n: "03", title: "Ship Instantly", desc: "Your fully functional app is live. Export to GitHub or keep iterating in the visual builder." },
];

const CODE_SAMPLE = `{
  "appName": "Task Manager",
  "entities": [{
    "name": "Task",
    "slug": "tasks",
    "fields": [
      { "name": "title", "type": "string" },
      { "name": "status", "type": "select",
        "options": ["Pending","Done"] }
    ]
  }]
}`;

const colorMap: Record<string, string> = {
  blue:   "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
  purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400",
  green:  "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400",
  orange: "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400",
  pink:   "bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400",
  teal:   "bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400",
};

export default function LandingPageClient() {
  const { t, language, setLanguage, availableLanguages } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">

      {/* ── NAV ─────────────────────────────────────────────────────── */}
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 dark:bg-gray-950/90 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm" : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Server className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight">C2A Engine</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-400">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#how" className="hover:text-blue-600 transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="bg-transparent text-sm font-medium text-gray-600 dark:text-gray-400 focus:outline-none cursor-pointer"
            >
              {availableLanguages.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
            </select>
            <Link href="/login" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors px-3 py-1.5">
              {t("signIn","Sign In")}
            </Link>
            <Link href="/register" className="text-sm font-semibold px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm">
              {t("signUp","Sign Up")} <ArrowRight className="inline w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden text-gray-700 dark:text-gray-300" onClick={() => setMenuOpen(v => !v)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 space-y-3">
            <a href="#features" className="block text-sm font-medium py-2 hover:text-blue-600" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#how" className="block text-sm font-medium py-2 hover:text-blue-600" onClick={() => setMenuOpen(false)}>How it Works</a>
            <Link href="/login" className="block text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>{t("signIn","Sign In")}</Link>
            <Link href="/register" className="block w-full text-center py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg" onClick={() => setMenuOpen(false)}>{t("signUp","Sign Up")}</Link>
          </div>
        )}
      </header>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Gradient blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-br from-blue-400/20 via-purple-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm font-medium">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            Version 1.0 — Now Live
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05]">
            {t("heroTitlePrefix","Generate Apps from")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600">
              {t("heroTitleHighlight","JSON Configs")}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {t("heroSubtitle","Stop writing boilerplate. Define your entities and fields in a single JSON file and get a full-stack app — Auth, DB, API & UI — instantly.")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/register" className="group flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-base font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 hover:shadow-xl transition-all">
              {t("getStarted","Get Started for Free")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#how" className="flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 text-base font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm">
              <Code2 className="w-5 h-5" /> See How It Works
            </a>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-500 pt-2">
            {["No credit card required","Open source","Deploy in seconds"].map(item => (
              <span key={item} className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-green-500" /> {item}
              </span>
            ))}
          </div>
        </div>

        {/* Code + App preview */}
        <div className="relative max-w-6xl mx-auto mt-20 grid md:grid-cols-2 gap-6 items-start">
          {/* Code card */}
          <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-2xl">
            <div className="bg-gray-800 dark:bg-gray-900 px-4 py-3 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-3 text-xs text-gray-400 font-mono">app_config.json</span>
            </div>
            <pre className="bg-gray-900 text-green-400 text-sm p-6 font-mono leading-relaxed overflow-x-auto">
              {CODE_SAMPLE}
            </pre>
          </div>

          {/* Generated app preview */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl bg-white dark:bg-gray-900 overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-3 text-xs text-gray-400 font-mono">Generated App ✨</span>
            </div>
            <div className="flex h-56">
              {/* Fake sidebar */}
              <div className="w-40 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-3 space-y-1">
                <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-blue-50 dark:bg-blue-900/40">
                  <Server className="w-3 h-3 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Dashboard</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Database className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Tasks</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 mt-4 opacity-60">
                  <Zap className="w-3 h-3 text-purple-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">App Builder</span>
                </div>
              </div>
              {/* Fake content */}
              <div className="flex-1 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900 dark:text-white">Tasks</span>
                  <span className="text-xs px-2 py-0.5 bg-blue-600 text-white rounded font-medium">+ Create</span>
                </div>
                {[{ t:"Design landing page", s:"In Progress" }, { t:"Write unit tests", s:"Pending" }, { t:"Deploy to prod", s:"Done" }].map((row, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
                    <span className="text-xs text-gray-700 dark:text-gray-300">{row.t}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      row.s === "Done" ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" :
                      row.s === "In Progress" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400" :
                      "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                    }`}>{row.s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Arrow */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 rounded-full items-center justify-center shadow-lg z-10">
            <ArrowRight className="w-5 h-5 text-white" />
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ─────────────────────────────────────────────── */}
      <section className="py-10 border-y border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-10 text-gray-400 dark:text-gray-600 text-sm font-semibold tracking-wide">
          {["Next.js","SQLite","NextAuth","TypeScript","Tailwind CSS","Lucide Icons"].map(tech => (
            <span key={tech} className="uppercase">{tech}</span>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <span className="inline-block text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Features</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Everything you need,<br />nothing you don't</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              C2A Engine handles the boring parts so you can focus on building product.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="group p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-xl transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${colorMap[color]} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section id="how" className="py-24 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <span className="inline-block text-sm font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">How It Works</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">From JSON to app<br />in 3 steps</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.n} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-900 dark:to-purple-900 z-0" />
                )}
                <div className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-4xl font-black text-blue-100 dark:text-blue-900/60 mb-4">{step.n}</div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-16">
          <span className="inline-block text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">Pricing</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">Simple, honest pricing</h2>
          <p className="text-lg text-gray-500 dark:text-gray-400">Start free, scale when you need to.</p>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Free */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-bold">Free</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-5xl font-black">$0</span>
                <span className="text-gray-500 dark:text-gray-400">/month</span>
              </div>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Perfect for personal projects and prototypes.</p>
            </div>
            <ul className="space-y-3">
              {["Unlimited entities","SQLite database","CRUD API generation","Dynamic UI components","GitHub export","i18n support"].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/register" className="block text-center py-3 px-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-sm hover:border-blue-500 hover:text-blue-600 transition-colors">
              Get Started Free
            </Link>
          </div>
          {/* Pro */}
          <div className="relative bg-blue-600 rounded-2xl p-8 shadow-2xl shadow-blue-500/30 space-y-6 text-white overflow-hidden">
            <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 text-xs font-bold">
              <Star className="w-3 h-3" /> Most Popular
            </div>
            <div>
              <h3 className="text-xl font-bold">Pro</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-5xl font-black">$19</span>
                <span className="text-blue-200">/month</span>
              </div>
              <p className="mt-3 text-sm text-blue-200">For teams shipping production apps at scale.</p>
            </div>
            <ul className="space-y-3">
              {["Everything in Free","PostgreSQL support","Custom domain","Team collaboration","Priority support","Advanced analytics"].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-blue-200 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/register" className="block text-center py-3 px-6 bg-white text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
              Start Free Trial →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Ready to build your app?
          </h2>
          <p className="text-xl text-gray-500 dark:text-gray-400">
            Join developers shipping faster with Config-to-App Engine.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="group flex items-center gap-2 px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 hover:shadow-xl transition-all text-lg">
              {t("getStarted","Get Started for Free")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Server className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-extrabold tracking-tight">C2A Engine</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-gray-500 dark:text-gray-400">
              <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
              <a href="#how" className="hover:text-blue-600 transition-colors">How It Works</a>
              <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
              <Link href="/login" className="hover:text-blue-600 transition-colors">{t("signIn","Sign In")}</Link>
            </div>
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} C2A Engine. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
