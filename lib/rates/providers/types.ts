import type { RateQuote, TradeSide } from "@/lib/rates/types";

export type ProviderContext = {
  fiat: string;
  asset: string;
  side: TradeSide;
  amount: number;
};

export type ProviderResult = {
  quotes: RateQuote[];
  error?: string;
};

export interface RateProvider {
  id: string;
  name: string;
  type: RateQuote["providerType"];

  supports(
    context: ProviderContext
  ): boolean;

  fetchQuote(
    context: ProviderContext
  ): Promise<ProviderResult>;
}
