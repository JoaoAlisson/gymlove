"use client";

import { useState, useRef, useCallback } from "react";

type Category = "shell" | "display" | "rack" | "counter" | "fitting";

type Item = {
  id: string;
  num?: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  baseZ?: number;
  fill: string;
  category: Category;
  rounded?: boolean;
  gender?: "female" | "male";
};

const DEFAULT_ROOM = { x: 40, y: 50, w: 820, h: 600 };

const DEFAULT_ITEMS: Item[] = [
  { id: "porta-entrada", label: "Porta de entrada", x: 680, y: 46, w: 130, h: 10, z: 8, fill: "#1A1A2E", category: "shell" },
  { id: "porta-wc", label: "Porta do banheiro", x: 130, y: 476, w: 80, h: 10, z: 8, fill: "#1A1A2E", category: "shell" },
  { id: "banheiro", num: "07", label: "Banheiro", x: 40, y: 480, w: 180, h: 170, z: 240, fill: "#E8E8E8", category: "shell" },
  { id: "vaso", label: "Vaso", x: 60, y: 580, w: 40, h: 45, z: 40, fill: "#FAFAFA", category: "counter" },
  { id: "pia", label: "Pia", x: 145, y: 495, w: 50, h: 24, z: 85, fill: "#FAFAFA", category: "counter" },
  { id: "vitrine", num: "01", label: "Vitrine", x: 100, y: 70, w: 560, h: 90, z: 40, fill: "#0BBCB7", category: "display" },
  { id: "manequim-1", label: "Manequim feminino 1", x: 200, y: 95, w: 28, h: 28, z: 170, baseZ: 40, fill: "#F0EDE7", category: "display", rounded: true, gender: "female" },
  { id: "manequim-2", label: "Manequim masculino", x: 370, y: 95, w: 32, h: 32, z: 178, baseZ: 40, fill: "#F0EDE7", category: "display", rounded: true, gender: "male" },
  { id: "manequim-3", label: "Manequim feminino 2", x: 540, y: 95, w: 28, h: 28, z: 170, baseZ: 40, fill: "#F0EDE7", category: "display", rounded: true, gender: "female" },
  { id: "feminino", num: "03", label: "Feminino", x: 50, y: 200, w: 55, h: 270, z: 200, fill: "#1A1A2E", category: "rack" },
  { id: "acessorios", num: "04", label: "Acessórios", x: 795, y: 180, w: 55, h: 130, z: 160, fill: "#C9A94E", category: "rack" },
  { id: "masculino", num: "04", label: "Masculino", x: 795, y: 320, w: 55, h: 200, z: 200, fill: "#1A1A2E", category: "rack" },
  { id: "caixa", num: "05", label: "Caixa", x: 540, y: 450, w: 240, h: 100, z: 110, fill: "#FAFAFA", category: "counter" },
  { id: "paredinha-logo", num: "05", label: "Painel GYM LOVE!", x: 540, y: 558, w: 200, h: 14, z: 220, fill: "#FAFAFA", category: "counter" },
  { id: "led-dourada", label: "LED dourada", x: 746, y: 558, w: 6, h: 14, z: 240, fill: "#C9A94E", category: "counter" },
  { id: "cadeira-cliente", label: "Cadeira cliente", x: 575, y: 400, w: 36, h: 36, z: 90, fill: "#3A3A40", category: "counter", rounded: true },
  { id: "provador-1", num: "06", label: "Provador 1", x: 260, y: 540, w: 60, h: 110, z: 220, fill: "#0BBCB7", category: "fitting", rounded: true },
  { id: "provador-2", num: "06", label: "Provador 2", x: 335, y: 540, w: 60, h: 110, z: 220, fill: "#0BBCB7", category: "fitting", rounded: true },
];

type Room = { x: number; y: number; w: number; h: number };

type DragMode = "move" | "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w";

type DragState = {
  itemId: string;
  mode: DragMode;
  startX: number;
  startY: number;
  startItem: Item;
};

const MIN_SIZE = 20;
const ISO_COS = Math.cos(Math.PI / 6);
const ISO_SIN = Math.sin(Math.PI / 6);

function isoProject(x: number, y: number, z: number) {
  return { x: (x - y) * ISO_COS, y: (x + y) * ISO_SIN - z };
}

function shade(hex: string, factor: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, Math.min(255, Math.round(((n >> 16) & 0xff) * factor)));
  const g = Math.max(0, Math.min(255, Math.round(((n >> 8) & 0xff) * factor)));
  const b = Math.max(0, Math.min(255, Math.round((n & 0xff) * factor)));
  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}

function textColorOn(item: Item): string {
  if (item.category === "shell") return "#FFFFFF";
  if (item.category === "rack") return "#FAFAFA";
  return "#1A1A2E";
}

const RESIZE_HANDLES: Array<{ mode: DragMode; dx: number; dy: number; cursor: string }> = [
  { mode: "nw", dx: 0, dy: 0, cursor: "nwse-resize" },
  { mode: "n", dx: 0.5, dy: 0, cursor: "ns-resize" },
  { mode: "ne", dx: 1, dy: 0, cursor: "nesw-resize" },
  { mode: "e", dx: 1, dy: 0.5, cursor: "ew-resize" },
  { mode: "se", dx: 1, dy: 1, cursor: "nwse-resize" },
  { mode: "s", dx: 0.5, dy: 1, cursor: "ns-resize" },
  { mode: "sw", dx: 0, dy: 1, cursor: "nesw-resize" },
  { mode: "w", dx: 0, dy: 0.5, cursor: "ew-resize" },
];

async function downloadSvgAsPng(svgEl: SVGSVGElement, filename: string) {
  const rect = svgEl.getBoundingClientRect();
  const scale = 2;
  const W = Math.max(1, Math.round(rect.width * scale));
  const H = Math.max(1, Math.round(rect.height * scale));

  const clone = svgEl.cloneNode(true) as SVGSVGElement;
  if (!clone.getAttribute("xmlns")) clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  if (!clone.getAttribute("xmlns:xlink"))
    clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  clone.setAttribute("width", String(W));
  clone.setAttribute("height", String(H));

  // Replace CSS variable fonts with concrete fallbacks so the rasterizer can render them
  const texts = clone.querySelectorAll("text");
  texts.forEach((t) => {
    const styleAttr = t.getAttribute("style") || "";
    if (styleAttr.includes("playfair")) {
      t.setAttribute(
        "style",
        styleAttr.replace(/var\(--font-playfair\)[^,;]*/g, '"Playfair Display", Georgia, serif')
      );
    }
    if (styleAttr.includes("inter")) {
      t.setAttribute(
        "style",
        styleAttr.replace(/var\(--font-inter\)[^,;]*/g, "Inter, system-ui, sans-serif")
      );
    }
  });

  const svgString = new XMLSerializer().serializeToString(clone);
  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);

  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Falha ao renderizar SVG"));
    img.src = svgUrl;
  });

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    URL.revokeObjectURL(svgUrl);
    return;
  }
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, W, H);
  ctx.drawImage(img, 0, 0, W, H);
  URL.revokeObjectURL(svgUrl);

  await new Promise<void>((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve();
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => {
        URL.revokeObjectURL(url);
        resolve();
      }, 300);
    }, "image/png");
  });
}

