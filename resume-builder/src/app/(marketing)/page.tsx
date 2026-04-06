"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AnimatedLinkButton } from "@/components/common/animated-link-button";

const headingLines = ["Build Your Perfect", "Resume with AI"];

const headingContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.05,
    },
  },
};

const headingLine = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut" as const,
    },
  },
};

const features = [
  {
    title: "AI Resume Writing",
    description: "Generate targeted summaries and bullet points tailored to the role you want.",
    icon: "AI",
  },
  {
    title: "Live Preview",
    description: "See every content and layout change instantly with production-ready formatting.",
    icon: "LP",
  },
  {
    title: "One-Click Export",
    description: "Export polished PDF resumes quickly with consistent typography and spacing.",
    icon: "PDF",
  },
];

export default function MarketingHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-slate-900">
                ResumeAI
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/features" className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Features
                </Link>
                <Link href="/pricing" className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Pricing
                </Link>
                <Link href="/about" className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  About
                </Link>
                <Link href="/sign-in" className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Sign In
                </Link>
                <Link href="/sign-up" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <motion.h1
                variants={headingContainer}
                initial="hidden"
                animate="show"
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight"
              >
                <motion.span variants={headingLine} className="block">
                  {headingLines[0]}
                </motion.span>
                <motion.span
                  variants={headingLine}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block"
                >
                  {headingLines[1]}
                </motion.span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
                className="text-xl text-slate-600 max-w-lg"
              >
                Create professional resumes in minutes with our AI-powered builder.
                Stand out from the crowd with expertly designed templates and smart suggestions.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.6,
                  ease: "easeOut"
                }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <AnimatedLinkButton
                  href="/sign-up"
                  label="Start Building Free"
                  delay={0.65}
                  className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
                />
                <AnimatedLinkButton
                  href="/dashboard"
                  label="View Demo"
                  delay={0.75}
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-slate-300 text-base font-semibold rounded-lg text-slate-700 bg-white hover:bg-slate-100 hover:border-slate-400 shadow-md hover:shadow-lg transition-all duration-200 w-full sm:w-auto"
                />
              </motion.div>
            </div>

            {/* Right Image */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative mx-auto w-full max-w-lg">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center shadow-inner">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mx-auto flex items-center justify-center shadow-lg">
                        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">AI-Powered Resume</h3>
                      <p className="text-base text-slate-600">Smart suggestions and professional templates</p>
                    </div>
                  </div>
                </div>
                {/* Floating elements for visual interest */}
                <motion.div
                  animate={{
                    y: [0, -15, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-6 -right-6 w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl"
                >
                  <span className="text-white font-bold text-sm">AI</span>
                </motion.div>
                <motion.div
                  animate={{
                    y: [0, 15, 0],
                    rotate: [0, -5, 0]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl"
                >
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Features</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Built for fast, professional resume delivery</h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.12,
                },
              },
            }}
            className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature) => (
              <motion.article
                key={feature.title}
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.55, ease: "easeOut" },
                  },
                }}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur-sm"
              >
                <div className="mb-4 inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-blue-100 px-3 text-xs font-bold tracking-wide text-blue-700">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
