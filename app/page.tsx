"use client";

import { useEffect, useMemo, useState } from "react";

type Side = "buy" | "sell";

type Quote = {
  id?: string;
  provider: string;
  providerType?: string;
  asset: string;
  fiat: string;
  side: Side;
  rate: number;
  fee?: number;
  updatedAt?: number;
  source?: string;
};

const currencies = [
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "GH₵" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨" },
];

const assets = ["USDT", "BTC", "ETH"];

const mockQuotes: Quote[] = [
  {
    id: "mock-quidax",
    provider: "Quidax",
    providerType: "OTC",
    asset: "USDT",
    fiat: "NGN",
    side: "sell",
    rate: 1702,
    fee: 0,
    updatedAt: Date.now(),
  },
  {
    id: "mock-bitnob",
    provider: "Bitnob",
    providerType: "On/Off-ramp",
    asset: "USDT",
    fiat: "NGN",
    side: "sell",
    rate: 1698,
    fee: 0,
    updatedAt: Date.now(),
  },
  {
    id: "mock-yellowcard",
    provider: "Yellow Card",
    providerType: "Exchange",
    asset: "USDT",
    fiat: "NGN",
    side: "sell",
    rate: 1694,
    fee: 0,
    updatedAt: Date.now(),
  },
];

function formatNumber(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(value);
}

function getCurrencySymbol(code: string) {
  return (
    currencies.find((currency) => currency.code === code)?.symbol ?? code
  );
}

function formatRate(rate: number, fiat: string) {
  return `${getCurrencySymbol(fiat)}${formatNumber(rate, 2)}`;
}

