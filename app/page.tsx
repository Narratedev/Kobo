"use client";

import { useMemo, useState } from "react";

import { assets } from "@/lib/assets";
import { currencies } from "@/lib/currencies";
import {
  calculateDifference,
  calculateReceived,
  getBestRate,
  sortRates,
} from "@/lib/rates/engine";
import { getReferenceRate } from "@/lib/rates/reference";
import { getMockRates, type TradeSide } from "@/lib/rates";

function formatNumber(value: number, decimals = 2) {
  return new Intl.NumberFormat("en", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

function formatRate(value: number, fiat: string) {
  const symbols: Record<string, string> = {
    NGN: "₦",
    GHS: "GH₵",
    KES: "KSh",
    PHP: "₱",
    VND: "₫",
    IDR: "Rp",
    INR: "₹",
    PKR: "₨",
  };

  return `${symbols[fiat] ?? ""}${formatNumber(value)}`;
}

export default function Home() {
  const [currency, setCurrency] = useState("NGN");
  const [asset, setAsset] = useState("USDT");
  const [side, setSide] = useState<TradeSide>("sell");
  const [amount, setAmount] = useState("1000");
  const [currencyOpen, setCurrencyOpen] = useState(false);

  const selectedCurrency = currencies.find(
    (item) => item.code === currency
  );

  const selectedAsset = assets.find(
    (item) => item.symbol === asset
  );

  const rates = useMemo(() => {
    return getMockRates(currency, asset, side);
  }, [currency, asset, side]);

  const sortedRates = useMemo(() => {
    return sortRates(rates, side);
  }, [rates, side]);

  const bestRate = getBestRate(rates, side);

  const reference = getReferenceRate(currency, asset);

  const numericAmount = Math.max(
    0,
    Number(amount.replace(/,/g, "")) || 0
  );

  const bestReceived = bestRate
    ? calculateReceived(numericAmount, bestRate, side)
    : 0;

  const referenceReceived =
    side === "sell"
      ? numericAmount * reference.rate
      : numericAmount / reference.rate;

  const differencePercent = calculateDifference(
    bestReceived,
    referenceReceived
  );

  return (
    <main className="min-h-screen bg-[#0d0f0e] text-[#f3f5f3]">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0d0f0e]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-10">
            <div className="text-xl font-semibold tracking-[-0.04em]">
              Kobo
            </div>

            <div className="hidden items-center gap-7 text-sm text-white/45 md:flex">
              <button className="text-white">
                Markets
              </button>

              <button className="transition hover:text-white">
                Compare
              </button>

              <button className="transition hover:text-white">
                Alerts
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-xs text-white/30 sm:block">
              No account required
            </span>

            <button
              aria-label="Toggle theme"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-sm text-white/60 transition hover:bg-white/[0.06]"
            >
              ☾
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-5 pb-8 pt-14 lg:px-8 lg:pt-20">
        <div className="max-w-3xl">
          <div className="mb-4 flex items-center gap-2 text-xs text-[#7ee2b8]">
            <span className="kobo-live-dot" />
            Live market comparison
          </div>

          <h1 className="text-4xl font-medium tracking-[-0.05em] sm:text-5xl lg:text-6xl">
            Find the better rate.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-white/40 sm:text-lg">
            Compare crypto-to-fiat rates across exchanges, OTC
            providers and P2P platforms in one place.
          </p>
        </div>

        {/* SELECTORS */}
        <div className="mt-10 flex flex-col gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-2 sm:flex-row">
          {/* CURRENCY */}
          <div className="relative flex-1">
            <button
              onClick={() => setCurrencyOpen(!currencyOpen)}
              className="flex h-14 w-full items-center justify-between rounded-xl px-4 transition hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {selectedCurrency?.flag}
                </span>

                <div className="text-left">
                  <div className="text-sm font-medium">
                    {currency}
                  </div>

                  <div className="text-xs text-white/30">
                    {selectedCurrency?.name}
                  </div>
                </div>
              </div>

              <span className="text-white/25">
                {currencyOpen ? "⌃" : "⌄"}
              </span>
            </button>

            {currencyOpen && (
              <div className="absolute left-0 top-[62px] z-30 max-h-80 w-full overflow-y-auto rounded-xl border border-white/[0.08] bg-[#171a18] p-1 shadow-2xl">
                {currencies.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      setCurrency(item.code);
                      setCurrencyOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-white/[0.05] ${
                      currency === item.code
                        ? "bg-white/[0.04]"
                        : ""
                    }`}
                  >
                    <span>{item.flag}</span>

                    <div>
                      <div className="text-sm">
                        {item.code}
                      </div>

                      <div className="text-xs text-white/30">
                        {item.name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ASSET */}
          <div className="flex items-center rounded-xl px-2 sm:px-3">
            <select
              value={asset}
              onChange={(event) =>
                setAsset(event.target.value)
              }
              className="h-12 cursor-pointer bg-transparent px-3 text-sm font-medium outline-none"
            >
              {assets.map((item) => (
                <option
                  key={item.symbol}
                  value={item.symbol}
                >
                  {item.icon} {item.symbol}
                </option>
              ))}
            </select>
          </div>

          {/* SIDE */}
          <div className="flex rounded-xl bg-white/[0.035] p-1">
            <button
              onClick={() => setSide("buy")}
              className={`flex-1 rounded-lg px-7 text-sm transition sm:flex-none ${
                side === "buy"
                  ? "bg-white/[0.09] text-white"
                  : "text-white/30 hover:text-white/60"
              }`}
            >
              Buy
            </button>

            <button
              onClick={() => setSide("sell")}
              className={`flex-1 rounded-lg px-7 text-sm transition sm:flex-none ${
                side === "sell"
                  ? "bg-white/[0.09] text-white"
                  : "text-white/30 hover:text-white/60"
              }`}
            >
              Sell
            </button>
          </div>
        </div>
      </section>

      {/* MARKET HEADER */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] sm:grid-cols-3">
          <div className="border-b border-white/[0.06] p-6 sm:border-b-0 sm:border-r">
            <div className="text-xs text-white/30">
              Kobo reference
            </div>

            <div className="mt-3 text-2xl font-medium tracking-[-0.04em]">
              {formatRate(reference.rate, currency)}
            </div>

            <div className="mt-2 flex items-center gap-2 text-xs text-[#7ee2b8]">
              <span className="kobo-live-dot" />
              Live reference
            </div>
          </div>

          <div className="border-b border-white/[0.06] p-6 sm:border-b-0 sm:border-r">
            <div className="text-xs text-white/30">
              Best available
            </div>

            <div className="mt-3 text-2xl font-medium tracking-[-0.04em]">
              {bestRate
                ? formatRate(bestRate.rate, currency)
                : "No rate"}
            </div>

            <div className="mt-2 text-xs text-white/30">
              {bestRate
                ? `${bestRate.provider} · ${bestRate.providerType}`
                : "Waiting for providers"}
            </div>
          </div>

          <div className="p-6">
            <div className="text-xs text-white/30">
              Providers tracked
            </div>

            <div className="mt-3 text-2xl font-medium tracking-[-0.04em]">
              {sortedRates.length}
            </div>

            <div className="mt-2 text-xs text-white/30">
              Currently available
            </div>
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">
            <div className="text-sm text-white/40">
              How much are you moving?
            </div>

            <div className="mt-4 flex items-center border-b border-white/[0.08] pb-4">
              <span className="mr-3 text-2xl text-white/20">
                {side === "sell" ? selectedAsset?.icon : "₦"}
              </span>

              <input
                value={amount}
                onChange={(event) =>
                  setAmount(event.target.value)
                }
                inputMode="decimal"
                className="w-full bg-transparent text-4xl font-medium tracking-[-0.05em] outline-none"
                placeholder="1,000"
              />

              <span className="text-sm text-white/30">
                {side === "sell" ? asset : currency}
              </span>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/30">
                  Best provider
                </span>

                <span>
                  {bestRate?.provider ?? "None"}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-white/30">
                  Rate
                </span>

                <span>
                  {bestRate
                    ? formatRate(bestRate.rate, currency)
                    : "—"}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-white/30">
                  You receive
                </span>

                <span className="font-medium text-[#7ee2b8]">
                  {side === "sell"
                    ? formatRate(bestReceived, currency)
                    : `${formatNumber(bestReceived)} ${asset}`}
                </span>
              </div>
            </div>

            <button
              disabled={!bestRate}
              className="mt-7 flex h-12 w-full items-center justify-center rounded-xl bg-[#f3f5f3] text-sm font-medium text-[#0d0f0e] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              Go to {bestRate?.provider ?? "provider"}
              <span className="ml-2">→</span>
            </button>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">
            <div className="text-sm text-white/40">
              Compared with Kobo's reference
            </div>

            <div className="mt-5 text-3xl font-medium tracking-[-0.05em]">
              {differencePercent >= 0 ? "+" : ""}
              {formatNumber(differencePercent)}%
            </div>

            <div className="mt-2 text-sm text-white/30">
              {differencePercent >= 0
                ? "above the reference rate"
                : "below the reference rate"}
            </div>

            {/* MINI CHART */}
            <div className="mt-8 flex h-32 items-end gap-1 overflow-hidden rounded-xl border border-white/[0.05] bg-black/10 px-4 pb-4 pt-6">
              {[32, 38, 35, 48, 43, 57, 52, 64, 59, 73, 68, 81, 77, 88].map(
                (height, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-sm bg-[#7ee2b8]/15 transition-all duration-500"
                    style={{
                      height: `${height}%`,
                    }}
                  />
                )
              )}
            </div>

            <div className="mt-3 flex justify-between text-[11px] text-white/20">
              <span>24h ago</span>
              <span>Now</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROVIDERS */}
      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-medium tracking-[-0.03em]">
              Best available rates
            </h2>

            <p className="mt-1 text-sm text-white/30">
              {currency} / {asset} ·{" "}
              {side === "sell" ? "Sell" : "Buy"}
            </p>
          </div>

          <div className="hidden text-xs text-white/20 sm:block">
            Updated automatically
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-white/[0.07]">
          <div className="hidden grid-cols-[1.5fr_1fr_1fr_1fr_0.7fr_auto] border-b border-white/[0.06] bg-white/[0.02] px-5 py-3 text-xs text-white/25 md:grid">
            <span>Provider</span>
            <span>Type</span>
            <span>Rate</span>
            <span>Liquidity</span>
            <span>Updated</span>
            <span />
          </div>

          {sortedRates.map((provider, index) => (
            <div
              key={provider.id}
              className="grid gap-4 border-b border-white/[0.05] px-5 py-5 last:border-0 transition hover:bg-white/[0.025] md:grid-cols-[1.5fr_1fr_1fr_1fr_0.7fr_auto] md:items-center md:gap-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] text-xs font-medium">
                  {provider.provider.charAt(0)}
                </div>

                <div>
                  <div className="text-sm font-medium">
                    {provider.provider}
                  </div>

                  {index === 0 && (
                    <div className="mt-1 text-[11px] text-[#7ee2b8]">
                      Best rate
                    </div>
                  )}
                </div>
              </div>

              <div className="text-xs text-white/35">
                {provider.providerType}
              </div>

              <div className="text-sm font-medium">
                {formatRate(provider.rate, currency)}
              </div>

              <div className="text-xs text-white/35">
                {provider.availableAmount
                  ? `${formatNumber(provider.availableAmount, 0)} ${asset}`
                  : "—"}
              </div>

              <div className="text-xs text-white/25">
                {Math.floor(
                  (Date.now() - provider.updatedAt) / 1000
                )}
                s ago
              </div>

              <button className="rounded-lg px-3 py-2 text-xs text-white/45 transition hover:bg-white/[0.06] hover:text-white">
                Go →
              </button>
            </div>
          ))}

          {sortedRates.length === 0 && (
            <div className="px-5 py-12 text-center text-sm text-white/30">
              No rates available for this market yet.
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-xs text-white/20 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <span>© 2026 Kobo</span>

          <span>
            Kobo compares rates. It does not execute or custody
            transactions.
          </span>
        </div>
      </footer>
    </main>
  );
            }
