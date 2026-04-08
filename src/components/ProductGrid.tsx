"use client";

import ProductCard from "./ProductCard";
import { products } from "@/data/products";

export default function ProductGrid() {
  return (
    <section id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center mb-10 sm:mb-14">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-brand-dark mb-3">
          Nosso <span className="text-brand-teal">Cat&aacute;logo</span>
        </h2>
        <p className="text-zinc-500 text-sm sm:text-base max-w-md mx-auto">
          Pecas selecionadas com qualidade, conforto e estilo para seus treinos
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
