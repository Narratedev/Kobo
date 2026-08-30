import type { RateQuote } from "@/lib/rates/types";
import type {
  ProviderContext,
  ProviderResult,
  RateProvider,
} from "./types";

const QUIDAX_BASE =
  "https://ramp-be.quidax.io/api/v1/merchants";

function getNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
}

function extractObject(data: any): any {
  if (data?.data?.quote) return data.data.quote;
  if (data?.quote) return data.quote;
  if (data?.data) return data.data;

  return data;
}

function getRateFromQuote(
  quote: any,
  side: "buy" | "sell",
  amount: number
): number | undefined {
  const directRate =
    getNumber(quote?.rate) ??
    getNumber(quote?.exchange_rate) ??
    getNumber(quote?.price);

  if (directRate) {
    return directRate;
  }

  const fiatAmount =
    getNumber(quote?.fiat_amount) ??
    getNumber(quote?.fiatAmount) ??
    getNumber(quote?.amount);

  const tokenAmount =
    getNumber(quote?.token_amount) ??
    getNumber(quote?.tokenAmount) ??
    amount;

  if (
    fiatAmount &&
    tokenAmount &&
    tokenAmount > 0
  ) {
    if (side === "sell") {
      return fiatAmount / tokenAmount;
    }

    return fiatAmount / tokenAmount;
  }

  return undefined;
}

const quidax: RateProvider = {
  id: "quidax",
  name: "Quidax",
  type: "OTC",

  supports(context: ProviderContext) {
    const fiat = context.fiat.toUpperCase();
    const asset = context.asset.toUpperCase();

    return (
      ["NGN", "GHS"].includes(fiat) &&
      asset === "USDT" &&
      context.amount > 0
    );
  },

  async fetchQuote(
    context: ProviderContext
  ): Promise<ProviderResult> {
    const privateKey = process.env.QUIDAX_PRIVATE_KEY;

    if (!privateKey) {
      return {
        quotes: [],
        error: "Quidax API key is not configured.",
      };
    }

    const fiat = context.fiat.toLowerCase();
    const token = context.asset.toLowerCase();

    try {
      let url: string;

      if (context.side === "buy") {
        const params = new URLSearchParams({
          currency: fiat,
          token,
          fiat_amount: String(context.amount),
          token_network: "celo",
        });

        url = `${QUIDAX_BASE}/purchase_quotes/buy?${params}`;
      } else {
        const params = new URLSearchParams({
          token,
          currency: fiat,
          token_amount: String(context.amount),
          token_network: "celo",
        });

        url = `${QUIDAX_BASE}/purchase_quotes/sell?${params}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "x-private-key": privateKey,
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        return {
          quotes: [],
          error: `Quidax returned HTTP ${response.status}.`,
        };
      }

      const data = await response.json();
      const quote = extractObject(data);

      const rate = getRateFromQuote(
        quote,
        context.side,
        context.amount
      );

      if (!rate || rate <= 0) {
        return {
          quotes: [],
          error: "Quidax returned an unusable rate.",
        };
      }

      const quoteResult: RateQuote = {
        id: `quidax-${Date.now()}`,
        provider: "Quidax",
        providerType: "OTC",
        asset: context.asset.toUpperCase(),
        fiat: context.fiat.toUpperCase(),
        side: context.side,
        rate,
        fee:
          getNumber(quote?.fee) ??
          getNumber(quote?.fees) ??
          0,
        availableAmount: undefined,
        updatedAt: Date.now(),
        source: "quidax",
      };

      return {
        quotes: [quoteResult],
      };
    } catch (error) {
      console.error("Quidax provider error:", error);

      return {
        quotes: [],
        error: "Unable to reach Quidax.",
      };
    }
  },
};

export default quidax;
