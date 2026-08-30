"use client";

import { useMemo, useState } from "react";

type Provider = {
  name: string;
  type: "OTC" | "P2P" | "Exchange";
  rate: number;
  liquidity: string;
  updated: string;
};

const providers: Provider[] = [
  {
    name: "Breet",
    type: "OTC",
    rate: 1521.0,
    liquidity: "High",
    updated: "8s",
  },
  {
    name: "Binance",
    type: "P2P",
    rate: 1518.0,
    liquidity: "High",
    updated: "11s",
  },
  {
    name: "Bybit",
    type: "P2P",
    rate: 1515.0,
    liquidity: "High",
    updated: "14s",
  },
  {
    name: "OKX",
    type: "P2P",
    rate: 1514.0,
    liquidity: "Medium",
    updated: "18s",
  },
];

const currencies = [
  { code: "NGN", name: "Nigerian Naira", flag: "🇳🇬" },
  { code: "GHS", name: "Ghanaian Cedi", flag: "🇬🇭" },
  { code: "KES", name: "Kenyan Shilling", flag: "🇰🇪" },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
  { code: "PHP", name: "Philippine Peso", flag: "🇵🇭" },
  { code: "VND", name: "Vietnamese Dong", flag: "🇻🇳" },
  { code: "IDR", name: "Indonesian Rupiah", flag: "🇮🇩" },
  { code: "PKR", name: "Pakistani Rupee", flag: "🇵🇰" },
];

function formatNaira(value: number) {
  return new Intl.NumberFormat("en-NG", {
    maximumFractionDigits: 2,
  }).format(value);
}

