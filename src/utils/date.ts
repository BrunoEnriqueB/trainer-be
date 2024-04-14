type TDateOptions = 'day';

export class DateUtils extends Date {
  startOf(option: TDateOptions) {
    if (option === 'day') {
      this.setHours(0);
      this.setMinutes(0);
      this.setMilliseconds(0);
    }

    return this;
  }

  endOf(option: TDateOptions) {
    if (option === 'day') {
      this.setHours(23);
      this.setMinutes(59);
      this.setMilliseconds(59);
    }

    return this;
  }
}
