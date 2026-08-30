export type TradeSide = "buy" | "sell";

export type ProviderType =
  | "P2P"
  | "OTC"
  | "Exchange"
  | "Remittance"
  | "Fintech";

export type RateQuote = {
  id: string;

  provider: string;

  providerType: ProviderType;

  asset: string;

  fiat: string;

  side: TradeSide;

  rate: number;

  fee?: number;

  minAmount?: number;

  maxAmount?: number;

  availableAmount?: number;

  paymentMethods?: string[];

  settlementTime?: string;

  updatedAt: number;

  source: string;
};

export type MarketReference = {
  asset: string;

  fiat: string;

  rate: number;

  change24h?: number;

  updatedAt: number;
};
