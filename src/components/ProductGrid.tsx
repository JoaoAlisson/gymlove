"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import { products, categories, type Category, type Gender } from "@/data/products";

const genders: { label: string; value: Gender | "Todos" }[] = [
  { label: "Todos", value: "Todos" },
  { label: "Feminino", value: "feminino" },
  { label: "Masculino", value: "masculino" },
];

export default function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState<Category | "Todos">("Todos");
  const [activeGender, setActiveGender] = useState<Gender | "Todos">("Todos");

  const filtered = products.filter((p) => {
    const matchCategory = activeCategory === "Todos" || p.category === activeCategory;
    const matchGender = activeGender === "Todos" || p.gender === activeGender;
    return matchCategory && matchGender;
  });

  const count = filtered.length;

  return (
    <section id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-brand-dark mb-3">
          Nosso <span className="text-brand-teal">Cat&aacute;logo</span>
        </h2>
        <p className="text-zinc-500 text-sm sm:text-base max-w-md mx-auto">
          Peças selecionadas com qualidade, conforto e estilo para seus treinos
        </p>
      </div>

      <button
        onClick={() => {
          setActiveCategory("Copa");
          setActiveGender("Todos");
        }}
        className="group relative flex w-full items-center mb-8 sm:mb-10 overflow-hidden rounded-2xl bg-br-green-dark text-left shadow-sm hover:shadow-xl hover:shadow-br-green/15 transition-all"
        aria-label="Ver coleção Copa 2026"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-br-green-deep via-br-green-dark to-br-green"
        />
        <svg
          aria-hidden
          viewBox="0 0 200 120"
          preserveAspectRatio="xMidYMid slice"
          className="pointer-events-none absolute right-0 top-0 h-full w-1/2 sm:w-1/3 opacity-90 transition-transform duration-500 group-hover:scale-[1.03]"
        >
          <polygon points="100,15 185,60 100,105 15,60" fill="#FFDF00" />
          <circle cx="100" cy="60" r="22" fill="#002776" />
        </svg>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-br-green-deep via-br-green-deep/85 to-transparent"
        />
        <div className="relative flex w-full items-center justify-between gap-4 px-5 sm:px-8 py-4 sm:py-5">
          <div className="flex items-center gap-4 sm:gap-5 min-w-0">
            <svg viewBox="0 0 24 16" className="hidden sm:block w-8 h-5 shrink-0 rounded-[2px] shadow-md" aria-hidden>
              <rect width="24" height="16" fill="#009C3B" />
              <polygon points="12,2 22,8 12,14 2,8" fill="#FFDF00" />
              <circle cx="12" cy="8" r="2.5" fill="#002776" />
            </svg>
            <div className="min-w-0">
              <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.28em] text-br-yellow">
                Edição Copa 2026
              </span>
              <span className="block font-display text-lg sm:text-2xl font-bold text-white leading-tight tracking-tight truncate">
                Vista <span className="text-br-yellow italic">a seleção</span>
              </span>
            </div>
          </div>
          <span className="flex shrink-0 items-center gap-2 rounded-full bg-br-yellow px-4 sm:px-5 py-2 text-[11px] sm:text-xs font-bold uppercase tracking-[0.15em] text-br-green-deep shadow-md shadow-br-yellow/25 transition-all group-hover:bg-white group-hover:translate-x-0.5">
            <span className="hidden sm:inline">Ver coleção</span>
            <span className="sm:hidden">Ver</span>
            <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </button>

      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
        {genders.map((g) => (
          <button
            key={g.value}
            onClick={() => setActiveGender(g.value)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              activeGender === g.value
                ? "bg-brand-teal text-white shadow-sm"
                : "bg-white text-zinc-600 border border-zinc-200 hover:border-brand-teal/40 hover:text-brand-teal"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 mb-8 sm:mb-10">
        {categories.map((cat) => {
          const isCopa = cat.value === "Copa";
          const isActive = activeCategory === cat.value;
          if (isCopa) {
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`group/copa relative inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                  isActive
                    ? "bg-br-green text-white border-br-green shadow-md shadow-br-green/30"
                    : "bg-white text-br-green border-br-green/40 hover:bg-br-green/5 hover:border-br-green"
                }`}
              >
                <svg viewBox="0 0 24 16" className="w-3.5 h-2.5" aria-hidden>
                  <rect width="24" height="16" fill={isActive ? "#FFDF00" : "#009C3B"} />
                  <polygon
                    points="12,2 22,8 12,14 2,8"
                    fill={isActive ? "#009C3B" : "#FFDF00"}
                  />
                  <circle cx="12" cy="8" r="2.5" fill="#002776" />
                </svg>
                {cat.label}
              </button>
            );
          }
          return (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isActive
                  ? "bg-brand-teal text-white shadow-sm"
                  : "bg-white text-zinc-500 border border-zinc-200 hover:border-brand-teal/40 hover:text-brand-teal"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {count === 0 ? (
        <p className="text-center text-zinc-400 py-12">Nenhum produto encontrado nesta categoria.</p>
      ) : (
        <>
          <p className="text-xs text-zinc-400 mb-4">
            {count} {count === 1 ? "produto" : "produtos"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