export default function InteractivePlan() {
  const [items, setItems] = useState<Item[]>(DEFAULT_ITEMS);
  const [room, setRoom] = useState<Room>(DEFAULT_ROOM);
  const [view, setView] = useState<"top" | "3d">("top");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const dragRef = useRef<DragState | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const facadeRef = useRef<SVGSVGElement | null>(null);

  const updateItem = useCallback((id: string, partial: Partial<Item>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...partial } : it)));
  }, []);

  const reset = () => {
    setItems(DEFAULT_ITEMS);
    setRoom(DEFAULT_ROOM);
    setSelectedId(null);
  };

  const clientToSvg = (svg: SVGSVGElement, clientX: number, clientY: number) => {
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const p = pt.matrixTransform(ctm.inverse());
    return { x: p.x, y: p.y };
  };

  const handlePointerDown = (e: React.PointerEvent<SVGElement>, item: Item, mode: DragMode) => {
    e.stopPropagation();
    if (!svgRef.current) return;
    const target = e.currentTarget as Element & { setPointerCapture?: (id: number) => void };
    target.setPointerCapture?.(e.pointerId);
    const pt = clientToSvg(svgRef.current, e.clientX, e.clientY);
    dragRef.current = { itemId: item.id, mode, startX: pt.x, startY: pt.y, startItem: { ...item } };
    setSelectedId(item.id);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGElement>) => {
    if (!dragRef.current || !svgRef.current) return;
    const d = dragRef.current;
    const pt = clientToSvg(svgRef.current, e.clientX, e.clientY);
    const dx = pt.x - d.startX;
    const dy = pt.y - d.startY;
    const s = d.startItem;

    let next: Partial<Item> = {};
    switch (d.mode) {
      case "move":
        next = { x: s.x + dx, y: s.y + dy };
        break;
      case "se":
        next = { w: Math.max(MIN_SIZE, s.w + dx), h: Math.max(MIN_SIZE, s.h + dy) };
        break;
      case "sw": {
        const nw = Math.max(MIN_SIZE, s.w - dx);
        next = { x: s.x + (s.w - nw), w: nw, h: Math.max(MIN_SIZE, s.h + dy) };
        break;
      }
      case "ne": {
        const nh = Math.max(MIN_SIZE, s.h - dy);
        next = { y: s.y + (s.h - nh), w: Math.max(MIN_SIZE, s.w + dx), h: nh };
        break;
      }
      case "nw": {
        const nw = Math.max(MIN_SIZE, s.w - dx);
        const nh = Math.max(MIN_SIZE, s.h - dy);
        next = { x: s.x + (s.w - nw), y: s.y + (s.h - nh), w: nw, h: nh };
        break;
      }
      case "e":
        next = { w: Math.max(MIN_SIZE, s.w + dx) };
        break;
      case "w": {
        const nw = Math.max(MIN_SIZE, s.w - dx);
        next = { x: s.x + (s.w - nw), w: nw };
        break;
      }
      case "n": {
        const nh = Math.max(MIN_SIZE, s.h - dy);
        next = { y: s.y + (s.h - nh), h: nh };
        break;
      }
      case "s":
        next = { h: Math.max(MIN_SIZE, s.h + dy) };
        break;
    }

    updateItem(d.itemId, next);
  };

  const handlePointerUp = (e: React.PointerEvent<SVGElement>) => {
    if (!dragRef.current) return;
    try {
      const target = e.currentTarget as Element & { releasePointerCapture?: (id: number) => void };
      target.releasePointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
    dragRef.current = null;
  };

  const selectedItem = items.find((i) => i.id === selectedId) || null;

  return (
    <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-zinc-200 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-lg">
          {(["top", "3d"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-colors ${
                view === v ? "bg-white text-brand-dark shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {v === "top" ? "Vista de cima" : "Vista 3D"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span className="hidden lg:inline">
            {view === "top"
              ? "Clique e arraste para mover · alças redimensionam"
              : "Edite na vista de cima"}
          </span>
          <button
            type="button"
            onClick={async () => {
              if (downloading) return;
              setDownloading(true);
              try {
                const ts = new Date()
                  .toISOString()
                  .replace(/[:.]/g, "-")
                  .slice(0, 16);
                if (svgRef.current) {
                  await downloadSvgAsPng(
                    svgRef.current,
                    `gymlove-${view === "top" ? "vista-cima" : "vista-3d"}-${ts}.png`
                  );
                }
                if (facadeRef.current) {
                  await downloadSvgAsPng(
                    facadeRef.current,
                    `gymlove-fachada-${ts}.png`
                  );
                }
              } catch (e) {
                console.error("Erro ao baixar:", e);
              } finally {
                setDownloading(false);
              }
            }}
            disabled={downloading}
            className="px-3 py-1.5 rounded-md text-xs font-semibold bg-brand-teal text-white hover:bg-brand-teal-dark transition-colors disabled:opacity-60 disabled:cursor-wait flex items-center gap-1.5"
          >
            {downloading ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.3" />
                  <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Baixando…
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
                </svg>
                Baixar PNG
              </>
            )}
          </button>
          <button
            type="button"
            onClick={reset}
            className="px-3 py-1.5 rounded-md text-xs font-semibold bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-brand-teal/40 transition-colors"
          >
            Restaurar
          </button>
        </div>
      </div>

      {/* Selected item editor OR room editor */}
      {view === "top" && selectedItem && (
        <SelectedEditor
          item={selectedItem}
          onChange={(p) => updateItem(selectedItem.id, p)}
          onClose={() => setSelectedId(null)}
        />
      )}
      {view === "top" && !selectedItem && (
        <RoomEditor room={room} onChange={(p) => setRoom({ ...room, ...p })} />
      )}

      {/* Canvas */}
      <div className="p-3 sm:p-6 bg-gradient-to-b from-zinc-50 to-zinc-100">
        {view === "top" ? (
          <TopView
            svgRef={svgRef}
            items={items}
            room={room}
            selectedId={selectedId}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onBackgroundClick={() => setSelectedId(null)}
          />
        ) : (
          <Iso3DView items={items} room={room} selectedId={selectedId} onSelect={setSelectedId} />
        )}
      </div>

      {/* Facade — always visible below */}
      <div className="border-t border-zinc-200 bg-white">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-teal">
              Fachada
            </span>
            <span className="text-xs text-zinc-400">
              Elevação vista da rua — atualiza com a planta
            </span>
          </div>
        </div>
        <div className="p-3 sm:p-6 bg-gradient-to-b from-zinc-50 to-zinc-100">
          <FacadeView items={items} room={room} svgRef={facadeRef} />
        </div>
      </div>

      {/* Legend */}
      <div className="border-t border-zinc-200 px-4 sm:px-6 py-4 bg-white">
        <Legend />
      </div>
    </div>
  );
}

function SelectedEditor({
  item,
  onChange,
  onClose,
}: {
  item: Item;
  onChange: (p: Partial<Item>) => void;
  onClose: () => void;
}) {
  return (
    <div className="px-4 sm:px-6 py-3 bg-brand-teal/5 border-b border-brand-teal/20 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
      <div className="flex items-center gap-2 mr-2">
        <span
          className="w-3 h-3 rounded-full border border-zinc-300"
          style={{ backgroundColor: item.fill }}
        />
        <span className="font-semibold text-brand-dark text-sm">{item.label}</span>
      </div>
      <NumInput label="X" value={item.x} onChange={(v) => onChange({ x: v })} />
      <NumInput label="Y" value={item.y} onChange={(v) => onChange({ y: v })} />
      <NumInput label="L" value={item.w} onChange={(v) => onChange({ w: Math.max(MIN_SIZE, v) })} />
      <NumInput label="A" value={item.h} onChange={(v) => onChange({ h: Math.max(MIN_SIZE, v) })} />
      <NumInput label="Alt 3D" value={item.z} onChange={(v) => onChange({ z: Math.max(5, v) })} />
      <button
        type="button"
        onClick={onClose}
        className="ml-auto text-xs text-zinc-500 hover:text-zinc-800 underline-offset-2 hover:underline"
      >
        deselecionar
      </button>
    </div>
  );
}

function NumInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex items-center gap-1.5 text-[11px] text-zinc-600">
      <span className="font-semibold uppercase tracking-wider">{label}</span>
      <input
        type="number"
        value={Math.round(value)}
        onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
        className="w-16 px-2 py-1 rounded border border-zinc-200 bg-white text-zinc-700 text-xs focus:outline-none focus:ring-2 focus:ring-brand-teal/40 focus:border-brand-teal/40"
      />
    </label>
  );
}

function TopView({
  svgRef,
  items,
  room,
  selectedId,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onBackgroundClick,
}: {
  svgRef: React.MutableRefObject<SVGSVGElement | null>;
  items: Item[];
  room: Room;
  selectedId: string | null;
  onPointerDown: (e: React.PointerEvent<SVGElement>, item: Item, mode: DragMode) => void;
  onPointerMove: (e: React.PointerEvent<SVGElement>) => void;
  onPointerUp: (e: React.PointerEvent<SVGElement>) => void;
  onBackgroundClick: () => void;
}) {
  const pad = 30;
  const vbX = room.x - pad;
  const vbY = room.y - pad;
  const vbW = room.w + pad * 2;
  const vbH = room.h + pad * 2 + 20;

  return (
    <svg
      ref={svgRef}
      viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
      className="w-full h-auto touch-none select-none"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <rect
        x={vbX}
        y={vbY}
        width={vbW}
        height={vbH}
        fill="transparent"
        onPointerDown={onBackgroundClick}
      />

      {/* Outer walls */}
      <rect
        x={room.x}
        y={room.y}
        width={room.w}
        height={room.h}
        fill="#FAFAFA"
        stroke="#1A1A2E"
        strokeWidth="3"
        rx="4"
        pointerEvents="none"
      />

      {/* Glass facade indicator */}
      <line
        x1={room.x}
        y1={room.y}
        x2={room.x + room.w}
        y2={room.y}
        stroke="#0BBCB7"
        strokeWidth="6"
        strokeDasharray="2 6"
        pointerEvents="none"
      />

      <text
        x={room.x + room.w / 2}
        y={room.y - 14}
        textAnchor="middle"
        fill="#0BBCB7"
        fontSize="11"
        fontWeight="700"
        letterSpacing="3"
        pointerEvents="none"
      >
        FRENTE • VIDRO • RUA
      </text>
      <text
        x={room.x + room.w / 2}
        y={room.y + room.h + 22}
        textAnchor="middle"
        fill="#1A1A2E"
        fontSize="10"
        fontWeight="700"
        letterSpacing="3"
        opacity="0.4"
        pointerEvents="none"
      >
        FUNDO
      </text>

      {items.map((item) => (
        <PlanItem
          key={item.id}
          item={item}
          selected={item.id === selectedId}
          onPointerDown={onPointerDown}
        />
      ))}
    </svg>
  );
}

function PlanItem({
  item,
  selected,
  onPointerDown,
}: {
  item: Item;
  selected: boolean;
  onPointerDown: (e: React.PointerEvent<SVGElement>, item: Item, mode: DragMode) => void;
}) {
  const opacity =
    item.category === "shell" ? 0.85 : item.category === "counter" ? 0.55 : 0.36;
  const rx = item.rounded ? Math.min(item.w, item.h) / 2 : 4;
  const labelFits = item.w >= 60 && item.h >= 22;
  const strokeColor = shade(item.fill, item.category === "counter" ? 0.45 : 0.55);

  return (
    <g>
      <rect
        x={item.x}
        y={item.y}
        width={item.w}
        height={item.h}
        fill={item.fill}
        opacity={opacity}
        stroke={strokeColor}
        strokeWidth={1.5}
        rx={rx}
        style={{ cursor: "move" }}
        onPointerDown={(e) => onPointerDown(e, item, "move")}
      />

      {item.num && item.w >= 36 && item.h >= 28 && (
        <g pointerEvents="none">
          <circle cx={item.x + 14} cy={item.y + 14} r="10" fill={item.fill} />
          <text
            x={item.x + 14}
            y={item.y + 18}
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="10"
            fontWeight="800"
          >
            {item.num}
          </text>
        </g>
      )}

      {labelFits && (
        <text
          x={item.x + item.w / 2}
          y={item.y + item.h / 2 + 4}
          textAnchor="middle"
          fill={textColorOn(item)}
          fontSize="11"
          fontWeight="700"
          pointerEvents="none"
        >
          {item.label.toUpperCase()}
        </text>
      )}

      {!labelFits && (
        <text
          x={item.x + item.w / 2}
          y={item.y - 6}
          textAnchor="middle"
          fill="#1A1A2E"
          fontSize="9"
          fontWeight="600"
          pointerEvents="none"
        >
          {item.label}
        </text>
      )}

      {selected && (
        <>
          <rect
            x={item.x - 4}
            y={item.y - 4}
            width={item.w + 8}
            height={item.h + 8}
            fill="none"
            stroke="#0BBCB7"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            rx={rx + 3}
            pointerEvents="none"
          />
          {RESIZE_HANDLES.map((h) => (
            <rect
              key={h.mode}
              x={item.x + h.dx * item.w - 5}
              y={item.y + h.dy * item.h - 5}
              width="10"
              height="10"
              fill="#FFFFFF"
              stroke="#0BBCB7"
              strokeWidth="1.5"
              style={{ cursor: h.cursor }}
              onPointerDown={(e) => onPointerDown(e, item, h.mode)}
            />
          ))}
        </>
      )}
    </g>
  );
}

function Iso3DView({
  items,
  room,
  selectedId,
  onSelect,
}: {
  items: Item[];
  room: Room;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  // Compute iso bounds for viewBox
  const corners: Array<{ x: number; y: number }> = [];
  const allItems = [
    ...items,
    {
      id: "_room",
      x: room.x,
      y: room.y,
      w: room.w,
      h: room.h,
      z: 260,
    } as Item,
  ];
  for (const it of allItems) {
    const base = it.baseZ || 0;
    for (const z of [base, base + it.z]) {
      corners.push(isoProject(it.x, it.y, z));
      corners.push(isoProject(it.x + it.w, it.y, z));
      corners.push(isoProject(it.x + it.w, it.y + it.h, z));
      corners.push(isoProject(it.x, it.y + it.h, z));
    }
  }
  const minX = Math.min(...corners.map((c) => c.x));
  const maxX = Math.max(...corners.map((c) => c.x));
  const minY = Math.min(...corners.map((c) => c.y));
  const maxY = Math.max(...corners.map((c) => c.y));
  const PAD = 30;

  const vbX = minX - PAD;
  const vbY = minY - PAD;
  const vbW = maxX - minX + PAD * 2;
  const vbH = maxY - minY + PAD * 2;

  // Painter's order:
  // 1. Group by baseZ ascending — items at ground level (baseZ=0) render first,
  //    elevated items (baseZ>0, like mannequins on the vitrine platform) after,
  //    so they always appear ON TOP of what they sit on.
  // 2. Within each group, sort by (x+y) depth — farthest from viewer first.
  const sorted = [...items].sort((a, b) => {
    const aB = a.baseZ || 0;
    const bB = b.baseZ || 0;
    if (aB !== bB) return aB - bB;
    const ad = a.x + a.w / 2 + (a.y + a.h / 2);
    const bd = b.x + b.w / 2 + (b.y + b.h / 2);
    return ad - bd;
  });

  // Floor and back walls
  const f1 = isoProject(room.x, room.y, 0);
  const f2 = isoProject(room.x + room.w, room.y, 0);
  const f3 = isoProject(room.x + room.w, room.y + room.h, 0);
  const f4 = isoProject(room.x, room.y + room.h, 0);

  const WALL_H = 240;
  // Back wall (+y face of room)
  const bw1 = isoProject(room.x, room.y + room.h, 0);
  const bw2 = isoProject(room.x + room.w, room.y + room.h, 0);
  const bw3 = isoProject(room.x + room.w, room.y + room.h, WALL_H);
  const bw4 = isoProject(room.x, room.y + room.h, WALL_H);
  // Right wall (+x face of room)
  const rw1 = isoProject(room.x + room.w, room.y, 0);
  const rw2 = isoProject(room.x + room.w, room.y + room.h, 0);
  const rw3 = isoProject(room.x + room.w, room.y + room.h, WALL_H);
  const rw4 = isoProject(room.x + room.w, room.y, WALL_H);

  // Front and left labels positions
  const frenteLabel = isoProject(room.x + room.w / 2, room.y, 0);
  const fundoLabel = isoProject(room.x + room.w / 2, room.y + room.h, 0);

  return (
    <svg viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`} className="w-full h-auto select-none">
      {/* Floor */}
      <polygon
        points={`${f1.x},${f1.y} ${f2.x},${f2.y} ${f3.x},${f3.y} ${f4.x},${f4.y}`}
        fill="#F0EFEB"
        stroke="#1A1A2E"
        strokeWidth="2"
      />

      {/* Floor grid */}
      <FloorGrid room={room} />

      {/* Back wall */}
      <polygon
        points={`${bw1.x},${bw1.y} ${bw2.x},${bw2.y} ${bw3.x},${bw3.y} ${bw4.x},${bw4.y}`}
        fill="#F5F5F5"
        stroke="#1A1A2E"
        strokeWidth="1.5"
      />
      {/* Right wall */}
      <polygon
        points={`${rw1.x},${rw1.y} ${rw2.x},${rw2.y} ${rw3.x},${rw3.y} ${rw4.x},${rw4.y}`}
        fill="#FAFAFA"
        stroke="#1A1A2E"
        strokeWidth="1.5"
      />

      {/* Items */}
      {sorted.map((item) => (
        <Iso3DBox
          key={item.id}
          item={item}
          selected={item.id === selectedId}
          onSelect={() => onSelect(item.id)}
        />
      ))}

      {/* Compass labels */}
      <text
        x={frenteLabel.x}
        y={frenteLabel.y - 14}
        textAnchor="middle"
        fill="#0BBCB7"
        fontSize="11"
        fontWeight="700"
        letterSpacing="3"
      >
        FRENTE
      </text>
      <text
        x={fundoLabel.x}
        y={fundoLabel.y + 22}
        textAnchor="middle"
        fill="#1A1A2E"
        fontSize="10"
        fontWeight="700"
        letterSpacing="3"
        opacity="0.4"
      >
        FUNDO
      </text>
    </svg>
  );
}

function FloorGrid({ room }: { room: Room }) {
  const lines: JSX.Element[] = [];
  const STEP = 50;
  for (let x = room.x + STEP; x < room.x + room.w; x += STEP) {
    const p1 = isoProject(x, room.y, 0);
    const p2 = isoProject(x, room.y + room.h, 0);
    lines.push(
      <line key={`vx-${x}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#1A1A2E" strokeWidth="0.4" opacity="0.1" />
    );
  }
  for (let y = room.y + STEP; y < room.y + room.h; y += STEP) {
    const p1 = isoProject(room.x, y, 0);
    const p2 = isoProject(room.x + room.w, y, 0);
    lines.push(
      <line key={`vy-${y}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#1A1A2E" strokeWidth="0.4" opacity="0.1" />
    );
  }
  return <g>{lines}</g>;
}

function Iso3DBox({
  item,
  selected,
  onSelect,
}: {
  item: Item;
  selected: boolean;
  onSelect: () => void;
}) {
  const { x, y, w, h, z, fill } = item;
  const baseZ = item.baseZ || 0;
  const topZ = baseZ + z;
  const c100 = isoProject(x + w, y, baseZ);
  const c110 = isoProject(x + w, y + h, baseZ);
  const c010 = isoProject(x, y + h, baseZ);
  const c001 = isoProject(x, y, topZ);
  const c101 = isoProject(x + w, y, topZ);
  const c111 = isoProject(x + w, y + h, topZ);
  const c011 = isoProject(x, y + h, topZ);

  const topFill = fill;
  const rightFill = shade(fill, 0.78);
  const backFill = shade(fill, 0.6);
  const stroke = selected ? "#0BBCB7" : shade(fill, 0.42);
  const strokeWidth = selected ? 2.5 : 0.8;

  const topCx = (c001.x + c101.x + c111.x + c011.x) / 4;
  const topCy = (c001.y + c101.y + c111.y + c011.y) / 4;

  return (
    <g onClick={onSelect} style={{ cursor: "pointer" }}>
      <polygon
        points={`${c100.x},${c100.y} ${c110.x},${c110.y} ${c111.x},${c111.y} ${c101.x},${c101.y}`}
        fill={rightFill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <polygon
        points={`${c010.x},${c010.y} ${c110.x},${c110.y} ${c111.x},${c111.y} ${c011.x},${c011.y}`}
        fill={backFill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <polygon
        points={`${c001.x},${c001.y} ${c101.x},${c101.y} ${c111.x},${c111.y} ${c011.x},${c011.y}`}
        fill={topFill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      {item.label && Math.min(w, h) >= 50 && (
        <text
          x={topCx}
          y={topCy + 4}
          textAnchor="middle"
          fill={textColorOn(item)}
          fontSize="10"
          fontWeight="700"
          pointerEvents="none"
        >
          {item.label.toUpperCase()}
        </text>
      )}
    </g>
  );
}

function RoomEditor({ room, onChange }: { room: Room; onChange: (p: Partial<Room>) => void }) {
  return (
    <div className="px-4 sm:px-6 py-3 bg-zinc-50 border-b border-zinc-200 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
      <div className="flex items-center gap-2 mr-2">
        <span className="w-3 h-3 rounded-sm border-2 border-brand-dark" />
        <span className="font-semibold text-brand-dark text-sm">Paredes externas</span>
      </div>
      <NumInput label="L" value={room.w} onChange={(v) => onChange({ w: Math.max(200, v) })} />
      <NumInput label="A" value={room.h} onChange={(v) => onChange({ h: Math.max(200, v) })} />
      <span className="text-xs text-zinc-400 ml-auto hidden sm:inline">
        clique em um móvel para selecioná-lo
      </span>
    </div>
  );
}

function FacadeView({
  items,
  room,
  svgRef,
}: {
  items: Item[];
  room: Room;
  svgRef?: React.MutableRefObject<SVGSVGElement | null>;
}) {
  const door = items.find((i) => i.id === "porta-entrada");
  const vitrine = items.find((i) => i.id === "vitrine");

  const FW = 1200;
  const FH = 820;
  const buildingX = 60;
  const buildingW = 1080;
  const skyH = 200;
  const brickY = skyH;
  const brickH = 110;
  const glassY = brickY + brickH;
  const glassH = 360;
  const groundY = glassY + glassH;
  const stepH = 18;
  const lawnH = 30;
  const sidewalkH = FH - groundY - lawnH;

  const mirror = (planX: number, planW: number) =>
    (room.x + room.w - planX - planW) / room.w;
  const doorFrac = door ? mirror(door.x, door.w) : 0.05;
  const doorWFrac = door ? door.w / room.w : 0.16;
  const doorX = buildingX + doorFrac * buildingW;
  const doorW = doorWFrac * buildingW;

  const vitrineXFrac = vitrine ? mirror(vitrine.x, vitrine.w) : 0.25;
  const vitrineWFrac = vitrine ? vitrine.w / room.w : 0.68;
  const vitrineStartX = buildingX + vitrineXFrac * buildingW;
  const vitrineEndX = vitrineStartX + vitrineWFrac * buildingW;

  const planMannequins = items.filter((i) => i.id.startsWith("manequim"));
  const facadeMannequins = planMannequins
    .map((m) => ({
      cx: buildingX + (mirror(m.x, m.w) + m.w / room.w / 2) * buildingW,
      id: m.id,
      gender: m.gender || "female",
    }))
    .sort((a, b) => a.cx - b.cx);

  const platformY = groundY - 70;
  const signCenterX = vitrineStartX + (vitrineEndX - vitrineStartX) / 2;
  const signY = glassY + 30;

  return (
    <svg ref={svgRef} viewBox={`0 0 ${FW} ${FH}`} className="w-full h-auto select-none">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1F324D" />
          <stop offset="0.45" stopColor="#3F5378" />
          <stop offset="0.8" stopColor="#7E94B1" />
          <stop offset="1" stopColor="#B4B5B0" />
        </linearGradient>
        <pattern id="brickPattern" patternUnits="userSpaceOnUse" width="48" height="14">
          <rect width="48" height="14" fill="#E8DCC4" />
          <rect x="0" y="0" width="24" height="7" fill="#DECEAE" opacity="0.5" />
          <rect x="24" y="7" width="24" height="7" fill="#DECEAE" opacity="0.5" />
          <rect x="6" y="0" width="6" height="7" fill="#D1BC92" opacity="0.35" />
          <rect x="34" y="7" width="4" height="7" fill="#D1BC92" opacity="0.4" />
          <line x1="0" y1="7" x2="48" y2="7" stroke="#B59C6E" strokeWidth="0.6" />
          <line x1="24" y1="0" x2="24" y2="7" stroke="#B59C6E" strokeWidth="0.6" />
          <line x1="0" y1="7" x2="0" y2="14" stroke="#B59C6E" strokeWidth="0.6" />
          <line x1="48" y1="7" x2="48" y2="14" stroke="#B59C6E" strokeWidth="0.6" />
        </pattern>
        <linearGradient id="glassTint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E5EEF2" stopOpacity="0.85" />
          <stop offset="0.55" stopColor="#C9D8DF" stopOpacity="0.7" />
          <stop offset="1" stopColor="#A7BBC4" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="glassReflection" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="0.4" stopColor="#FFFFFF" stopOpacity="0.45" />
          <stop offset="0.55" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lawnGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8FB572" />
          <stop offset="1" stopColor="#688F4F" />
        </linearGradient>
        <linearGradient id="sidewalkGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C4BFB7" />
          <stop offset="1" stopColor="#9F9A91" />
        </linearGradient>
        <linearGradient id="doorGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D6DDE2" stopOpacity="0.9" />
          <stop offset="1" stopColor="#9BA9B3" stopOpacity="0.9" />
        </linearGradient>
        <clipPath id="glassClip">
          <rect x={buildingX} y={glassY} width={buildingW} height={glassH} />
        </clipPath>
      </defs>

      {/* Sky */}
      <rect x="0" y="0" width={FW} height={skyH + 8} fill="url(#sky)" />

      {/* Distant clouds */}
      <ellipse cx={220} cy={70} rx={140} ry={10} fill="#FFFFFF" opacity="0.08" />
      <ellipse cx={900} cy={90} rx={200} ry={12} fill="#FFFFFF" opacity="0.06" />

      {/* Brick wall */}
      <rect x={buildingX} y={brickY} width={buildingW} height={brickH} fill="url(#brickPattern)" />
      <rect x={buildingX} y={brickY} width={buildingW} height="8" fill="#1A1A2E" opacity="0.15" />
      <rect
        x={buildingX}
        y={brickY}
        width={buildingW}
        height={brickH}
        fill="none"
        stroke="#1A1A2E"
        strokeWidth="2"
      />

      {/* Concrete band */}
      <rect x={buildingX - 6} y={brickY + brickH - 4} width={buildingW + 12} height="14" fill="#E8E2D6" />
      <rect x={buildingX - 6} y={brickY + brickH - 4} width={buildingW + 12} height="14" fill="none" stroke="#1A1A2E" strokeWidth="1.5" />

      {/* GYM LOVE! gold logo on brick wall */}
      <text
        x={FW / 2 + 2}
        y={brickY + brickH / 2 + 16}
        textAnchor="middle"
        fill="#1A1A2E"
        fontSize="46"
        fontWeight="900"
        opacity="0.18"
        style={{ fontFamily: "var(--font-playfair), serif", letterSpacing: "5px" }}
      >
        GYM LOVE!
      </text>
      <text
        x={FW / 2}
        y={brickY + brickH / 2 + 14}
        textAnchor="middle"
        fill="#C9A94E"
        fontSize="46"
        fontWeight="900"
        style={{ fontFamily: "var(--font-playfair), serif", letterSpacing: "5px" }}
      >
        GYM LOVE!
      </text>

      {/* Interior backdrop */}
      <rect x={buildingX} y={glassY} width={buildingW} height={glassH} fill="#FAFAF7" />
      <rect x={buildingX} y={glassY} width={buildingW} height="34" fill="#ECE9DF" />
      <rect x={buildingX} y={glassY + 30} width={buildingW} height="6" fill="#D0CCBE" opacity="0.6" />
      <rect x={buildingX} y={glassY + glassH - 24} width={buildingW} height="24" fill="#EFEBE0" />
      <line
        x1={buildingX}
        y1={glassY + glassH - 24}
        x2={buildingX + buildingW}
        y2={glassY + glassH - 24}
        stroke="#C9C2AE"
        strokeWidth="0.8"
      />
      {[0.18, 0.36, 0.54, 0.72, 0.9].map((f) => (
        <line
          key={f}
          x1={buildingX + buildingW * f}
          y1={glassY + glassH - 24}
          x2={buildingX + buildingW * f}
          y2={glassY + glassH}
          stroke="#C9C2AE"
          strokeWidth="0.5"
          opacity="0.6"
        />
      ))}

      {/* Center ceiling LED panel */}
      <rect
        x={buildingX + buildingW * 0.45}
        y={glassY + 10}
        width={buildingW * 0.1}
        height="6"
        fill="#FFFFFF"
        stroke="#D0CCBE"
        strokeWidth="0.6"
      />
      <ellipse
        cx={buildingX + buildingW * 0.5}
        cy={glassY + 70}
        rx={buildingW * 0.1}
        ry="55"
        fill="#FFF7DC"
        opacity="0.35"
      />

      {/* Track lighting downlights */}
      {[0.15, 0.28, 0.4, 0.6, 0.72, 0.85].map((f) => (
        <g key={f}>
          <rect
            x={buildingX + buildingW * f - 3}
            y={glassY + 14}
            width="6"
            height="6"
            fill="#3A3A40"
          />
          <circle
            cx={buildingX + buildingW * f}
            cy={glassY + 21}
            r="2.6"
            fill="#FFE6A8"
            opacity="0.95"
          />
          <ellipse
            cx={buildingX + buildingW * f}
            cy={glassY + 75}
            rx="22"
            ry="55"
            fill="#FFE2A0"
            opacity="0.06"
          />
        </g>
      ))}

      {/* Wall outlets */}
      {[0.18, 0.55, 0.84].map((f) => (
        <rect
          key={f}
          x={buildingX + buildingW * f - 5}
          y={glassY + glassH - 70}
          width="10"
          height="12"
          fill="#FFFFFF"
          stroke="#C0BBA8"
          strokeWidth="0.5"
        />
      ))}

      {/* Interior furniture visible through the glass (back-to-front depth order) */}
      <g clipPath="url(#glassClip)">
        {[...items]
          .filter((it) => {
            if (it.id === "vitrine") return false;
            if (it.id.startsWith("manequim")) return false;
            if (it.id === "porta-entrada") return false;
            if (it.id === "porta-wc") return false;
            return true;
          })
          .sort((a, b) => (b.y + b.h / 2) - (a.y + a.h / 2))
          .map((it) => (
            <InteriorPiece
              key={it.id}
              item={it}
              room={room}
              buildingX={buildingX}
              buildingW={buildingW}
              glassY={glassY}
              glassH={glassH}
              platformY={platformY}
            />
          ))}
      </g>

      {/* Glass tint */}
      <rect x={buildingX} y={glassY} width={buildingW} height={glassH} fill="url(#glassTint)" />

      {/* Hanging GYM LOVE! sign */}
      <line
        x1={signCenterX}
        y1={glassY}
        x2={signCenterX}
        y2={signY}
        stroke="#3A3A3A"
        strokeWidth="1.4"
      />
      <line
        x1={signCenterX - 60}
        y1={glassY}
        x2={signCenterX - 60}
        y2={signY + 4}
        stroke="#3A3A3A"
        strokeWidth="0.8"
        opacity="0.6"
      />
      <line
        x1={signCenterX + 60}
        y1={glassY}
        x2={signCenterX + 60}
        y2={signY + 4}
        stroke="#3A3A3A"
        strokeWidth="0.8"
        opacity="0.6"
      />
      <rect
        x={signCenterX - 130}
        y={signY}
        width="260"
        height="92"
        fill="#0BBCB7"
        stroke="#079590"
        strokeWidth="1.5"
        rx="6"
      />
      <text
        x={signCenterX}
        y={signY + 60}
        textAnchor="middle"
        fill="#C9A94E"
        fontSize="40"
        fontWeight="900"
        style={{ fontFamily: "var(--font-playfair), serif" }}
      >
        GYM LOVE!
      </text>

      {/* Vitrine platform */}
      <rect
        x={vitrineStartX}
        y={platformY}
        width={vitrineEndX - vitrineStartX}
        height="60"
        fill="#E5E1D6"
        stroke="#A89B82"
        strokeWidth="1"
      />
      <rect
        x={vitrineStartX}
        y={platformY}
        width={vitrineEndX - vitrineStartX}
        height="6"
        fill="#1A1A2E"
        opacity="0.15"
      />

      {/* Mannequins */}
      {facadeMannequins.map((m, i) => (
        <Mannequin
          key={m.id}
          x={m.cx}
          baseY={platformY}
          variant={i % 3}
          gender={m.gender as "female" | "male"}
        />
      ))}

      {/* Glass mullions */}
      {[0.18, 0.32, 0.46, 0.6, 0.74, 0.88].map((f) => (
        <rect
          key={f}
          x={buildingX + buildingW * f - 1.5}
          y={glassY}
          width="3"
          height={glassH}
          fill="#2A2A33"
          opacity="0.85"
        />
      ))}

      {/* Aluminum frames */}
      <rect x={buildingX - 4} y={glassY} width={buildingW + 8} height="10" fill="#3A3A40" />
      <rect x={buildingX - 4} y={glassY + glassH - 8} width={buildingW + 8} height="12" fill="#3A3A40" />

      {/* Glass reflection */}
      <rect
        x={buildingX}
        y={glassY}
        width={buildingW}
        height={glassH}
        fill="url(#glassReflection)"
        opacity="0.6"
      />

      {/* Door */}
      <DoorElement x={doorX} y={glassY} w={doorW} h={glassH} />

      {/* Building border */}
      <rect
        x={buildingX}
        y={brickY}
        width={buildingW}
        height={brickH + glassH}
        fill="none"
        stroke="#1A1A2E"
        strokeWidth="2.5"
      />

      {/* Side concrete columns */}
      <rect x={buildingX - 14} y={brickY} width="14" height={brickH + glassH} fill="#E8E2D6" />
      <rect x={buildingX - 14} y={brickY} width="14" height={brickH + glassH} fill="none" stroke="#1A1A2E" strokeWidth="1.5" />
      <rect x={buildingX + buildingW} y={brickY} width="14" height={brickH + glassH} fill="#E8E2D6" />
      <rect x={buildingX + buildingW} y={brickY} width="14" height={brickH + glassH} fill="none" stroke="#1A1A2E" strokeWidth="1.5" />

      {/* Address plaque */}
      <rect x={buildingX + buildingW - 90} y={glassY + 22} width="64" height="34" fill="#1A1A2E" rx="2" />
      <text
        x={buildingX + buildingW - 58}
        y={glassY + 46}
        textAnchor="middle"
        fill="#C9A94E"
        fontSize="20"
        fontWeight="800"
        style={{ fontFamily: "var(--font-playfair), serif" }}
      >
        77
      </text>

      {/* Concrete step in front of door */}
      <rect
        x={doorX - 26}
        y={groundY}
        width={doorW + 52}
        height={lawnH + stepH}
        fill="#D5CDB8"
        stroke="#9C947E"
        strokeWidth="1.2"
      />
      <rect
        x={doorX - 26}
        y={groundY}
        width={doorW + 52}
        height="5"
        fill="#1A1A2E"
        opacity="0.12"
      />
      <line
        x1={doorX - 26}
        y1={groundY + lawnH + stepH}
        x2={doorX + doorW + 26}
        y2={groundY + lawnH + stepH}
        stroke="#6E6856"
        strokeWidth="1.5"
      />

      {/* Lawn */}
      <LawnStrip
        groundY={groundY}
        lawnH={lawnH}
        gaps={[{ x1: doorX - 26, x2: doorX + doorW + 26 }]}
        fullWidth={FW}
      />

      {/* Planters */}
      <Planter cx={doorX - 50} groundY={groundY + lawnH} />
      <Planter cx={doorX + doorW + 50} groundY={groundY + lawnH} />

      {/* Drum sign */}
      <DrumSign cx={36} cy={brickY + brickH / 2 + 6} attachX={buildingX} />

      {/* Monolith */}
      <Monolith baseCx={doorX + doorW + 80} baseY={groundY + lawnH + stepH + 26} />

      {/* Sidewalk */}
      <rect
        x="0"
        y={groundY + lawnH}
        width={FW}
        height={sidewalkH}
        fill="url(#sidewalkGradient)"
      />
      <PaverPattern y={groundY + lawnH} width={FW} height={sidewalkH} />

      {/* Curb */}
      <rect
        x="0"
        y={groundY + lawnH}
        width={FW}
        height="4"
        fill="#1A1A2E"
        opacity="0.25"
      />
    </svg>
  );
}

function DoorElement({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const frameThickness = 6;
  const handleTopY = y + h * 0.5;
  const handleHeight = h * 0.22;
  return (
    <g>
      {/* Outer frame */}
      <rect x={x - frameThickness} y={y - 2} width={w + frameThickness * 2} height={h + 4} fill="#2A2A33" />
      {/* Door panels - 2 leaves */}
      <rect x={x} y={y + frameThickness} width={w / 2 - 2} height={h - frameThickness * 2} fill="url(#doorGlass)" />
      <rect x={x + w / 2 + 2} y={y + frameThickness} width={w / 2 - 2} height={h - frameThickness * 2} fill="url(#doorGlass)" />

      {/* Glass reflection on left leaf */}
      <rect x={x + 10} y={y + frameThickness + 20} width={w / 2 - 24} height={(h - frameThickness * 2 - 40) * 0.3} fill="#FFFFFF" opacity="0.25" />

      {/* Pull handles (long vertical bars) */}
      <rect
        x={x + w / 2 - 14}
        y={handleTopY - handleHeight / 2}
        width="6"
        height={handleHeight}
        fill="#9FA4A8"
        rx="2"
      />
      <rect
        x={x + w / 2 + 8}
        y={handleTopY - handleHeight / 2}
        width="6"
        height={handleHeight}
        fill="#9FA4A8"
        rx="2"
      />
      {/* Handle support brackets */}
      <rect x={x + w / 2 - 14} y={handleTopY - handleHeight / 2 - 3} width="6" height="3" fill="#6E7378" />
      <rect x={x + w / 2 - 14} y={handleTopY + handleHeight / 2} width="6" height="3" fill="#6E7378" />
      <rect x={x + w / 2 + 8} y={handleTopY - handleHeight / 2 - 3} width="6" height="3" fill="#6E7378" />
      <rect x={x + w / 2 + 8} y={handleTopY + handleHeight / 2} width="6" height="3" fill="#6E7378" />

      {/* Bottom kick plate */}
      <rect x={x} y={y + h - frameThickness - 18} width={w} height="18" fill="#3A3A40" />
    </g>
  );
}

function InteriorPiece({
  item,
  room,
  buildingX,
  buildingW,
  glassY,
  glassH,
  platformY,
}: {
  item: Item;
  room: Room;
  buildingX: number;
  buildingW: number;
  glassY: number;
  glassH: number;
  platformY: number;
}) {
  // Mirror x position (facade view = looking from the street)
  const itemCenterX = item.x + item.w / 2;
  const facadeXFrac = (room.x + room.w - itemCenterX) / room.w;
  const facadeCx = buildingX + facadeXFrac * buildingW;

  // Depth (y in plan): 0 = front (close to glass), 1 = back of store
  const depthFrac = Math.max(
    0,
    Math.min(1, (item.y + item.h / 2 - room.y) / room.h)
  );

  // Pseudoperspective: back items smaller and shifted up
  const scale = 0.55 + (1 - depthFrac) * 0.45;
  const widthInFacade = Math.max(6, (item.w / room.w) * buildingW * scale);
  const heightInFacade = Math.max(8, ((item.baseZ || 0) + item.z) * 0.75 * scale);

  // Vertical placement: front items rest on a virtual back-floor close to the platform.
  // Items further back ride higher in the glass (closer to the ceiling band).
  const floorBaseY = platformY + 8;
  const ceilingBaseY = glassY + 50;
  const itemBottomY = floorBaseY - depthFrac * (floorBaseY - ceilingBaseY);
  const itemTopY = itemBottomY - heightInFacade;

  const rx = item.rounded
    ? Math.min(widthInFacade, heightInFacade) / 2
    : item.category === "shell"
    ? 4
    : 2;
  const opacity =
    item.category === "shell"
      ? 0.78
      : item.category === "counter"
      ? 0.82
      : item.category === "rack"
      ? 0.88
      : 0.8;
  const stroke = shade(item.fill, 0.45);
  const labelFits = widthInFacade > 30 && heightInFacade > 18;

  return (
    <g>
      {/* Soft contact shadow */}
      <ellipse
        cx={facadeCx}
        cy={itemBottomY + 2}
        rx={widthInFacade / 2}
        ry={4 * scale}
        fill="#1A1A2E"
        opacity={0.28 * (1 - depthFrac * 0.4)}
      />
      <rect
        x={facadeCx - widthInFacade / 2}
        y={itemTopY}
        width={widthInFacade}
        height={heightInFacade}
        fill={item.fill}
        opacity={opacity}
        stroke={stroke}
        strokeWidth={1.1}
        rx={rx}
      />
      {labelFits && (
        <text
          x={facadeCx}
          y={itemTopY + heightInFacade / 2 + 3}
          textAnchor="middle"
          fill={item.category === "rack" || item.category === "shell" ? "#FAFAFA" : "#1A1A2E"}
          fontSize={Math.max(6, 9 * scale)}
          fontWeight="700"
          opacity="0.85"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          {item.label.toUpperCase()}
        </text>
      )}
    </g>
  );
}

function PhotoMannequin({
  x,
  baseY,
  variant = 0,
  scale = 1,
}: {
  x: number;
  baseY: number;
  variant?: number;
  scale?: number;
}) {
  const s = scale;
  const headR = 16 * s;
  const neckH = 8 * s;
  const torsoH = 100 * s;
  const legH = 120 * s;
  const headY = baseY - legH - torsoH - neckH - headR;
  const torsoTopY = headY + headR + neckH;
  const legTopY = torsoTopY + torsoH;
  const standH = 6 * s;
  const standW = 26 * s;

  const outfits = [
    { top: "#1A1A2E", bottom: "#1A1A2E", topName: "tank" },
    { top: "#1A1A2E", bottom: "#3F5E8A", topName: "shirt" },
    { top: "#0BBCB7", bottom: "#1A1A2E", topName: "crop" },
  ];
  const o = outfits[variant];

  return (
    <g>
      {/* Ground shadow */}
      <ellipse cx={x} cy={baseY + 4} rx={22 * s} ry={4} fill="#000000" opacity="0.32" />

      {/* Stand base */}
      <rect x={x - standW / 2} y={baseY - standH} width={standW} height={standH} fill="#2A2A33" rx={1.5} />
      {/* Stand pole */}
      <rect x={x - 2 * s} y={baseY - standH - 14 * s} width={4 * s} height={14 * s} fill="#9FA4A8" />

      {/* Legs (under pants) */}
      <rect x={x - 16 * s} y={legTopY} width={13 * s} height={legH} fill={o.bottom} />
      <rect x={x + 3 * s} y={legTopY} width={13 * s} height={legH} fill={o.bottom} />
      {/* Subtle inner-leg shadow */}
      <rect x={x - 3 * s} y={legTopY} width={3 * s} height={legH * 0.6} fill="#000000" opacity="0.18" />
      {/* Shoes */}
      <rect x={x - 16 * s} y={legTopY + legH - 5 * s} width={13 * s} height={5 * s} fill="#0A0A14" />
      <rect x={x + 3 * s} y={legTopY + legH - 5 * s} width={13 * s} height={5 * s} fill="#0A0A14" />

      {/* Torso (with shoulders / waist) */}
      <path
        d={`M ${x - 36 * s} ${torsoTopY - 2}
           Q ${x - 36 * s} ${torsoTopY - 8 * s} ${x - 30 * s} ${torsoTopY - 4 * s}
           L ${x + 30 * s} ${torsoTopY - 4 * s}
           Q ${x + 36 * s} ${torsoTopY - 8 * s} ${x + 36 * s} ${torsoTopY - 2}
           L ${x + 26 * s} ${torsoTopY + torsoH * 0.55}
           L ${x + 22 * s} ${torsoTopY + torsoH}
           L ${x - 22 * s} ${torsoTopY + torsoH}
           L ${x - 26 * s} ${torsoTopY + torsoH * 0.55} Z`}
        fill={o.top}
      />
      {/* Highlight stripe on torso */}
      <path
        d={`M ${x - 30 * s} ${torsoTopY + 8 * s}
           L ${x - 24 * s} ${torsoTopY + torsoH - 8 * s}`}
        stroke="#FFFFFF"
        strokeWidth={2 * s}
        opacity="0.1"
      />
      {/* Belt line */}
      <rect
        x={x - 24 * s}
        y={torsoTopY + torsoH - 4 * s}
        width={48 * s}
        height={3 * s}
        fill="#0A0A14"
        opacity="0.6"
      />

      {/* Neck */}
      <rect x={x - 4 * s} y={headY + headR - 1} width={8 * s} height={neckH + 2} fill="#E8E2D6" />

      {/* Head */}
      <circle cx={x} cy={headY} r={headR} fill="#F0EDE7" stroke="#A89B82" strokeWidth={0.8 * s} />
      {/* Head highlight */}
      <ellipse cx={x - headR * 0.35} cy={headY - headR * 0.4} rx={headR * 0.4} ry={headR * 0.25} fill="#FFFFFF" opacity="0.45" />
      {/* Subtle head shading */}
      <ellipse cx={x + headR * 0.3} cy={headY + headR * 0.3} rx={headR * 0.5} ry={headR * 0.4} fill="#C9C2AE" opacity="0.25" />
    </g>
  );
}

function Mannequin({
  x,
  baseY,
  variant = 0,
  gender = "female",
}: {
  x: number;
  baseY: number;
  variant?: number;
  gender?: "female" | "male";
}) {
  const isMale = gender === "male";

  const headR = isMale ? 12 : 11;
  const torsoH = isMale ? 82 : 76;
  const legH = isMale ? 92 : 88;
  const totalH = headR * 2 + 6 + torsoH + legH;
  const headY = baseY - totalH + headR;
  const torsoTopY = headY + headR + 6;
  const legTopY = torsoTopY + torsoH;

  // Female: narrower shoulders, waist taper, slightly wider hips, longer "hair" silhouette
  // Male: broader shoulders, no waist taper, straight torso
  const shoulderW = isMale ? 32 : 26;
  const waistW = isMale ? 28 : 18;
  const hipW = isMale ? 22 : 22;
  const pantsLegW = isMale ? 13 : 11;
  const pantsGap = isMale ? 3 : 2;

  // Female outfits use crop tops; male uses t-shirts. Bottom is shorts (male) vs leggings (female).
  const femaleOutfits = [
    { top: "#1A1A2E", bottom: "#1A1A2E", topName: "legging-conjunto" },
    { top: "#0BBCB7", bottom: "#1A1A2E", topName: "top-teal" },
    { top: "#1A1A2E", bottom: "#3B5F88", topName: "top-azul" },
  ];
  const maleOutfit = { top: "#1A1A2E", bottom: "#3B5F88" };
  const o = isMale ? maleOutfit : femaleOutfits[variant];

  return (
    <g>
      {/* Stand base */}
      <ellipse cx={x} cy={baseY + 2} rx="16" ry="3" fill="#1A1A2E" opacity="0.55" />
      <rect x={x - 1.8} y={baseY - 6} width="3.6" height="6" fill="#9FA4A8" />

      {/* Hair silhouette for female (long hair past shoulders) */}
      {!isMale && (
        <path
          d={`M ${x - headR - 2} ${headY - 2}
             Q ${x - headR - 4} ${headY + headR + 4} ${x - headR + 2} ${torsoTopY + 10}
             L ${x - headR + 4} ${torsoTopY + 14}
             L ${x + headR - 4} ${torsoTopY + 14}
             L ${x + headR - 2} ${torsoTopY + 10}
             Q ${x + headR + 4} ${headY + headR + 4} ${x + headR + 2} ${headY - 2}
             Q ${x} ${headY - headR - 4} ${x - headR - 2} ${headY - 2} Z`}
          fill="#3A3026"
          opacity="0.85"
        />
      )}

      {/* Head */}
      <circle cx={x} cy={headY} r={headR} fill="#F2EFE8" stroke="#A89B82" strokeWidth="0.6" />
      {/* Male short hair on top of head */}
      {isMale && (
        <path
          d={`M ${x - headR + 1} ${headY - 2}
             Q ${x - headR + 3} ${headY - headR + 2} ${x} ${headY - headR + 2}
             Q ${x + headR - 3} ${headY - headR + 2} ${x + headR - 1} ${headY - 2}
             Q ${x + headR} ${headY - 4} ${x + headR / 2} ${headY - headR + 3}
             Q ${x} ${headY - headR - 1} ${x - headR / 2} ${headY - headR + 3}
             Q ${x - headR} ${headY - 4} ${x - headR + 1} ${headY - 2} Z`}
          fill="#3A3026"
          opacity="0.9"
        />
      )}
      <ellipse cx={x - 2} cy={headY - 2} rx="3" ry="2" fill="#FFFFFF" opacity="0.4" />

      {/* Neck */}
      <rect x={x - (isMale ? 4 : 3)} y={headY + headR - 1} width={isMale ? 8 : 6} height="8" fill="#E6E2D9" />

      {/* Shoulders / torso — gender-shaped */}
      {isMale ? (
        <path
          d={`M ${x - shoulderW} ${torsoTopY}
             Q ${x - shoulderW} ${torsoTopY - 5} ${x - shoulderW + 4} ${torsoTopY - 3}
             L ${x + shoulderW - 4} ${torsoTopY - 3}
             Q ${x + shoulderW} ${torsoTopY - 5} ${x + shoulderW} ${torsoTopY}
             L ${x + waistW} ${torsoTopY + torsoH}
             L ${x - waistW} ${torsoTopY + torsoH} Z`}
          fill={o.top}
        />
      ) : (
        <path
          d={`M ${x - shoulderW} ${torsoTopY}
             Q ${x - shoulderW} ${torsoTopY - 4} ${x - shoulderW + 3} ${torsoTopY - 2}
             L ${x + shoulderW - 3} ${torsoTopY - 2}
             Q ${x + shoulderW} ${torsoTopY - 4} ${x + shoulderW} ${torsoTopY}
             L ${x + waistW} ${torsoTopY + torsoH * 0.55}
             L ${x + hipW} ${torsoTopY + torsoH}
             L ${x - hipW} ${torsoTopY + torsoH}
             L ${x - waistW} ${torsoTopY + torsoH * 0.55} Z`}
          fill={o.top}
        />
      )}

      {/* Subtle vertical highlight on torso */}
      <path
        d={`M ${x - shoulderW + 4} ${torsoTopY + 6}
           L ${x - waistW + 2} ${torsoTopY + torsoH - 4}`}
        stroke="#FFFFFF"
        strokeWidth="2"
        opacity="0.08"
      />

      {/* Waist / pants line */}
      <rect
        x={x - hipW}
        y={torsoTopY + torsoH - 2}
        width={hipW * 2}
        height="3"
        fill="#0A0A14"
        opacity="0.6"
      />

      {/* Legs */}
      <rect x={x - pantsLegW - pantsGap} y={legTopY} width={pantsLegW} height={legH} fill={o.bottom} />
      <rect x={x + pantsGap} y={legTopY} width={pantsLegW} height={legH} fill={o.bottom} />
      {/* Shoes */}
      <rect x={x - pantsLegW - pantsGap} y={legTopY + legH - 4} width={pantsLegW} height="4" fill="#1A1A2E" />
      <rect x={x + pantsGap} y={legTopY + legH - 4} width={pantsLegW} height="4" fill="#1A1A2E" />
    </g>
  );
}

function LawnStrip({
  groundY,
  lawnH,
  gaps,
  fullWidth,
}: {
  groundY: number;
  lawnH: number;
  gaps: Array<{ x1: number; x2: number }>;
  fullWidth: number;
}) {
  // Build list of x-ranges for lawn (full width minus gaps)
  const sorted = [...gaps].sort((a, b) => a.x1 - b.x1);
  const ranges: Array<{ x1: number; x2: number }> = [];
  let cursor = 0;
  for (const g of sorted) {
    if (g.x1 > cursor) ranges.push({ x1: cursor, x2: g.x1 });
    cursor = Math.max(cursor, g.x2);
  }
  if (cursor < fullWidth) ranges.push({ x1: cursor, x2: fullWidth });

  return (
    <g>
      {ranges.map((r, i) => (
        <g key={i}>
          <rect x={r.x1} y={groundY} width={r.x2 - r.x1} height={lawnH} fill="url(#lawnGradient)" />
          {/* Grass blades scattered within the strip */}
          {Array.from({ length: Math.max(1, Math.floor((r.x2 - r.x1) / 14)) }).map((_, j) => {
            const gx = r.x1 + j * 14 + 4;
            const gh = 5 + ((j * 37 + i * 7) % 6);
            return (
              <line
                key={j}
                x1={gx}
                y1={groundY + lawnH}
                x2={gx + ((j % 2) * 2 - 1)}
                y2={groundY + lawnH - gh}
                stroke="#4D7038"
                strokeWidth="0.9"
                opacity="0.7"
              />
            );
          })}
        </g>
      ))}
    </g>
  );
}

function Planter({ cx, groundY }: { cx: number; groundY: number }) {
  const potY = groundY - 32;
  return (
    <g>
      {/* Pot */}
      <path
        d={`M ${cx - 18} ${potY}
           L ${cx + 18} ${potY}
           L ${cx + 15} ${potY + 30}
           L ${cx - 15} ${potY + 30} Z`}
        fill="#8B6F4B"
        stroke="#5C4A30"
        strokeWidth="1"
      />
      <rect x={cx - 19} y={potY - 4} width="38" height="6" fill="#A4845C" stroke="#5C4A30" strokeWidth="1" />
      {/* Foliage */}
      <ellipse cx={cx - 8} cy={potY - 14} rx="14" ry="16" fill="#5C8049" />
      <ellipse cx={cx + 8} cy={potY - 16} rx="14" ry="18" fill="#6F9758" />
      <ellipse cx={cx} cy={potY - 24} rx="10" ry="12" fill="#82AF66" />
    </g>
  );
}

function DrumSign({ cx, cy, attachX }: { cx: number; cy: number; attachX: number }) {
  const r = 28;
  const drumDepthX = cx + r * 0.18;
  return (
    <g>
      {/* Bracket bar extending from wall to drum */}
      <rect x={drumDepthX + 1} y={cy - 3} width={attachX - drumDepthX - 1} height="6" fill="#3A3A40" stroke="#1A1A2E" strokeWidth="0.4" />
      <rect x={drumDepthX + 1} y={cy - 5} width={Math.max(8, attachX - drumDepthX - 1) / 4} height="2" fill="#1A1A2E" opacity="0.4" />
      {/* Wall plate where bracket attaches */}
      <rect x={attachX - 2} y={cy - 9} width="6" height="18" fill="#2A2A33" />
      {/* Drum side edge — depth */}
      <ellipse cx={drumDepthX} cy={cy} rx={r * 0.16} ry={r * 0.92} fill="#0A4F60" />
      {/* Drum front face */}
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.94} fill="#0088A3" stroke="#005B73" strokeWidth="1.6" />
      {/* Inner ring (LED border) */}
      <ellipse cx={cx} cy={cy} rx={r - 4} ry={(r - 4) * 0.94} fill="none" stroke="#FFE066" strokeWidth="0.8" opacity="0.7" />
      {/* Gloss highlight */}
      <ellipse cx={cx - r * 0.25} cy={cy - r * 0.45} rx={r * 0.5} ry="4" fill="#FFFFFF" opacity="0.22" />
      {/* GYM */}
      <text
        x={cx}
        y={cy - 3}
        textAnchor="middle"
        fill="#FFE066"
        fontSize="12"
        fontWeight="900"
        style={{ fontFamily: "var(--font-playfair), serif", letterSpacing: "1px" }}
      >
        GYM
      </text>
      {/* LOVE! */}
      <text
        x={cx}
        y={cy + 12}
        textAnchor="middle"
        fill="#FFE066"
        fontSize="12"
        fontWeight="900"
        style={{ fontFamily: "var(--font-playfair), serif", letterSpacing: "1px" }}
      >
        LOVE!
      </text>
      {/* Soft outer glow */}
      <ellipse cx={cx} cy={cy} rx={r + 3} ry={(r + 3) * 0.94} fill="none" stroke="#FFE066" strokeWidth="0.5" opacity="0.35" />
    </g>
  );
}

function Monolith({ baseCx, baseY }: { baseCx: number; baseY: number }) {
  // Trihedral sign: two triangular panels meeting at a vertical edge
  // Front panel (blue) — visible facing the viewer at an angle
  // Back/side panel (gray) — visible to the right of the front panel
  const totalH = 150;
  const baseW = 92;
  const apexY = baseY - totalH;
  const edgeX = baseCx + 6; // vertical edge where panels meet
  const frontTopX = baseCx - baseW * 0.32;
  const frontBaseLeftX = baseCx - baseW * 0.4;
  const sideBaseRightX = baseCx + baseW * 0.46;
  const sideTopX = baseCx + baseW * 0.16;

  return (
    <g>
      {/* Ground contact shadow */}
      <ellipse cx={baseCx} cy={baseY + 4} rx={baseW * 0.55} ry="4" fill="#1A1A2E" opacity="0.28" />

      {/* Base platform (removable base) */}
      <rect
        x={baseCx - baseW / 2}
        y={baseY - 4}
        width={baseW}
        height="8"
        fill="#EFEAE0"
        stroke="#9C947E"
        strokeWidth="1"
      />
      <rect x={baseCx - baseW / 2} y={baseY - 4} width={baseW} height="2" fill="#1A1A2E" opacity="0.12" />

      {/* Back/side panel (gray) */}
      <polygon
        points={`${edgeX},${baseY - 4} ${sideBaseRightX},${baseY - 4} ${sideTopX},${apexY + 12} ${edgeX},${apexY}`}
        fill="#C9C2B0"
        stroke="#7A7464"
        strokeWidth="1.4"
      />
      {/* Side panel shading */}
      <polygon
        points={`${edgeX},${baseY - 4} ${sideBaseRightX},${baseY - 4} ${sideTopX},${apexY + 12} ${edgeX},${apexY}`}
        fill="#1A1A2E"
        opacity="0.1"
      />

      {/* Front panel (blue) */}
      <polygon
        points={`${frontBaseLeftX},${baseY - 4} ${edgeX},${baseY - 4} ${edgeX},${apexY} ${frontTopX},${apexY + 4}`}
        fill="#0088A3"
        stroke="#005B73"
        strokeWidth="1.6"
      />
      {/* LED edge glow on front triangle */}
      <polyline
        points={`${frontBaseLeftX},${baseY - 4} ${frontTopX},${apexY + 4} ${edgeX},${apexY}`}
        fill="none"
        stroke="#FFE066"
        strokeWidth="1.6"
        opacity="0.85"
      />

      {/* GYM LOVE! diagonal text on front panel */}
      <text
        x={frontBaseLeftX + 12}
        y={baseY - 20}
        fill="#1A1A2E"
        fontSize="14"
        fontWeight="900"
        style={{ fontFamily: "var(--font-playfair), serif", letterSpacing: "2px" }}
        transform={`rotate(-66 ${frontBaseLeftX + 12} ${baseY - 20})`}
      >
        GYM LOVE!
      </text>

      {/* Partner logo placeholders on the right-of-text area */}
      {[
        { label: "adidas", y: apexY + 32 },
        { label: "Santa Bella", y: apexY + 50 },
        { label: "rosa imp.", y: apexY + 68 },
        { label: "B!", y: apexY + 86 },
        { label: "gocase", y: apexY + 104 },
      ].map((p) => (
        <text
          key={p.label}
          x={baseCx + 2}
          y={p.y}
          fill="#1A1A2E"
          fontSize="6"
          fontWeight="700"
          opacity="0.75"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          {p.label}
        </text>
      ))}
    </g>
  );
}

function PaverPattern({ y, width, height }: { y: number; width: number; height: number }) {
  const lines: JSX.Element[] = [];
  const pw = 60;
  const ph = 30;
  for (let row = 0; row * ph < height; row++) {
    const offset = (row % 2) * (pw / 2);
    for (let col = 0; col * pw - offset < width; col++) {
      const px = col * pw - offset;
      const py = y + row * ph;
      lines.push(
        <rect
          key={`p-${row}-${col}`}
          x={px}
          y={py}
          width={pw}
          height={ph}
          fill="none"
          stroke="#6F6A62"
          strokeWidth="0.7"
          opacity="0.5"
        />
      );
    }
  }
  return <g>{lines}</g>;
}

function Legend() {
  const items: Array<{ color: string; label: string }> = [
    { color: "#0BBCB7", label: "Vitrine, provador" },
    { color: "#C9A94E", label: "Acessórios, LED dourada" },
    { color: "#1A1A2E", label: "Araras, portas" },
    { color: "#FAFAFA", label: "Balcão, painel, vaso, pia" },
    { color: "#E8E8E8", label: "Banheiro" },
  ];
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-2 text-xs text-zinc-600">
          <span
            className="w-3.5 h-3.5 rounded border border-zinc-300"
            style={{ backgroundColor: it.color, opacity: it.color === "#FAFAFA" ? 1 : 0.7 }}
          />
          {it.label}
        </div>
      ))}
    </div>
  );
}