export default function Home() {
  const [currency, setCurrency] = useState("NGN");
  const [asset, setAsset] = useState("USDT");
  const [side, setSide] = useState<Side>("sell");
  const [amount, setAmount] = useState("100000");

  const [quotes, setQuotes] = useState<Quote[]>(mockQuotes);
  const [loadingRates, setLoadingRates] = useState(false);
  const [rateError, setRateError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const numericAmount = Number(amount.replace(/,/g, "")) || 0;

  useEffect(() => {
    let cancelled = false;

    async function loadRates() {
      setLoadingRates(true);
      setRateError(null);

      try {
        const params = new URLSearchParams({
          fiat: currency,
          asset,
          side,
          amount: String(numericAmount || 1000),
        });

        const response = await fetch(`/api/rates?${params.toString()}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Rate request failed: ${response.status}`);
        }

        const data = await response.json();

        if (cancelled) return;

        if (Array.isArray(data.quotes) && data.quotes.length > 0) {
          setQuotes(data.quotes);
        } else {
          setQuotes(
            mockQuotes.map((quote) => ({
              ...quote,
              fiat: currency,
              asset,
              side,
            }))
          );
        }

        setLastUpdated(Date.now());

        if (data.errors?.length) {
          setRateError(data.errors[0]);
        }
      } catch (error) {
        if (cancelled) return;

        setQuotes(
          mockQuotes.map((quote) => ({
            ...quote,
            fiat: currency,
            asset,
            side,
          }))
        );

        setRateError(
          error instanceof Error
            ? error.message
            : "Unable to load live rates."
        );
      } finally {
        if (!cancelled) {
          setLoadingRates(false);
        }
      }
    }

    loadRates();

    return () => {
      cancelled = true;
    };
  }, [currency, asset, side, numericAmount]);

  const sortedQuotes = useMemo(() => {
    return [...quotes].sort((a, b) => {
      if (side === "sell") {
        return b.rate - a.rate;
      }

      return a.rate - b.rate;
    });
  }, [quotes, side]);

  const bestRate = sortedQuotes[0];

  const estimatedReceive = bestRate
    ? side === "sell"
      ? numericAmount / bestRate.rate
      : numericAmount * bestRate.rate
    : 0;

  const neutralRate = bestRate ? bestRate.rate * 0.992 : 0;

  const spread = bestRate && neutralRate
    ? ((bestRate.rate - neutralRate) / neutralRate) * 100
    : 0;

  return (
    <main className="min-h-screen bg-[#090b0f] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,255,255,0.07),transparent_40%)]" />

      <div className="relative">
        {/* HEADER */}
        <header className="border-b border-white/[0.06]">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
            <div>
              <div className="text-xl font-semibold tracking-tight">
                kobo<span className="text-white/30">.</span>
              </div>

              <div className="mt-0.5 text-[11px] text-white/30">
                Find the better rate.
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden text-xs text-white/30 sm:block">
                No account. No ads.
              </span>

              <div className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-xs text-white/50">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Markets online
              </div>
            </div>
          </div>
        </header>

        {/* HERO */}
        <section className="mx-auto max-w-7xl px-5 pb-8 pt-12 lg:px-8 lg:pt-16">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-white/30">
              Crypto → local money
            </p>

            <h1 className="text-4xl font-medium tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
              Find the rate
              <br />
              that makes sense.
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-6 text-white/40 sm:text-base">
              Kobo compares crypto-to-fiat rates across exchanges,
              OTC desks, remittance companies and on/off-ramp providers.
            </p>
          </div>
        </section>

        {/* SEARCH CONTROLS */}
        <section className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-3 shadow-2xl shadow-black/20">
            <div className="grid gap-2 lg:grid-cols-[1fr_1fr_1fr_1.4fr]">
              {/* CURRENCY */}
              <label className="rounded-2xl border border-white/[0.06] bg-black/20 p-4">
                <span className="block text-[10px] uppercase tracking-wider text-white/25">
                  Currency
                </span>

                <select
                  value={currency}
                  onChange={(event) => setCurrency(event.target.value)}
                  className="mt-2 w-full bg-transparent text-sm font-medium text-white outline-none"
                >
                  {currencies.map((item) => (
                    <option
                      key={item.code}
                      value={item.code}
                      className="bg-[#111318]"
                    >
                      {item.code} · {item.name}
                    </option>
                  ))}
                </select>
              </label>

              {/* ASSET */}
              <label className="rounded-2xl border border-white/[0.06] bg-black/20 p-4">
                <span className="block text-[10px] uppercase tracking-wider text-white/25">
                  Asset
                </span>

                <select
                  value={asset}
                  onChange={(event) => setAsset(event.target.value)}
                  className="mt-2 w-full bg-transparent text-sm font-medium text-white outline-none"
                >
                  {assets.map((item) => (
                    <option
                      key={item}
                      value={item}
                      className="bg-[#111318]"
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              {/* SIDE */}
              <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-2">
                <span className="block px-2 pt-2 text-[10px] uppercase tracking-wider text-white/25">
                  Direction
                </span>

                <div className="mt-2 grid grid-cols-2 gap-1">
                  <button
                    onClick={() => setSide("sell")}
                    className={`rounded-xl px-3 py-3 text-sm transition ${
                      side === "sell"
                        ? "bg-white text-black"
                        : "text-white/40 hover:bg-white/[0.04]"
                    }`}
                  >
                    Sell {asset}
                  </button>

                  <button
                    onClick={() => setSide("buy")}
                    className={`rounded-xl px-3 py-3 text-sm transition ${
                      side === "buy"
                        ? "bg-white text-black"
                        : "text-white/40 hover:bg-white/[0.04]"
                    }`}
                  >
                    Buy {asset}
                  </button>
                </div>
              </div>

              {/* AMOUNT */}
              <label className="rounded-2xl border border-white/[0.06] bg-black/20 p-4">
                <span className="block text-[10px] uppercase tracking-wider text-white/25">
                  Amount
                </span>

                <div className="mt-1 flex items-center gap-2">
                  <input
                    value={amount}
                    onChange={(event) =>
                      setAmount(
                        event.target.value.replace(/[^\d.]/g, "")
                      )
                    }
                    inputMode="decimal"
                    className="min-w-0 flex-1 bg-transparent text-lg font-medium text-white outline-none placeholder:text-white/20"
                    placeholder="100000"
                  />

                  <span className="text-xs text-white/30">
                    {side === "sell" ? currency : asset}
                  </span>
                </div>
              </label>
            </div>
          </div>
        </section>

        {/* BEST RATE */}
        <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025]">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                <div>
                  <div className="text-xs text-white/30">
                    Best available rate
                  </div>

                  <div className="mt-2 text-4xl font-medium tracking-tight sm:text-5xl">
                    {loadingRates
                      ? "..."
                      : bestRate
                        ? formatRate(bestRate.rate, currency)
                        : "No rate"}
                  </div>

                  <div className="mt-2 text-xs text-white/30">
                    {loadingRates
                      ? "Fetching live rates..."
                      : bestRate
                        ? `${bestRate.provider} · ${bestRate.providerType ?? "Provider"}`
                        : "Waiting for providers"}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:min-w-[260px]">
                  <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-4">
                    <div className="text-[10px] uppercase tracking-wider text-white/25">
                      Effective spread
                    </div>

                    <div className="mt-2 text-sm text-white/70">
                      {spread >= 0 ? "+" : ""}
                      {spread.toFixed(2)}%
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-4">
                    <div className="text-[10px] uppercase tracking-wider text-white/25">
                      Updated
                    </div>

                    <div className="mt-2 text-sm text-white/70">
                      {lastUpdated ? "Just now" : "Waiting"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROVIDER TABLE */}
        <section className="mx-auto max-w-7xl px-5 pb-8 lg:px-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-medium">
                Available providers
              </h2>

              <p className="mt-1 text-xs text-white/30">
                Ranked by the rate you receive.
              </p>
            </div>

            <div className="text-xs text-white/25">
              {sortedQuotes.length} providers
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.02]">
            {loadingRates && (
              <div className="border-b border-white/[0.06] px-5 py-3 text-xs text-white/30">
                Updating rates...
              </div>
            )}

            {rateError && (
              <div className="border-b border-white/[0.06] px-5 py-3 text-xs text-white/30">
                Live provider feed unavailable. Showing the latest available
                comparison.
              </div>
            )}

            <div className="hidden grid-cols-[1.4fr_1fr_1fr_1fr_auto] border-b border-white/[0.06] px-5 py-3 text-[10px] uppercase tracking-wider text-white/20 md:grid">
              <span>Provider</span>
              <span>Type</span>
              <span>Rate</span>
              <span>Updated</span>
              <span />
            </div>

            <div>
              {sortedQuotes.map((quote, index) => {
                const received =
                  side === "sell"
                    ? numericAmount / quote.rate
                    : numericAmount * quote.rate;

                return (
                  <div
                    key={quote.id ?? `${quote.provider}-${index}`}
                    className="grid gap-3 border-b border-white/[0.05] px-5 py-5 last:border-b-0 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto] md:items-center"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {quote.provider}
                        </span>

                        {index === 0 && (
                          <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[9px] text-emerald-300">
                            BEST
                          </span>
                        )}
                      </div>

                      <div className="mt-1 text-xs text-white/25 md:hidden">
                        {quote.providerType ?? "Provider"}
                      </div>
                    </div>

                    <div className="hidden text-xs text-white/35 md:block">
                      {quote.providerType ?? "Provider"}
                    </div>

                    <div>
                      <div className="text-sm font-medium">
                        {formatRate(quote.rate, currency)}
                      </div>

                      <div className="mt-1 text-[10px] text-white/25">
                        {side === "sell"
                          ? `${formatNumber(received, 4)} ${asset}`
                          : `${formatRate(received, currency)}`}
                      </div>
                    </div>

                    <div className="text-xs text-white/25">
                      {quote.updatedAt ? "Live" : "Sample"}
                    </div>

                    <button
                      className="rounded-xl border border-white/[0.08] px-4 py-2.5 text-xs text-white/60 transition hover:bg-white/[0.05] hover:text-white"
                      onClick={() => {
                        window.alert(
                          `${quote.provider} integration will open here.`
                        );
                      }}
                    >
                      Open
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CALCULATOR */}
        <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 sm:p-8">
              <div className="text-xs text-white/30">
                Kobo calculator
              </div>

              <h2 className="mt-2 text-2xl font-medium tracking-tight">
                See what you actually receive.
              </h2>

              <p className="mt-2 max-w-lg text-sm leading-6 text-white/35">
                Compare the expected result across providers before
                leaving Kobo.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-5">
                  <div className="text-[10px] uppercase tracking-wider text-white/25">
                    You provide
                  </div>

                  <div className="mt-2 text-2xl">
                    {formatNumber(numericAmount)}{" "}
                    <span className="text-sm text-white/30">
                      {side === "sell" ? currency : asset}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-5">
                  <div className="text-[10px] uppercase tracking-wider text-white/25">
                    Estimated receive
                  </div>

                  <div className="mt-2 text-2xl">
                    {bestRate
                      ? formatNumber(estimatedReceive, 4)
                      : "0"}{" "}
                    <span className="text-sm text-white/30">
                      {side === "sell" ? asset : currency}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 sm:p-8">
              <div className="text-xs text-white/30">
                Rate monitoring
              </div>

              <h2 className="mt-2 text-2xl font-medium tracking-tight">
                Want Kobo to watch it?
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/35">
                Rate alerts are coming soon. Get notified when your
                chosen corridor reaches the rate you want.
              </p>

              <button className="mt-6 rounded-xl border border-white/[0.08] px-5 py-3 text-xs text-white/60 transition hover:bg-white/[0.05] hover:text-white">
                Create rate alert
              </button>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mx-auto max-w-7xl px-5 pb-10 pt-8"> 
          <div className="border-t 
     border-white/[0.06] pt-6">
            <div className="flex flex-col justify-between gap-3 text-xs text-white/25 sm:flex-row">
              <span>
           justify-between gap-3 text-xs text-white/25 sm:flex-row">
              <span>
                kobo. Compare before you convert.
              </span>

              <span>
                Rates are indicative and may change before execution.
              </span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
      }
