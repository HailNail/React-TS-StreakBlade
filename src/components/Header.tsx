import ThemeToggle from "./ThemeToggle";
import { useEffect, useState } from "react";

const Header = () => {
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    let intervalId: number | undefined;
    const fetchQuote = async () => {
      try {
        const today = new Date().toDateString();
        const res = await fetch("https://api.api-ninjas.com/v1/quotes", {
          headers: {
            "X-Api-Key": import.meta.env.VITE_API_NINJAS_KEY,
          },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (data[0]) {
          const newQuote = `“${data[0].quote}” — ${data[0].author}`;
          setQuote(newQuote);
          localStorage.setItem("dailyQuote", newQuote);
          localStorage.setItem("dailyQuoteDate", today);
        } else {
          setQuote("Stay inspired, even offline.");
        }
      } catch (error) {
        console.error("Quote fetch failed:", error);
        setQuote("Stay inspired, even offline.");
      } finally {
        setLoading(false);
        setFadeIn(true);
      }
    };

    // 🔎 check saved quote first
    const today = new Date().toDateString();
    const saved = localStorage.getItem("dailyQuote");
    const savedDate = localStorage.getItem("dailyQuoteDate");

    if (saved && savedDate === today) {
      setQuote(saved);
      setLoading(false);
      setFadeIn(true);
    } else {
      fetchQuote();
    }

    // 🌙 schedule first refresh at next midnight
    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0
    );
    const msUntilMidnight = nextMidnight.getTime() - now.getTime();

    const timeoutId = window.setTimeout(() => {
      fetchQuote();

      // then repeat every 24h
      intervalId = window.setInterval(() => {
        fetchQuote();
      }, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);

    // cleanup on unmount
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // Trigger fade-in when loading finishes
  useEffect(() => {
    if (!loading) {
      const timeout = setTimeout(() => setFadeIn(true), 100);
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  return (
    <div className="flex flex-wrap sm:flex-nowrap sm:justify-center p-4 mb-2 w-full bg-base-300 text-base-content shadow-md font-quattrocento text-2xl">
      <div className="flex w-1/2 sm:w-auto sm:flex-grow mb-2 sm:mb-0">
        <svg
          fill="#000000"
          width="50"
          height="50"
          className="fill-current"
          viewBox="-2.4 -2.4 28.80 28.80"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <title>Katana icon</title>
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.016 22.762H12c-5.95-.009-10.765-4.84-10.756-10.789.009-5.95 4.839-10.766 10.789-10.757 5.943.009 10.756 4.829 10.756 10.773 0 5.95-4.823 10.773-10.773 10.773zm9.475-10.857a5.562 5.562 0 0 1-9.142 3.214 6.331 6.331 0 0 0 3.251-2.062l.104.169c.339.584.568 1.226.676 1.893a6.281 6.281 0 0 0-.349-2.656 6.328 6.328 0 0 0-8.94-8.63 5.563 5.563 0 0 1 7.418 6.256 6.334 6.334 0 0 0-3.425-1.762l.093-.175a5.53 5.53 0 0 1 1.304-1.533 6.31 6.31 0 0 0-2.122 1.636 6.327 6.327 0 0 0-3.016 12.044 5.564 5.564 0 0 1 1.713-9.562 6.33 6.33 0 0 0 .185 3.818h-.186a5.535 5.535 0 0 1-1.98-.36 6.295 6.295 0 0 0 2.471 1.025 6.328 6.328 0 0 0 8.513 2.758 6.319 6.319 0 0 0 3.432-6.073zm-11.018-1.443a5.582 5.582 0 0 1 3.6.998 5.584 5.584 0 0 1-2.667 2.618 5.57 5.57 0 0 1-.933-3.616z"></path>
          </g>
        </svg>
      </div>
      <div className="flex w-1/2 justify-end items-center sm:w-auto sm:flex-grow order-2 sm:order-3 mb-2 sm:mb-0">
        <ThemeToggle />
      </div>

      <div
        className={`w-full flex sm:justify-center items-center sm:w-auto sm:flex-grow order-3 sm:order-2 transition-opacity duration-700 ${
          fadeIn ? "opacity-100" : "opacity-0"
        }`}
      >
        {loading ? (
          <div className="flex justify-center">
            <span className="loading loading-dots loading-lg"></span>
          </div>
        ) : (
          <p className="text-center text-lg tracking-wide">{quote}</p>
        )}
      </div>
    </div>
  );
};

export default Header;
