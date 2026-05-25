import Image from "next/image";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InteractivePlan from "./InteractivePlan";

export const metadata: Metadata = {
  title: "Proposta de Layout — Nova Loja | Gym Love",
  description: "Proposta visual de layout para o novo espaço da Gym Love em Boa Vista.",
  robots: { index: false, follow: false },
};

type Zone = {
  id: string;
  num: string;
  title: string;
  desc: string;
  bullets: string[];
};

const zones: Zone[] = [
  {
    id: "vitrine",
    num: "01",
    title: "Vitrine",
    desc:
      "Plataforma elevada com 4 manequins voltados para a rua e backdrop branded — ocupa a porção do vidro à esquerda da porta de entrada, aproveitando o pé-direito maior.",
    bullets: [
      "Painel '@GYMLOVEBV' atrás dos manequins",
      "Placa azul 'GYM LOVE!' suspensa do teto, visível da calçada",
      "Spots direcionados aos manequins",
    ],
  },
  {
    id: "esquerda",
    num: "03",
    title: "Parede esquerda — Feminino",
    desc:
      "Araras contínuas até a altura do olhar, reaproveitando as gôndolas pretas atuais. Tipografia gold 'GYM LOVE!' no topo da parede, repetindo o look da loja atual.",
    bullets: [
      "Sub-prateleiras inferiores para sacolas Gym Love",
      "Espelho de corpo inteiro no fim do percurso",
    ],
  },
  {
    id: "direita",
    num: "04",
    title: "Parede direita — Masculino + Acessórios",
    desc:
      "Araras de masculino na parte central da parede direita; acessórios (boné, garrafa, meia, mochila) em prateleiras baixas próximas à vitrine.",
    bullets: [
      "Espelho de corpo inteiro no fim do percurso",
      "Prateleiras baixas para itens pequenos",
    ],
  },
  {
    id: "caixa",
    num: "05",
    title: "Caixa & atendimento",
    desc:
      "Balcão de mármore L-shape no fundo-direito + paredinha de mármore atrás do operador com letreiro 'GYM LOVE!' em gold e tira LED dourada vertical na lateral — as 3 assinaturas visuais que vocês já têm hoje.",
    bullets: [
      "Linha de visão da porta até o balcão",
      "Paredinha funciona como divisor visual e backdrop fotográfico",
      "Tomada planejada para POS e impressora",
    ],
  },
  {
    id: "provadores",
    num: "06",
    title: "Provadores",
    desc:
      "Duas cabines com o arco característico e cortina, encostadas no fundo do salão na região central — entre a porta de serviço (esquerda) e o caixa (direita).",
    bullets: [
      "Banco de espera externo para acompanhantes",
      "Gancho duplo e prateleira interna por cabine",
    ],
  },
  {
    id: "banheiro",
    num: "07",
    title: "Banheiro",
    desc:
      "Sala partitionada no canto fundo-esquerdo da loja, oposta à porta de entrada. Vaso e pia internos, porta interior dando para o salão.",
    bullets: [
      "Partição com paredes leves (drywall)",
      "Porta pintada no tom da parede para ficar discreta",
    ],
  },
];

const identidadeItens = [
  "Balcão de mármore com base preta metálica",
  "Parede azul de fundo do caixa",
  "Tira LED dourada vertical",
  "Letreiro 'GYM LOVE!' em gold",
  "Provadores com arco e cortina",
  "Plataforma elevada de manequins",
  "Gôndolas pretas de arara",
];

const fachadaItens = [
  {
    t: "Logo grande no tijolinho",
    d: "A faixa de tijolo acima do vidro está vazia — é o lugar natural para o letreiro 'GYM LOVE!' em tamanho generoso, visível de longe.",
  },
  {
    t: "Adesivos no vidro",
    d: "Letreiro 'GYM LOVE!' em gold + @gymlovebv aplicados internamente no vidro, sem cobrir a vitrine.",
  },
  {
    t: "Plantas no jardim da frente",
    d: "Vasos com folhagem amaciam a calçada e convidam o cliente a se aproximar do vidro.",
  },
  {
    t: "Refletor noturno no tijolo",
    d: "Luz quente subindo na parede de tijolo destaca a loja à noite — diferencial real numa rua de movimento.",
  },
];

const resumoStats = [
  {
    num: "100%",
    label: "da identidade preservada",
    desc: "Mármore, azul, gold, arco — tudo viaja para o novo espaço.",
  },
  {
    num: "+ largo",
    label: "fluxo de circulação",
    desc: "Cliente passa pelas 2 paredes antes de chegar ao caixa.",
  },
  {
    num: "Vitrine",
    label: "visível da rua",
    desc: "Pé-direito alto permite display mais dramático.",
  },
  {
    num: "7 zonas",
    label: "bem separadas",
    desc: "Vitrine, salão, caixa, provador e estoque distintos.",
  },
];

