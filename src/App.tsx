import { useState } from "react";
import "./App.css";
import Onboarding from "./components/Onboarding";
import SwipeDeck from "./components/SwipeDeck";
import ResultsScreen from "./components/ResultsScreen";
import MapView from "./components/MapView";
import { apartments } from "./data/apartments";
import { filterApartments } from "./utils/filterApartments";
import type { Apartment, OnboardingAnswers, SwipeDirection } from "./types";

type Stage = "onboarding" | "swiping" | "done";
type BrowseView = "cards" | "map";

export default function App() {
  const [stage, setStage] = useState<Stage>("onboarding");
  const [queue, setQueue] = useState<Apartment[]>([]);
  const [liked, setLiked] = useState<Apartment[]>([]);
  const [browseView, setBrowseView] = useState<BrowseView>("cards");

  const handleOnboardingComplete = (a: OnboardingAnswers) => {
    const filtered = filterApartments(apartments, a);
    setQueue(filtered);
    setLiked([]);
    setBrowseView("cards");
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
    setQueue([]);
    setLiked([]);
    setBrowseView("cards");
  };

  const topApartment = queue[0];

  return (
    <div className="app-shell">
      {stage === "onboarding" && <Onboarding onComplete={handleOnboardingComplete} />}

      {stage === "swiping" && (
        <div className="swipe-screen">
          {queue.length > 0 ? (
            browseView === "cards" ? <>
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
                <button
                  type="button"
                  className="round-btn round-btn-map"
                  aria-label="Открыть карту объектов"
                  onClick={() => setBrowseView("map")}
                >
                  ⌖
                </button>
              </div>
            </> : <MapView apartments={queue} onClose={() => setBrowseView("cards")} />
          ) : (
            <ResultsScreen liked={liked} onRestart={handleRestart} />
          )}
        </div>
      )}

      {stage === "done" && <ResultsScreen liked={liked} onRestart={handleRestart} />}
    </div>
  );
}
