export class DailyMeanCalculator {
  private currentMean: number = 0;
  private count: number = 0;
  private previousDayMean: number = 0;
  private lastResetTime: Date = new Date();

  constructor() {
      // Initialize the reset mechanism (check every minute or periodically)
      setInterval(() => this.checkReset(), 60 * 1000); // Check every minute
  }

  // Method to add new data point to the mean calculation
  push(dataPoint: number): void {
      this.count += 1;
      // Incremental mean update
      this.currentMean = this.currentMean + (dataPoint - this.currentMean) / this.count;
  }

  // Check if it's midnight, and reset the mean if needed
  private checkReset(): void {
      const now = new Date();
      // Check if it is a new day (midnight reset)
      if (now.getDate() !== this.lastResetTime.getDate()) {
          // Store the previous day's mean
          this.previousDayMean = this.currentMean;
          console.log(`Previous day's mean: ${this.previousDayMean}`);

          // Reset for the new day
          this.currentMean = 0;
          this.count = 0;
          this.lastResetTime = now;
      }
  }

  // Method to get the current mean
  getMean(): number {
      return this.currentMean;
  }

  // Method to get the previous day's mean
  getPreviousDayMean(): number {
      return this.previousDayMean;
  }
}


