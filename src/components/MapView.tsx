import { useState, type PointerEvent, type WheelEvent } from "react";
import type { Apartment } from "../types";
import ApartmentCard from "./ApartmentCard";

interface Props {
  apartments: Apartment[];
  onClose: () => void;
}

const points = [
  [20, 30], [70, 25], [54, 67], [27, 73], [76, 55], [42, 44], [63, 82], [85, 76],
] as const;

export default function MapView({ apartments, onClose }: Props) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState<Apartment | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  const changeZoom = (delta: number) => setZoom((value) => Math.min(2.2, Math.max(0.75, value + delta)));
  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    changeZoom(event.deltaY > 0 ? -0.1 : 0.1);
  };
  const moveMap = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragStart) return;
    setPosition((value) => ({ x: value.x + event.clientX - dragStart.x, y: value.y + event.clientY - dragStart.y }));
    setDragStart({ x: event.clientX, y: event.clientY });
  };

  return (
    <section className="map-screen" aria-label="Карта объектов Rentch">
      <div
        className="interactive-map"
        onWheel={handleWheel}
        onPointerDown={(event) => setDragStart({ x: event.clientX, y: event.clientY })}
        onPointerMove={moveMap}
        onPointerUp={() => setDragStart(null)}
        onPointerLeave={() => setDragStart(null)}
      >
        <div className="map-canvas" style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})` }}>
          <div className="map-river" />
          <div className="map-road road-one" /><div className="map-road road-two" /><div className="map-road road-three" />
          {apartments.map((apartment, index) => {
            const [left, top] = points[index % points.length];
            return <button key={apartment.id} type="button" className="map-marker" style={{ left: `${left}%`, top: `${top}%` }} onPointerDown={(event) => event.stopPropagation()} onClick={() => setSelected(apartment)} aria-label={`Открыть: ${apartment.title}`}>
              {Math.round(apartment.price / 1000)}k
            </button>;
          })}
        </div>
      </div>
      <div className="map-controls" aria-label="Масштаб карты">
        <button type="button" onClick={() => changeZoom(0.2)} aria-label="Приблизить">+</button>
        <button type="button" onClick={() => changeZoom(-0.2)} aria-label="Отдалить">−</button>
      </div>
      <button type="button" className="map-back" onClick={onClose}>К карточкам</button>
      <p className="map-hint">Перемещайте карту, меняйте масштаб и нажимайте на метки</p>
      {selected && <div className="map-card-modal" role="dialog" aria-modal="true" aria-label={selected.title}>
        <button type="button" className="map-card-close" onClick={() => setSelected(null)} aria-label="Закрыть карточку">×</button>
        <ApartmentCard apartment={selected} active />
      </div>}
    </section>
  );
}
