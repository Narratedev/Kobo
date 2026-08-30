import type { RateProvider } from "./types";
import quidax from "./quidax";

export const providers: RateProvider[] = [
  quidax,
];

export function getProviders() {
  return providers;
}
