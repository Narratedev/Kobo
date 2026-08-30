import type { MarketReference } from "./types";

const references: Record<string, number> = {
  NGN: 1514.2,
  GHS: 12.15,
  KES: 129.4,
  PHP: 57.9,
  VND: 26250,
  IDR: 16650,
  INR: 87.4,
  PKR: 280.5,
};

export function getReferenceRate(
  fiat: string,
  asset = "USDT"
): MarketReference {
  return {
    asset,
    fiat,
    rate: references[fiat] ?? 1,
    change24h: 0.42,
    updatedAt: Date.now(),
  };
}
