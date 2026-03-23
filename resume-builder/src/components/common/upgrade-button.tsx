"use client";

import { useState } from "react";
import { Button } from "@/components/common/button";

export function UpgradeButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpgrade() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/billing/checkout", { method: "POST" });
      const payload = (await response.json()) as {
        data?: { checkoutUrl?: string };
        error?: { message: string };
      };

      if (!response.ok || !payload.data?.checkoutUrl) {
        throw new Error(payload.error?.message ?? "Unable to create checkout session");
      }

      window.location.href = payload.data.checkoutUrl;
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Checkout failed");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleUpgrade} isLoading={loading}>
        Upgrade to Pro
      </Button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
