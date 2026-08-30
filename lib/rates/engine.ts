import type { RateQuote, TradeSide } from "./types";

export function sortRates(
  rates: RateQuote[],
  side: TradeSide
): RateQuote[] {
  return [...rates].sort((a, b) => {
    if (side === "sell") {
      return b.rate - a.rate;
    }

    return a.rate - b.rate;
  });
}

export function getBestRate(
  rates: RateQuote[],
  side: TradeSide
): RateQuote | null {
  const sorted = sortRates(rates, side);

  return sorted[0] ?? null;
}

export function calculateReceived(
  amount: number,
  quote: RateQuote,
  side: TradeSide
): number {
  if (!Number.isFinite(amount) || amount <= 0) {
    return 0;
  }

  if (side === "sell") {
    const gross = amount * quote.rate;
    const fee = quote.fee ?? 0;

    return Math.max(0, gross - fee);
  }

  const fee = quote.fee ?? 0;

  return Math.max(0, amount / quote.rate - fee);
}

export function calculateDifference(
  actual: number,
  reference: number
): number {
  if (reference === 0) return 0;

  return ((actual - reference) / reference) * 100;
}

export function calculateSpread(
  best: number,
  worst: number
): number {
  if (worst === 0) return 0;

  return ((best - worst) / worst) * 100;
}
