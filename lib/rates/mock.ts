import type { RateQuote } from "./types";

export const mockRates: RateQuote[] = [
  {
    id: "breet-ngn-usdt-001",
    provider: "Breet",
    providerType: "OTC",
    asset: "USDT",
    fiat: "NGN",
    side: "sell",
    rate: 1521,
    fee: 0,
    availableAmount: 5000000,
    settlementTime: "Instant",
    updatedAt: Date.now() - 8000,
    source: "mock",
  },

  {
    id: "binance-ngn-usdt-001",
    provider: "Binance",
    providerType: "P2P",
    asset: "USDT",
    fiat: "NGN",
    side: "sell",
    rate: 1518,
    fee: 0,
    availableAmount: 2500000,
    settlementTime: "Varies",
    updatedAt: Date.now() - 11000,
    source: "mock",
  },

  {
    id: "bybit-ngn-usdt-001",
    provider: "Bybit",
    providerType: "P2P",
    asset: "USDT",
    fiat: "NGN",
    side: "sell",
    rate: 1515,
    fee: 0,
    availableAmount: 1800000,
    settlementTime: "Varies",
    updatedAt: Date.now() - 14000,
    source: "mock",
  },

  {
    id: "okx-ngn-usdt-001",
    provider: "OKX",
    providerType: "P2P",
    asset: "USDT",
    fiat: "NGN",
    side: "sell",
    rate: 1514,
    fee: 0,
    availableAmount: 1200000,
    settlementTime: "Varies",
    updatedAt: Date.now() - 18000,
    source: "mock",
  },
];

export function getMockRates(
  fiat: string,
  asset: string,
  side: "buy" | "sell"
): RateQuote[] {
  return mockRates.filter(
    (rate) =>
      rate.fiat === fiat &&
      rate.asset === asset &&
      rate.side === side
  );
}
