import type { Apartment } from "../types";

interface Props {
  liked: Apartment[];
  onRestart: () => void;
}

export default function ResultsScreen({ liked, onRestart }: Props) {
  return (
    <div className="results-screen">
      <h1>Квартиры закончились</h1>
      <p className="subtitle">
        {liked.length > 0
          ? `Вам понравилось ${liked.length} ${pluralApt(liked.length)}. Вот список:`
          : "Пока ничего не понравилось. Попробуйте изменить параметры поиска."}
      </p>

      {liked.length > 0 && (
        <div className="results-list">
          {liked.map((apt) => (
            <div key={apt.id} className="result-item">
              <img src={apt.images[0]} alt={apt.title} />
              <div className="result-item-info">
                <strong>{apt.title}</strong>
                <span>
                  {apt.district} · {apt.area} м² · {apt.price.toLocaleString("ru-RU")} ₽/мес
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <button type="button" className="btn btn-primary" onClick={onRestart}>
        Начать заново
      </button>
    </div>
  );
}

function pluralApt(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "квартира";
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return "квартиры";
  return "квартир";
}
