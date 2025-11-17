export interface QuoteState {
  quote: string;
  loading: boolean;
  fadeIn: boolean;

  initQuote: () => Promise<void>;
  fetchQuote: () => Promise<void>;
}
