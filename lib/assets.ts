export type CryptoAsset = {
  symbol: string;
  name: string;
  icon: string;
};

export const assets: CryptoAsset[] = [
  {
    symbol: "USDT",
    name: "Tether",
    icon: "₮",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    icon: "$",
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    icon: "₿",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    icon: "Ξ",
  },
];

export const defaultAsset = "USDT";

export function getAsset(symbol: string): CryptoAsset | undefined {
  return assets.find(
    (asset) => asset.symbol === symbol.toUpperCase()
  );
}
