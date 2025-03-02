// hooks/useCurrency.ts
"use client";

import { useEffect, useState } from "react";

export function useCurrency() {
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      // A simple check: if the browser language includes "in", assume INR; otherwise, USD.
      if (navigator.language.toLowerCase().includes("in")) {
        setCurrency("INR");
      } else {
        setCurrency("USD");
      }
    }
  }, []);

  return currency;
}
