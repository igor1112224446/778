import { useMemo, useState } from "react";
import "./App.css";
import Onboarding from "./components/Onboarding";
import SwipeDeck from "./components/SwipeDeck";
import ResultsScreen from "./components/ResultsScreen";
import { apartments } from "./data/apartments";
import { filterApartments } from "./utils/filterApartments";
import type { Apartment, OnboardingAnswers, SwipeDirection } from "./types";

type Stage = "onboarding" | "swiping" | "done";

export default function App() {
  const [stage, setStage] = useState<Stage>("onboarding");
  const [answers, setAnswers] = useState<OnboardingAnswers | null>(null);
  const [queue, setQueue] = useState<Apartment[]>([]);
  const [liked, setLiked] = useState<Apartment[]>([]);

  const matchCount = useMemo(
    () => (answers ? filterApartments(apartments, answers).length : 0),
    [answers]
  );

  const handleOnboardingComplete = (a: OnboardingAnswers) => {
    const filtered = filterApartments(apartments, a);
    setAnswers(a);
    setQueue(filtered);
    setLiked([]);
    setStage("swiping");
  };

  const handleSwipe = (apartment: Apartment, direction: SwipeDirection) => {
    if (direction === "right") {
      setLiked((prev) => [...prev, apartment]);
    }
    setQueue((prev) => {
      const next = prev.filter((a) => a.id !== apartment.id);
      if (next.length === 0) setStage("done");
      return next;
    });
  };

  const handleRestart = () => {
    setStage("onboarding");
    setAnswers(null);
    setQueue([]);
    setLiked([]);
  };

  const topApartment = queue[0];

  return (
    <div className="app-shell">
      {stage === "onboarding" && <Onboarding onComplete={handleOnboardingComplete} />}

      {stage === "swiping" && (
        <div className="swipe-screen">
          <header className="swipe-header">
            <div>
              <h1>Найдено {matchCount} вариантов</h1>
              <p className="subtitle">Свайпайте вправо, если нравится, влево — если нет</p>
            </div>
          </header>

          {queue.length > 0 ? (
            <>
              <SwipeDeck apartments={queue} onSwipe={handleSwipe} />
              <div className="swipe-buttons">
                <button
                  type="button"
                  className="round-btn round-btn-nope"
                  aria-label="Не нравится"
                  onClick={() => topApartment && handleSwipe(topApartment, "left")}
                >
                  ✕
                </button>
                <button
                  type="button"
                  className="round-btn round-btn-like"
                  aria-label="Нравится"
                  onClick={() => topApartment && handleSwipe(topApartment, "right")}
                >
                  ♥
                </button>
              </div>
            </>
          ) : (
            <ResultsScreen liked={liked} onRestart={handleRestart} />
          )}
        </div>
      )}

      {stage === "done" && <ResultsScreen liked={liked} onRestart={handleRestart} />}
    </div>
  );
}
