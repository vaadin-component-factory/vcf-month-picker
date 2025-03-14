/**
 * @license
 * This program is available under Apache License Version 2.0
 */
import { html, css, LitElement } from 'lit';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { customElement, property } from 'lit/decorators.js';
import {
  clickOnKey,
  isInvalid,
  valueToYearMonth,
  yearMonthToValue,
} from './vcf-month-picker-util.js';

/**
 * @element vcf-month-picker-calendar
 */
@customElement('vcf-month-picker-calendar')
class MonthPickerCalendar extends ElementMixin(
  ThemableMixin(PolylitMixin(LitElement))
) {
  static get is() {
    return 'vcf-month-picker-calendar';
  }

  static get version() {
    return '1.0.0';
  }

  @property({ type: String }) value: string | null = null;

  @property({ type: Array }) monthLabels = [];

  @property({ type: Number }) openedYear = 2020;

  @property({ type: String }) min: string | null = null;

  @property({ type: String }) max: string | null = null;

  static get styles() {
    return css`
      :host {
      }

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

  render() {
    return html` <div class="header">
        <button
          class="yearButton prevYear"
          @click=${() => {
            this.openedYear -= 1;
          }}
          @keydown=${(e: KeyboardEvent) => clickOnKey(e, ' ', 'Enter')}
          ?disabled=${this.__isYearDisabled(this.openedYear - 1)}
        ></button>
        ${this.openedYear}
        <button
          class="yearButton nextYear"
          @click=${() => {
            this.openedYear += 1;
          }}
          @keydown=${(e: KeyboardEvent) => clickOnKey(e, ' ', 'Enter')}
          ?disabled=${this.__isYearDisabled(this.openedYear + 1)}
        ></button>
      </div>

      <div class="month-grid">
        ${this.monthLabels
          .map((label, index) => ({
            content: label,
            value: yearMonthToValue({
              year: this.openedYear,
              month: index + 1,
            }),
          }))
          .map(props => ({
            ...props,
            disabled: isInvalid(props.value, this.min, this.max),
          }))
          .map(
            ({ content, value, disabled }) => html` <div
              class="month-button"
              data-value=${value}
              ?selected=${this.value === value}
              @click=${() =>
                disabled ||
                this.dispatchEvent(
                  new CustomEvent('month-clicked', { detail: value })
                )}
              @keydown=${(e: KeyboardEvent) => clickOnKey(e, ' ', 'Enter')}
              ?disabled=${disabled}
              tabindex=${disabled ? '-1' : '0'}
              role="button"
            >
              ${content}
            </div>`
          )}
      </div>`;
  }

  private __isYearDisabled(year: number) {
    return (
      (this.min && year < valueToYearMonth(this.min)!.year) ||
      (this.max && year > valueToYearMonth(this.max)!.year)
    );
  }
}

export { MonthPickerCalendar };

declare global {
  interface HTMLElementTagNameMap {
    'vcf-month-picker-calendar': MonthPickerCalendar;
  }
}
