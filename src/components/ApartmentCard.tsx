import { useState } from "react";
import type { Apartment } from "../types";

const TERM_LABELS: Record<string, string> = {
  short: "короткий срок",
  medium: "средний срок",
  long: "долгосрочно",
};

interface Props {
  apartment: Apartment;
  active: boolean;
}

export default function ApartmentCard({ apartment, active }: Props) {
  const [photoIndex, setPhotoIndex] = useState(0);

  const goTo = (delta: number) => {
    setPhotoIndex((i) => {
      const next = i + delta;
      if (next < 0) return apartment.images.length - 1;
      if (next >= apartment.images.length) return 0;
      return next;
    });
  };

  return (
    <div className="apartment-card">
      <div className="card-photo-wrap">
        <img
          src={apartment.images[photoIndex]}
          alt={apartment.title}
          className="card-photo"
          draggable={false}
        />
        <div className="photo-dots">
          {apartment.images.map((_, i) => (
            <span key={i} className={"photo-dot" + (i === photoIndex ? " active" : "")} />
          ))}
        </div>
        {active && (
          <>
            <button
              type="button"
              className="photo-tap photo-tap-left"
              aria-label="Предыдущее фото"
              onClick={() => goTo(-1)}
            />
            <button
              type="button"
              className="photo-tap photo-tap-right"
              aria-label="Следующее фото"
              onClick={() => goTo(1)}
            />
          </>
        )}
        <div className="card-price-badge">{apartment.price.toLocaleString("ru-RU")} ₽/мес</div>
        <div className="card-gradient" />
        <div className="card-heading">
          <h2>{apartment.title}</h2>
          <p className="card-address">
            {apartment.district} · {apartment.address}
          </p>
        </div>
      </div>

      <div className="card-body">
        <div className="card-stats">
          <div className="stat">
            <span className="stat-value">{apartment.area} м²</span>
            <span className="stat-label">площадь</span>
          </div>
          <div className="stat">
            <span className="stat-value">{apartment.rooms}</span>
            <span className="stat-label">{apartment.rooms === 1 ? "комната" : "комнаты"}</span>
          </div>
          <div className="stat">
            <span className="stat-value">
              {apartment.floor}/{apartment.totalFloors}
            </span>
            <span className="stat-label">этаж</span>
          </div>
        </div>

        <p className="card-description">{apartment.description}</p>

        <div className="tag-row">
          {apartment.termTypes.map((t) => (
            <span key={t} className="tag tag-term">
              {TERM_LABELS[t]}
            </span>
          ))}
          {apartment.amenities.map((a) => (
            <span key={a} className="tag">
              {a}
            </span>
          ))}
        </div>
        <p className="rentch-concierge">
          Консьерж Rentch поможет уточнить детали объекта и организовать просмотр.
        </p>
      </div>
    </div>
  );
}
