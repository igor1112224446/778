import { useState } from "react";
import type { AreaRange, BudgetRange, OnboardingAnswers, TermType } from "../types";
import { DISTRICTS } from "../data/apartments";

const TERM_OPTIONS: { value: TermType; label: string; hint: string }[] = [
  { value: "short", label: "Коротко", hint: "до 3 месяцев" },
  { value: "medium", label: "Средний срок", hint: "3–11 месяцев" },
  { value: "long", label: "Долгосрочно", hint: "от года" },
];

const BUDGET_MIN = 15000;
const BUDGET_MAX = 150000;
const AREA_MIN = 15;
const AREA_MAX = 120;

interface Props {
  onComplete: (answers: OnboardingAnswers) => void;
}

export default function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [budget, setBudget] = useState<BudgetRange>({ min: 25000, max: 70000 });
  const [term, setTerm] = useState<TermType | null>(null);
  const [districts, setDistricts] = useState<string[]>([]);
  const [area, setArea] = useState<AreaRange>({ min: 25, max: 60 });

  const steps = [
    {
      title: "Какой у вас бюджет?",
      subtitle: "Укажите диапазон в месяц, который вам комфортен",
      canNext: budget.min < budget.max,
      body: (
        <div className="field-block">
          <div className="range-values">
            <span>{budget.min.toLocaleString("ru-RU")} ₽</span>
            <span>{budget.max.toLocaleString("ru-RU")} ₽</span>
          </div>
          <div className="dual-range">
            <input
              type="range"
              min={BUDGET_MIN}
              max={BUDGET_MAX}
              step={1000}
              value={budget.min}
              onChange={(e) => {
                const v = Math.min(Number(e.target.value), budget.max - 1000);
                setBudget((b) => ({ ...b, min: v }));
              }}
            />
            <input
              type="range"
              min={BUDGET_MIN}
              max={BUDGET_MAX}
              step={1000}
              value={budget.max}
              onChange={(e) => {
                const v = Math.max(Number(e.target.value), budget.min + 1000);
                setBudget((b) => ({ ...b, max: v }));
              }}
            />
          </div>
        </div>
      ),
    },
    {
      title: "На какой срок хотите снять?",
      subtitle: "Выберите подходящий вариант",
      canNext: term !== null,
      body: (
        <div className="option-list">
          {TERM_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={"option-card" + (term === opt.value ? " selected" : "")}
              onClick={() => setTerm(opt.value)}
            >
              <span className="option-title">{opt.label}</span>
              <span className="option-hint">{opt.hint}</span>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "В каком районе ищете квартиру?",
      subtitle: "Можно выбрать несколько районов или пропустить, чтобы искать везде",
      canNext: true,
      body: (
        <div className="chip-list">
          {DISTRICTS.map((d) => {
            const active = districts.includes(d);
            return (
              <button
                key={d}
                type="button"
                className={"chip" + (active ? " selected" : "")}
                onClick={() =>
                  setDistricts((prev) =>
                    active ? prev.filter((x) => x !== d) : [...prev, d]
                  )
                }
              >
                {d}
              </button>
            );
          })}
        </div>
      ),
    },
    {
      title: "Какая нужна площадь?",
      subtitle: "Укажите желаемый диапазон в квадратных метрах",
      canNext: area.min < area.max,
      body: (
        <div className="field-block">
          <div className="range-values">
            <span>{area.min} м²</span>
            <span>{area.max} м²</span>
          </div>
          <div className="dual-range">
            <input
              type="range"
              min={AREA_MIN}
              max={AREA_MAX}
              step={5}
              value={area.min}
              onChange={(e) => {
                const v = Math.min(Number(e.target.value), area.max - 5);
                setArea((a) => ({ ...a, min: v }));
              }}
            />
            <input
              type="range"
              min={AREA_MIN}
              max={AREA_MAX}
              step={5}
              value={area.max}
              onChange={(e) => {
                const v = Math.max(Number(e.target.value), area.min + 5);
                setArea((a) => ({ ...a, max: v }));
              }}
            />
          </div>
        </div>
      ),
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  const handleNext = () => {
    if (!current.canNext) return;
    if (isLast) {
      onComplete({ budget, term: term as TermType, districts, area });
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <div className="onboarding">
      <div className="progress-bar">
        {steps.map((_, i) => (
          <div key={i} className={"progress-dot" + (i <= step ? " filled" : "")} />
        ))}
      </div>
      <div className="onboarding-content">
        <h1>{current.title}</h1>
        <p className="subtitle">{current.subtitle}</p>
        {current.body}
      </div>
      <div className="onboarding-actions">
        {step > 0 && (
          <button type="button" className="btn btn-ghost" onClick={() => setStep((s) => s - 1)}>
            Назад
          </button>
        )}
        <button
          type="button"
          className="btn btn-primary"
          disabled={!current.canNext}
          onClick={handleNext}
        >
          {isLast ? "Смотреть квартиры" : "Далее"}
        </button>
      </div>
    </div>
  );
}
