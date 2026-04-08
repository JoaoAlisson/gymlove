"use client";

import { useState } from "react";

export default function PromoBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative bg-brand-teal text-white text-center py-2.5 px-4 text-sm font-medium">
      <span className="hidden sm:inline">
        Pecas selecionadas com ate <strong>25% OFF</strong> &mdash; Aproveite, estoque limitado!
      </span>
      <span className="sm:hidden">
        Ate <strong>25% OFF</strong> em pecas selecionadas!
      </span>
      <a
        href="https://wa.me/5595981033359?text=Oi!%20Quero%20saber%20sobre%20as%20promo%C3%A7%C3%B5es!"
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 ml-2 hover:text-white/80 transition-colors"
      >
        Saiba mais
      </a>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
        aria-label="Fechar banner"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
