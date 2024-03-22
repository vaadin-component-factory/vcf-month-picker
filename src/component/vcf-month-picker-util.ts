export interface YearMonth {
  year: number;
  month: number;
}

export function yearMonthToValue({ year, month }: YearMonth): string {
  return `${year}-${`0${month}`.substr(-2)}`;
}

export function valueToYearMonth(value: string): YearMonth | null {
  if (value && value.length) {
    const parts = value.split('-');
    return {
      year: parseInt(parts[0], 10),
      month: parseInt(parts[1], 10),
    };
  }
  return null;
}

export function isInvalid(
  value: string,
  min: string | null,
  max: string | null
): boolean {
  return (
    (min !== null && min.length > 0 && value < min) ||
    (max !== null && max.length > 0 && value > max)
  );
}

export function clickOnKey(event: KeyboardEvent, ...keys: string[]) {
  if (keys.includes(event.key) && event.target instanceof HTMLElement) {
    event.preventDefault();
    event.target.click();
  }
}
