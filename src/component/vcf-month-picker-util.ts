/*-
 * #%L
 *
 * Copyright (C) 2024 - 2025 Vaadin Ltd
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */

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

export function isYearDisabled(
  year: number,
  minYear: string | null,
  maxYear: string | null
): boolean {
  return (
    (minYear !== null &&
      minYear.length > 0 &&
      year < valueToYearMonth(minYear)!.year) ||
    (maxYear !== null &&
      maxYear.length > 0 &&
      year > valueToYearMonth(maxYear)!.year)
  );
}

export function monthAllowed(
  value: string,
  minYear: string | null,
  maxYear: string | null
): boolean {
  const invalid = isInvalid(value, minYear, maxYear);
  const year = valueToYearMonth(value)?.year;
  const disabled = isYearDisabled(year!, minYear, maxYear);
  return !invalid && !disabled;
}

export function clickOnKey(event: KeyboardEvent, ...keys: string[]) {
  if (keys.includes(event.key) && event.target instanceof HTMLElement) {
    event.preventDefault();
    event.target.click();
  }
}
