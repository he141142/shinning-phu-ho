export interface WeekRange {
  week: number;
  start: Date;
  end: Date;
  startString: string;
  endString: string;
}

export class WeekRangeByYear {
  weekRange: WeekRange[];
  year: number;
  constructor(year: number) {
    this.weekRange = [];
    this.year = year;
  }

  load() {
    let date = new Date(this.year, 0, 1);

    // Find the first Monday of the year
    while (date.getDay() !== 1) {
      date.setDate(date.getDate() + 1);
    }

    const weeks: WeekRange[] = [];
    let weekNumber = 1;
    while (date.getFullYear() === this.year) {
      let startDate = new Date(date);
      date.setDate(date.getDate() + 6);
      let endDate = new Date(date);

      weeks.push({
        week: weekNumber++,
        startString: startDate.toLocaleDateString("en-GB"), // Format as DD/MM/YYYY
        endString: endDate.toLocaleDateString("en-GB"),
        start: startDate,
        end: endDate,
      });

      // Move to the next week
      date.setDate(date.getDate() + 1);
    }
    this.weekRange = weeks;
  }

  getCurrentWeek(): WeekRange {
   let def =   new WeekRangeByYear(new Date().getFullYear());
   def.load();
   return def.getWeekRangeByDate(new Date());
  }

  getWeekRangeByDate(date: Date): WeekRange {
    let weekRange = this.weekRange.find((week) => {
      return (
        date.getTime() >= week.start.getTime() &&
        date.getTime() <= week.end.getTime()
      );
    });

    if (!weekRange) {
      return this.getCurrentWeek();
    }
    return weekRange;
  }
}
