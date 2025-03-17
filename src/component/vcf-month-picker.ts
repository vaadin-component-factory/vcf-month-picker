/**
 * @license
 * This program is available under Apache License Version 2.0
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { Overlay } from '@vaadin/overlay/vaadin-overlay';
import '@vaadin/text-field';
import { TextField } from '@vaadin/text-field/vaadin-text-field';
import '@vaadin/tooltip';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { css, html, LitElement, PropertyValues, render } from 'lit';
import { property, query } from 'lit/decorators.js';
import './vcf-month-picker-calendar.js';
import { MonthPickerCalendar } from './vcf-month-picker-calendar.js';
import './vcf-month-picker-overlay.js';
import {
  clickOnKey,
  isInvalid,
  valueToYearMonth,
  YearMonth,
  yearMonthToValue,
} from './vcf-month-picker-util.js';

/**
 * `<vcf-month-picker>` is a web component for selecting year and month.
 *
 * Example:
 * ```html
 * <vcf-month-picker
 *   value="2021-06"
 *   min="2021-01"
 *   max="2022-12"
 * ></vcf-month-picker>
 * ```
 *
 * @element vcf-month-picker
 */
export class VcfMonthPicker extends ElementMixin(
  ThemableMixin(PolylitMixin(LitElement))
) {
  static get is() {
    return 'vcf-month-picker';
  }

  static get version() {
    return '1.0.0';
  }

  @property({ type: String }) value = '';

  @property({ type: Boolean }) opened = false;

  @property({ type: String }) min: string | null = null;

  @property({ type: String }) max: string | null = null;

  @property({ type: String }) label = '';

  @property({ type: String }) placeholder = '';

  @property({ type: Boolean }) disabled = false;

  @property({ type: Boolean }) readonly = false;

  @property({ type: Boolean }) required = false;

  @property({ type: Boolean }) invalid = false;

  @property({ type: Boolean }) clearbutton = false;

  @property({ type: String }) errorMessage = false;

  @property({ type: String }) tooltiptext = '';

  @property({ type: Array }) monthLabels = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  @query('#textField') private textField?: TextField;

  // Can't use @query for overlay, because it will be teleported to body
  private overlay: Overlay | null = null;

  private calendar: MonthPickerCalendar | null = null;

  private __boundInputClicked = this.__inputClicked.bind(this);

  private __boundInputValueChanged = this.__inputValueChanged.bind(this);

  private __boundOverlayOpenedChanged = this.__overlayOpenedChanged.bind(this);

  private __boundRenderOverlay = this.__renderOverlay.bind(this);

  private __dispatchChange = false;

  static get styles() {
    return css`
      :host {
        display: inline-block;
      }

      :host([hidden]) {
        display: none !important;
      }
    `;
  }

  update(props: PropertyValues) {
    const observer = new MutationObserver(() => {
      this._updateSuffixStyles();
    });
    observer.observe(this.shadowRoot!, { childList: true, subtree: true });
    super.update(props);
    this.overlay = this.overlay || this.shadowRoot!.querySelector('#overlay');
    if (this.overlay?.shadowRoot) {
      this.overlay.requestContentUpdate();
    }
    this.calendar =
      this.calendar ||
      this.shadowRoot!.querySelector('vcf-month-picker-calendar');
    // todo this can't be a calculated value since it can be set on the server side (binder)
    this.invalid = isInvalid(this.value, this.min, this.max);

    if (this.__dispatchChange && props.has('value')) {
      this.dispatchEvent(new CustomEvent('change', { bubbles: true }));
      this.__dispatchChange = false;
    }
  }

  render() {
    return html`
      <vaadin-text-field
        id="textField"
        value=${this.formattedValue}
        @click=${this.__boundInputClicked}
        @keydown=${(e: KeyboardEvent) => clickOnKey(e, ' ', 'ArrowDown')}
        @change=${this.__boundInputValueChanged}
        label=${this.label}
        placeholder=${this.placeholder}
        ?disabled=${this.disabled}
        ?readonly=${this.readonly}
        ?invalid=${this.invalid}
        .errorMessage=${this.errorMessage}
        ?required=${this.required}
        ?clear-button-visible=${this.clearbutton}
      >
        <div part="toggle-button" slot="suffix"></div>
        <vaadin-tooltip
          slot="tooltip"
          text=${this.tooltiptext}
        ></vaadin-tooltip>
      </vaadin-text-field>
      <vcf-month-picker-overlay
        id="overlay"
        .positionTarget=${this.textField}
        no-vertical-overlap
        .opened=${this.opened}
        @opened-changed=${this.__boundOverlayOpenedChanged}
        .renderer=${this.__boundRenderOverlay}
      >
      </vcf-month-picker-overlay>
    `;
  }

  _updateSuffixStyles() {
    const suffixElement = this.textField?.shadowRoot
      ?.querySelector('vaadin-input-container')
      ?.shadowRoot?.querySelector('[name="suffix"]') as HTMLElement;
    if (suffixElement) {
      suffixElement.style.display = 'flex';
      suffixElement.style.flexDirection = 'row-reverse';
    }
  }

  /**
   * Override formatValue and parseValue to define how the current value is
   * presented in the field.
   */
  static formatValue({ year, month }: YearMonth) {
    return `${month}/${year}`;
  }

  /**
   * Override formatValue and parseValue to define how the current value is
   * presented in the field.
   */
  static parseValue(inputValue: string): YearMonth | null {
    if (!inputValue.match(/^[0-9]+[/][0-9]+$/)) {
      return null;
    }
    const parts = inputValue.split('/');
    const month = parseInt(parts[0], 10);
    const year = parseInt(parts[1], 10);

    if (month < 1 || month > 12) {
      return null;
    }

    return { month, year };
  }

  get formattedValue() {
    return this.yearMonth ? VcfMonthPicker.formatValue(this.yearMonth) : '';
  }

  get yearMonth(): YearMonth | null {
    return valueToYearMonth(this.value);
  }

  private __inputClicked() {
    if (!this.disabled && !this.readonly) {
      this.opened = !this.opened;
    }
  }

  private __inputValueChanged() {
    if (this.textField) {
      const inputValue = this.textField.value;
      const yearMonth = VcfMonthPicker.parseValue(inputValue);
      this.__dispatchChange = true;
      if (yearMonth) {
        this.value = yearMonthToValue(yearMonth);
      } else {
        this.textField.value = '';
        this.value = '';
      }
    }
    this.__updateOpenedYear();
  }

  private __overlayOpenedChanged(e: CustomEvent) {
    const opened = e.detail.value;
    this.opened = opened;
    this.__updateOpenedYear();
  }

  private __renderOverlay(root: HTMLElement) {
    const content = html` <vcf-month-picker-calendar
      .value=${this.value}
      .min=${this.min}
      .max=${this.max}
      .monthLabels=${this.monthLabels}
      @month-clicked=${(e: CustomEvent) => {
        this.__dispatchChange = true;
        this.value = this.value === e.detail ? '' : e.detail;
        this.opened = false;
      }}
    ></vcf-month-picker-calendar>`;
    render(content, root);
  }

  private __updateOpenedYear() {
    if (!this.opened) {
      return;
    }
    if (this.calendar) {
      if (this.yearMonth) {
        // The current value, if any, should be visible:
        this.calendar.openedYear = this.yearMonth.year;
      } else {
        // Otherwise, show current year, or the closest year with enabled values:
        const yearNow = new Date().getFullYear();

        const adjustByMin = (year: number) =>
          this.min ? Math.max(year, valueToYearMonth(this.min)!.year) : year;
        const adjustByMax = (year: number) =>
          this.max ? Math.min(year, valueToYearMonth(this.max)!.year) : year;

        this.calendar.openedYear = adjustByMax(adjustByMin(yearNow));
      }
    }
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();

    this.opened = false;
  }
}
