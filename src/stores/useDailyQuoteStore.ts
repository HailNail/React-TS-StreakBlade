import { create } from "zustand";
import type { QuoteState } from "../types/dailyQuotesTypes";

export const useDailyQuoteStore = create<QuoteState>((set) => ({
  quote: "",
  loading: true,
  fadeIn: false,

  // 🔹 Fetch from API
  fetchQuote: async () => {
    set({ loading: true });

    try {
      const today = new Date().toDateString();
      const res = await fetch("https://dummyjson.com/quotes/random");

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const newQuote = `“${data.quote}” — ${data.author}`;

      set({ quote: newQuote });
      localStorage.setItem("dailyQuote", newQuote);
      localStorage.setItem("dailyQuoteDate", today);
    } catch (err) {
      console.error(err);
      set({ quote: "Stay inspired, even offline." });
    }

    setTimeout(() => set({ fadeIn: true }), 150);
    set({ loading: false });
  },

  // 🔹 Initialize: read from cache or fetch new
  initQuote: async () => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem("dailyQuote");
    const savedDate = localStorage.getItem("dailyQuoteDate");

    if (saved && savedDate === today) {
      set({
        quote: saved,
        loading: false,
        fadeIn: true,
      });
    } else {
      await useDailyQuoteStore.getState().fetchQuote();
    }

    // 🕛 schedule refresh at next midnight
    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0
    );

    const ms = nextMidnight.getTime() - now.getTime();
    setTimeout(() => {
      useDailyQuoteStore.getState().fetchQuote();
      setInterval(
        () => useDailyQuoteStore.getState().fetchQuote(),
        24 * 60 * 60 * 1000
      );
    }, ms);
  },
}));
