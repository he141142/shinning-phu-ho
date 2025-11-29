import { WeekRangeByYear } from "../libs/week-range";

export class WeekRangeStore {
  store: Map<number, WeekRangeByYear> = new Map();
  constructor(...years: number[]) {
    this.store = years.reduce((prev, y) => {
      let wk_range = new WeekRangeByYear(y);
      wk_range.load();
      prev.set(y, wk_range);
      return prev;
    }, new Map<number, WeekRangeByYear>());
  }

  addYear(year: number) {
    if (!this.store.has(year)) {
      let wk = new WeekRangeByYear(year);
      wk.load();
      this.store.set(year, wk);
    }
  }
}

export const weekRangeStore = new WeekRangeStore(
  new Date().getFullYear() - 1,
  new Date().getFullYear(),
  new Date().getFullYear() + 1
);
