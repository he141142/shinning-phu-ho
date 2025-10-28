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
    const today = new Date();
    console.log("today", today);
    console.log("this.weekRange", this.weekRange);
    
    
    let weekRange =  this.weekRange.find((week) => {
      return today.getTime() >= week.start.getTime() && today.getTime() <= week.end.getTime();
    });

    if (!weekRange) {
        console.log("false to if");
        
      weekRange = this.weekRange[this.weekRange.length - 1];
    }
    return weekRange;
  }
}
