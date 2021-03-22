export default class Expiry {
  seconds?: number;
  minutes?: number;
  hours?: number;
  days?: number;
  months?: number;

  constructor(options: { seconds?: number; minutes?: number; hours?: number; days?: number; months?: number }) {
    this.seconds = options.seconds;
    this.minutes = options.minutes;
    this.hours = options.hours;
    this.days = options.days;
    this.months = options.months;
  }

  getSeconds(): number {
    let total = 0;

    if (this.seconds != null) total += this.seconds;
    if (this.minutes != null) total += this.minutes * 60;
    if (this.hours != null) total += this.hours * 3600;
    if (this.days != null) total += this.days * 86400;
    if (this.months != null) total += this.months * 2592000;

    return total;
  }
}
