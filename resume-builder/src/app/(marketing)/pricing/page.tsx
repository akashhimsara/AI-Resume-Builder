"use client";
import React from "react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "Forever",
    features: [
      "1 Resume",
      "Basic Templates",
      "AI Bullet Improver (limited)",
      "Community Support",
    ],
    isPro: false,
    button: { label: "Current Plan", disabled: true },
  },
  {
    name: "Pro Monthly",
    price: "$12",
    period: "/month",
    features: [
      "Unlimited Resumes",
      "All Templates",
      "Full AI Tools Access",
      "Export PDF/Word",
      "Priority Support",
    ],
    isPro: true,
    button: { label: "Upgrade to Pro", disabled: false },
  },
  {
    name: "Pro Yearly",
    price: "$99",
    period: "/year",
    features: [
      "Unlimited Resumes",
      "All Templates",
      "Full AI Tools Access",
      "Export PDF/Word",
      "Priority Support",
      "2 months free!",
    ],
    isPro: true,
    button: { label: "Upgrade & Save", disabled: false },
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-slate-800">Pricing Plans</h1>
        <p className="text-center text-slate-600 mb-12">Choose the plan that fits your career goals. Upgrade anytime.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={plan.name}
              className={`rounded-2xl shadow-lg bg-white p-8 flex flex-col border-2 transition-all duration-200 ${
                plan.isPro ? "border-blue-500" : "border-slate-200"
              } ${plan.isPro && idx === 2 ? "scale-105 z-10" : ""}`}
            >
              <h2 className="text-2xl font-semibold mb-2 text-slate-800 flex items-center justify-between">
                {plan.name}
                {plan.isPro && (
                  <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full font-medium">
                    Pro
                  </span>
                )}
              </h2>
              <div className="text-4xl font-bold text-blue-600 mb-1">{plan.price}</div>
              <div className="text-slate-500 mb-6">{plan.period}</div>
              <ul className="mb-8 space-y-2">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className={`flex items-center gap-2 ${plan.isPro ? "text-blue-700" : "text-slate-700"}`}
                  >
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-400"></span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-2 rounded-lg font-semibold text-white transition-all duration-150 ${
                  plan.isPro
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-slate-400 cursor-not-allowed"
                }`}
                disabled={plan.button.disabled}
              >
                {plan.button.label}
              </button>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center text-slate-500 text-sm">
          All prices in USD. Cancel anytime. No hidden fees.
        </div>
      </div>
    </div>
  );
}
