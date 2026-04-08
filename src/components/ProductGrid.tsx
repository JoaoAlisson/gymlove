"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import { products, categories, type Category } from "@/data/products";

export default function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState<Category | "Todos">("Todos");

  const filtered = activeCategory === "Todos"
    ? products
    : products.filter((p) => p.category === activeCategory);

  const count = filtered.length;

  return (
    <section id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-brand-dark mb-3">
          Nosso <span className="text-brand-teal">Cat&aacute;logo</span>
        </h2>
        <p className="text-zinc-500 text-sm sm:text-base max-w-md mx-auto">
          Pecas selecionadas com qualidade, conforto e estilo para seus treinos
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 mb-8 sm:mb-10">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat.value
                ? "bg-brand-teal text-white shadow-sm"
                : "bg-white text-zinc-500 border border-zinc-200 hover:border-brand-teal/40 hover:text-brand-teal"
            }`}
          >
            {cat.label}
          </button>
        ))}
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
