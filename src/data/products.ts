export interface Product {
  id: number;
  name: string;
  price: string;
  priceValue: number;
  images: string[];
  description?: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Macaquinho Frente Unica",
    price: "R$ 351,90",
    priceValue: 351.9,
    images: ["/products/01-frente.jpg", "/products/02-costas.jpg"],
    description: "Macaquinho com design frente unica, perfeito para treinos intensos",
  },
  {
    id: 2,
    name: "Macacao Regata",
    price: "R$ 516,90",
    priceValue: 516.9,
    images: ["/products/03-frente.jpg", "/products/04-costas.jpg"],
    description: "Macacao regata com ziper frontal, ideal para musculacao",
  },
  {
    id: 3,
    name: "Macaquinho Bolso Pocket",
    price: "R$ 375,90",
    priceValue: 375.9,
    images: ["/products/05-frente.jpg", "/products/06-costas.jpg"],
    description: "Macaquinho com bolsos laterais, pratico e estiloso",
  },
  {
    id: 4,
    name: "Macaquinho Hiper",
    price: "R$ 368,90",
    priceValue: 368.9,
    images: ["/products/07.jpg"],
    description: "Macaquinho hiper com ziper, versatil para qualquer atividade",
  },
  {
    id: 5,
    name: "Macaquinho Manga Longa",
    price: "R$ 385,90",
    priceValue: 385.9,
    images: ["/products/08.jpg"],
    description: "Macaquinho manga longa, protecao e conforto",
  },
  {
    id: 6,
    name: "Macaquinho My Fit Mood",
    price: "R$ 158,90",
    priceValue: 158.9,
    images: ["/products/09.jpg"],
    description: "Macaquinho leve e confortavel para o dia a dia fitness",
  },
  {
    id: 7,
    name: "Top Verde",
    price: "R$ 152,90",
    priceValue: 152.9,
    images: ["/products/10.jpg"],
    description: "Top esportivo verde com sustentacao e estilo",
  },
  {
    id: 8,
    name: "Short Dusell",
    price: "R$ 191,90",
    priceValue: 191.9,
    images: ["/products/11.jpg"],
    description: "Short com bolso lateral para celular",
  },
  {
    id: 9,
    name: "Legging Dusell",
    price: "R$ 285,90",
    priceValue: 285.9,
    images: ["/products/12.jpg"],
    description: "Legging com bolso e tecido brilhoso de alta compressao",
  },
  {
    id: 10,
    name: "Short Sobreposto",
    price: "R$ 262,90",
    priceValue: 262.9,
    images: ["/products/13.jpg"],
    description: "Short sobreposto, estilo e liberdade de movimento",
  },
  {
    id: 11,
    name: "Conjunto Top + Short Rosa",
    price: "Top R$ 189,90 / Short R$ 191,90",
    priceValue: 380.8,
    images: ["/products/14.jpg"],
    description: "Conjunto combinando top e short na cor rosa",
  },
  {
    id: 12,
    name: "Macacao Preto",
    price: "R$ 339,90",
    priceValue: 339.9,
    images: ["/products/15.jpg"],
    description: "Macacao preto classico, elegancia para seus treinos",
  },
];
