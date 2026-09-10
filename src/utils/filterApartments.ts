import type { Apartment, OnboardingAnswers } from "../types";

export function filterApartments(apartments: Apartment[], answers: OnboardingAnswers): Apartment[] {
  return apartments.filter((apt) => {
    const inBudget = apt.price >= answers.budget.min && apt.price <= answers.budget.max;
    const inArea = apt.area >= answers.area.min && apt.area <= answers.area.max;
    const matchesTerm = apt.termTypes.includes(answers.term);
    const matchesDistrict =
      answers.districts.length === 0 || answers.districts.includes(apt.district);
    return inBudget && inArea && matchesTerm && matchesDistrict;
  });
}
