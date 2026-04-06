
"use client";
import { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";

// Dummy data for now; replace with real user/plan info from server
const userPlan = {
  name: "Pro Monthly",
  status: "Active",
  renewal: "2026-05-06",
  price: "$12/mo",
};

export default function BillingModulePage() {
  const [loading, setLoading] = useState(false);


  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/checkout", { method: "POST" });
      const data = await res.json();
      const checkoutUrl = data?.data?.checkoutUrl;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        setLoading(false);
        alert(data?.error?.message || "Failed to start checkout session");
      }
    } catch {
      setLoading(false);
      alert("Error connecting to Stripe");
    }
  };

  const handlePortal = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();
      const portalUrl = data?.data?.portalUrl;
      if (portalUrl) {
        window.location.href = portalUrl;
      } else {
        setLoading(false);
        alert(data?.error?.message || "Failed to open billing portal");
      }
    } catch {
      setLoading(false);
      alert("Error connecting to Stripe");
    }
  };

  return (
    <PageContainer title="Billing" description="Manage your subscription, invoices, and payment methods.">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-1">Current Plan</h2>
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-blue-700">{userPlan.name}</span>
            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">{userPlan.status}</span>
          </div>
          <div className="text-slate-500 text-sm mt-1">Renews: {userPlan.renewal}</div>
          <div className="text-slate-700 font-medium mt-2">{userPlan.price}</div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Redirecting..." : "Upgrade Plan"}
          </button>
          <button
            onClick={handlePortal}
            disabled={loading}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-4 py-2 rounded-lg border border-slate-300 transition disabled:opacity-60"
          >
            {loading ? "Loading..." : "Open Billing Portal"}
          </button>
        </div>
        <div className="text-xs text-slate-400 pt-2">Invoices and usage metering coming soon.</div>
      </div>
    </PageContainer>
  );
}
