export type Currency = {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  country: string;
};

export const currencies: Currency[] = [
  {
    code: "NGN",
    name: "Nigerian Naira",
    symbol: "₦",
    flag: "🇳🇬",
    country: "Nigeria",
  },
  {
    code: "GHS",
    name: "Ghanaian Cedi",
    symbol: "GH₵",
    flag: "🇬🇭",
    country: "Ghana",
  },
  {
    code: "KES",
    name: "Kenyan Shilling",
    symbol: "KSh",
    flag: "🇰🇪",
    country: "Kenya",
  },
  {
    code: "PHP",
    name: "Philippine Peso",
    symbol: "₱",
    flag: "🇵🇭",
    country: "Philippines",
  },
  {
    code: "VND",
    name: "Vietnamese Dong",
    symbol: "₫",
    flag: "🇻🇳",
    country: "Vietnam",
  },
  {
    code: "IDR",
    name: "Indonesian Rupiah",
    symbol: "Rp",
    flag: "🇮🇩",
    country: "Indonesia",
  },
  {
    code: "INR",
    name: "Indian Rupee",
    symbol: "₹",
    flag: "🇮🇳",
    country: "India",
  },
  {
    code: "PKR",
    name: "Pakistani Rupee",
    symbol: "₨",
    flag: "🇵🇰",
    country: "Pakistan",
  },
];

export const defaultCurrency = "NGN";

export function getCurrency(code: string): Currency | undefined {
  return currencies.find(
    (currency) => currency.code === code.toUpperCase()
  );
    }
