export function formatMoney(
  value: number,
  currency: string,
  maximumFractionDigits = 2
): string {
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      maximumFractionDigits,
    }).format(value);
  } catch {
    return `${value.toLocaleString("en")}`;
  }
}

export function formatNumber(
  value: number,
  maximumFractionDigits = 2
): string {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits,
  }).format(value);
}

export function formatRate(
  value: number,
  currency: string
): string {
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

  const symbol = symbols[currency] ?? currency;

  return `${symbol}${value.toLocaleString("en", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatRelativeTime(timestamp: number): string {
  const seconds = Math.max(
    0,
    Math.floor((Date.now() - timestamp) / 1000)
  );

  if (seconds < 5) return "just now";

  if (seconds < 60) {
    return `${seconds}s ago`;
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  return `${hours}h ago`;
}
