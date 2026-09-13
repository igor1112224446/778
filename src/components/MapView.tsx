import { useRef, useState, type PointerEvent, type WheelEvent } from "react";
import type { Apartment } from "../types";
import ApartmentCard from "./ApartmentCard";

interface Props {
  apartments: Apartment[];
  onClose: () => void;
}

const points = [
  [18, 24], [39, 18], [64, 24], [82, 33], [26, 42], [48, 38], [69, 47],
  [14, 63], [37, 58], [58, 64], [83, 61], [26, 79], [47, 76], [70, 83],
  [88, 78], [54, 88], [35, 31], [76, 18], [18, 86], [91, 49],
] as const;

export default function MapView({ apartments, onClose }: Props) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState<Apartment | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const dragged = useRef(false);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchStart = useRef<{ distance: number; zoom: number } | null>(null);

  const changeZoom = (delta: number) => setZoom((value) => Math.min(2.2, Math.max(0.75, value + delta)));
  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    changeZoom(event.deltaY > 0 ? -0.1 : 0.1);
  };
  const moveMap = (event: PointerEvent<HTMLDivElement>) => {
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const activePointers = [...pointers.current.values()];

    if (activePointers.length === 2 && pinchStart.current) {
      const [first, second] = activePointers;
      const distance = Math.hypot(first.x - second.x, first.y - second.y);
      setZoom(Math.min(2.2, Math.max(0.75, pinchStart.current.zoom * (distance / pinchStart.current.distance))));
      dragged.current = true;
      return;
    }

    if (!dragStart) return;
    if (Math.abs(event.clientX - dragStart.x) + Math.abs(event.clientY - dragStart.y) > 3) {
      dragged.current = true;
    }
    setPosition((value) => ({ x: value.x + event.clientX - dragStart.x, y: value.y + event.clientY - dragStart.y }));
    setDragStart({ x: event.clientX, y: event.clientY });
  };

  return (
    <section className="map-screen" aria-label="Карта объектов Rentch">
      <div
        className="interactive-map"
        onWheel={handleWheel}
        onPointerDown={(event) => {
          dragged.current = false;
          event.currentTarget.setPointerCapture(event.pointerId);
          pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
          const activePointers = [...pointers.current.values()];
          if (activePointers.length === 2) {
            const [first, second] = activePointers;
            pinchStart.current = {
              distance: Math.hypot(first.x - second.x, first.y - second.y),
              zoom,
            };
            setDragStart(null);
          } else {
            setDragStart({ x: event.clientX, y: event.clientY });
          }
        }}
        onPointerMove={moveMap}
        onPointerUp={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
          pointers.current.delete(event.pointerId);
          pinchStart.current = null;
          const [remainingPointer] = pointers.current.values();
          setDragStart(remainingPointer ?? null);
        }}
        onPointerCancel={(event) => {
          pointers.current.delete(event.pointerId);
          pinchStart.current = null;
          setDragStart(null);
        }}
      >
        <div className="map-canvas" style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})` }}>
          <div className="map-river" />
          <div className="map-road road-one" /><div className="map-road road-two" /><div className="map-road road-three" />
          {apartments.map((apartment, index) => {
            const [left, top] = points[index % points.length];
            return <button key={apartment.id} type="button" className="map-marker" style={{ left: `${left}%`, top: `${top}%` }} onPointerDown={(event) => {
              event.stopPropagation();
              dragged.current = false;
            }} onClick={() => !dragged.current && setSelected(apartment)} aria-label={`Открыть карточку: ${apartment.title}`}>
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
