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
import { html, css, LitElement } from 'lit';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { customElement, property } from 'lit/decorators.js';
import {
  clickOnKey,
  isInvalid,
  isYearDisabled,
  yearMonthToValue,
} from './vcf-month-picker-util.js';

interface I18n {
  monthNames: string[];
  monthLabels: string[];
}

/**
 * @element vcf-month-picker-calendar displays a calendar for selecting a month.
 */
@customElement('vcf-month-picker-calendar')
class MonthPickerCalendar extends ElementMixin(
  ThemableMixin(PolylitMixin(LitElement))
) {
  static get is() {
    return 'vcf-month-picker-calendar';
  }

  static get version() {
    return '1.1.0';
  }

  /**
   * The selected month in YYYY-MM format.
   */
  @property({ type: String }) value: string | null = null;

  /**
   * Localization properties for month names and labels.
   */
  @property({ type: Object }) i18n: I18n = {
    monthNames: [],
    monthLabels: [],
  };

  /**
   * The currently opened year in the calendar.
   */
  @property({ type: Number }) openedYear = new Date().getFullYear();

  /**
   * The minimum selectable year
   */
  @property({ type: String }) minYear: string | null = null;

  /**
   * The maximum selectable year.
   */
  @property({ type: String }) maxYear: string | null = null;

  static get styles() {
    return css`
      :host([hidden]) {
        display: none !important;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .month-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        min-width: 16rem;
      }

      .month-button {
        text-align: center;
        cursor: default;
        outline: none;
        height: var(--_month-button-height);
        line-height: var(--_month-button-height);
      }

      .month-button[disabled] {
        pointer-events: none;
      }
    `;
  }

  ready() {
    super.ready();

    // add accessibility attributes to calendar
    this.setAttribute('role', 'dialog');
    this.setAttribute('aria-labelledby', 'year-label');
  }

  render() {
    const isNextYearDisabled = this.__IsNextYearDisabled();
    const isPrevYearDisabled = this.__IsPrevYearDisabled();

    return html` <div class="header">
        <button
          class="yearButton prevYear"
          aria-label="Previous year"
          @click=${() => {
            this.openedYear -= 1;
          }}
          @keydown=${(e: KeyboardEvent) => clickOnKey(e, ' ', 'Enter')}
          ?disabled=${isPrevYearDisabled}
          tabindex=${isPrevYearDisabled ? '-1' : '0'}
        ></button>
        <span id="year-label" aria-live="polite">${this.openedYear}</span>
        <button
          class="yearButton nextYear"
          aria-label="Next year"
          @click=${() => {
            this.openedYear += 1;
          }}
          @keydown=${(e: KeyboardEvent) => clickOnKey(e, ' ', 'Enter')}
          ?disabled=${isNextYearDisabled}
          tabindex=${isNextYearDisabled ? '-1' : '0'}
        ></button>
      </div>

      <div class="month-grid" role="grid">
        ${this.i18n?.monthLabels
          .map((label, index) => ({
            content: label,
            value: yearMonthToValue({
              year: this.openedYear,
              month: index + 1,
            }),
            monthIndex: index,
          }))
          .map(props => ({
            ...props,
            disabled: isInvalid(props.value, this.minYear, this.maxYear),
            selected: this.value === props.value,
          }))
          .map(({ content, value, monthIndex, disabled, selected }) => {
            // Set tabindex="0" for the selected month, or the first month if no value is selected
            const shouldBeFocusable =
              selected || (!this.value && monthIndex === 0);

            return html` <div
              class="month-button"
              data-value=${value}
              ?selected=${selected}
              aria-selected=${selected}
              @click=${() =>
                disabled ||
                this.dispatchEvent(
                  new CustomEvent('month-clicked', { detail: value })
                )}
              @keydown=${(e: KeyboardEvent) => this.__onMonthsKeyDown(e)}
              ?disabled=${disabled}
              aria-disabled=${disabled}
              tabindex=${shouldBeFocusable ? '0' : '-1'}
              role="gridcell"
              aria-label="${this.i18n.monthNames[monthIndex]} ${this
                .openedYear}"
            >
              ${content}
            </div>`;
          })}
      </div>`;
  }

  private __IsPrevYearDisabled() {
    return isYearDisabled(this.openedYear - 1, this.minYear, this.maxYear);
  }

  private __IsNextYearDisabled() {
    return isYearDisabled(this.openedYear + 1, this.minYear, this.maxYear);
  }

  /**
   * Handles keyboard navigation for month selection.
   */
  private __onMonthsKeyDown(event: KeyboardEvent) {
    const monthButtons = Array.from(
      this.shadowRoot!.querySelectorAll('.month-button:not([disabled])')
    ) as HTMLElement[];

    const focusedButton = this.shadowRoot!.activeElement as HTMLElement;
    const currentIndex = monthButtons.indexOf(focusedButton);

    if (currentIndex === -1) return;

    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowLeft':
        newIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;
        break;
      case 'ArrowRight':
        newIndex =
          currentIndex < monthButtons.length - 1
            ? currentIndex + 1
            : currentIndex;
        break;
      case 'ArrowUp':
        newIndex = currentIndex - 4 >= 0 ? currentIndex - 4 : currentIndex;
        break;
      case 'ArrowDown':
        newIndex =
          currentIndex + 4 < monthButtons.length
            ? currentIndex + 4
            : currentIndex;
        break;
      case 'Enter':
        clickOnKey(event, 'Enter');
        break;
      case ' ':
        clickOnKey(event, ' ');
        break;
      case 'Tab':
        this._focusPreviousYearButton(event);
        break;
      default:
        break;
    }

    if (newIndex !== currentIndex) {
      event.preventDefault();
      monthButtons[newIndex].focus();
    }
  }

  /**
   * Returns the month button element that should be focused (tabindex=0).
   */
  get focusedMonth(): HTMLElement | null {
    return (
      this.shadowRoot!.querySelector('.month-grid')!.querySelector(
        '.month-button[tabindex="0"]'
      ) || null
    );
  }

  private _focusPreviousYearButton(event: KeyboardEvent) {
    const prevYearButton = this.shadowRoot!.querySelector('.prevYear');
    if (prevYearButton && prevYearButton instanceof HTMLButtonElement) {
      event.preventDefault();
      prevYearButton.focus();
    }
  }
}

export { MonthPickerCalendar };

declare global {
  interface HTMLElementTagNameMap {
    'vcf-month-picker-calendar': MonthPickerCalendar;
  }
}