export default function Home() {
  const [currency, setCurrency] = useState("NGN");
  const [asset, setAsset] = useState("USDT");
  const [side, setSide] = useState<"buy" | "sell">("sell");
  const [amount, setAmount] = useState("1000");
  const [currencyOpen, setCurrencyOpen] = useState(false);

  const selectedCurrency = currencies.find(
    (item) => item.code === currency
  );

  const referenceRate = 1514.2;

  const sortedProviders = useMemo(() => {
    return [...providers].sort((a, b) =>
      side === "sell" ? b.rate - a.rate : a.rate - b.rate
    );
  }, [side]);

  const bestProvider = sortedProviders[0];
  const numericAmount = Number(amount) || 0;

  const bestReceive =
    side === "sell"
      ? numericAmount * bestProvider.rate
      : numericAmount / bestProvider.rate;

  const referenceValue =
    side === "sell"
      ? numericAmount * referenceRate
      : numericAmount / referenceRate;

  const difference = bestReceive - referenceValue;

  return (
    <main className="min-h-screen bg-[#0d0f0e] text-[#f3f5f3]">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0d0f0e]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-10">
            <div className="text-xl font-semibold tracking-[-0.04em]">
              Kobo
            </div>

            <div className="hidden items-center gap-7 text-sm text-white/55 md:flex">
              <button className="text-white">Markets</button>
              <button>Compare</button>
              <button>Alerts</button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-xs text-white/35 sm:block">
              No account required
            </span>

            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-sm text-white/70">
              ☾
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-5 pb-10 pt-14 lg:px-8 lg:pt-20">
        <div className="max-w-3xl">
          <div className="mb-4 flex items-center gap-2 text-xs text-emerald-400/90">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Live market comparison
          </div>

          <h1 className="text-4xl font-medium tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
            Find the better rate.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-white/45 sm:text-lg">
            Compare crypto-to-fiat rates across exchanges, OTC providers and
            P2P platforms in one calm place.
          </p>
        </div>

        {/* MARKET SELECTOR */}
        <div className="mt-10 flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-2 sm:flex-row">
          <div className="relative flex-1">
            <button
              onClick={() => setCurrencyOpen(!currencyOpen)}
              className="flex h-14 w-full items-center justify-between rounded-xl px-4 transition hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{selectedCurrency?.flag}</span>
                <div className="text-left">
                  <div className="text-sm font-medium">{currency}</div>
                  <div className="text-xs text-white/35">
                    {selectedCurrency?.name}
                  </div>
                </div>
              </div>

              <span className="text-white/30">⌄</span>
            </button>

            {currencyOpen && (
              <div className="absolute left-0 top-[62px] z-20 w-full overflow-hidden rounded-xl border border-white/[0.08] bg-[#171a18] p-1 shadow-2xl">
                {currencies.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      setCurrency(item.code);
                      setCurrencyOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left hover:bg-white/[0.05]"
                  >
                    <span>{item.flag}</span>
                    <div>
                      <div className="text-sm">{item.code}</div>
                      <div className="text-xs text-white/35">
                        {item.name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <select
            value={asset}
            onChange={(e) => setAsset(e.target.value)}
            className="h-14 rounded-xl border-0 bg-transparent px-4 text-sm outline-none hover:bg-white/[0.04]"
          >
            <option value="USDT">USDT</option>
            <option value="USDC">USDC</option>
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
          </select>

          <div className="flex rounded-xl bg-white/[0.035] p-1">
            <button
              onClick={() => setSide("buy")}
              className={`rounded-lg px-6 text-sm transition ${
                side === "buy"
                  ? "bg-white/[0.09] text-white"
                  : "text-white/35"
              }`}
            >
              Buy
            </button>

            <button
              onClick={() => setSide("sell")}
              className={`rounded-lg px-6 text-sm transition ${
                side === "sell"
                  ? "bg-white/[0.09] text-white"
                  : "text-white/35"
              }`}
            >
              Sell
            </button>
          </div>
        </div>
      </section>

      {/* MARKET OVERVIEW */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.06] sm:grid-cols-3">
          <div className="bg-[#111412] p-6">
            <div className="text-xs text-white/35">Kobo reference rate</div>

            <div className="mt-3 text-2xl font-medium tracking-[-0.03em]">
              ₦{formatNaira(referenceRate)}
            </div>

            <div className="mt-2 flex items-center gap-2 text-xs text-emerald-400">
              <span>●</span>
              Live reference
            </div>
          </div>

          <div className="bg-[#111412] p-6">
            <div className="text-xs text-white/35">Best available</div>

            <div className="mt-3 text-2xl font-medium tracking-[-0.03em]">
              ₦{formatNaira(bestProvider.rate)}
            </div>

            <div className="mt-2 text-xs text-white/35">
              {bestProvider.name} · {bestProvider.type}
            </div>
          </div>

          <div className="bg-[#111412] p-6">
            <div className="text-xs text-white/35">Providers tracked</div>

            <div className="mt-3 text-2xl font-medium tracking-[-0.03em]">
              {providers.length}
            </div>

            <div className="mt-2 text-xs text-white/35">
              Updated within seconds
            </div>
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">
            <div className="text-sm text-white/45">
              How much are you moving?
            </div>

            <div className="mt-4 flex items-center border-b border-white/[0.08] pb-4">
              <span className="mr-3 text-2xl text-white/30">$</span>

              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="decimal"
                className="w-full bg-transparent text-4xl font-medium tracking-[-0.04em] outline-none placeholder:text-white/20"
                placeholder="1,000"
              />

              <span className="text-sm text-white/35">{asset}</span>
            </div>

            <div className="mt-6 flex items-center justify-between text-sm">
              <span className="text-white/35">Best provider</span>

              <span className="font-medium">
                {bestProvider.name}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-white/35">Rate</span>

              <span>
                ₦{formatNaira(bestProvider.rate)}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-white/35">You receive</span>

              <span className="font-medium text-emerald-400">
                ₦{formatNaira(bestReceive)}
              </span>
            </div>

            <button className="mt-7 flex h-12 w-full items-center justify-center rounded-xl bg-white text-sm font-medium text-black transition hover:bg-white/90">
              Go to {bestProvider.name}
              <span className="ml-2">→</span>
            </button>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">
            <div className="text-sm text-white/45">
              Your rate compared with Kobo
            </div>

            <div className="mt-5 text-3xl font-medium tracking-[-0.04em]">
              {difference >= 0 ? "+" : ""}
              ₦{formatNaira(Math.abs(difference))}
            </div>

            <div className="mt-2 text-sm text-white/35">
              {difference >= 0
                ? "more than the Kobo reference rate"
                : "less than the Kobo reference rate"}
            </div>

            <div className="mt-8 h-28 overflow-hidden rounded-xl border border-white/[0.05] bg-black/10">
              <div className="flex h-full items-end gap-1 px-4 pb-4">
                {[35, 43, 38, 55, 48, 61, 58, 70, 64, 77, 72, 84].map(
                  (height, index) => (
                    <div
                      key={index}
                      className="flex-1 rounded-sm bg-emerald-400/20"
                      style={{ height: `${height}%` }}
                    />
                  )
                )}
              </div>
            </div>

            <div className="mt-3 flex justify-between text-[11px] text-white/25">
              <span>24h ago</span>
              <span>Now</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROVIDER TABLE */}
      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-medium tracking-[-0.025em]">
              Best available rates
            </h2>

            <p className="mt-1 text-sm text-white/35">
              {currency} / {asset} · {side === "sell" ? "Sell" : "Buy"}
            </p>
          </div>

          <div className="hidden text-xs text-white/25 sm:block">
            Updated automatically
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-white/[0.07]">
          <div className="hidden grid-cols-[1.6fr_1fr_1fr_1fr_0.7fr_auto] border-b border-white/[0.06] bg-white/[0.02] px-5 py-3 text-xs text-white/30 md:grid">
            <span>Provider</span>
            <span>Type</span>
            <span>Rate</span>
            <span>Liquidity</span>
            <span>Updated</span>
            <span />
          </div>

          {sortedProviders.map((provider, index) => (
            <div
              key={provider.name}
              className="grid gap-4 border-b border-white/[0.05] px-5 py-5 last:border-0 transition hover:bg-white/[0.025] md:grid-cols-[1.6fr_1fr_1fr_1fr_0.7fr_auto] md:items-center md:gap-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] text-xs font-medium">
                  {provider.name.charAt(0)}
                </div>

                <div>
                  <div className="text-sm font-medium">
                    {provider.name}
                  </div>

                  {index === 0 && (
                    <div className="mt-1 text-[11px] text-emerald-400">
                      Best rate
                    </div>
                  )}
                </div>
              </div>

              <div className="text-xs text-white/40">
                {provider.type}
              </div>

              <div className="text-sm font-medium">
                ₦{formatNaira(provider.rate)}
              </div>

              <div className="text-xs text-white/40">
                {provider.liquidity}
              </div>

              <div className="text-xs text-white/30">
                {provider.updated}
              </div>

              <button className="rounded-lg px-3 py-2 text-xs text-white/55 transition hover:bg-white/[0.06] hover:text-white">
                Go →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-xs text-white/25 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>© 2026 Kobo</div>

          <div>
            Kobo compares rates. It does not execute or custody transactions.
          </div>
        </div>
      </footer>
    </main>
  );
      }