export default function NovaLojaPage() {
  return (
    <>
      <Header />
      <main className="bg-brand-white">
        {/* Hero */}
        <section className="relative h-[420px] sm:h-[560px] lg:h-[640px] overflow-hidden">
          <Image
            src="/nova-loja/nova-fachada-frontal.jpeg"
            alt="Nova loja - fachada de rua"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/30 via-brand-dark/40 to-brand-dark/85" />
          <div className="relative h-full flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-16 lg:pb-20">
            <span className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-brand-gold-light mb-3">
              Proposta de Layout
            </span>
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[0.95]">
              Nova Loja
              <br />
              <span className="text-brand-teal">Gym Love</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-zinc-200 max-w-2xl leading-relaxed">
              Mais largura, fachada de rua, pé-direito maior — e a mesma identidade
              visual (mármore, azul, dourado, arco) que vocês já construíram.
            </p>
          </div>
        </section>

        {/* Comparativo */}
        <section className="border-y border-zinc-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
              <div>
                <span className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500 mb-3">
                  Loja atual
                </span>
                <h2 className="font-display text-2xl sm:text-3xl text-brand-dark mb-4 leading-tight">
                  Corredor de shopping, estreita
                </h2>
                <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                  Vitrine com 3 manequins, balcão de mármore central, arara nas paredes laterais,
                  provador no fundo. Funciona, mas o espaço comprime a circulação.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <ImgFrame src="/nova-loja/atual-fachada-vitrine.jpeg" alt="Vitrine atual" />
                  <ImgFrame src="/nova-loja/atual-balcao-1.jpeg" alt="Balcão atual" />
                </div>
              </div>
              <div>
                <span className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-brand-teal mb-3">
                  Novo espaço
                </span>
                <h2 className="font-display text-2xl sm:text-3xl text-brand-dark mb-4 leading-tight">
                  Fachada de rua, retangular e mais ampla
                </h2>
                <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                  Vidro do chão ao teto, porta de entrada à direita e banheiro partitionado
                  no fundo-esquerdo dentro da loja. Paredes brancas, piso claro, iluminação
                  já instalada.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <ImgFrame src="/nova-loja/nova-interior-1.jpeg" alt="Interior novo - vista 1" />
                  <ImgFrame src="/nova-loja/nova-interior-2.jpeg" alt="Interior novo - vista 2" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Planta baixa */}
        <section className="bg-brand-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="text-center mb-10 sm:mb-12">
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-brand-teal mb-3">
                Planta interativa
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-brand-dark leading-tight">
                Mexa, redimensione, veja em 3D
              </h2>
              <p className="mt-3 text-sm sm:text-base text-zinc-600 max-w-2xl mx-auto">
                Clique em qualquer móvel para selecionar — arraste para mover, puxe as alças
                para redimensionar. Alterne entre vista de cima e 3D no topo do quadro.
              </p>
            </div>

            <InteractivePlan />
          </div>
        </section>

        {/* Zonas detalhadas */}
        <section className="bg-zinc-50 border-y border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="text-center mb-12">
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-brand-teal mb-3">
                Zonas
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-brand-dark leading-tight">
                Sete áreas, um fluxo
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {zones.map((z) => (
                <div
                  key={z.id}
                  className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm hover:shadow-md hover:border-brand-teal/30 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-display text-3xl text-brand-teal/30 leading-none">
                      {z.num}
                    </span>
                    <h3 className="text-lg font-bold text-brand-dark">{z.title}</h3>
                  </div>
                  <p className="text-sm text-zinc-600 leading-relaxed mb-4">{z.desc}</p>
                  <ul className="space-y-2">
                    {z.bullets.map((b, i) => (
                      <li key={i} className="text-xs text-zinc-500 flex gap-2.5 leading-relaxed items-start">
                        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-brand-teal mt-1.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Identidade visual */}
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <span className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-brand-teal mb-3">
                  Identidade visual
                </span>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-brand-dark leading-tight mb-6">
                  Tudo o que já é Gym Love
                  <br />
                  continua sendo Gym Love
                </h2>
                <p className="text-sm sm:text-base text-zinc-600 leading-relaxed mb-8">
                  A proposta não exige reformar móveis. Os elementos visuais da loja atual viajam
                  para o novo espaço — só que agora com mais respiro entre eles.
                </p>
                <ul className="space-y-3">
                  {identidadeItens.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <span className="w-6 h-6 rounded-full bg-brand-teal/10 text-brand-teal flex items-center justify-center shrink-0">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-zinc-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 aspect-[4/3] relative rounded-2xl overflow-hidden bg-zinc-100">
                  <Image
                    src="/nova-loja/atual-balcao-2.jpeg"
                    alt="Balcão atual com letreiro, LED dourada e provador"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square relative rounded-2xl overflow-hidden bg-zinc-100">
                  <Image
                    src="/nova-loja/atual-fachada-1.jpeg"
                    alt="Vitrine atual"
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square relative rounded-2xl overflow-hidden bg-zinc-100">
                  <Image
                    src="/nova-loja/atual-balcao-1.jpeg"
                    alt="Balcão atual detalhe"
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fachada */}
        <section className="bg-brand-dark text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="order-2 lg:order-1 relative aspect-[4/5] rounded-2xl overflow-hidden">
                <Image
                  src="/nova-loja/nova-fachada-rua.jpeg"
                  alt="Nova fachada vista da rua"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="order-1 lg:order-2">
                <span className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-brand-gold-light mb-3">
                  Fachada externa
                </span>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-6">
                  Quatro ajustes de baixo custo e alto impacto
                </h2>
                <ol className="space-y-5">
                  {fachadaItens.map((item, i) => (
                    <li key={item.t} className="flex gap-4">
                      <span className="font-display text-3xl text-brand-gold-light leading-none w-10 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h4 className="text-base font-semibold text-white mb-1">{item.t}</h4>
                        <p className="text-sm text-zinc-400 leading-relaxed">{item.d}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* Resumo */}
        <section className="bg-brand-teal-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="text-center mb-12">
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-brand-teal-dark mb-3">
                Por que funciona
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-brand-dark leading-tight">
                Resumo
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {resumoStats.map((s) => (
                <div key={s.label} className="bg-white rounded-2xl p-6">
                  <div className="font-display text-3xl sm:text-4xl text-brand-teal mb-2">
                    {s.num}
                  </div>
                  <div className="text-sm font-semibold text-brand-dark mb-1">{s.label}</div>
                  <div className="text-xs text-zinc-500 leading-relaxed">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ImgFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-zinc-100">
      <Image src={src} alt={alt} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
    </div>
  );
}

