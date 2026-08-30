import { NextRequest, NextResponse } from "next/server";

import { getProviders } from "@/lib/rates/providers/registry";
import type { TradeSide } from "@/lib/rates/types";

export async function GET(
  request: NextRequest
) {
  const searchParams = request.nextUrl.searchParams;

  const fiat =
    searchParams.get("fiat")?.toUpperCase() || "NGN";

  const asset =
    searchParams.get("asset")?.toUpperCase() || "USDT";

  const side =
    (searchParams.get("side")?.toLowerCase() ||
      "sell") as TradeSide;

  const amount =
    Number(searchParams.get("amount") || "1000");

  if (!["buy", "sell"].includes(side)) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid trade side.",
      },
      { status: 400 }
    );
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid amount.",
      },
      { status: 400 }
    );
  }

  const context = {
    fiat,
    asset,
    side,
    amount,
  };

  const activeProviders = getProviders().filter(
    (provider) => provider.supports(context)
  );

  const results = await Promise.allSettled(
    activeProviders.map((provider) =>
      provider.fetchQuote(context)
    )
  );

  const quotes = [];
  const errors: string[] = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      quotes.push(...result.value.quotes);

      if (result.value.error) {
        errors.push(result.value.error);
      }
    } else {
      errors.push("A provider failed to respond.");
    }
  }

  return NextResponse.json(
    {
      success: true,
      fiat,
      asset,
      side,
      amount,
      quotes,
      providerCount: activeProviders.length,
      errors,
      timestamp: Date.now(),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
