import type { Metadata } from "next";
import { PricingPageClient } from "./pricing-client";

export const metadata: Metadata = {
  title: "NB-Card Plans & Pricing | NeuroBreath",
  description:
    "Choose an NB-Card storage plan. Free accounts save up to 2 cards. Upgrade with a one-time purchase or monthly subscription for unlimited cards and more storage.",
};

export default function PricingPage() {
  return <PricingPageClient />;
}
