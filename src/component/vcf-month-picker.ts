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
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { Overlay, OverlayCloseEvent } from '@vaadin/overlay/vaadin-overlay';
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
  monthAllowed,
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

  /**
   * The selected month in `YYYY-MM` format.
   */
  @property({ type: String }) value = '';

  /**
   * Whether the month picker overlay is open.
   */
  @property({ type: Boolean }) opened = false;

  /**
   * The minimum selectable year.
   * @attr {boolen} min-year
   */
  @property({ type: String }) minYear: string | null = null;

  /**
   * The maximum selectable year.
   * @attr {boolen} max-year
   */
  @property({ type: String }) maxYear: string | null = null;

  /**
   * The label for the input field.
   */
  @property({ type: String }) label = '';

  /**
   * The placeholder text.
   */
  @property({ type: String }) placeholder = '';

  /**
   * Whether the component is disabled.
   */
  @property({ type: Boolean }) disabled = false;

  /**
   * Whether the component is readonly.
   */
  @property({ type: Boolean }) readonly = false;

  /**
   * Whether a value is required.
   */
  @property({ type: Boolean }) required = false;

  /**
   * Whether the value is invalid.
   */
  @property({ type: Boolean }) invalid = false;

  /**
   * Set to true to make clear button visible.
   * @attr {boolen} clear-button-visible
   */
  @property({ type: Boolean }) clearButtonVisible = false;

  /**
   * The error message to show.
   */
  @property({ type: String }) errorMessage = '';

  /**
   * To set the tooltip text when needed.
   * @attr {string} tooltip-text
   */
  @property({ type: String }) tooltipText = '';

  /**
   * The object used to localize months names and months labels.
   */
  @property({ type: Object })
  i18n = {
    monthNames: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    monthLabels: [
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
    ],
  };

  /**
   * Set true to prevent the overlay from opening automatically.
   * @attr {boolean} auto-open-disabled
   */
  @property({ type: Boolean }) autoOpenDisabled = false;

  /**
   * To set the helper text when needed.
   * @attr {string} helper-text
   */
  @property({ type: String }) helperText = '';

  @query('#textField') private textField?: TextField;

  // Can't use @query for overlay, because it will be teleported to body
  private overlay: Overlay | null = null;

  private calendar: MonthPickerCalendar | null = null;

  private __boundInputClicked = this.__inputClicked.bind(this);

  private __boundInputValueChanged = this.__inputValueChanged.bind(this);

  private __boundOverlayOpenedChanged = this.__overlayOpenedChanged.bind(this);

  private __boundRenderOverlay = this.__renderOverlay.bind(this);

  private __dispatchChange = false;

  private __keepInputValue = false;

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

    if (this.__dispatchChange && props.has('value')) {
      this.dispatchEvent(new CustomEvent('change', { bubbles: true }));
      this.__dispatchChange = false;
    }
  }

  ready() {
    super.ready();

    // add accessibility attributes to the text field
    this.textField?.setAttribute('role', 'combobox');
    this.textField?.setAttribute('aria-haspopup', 'dialog');
    this.textField?.setAttribute(
      'aria-expanded',
      this.opened ? 'true' : 'false'
    );
  }

  protected firstUpdated() {
    if (this.value) {
      this.__boundInputValueChanged();
    }
  }

  render() {
    return html`
      <vaadin-text-field
        id="textField"
        value=${this.inputValue}
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
        ?clear-button-visible=${this.clearButtonVisible}
        autocomplete="off"
        helper-text=${this.helperText}
      >
        <div
          part="toggle-button"
          slot="suffix"
          aria-hidden="true"
          @click="${this.__toggle}"
        ></div>
        <vaadin-tooltip
          slot="tooltip"
          text=${this.tooltipText}
        ></vaadin-tooltip>
      </vaadin-text-field>
      <vcf-month-picker-overlay
        id="overlay"
        .positionTarget=${this.textField?.shadowRoot?.querySelector(
          '[part="input-field"]'
        ) as HTMLInputElement}
        no-vertical-overlap
        restore-focus-on-close
        .restoreFocusNode=${this.textField?.inputElement}
        focus-trap
        .opened=${this.opened}
        @opened-changed=${this.__boundOverlayOpenedChanged}
        .renderer=${this.__boundRenderOverlay}
        @vaadin-overlay-close="${this._onVaadinOverlayClose}"
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

  _onVaadinOverlayClose(e: OverlayCloseEvent) {
    if (
      e.detail.sourceEvent &&
      e.detail.sourceEvent.composedPath().includes(this)
    ) {
      e.preventDefault();
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

  get inputValue() {
    return this.__keepInputValue && this.invalid
      ? this.textField?.value
      : this.formattedValue;
  }

  private __inputClicked(event: Event) {
    if (!this.__isClearButton(event)) {
      if (!this.autoOpenDisabled) {
        if (!this.disabled && !this.readonly) {
          this.opened = !this.opened;
        }
      }
    }
  }

  private __isClearButton(event: Event) {
    return (
      event.composedPath()[0] ===
      this.textField?.shadowRoot?.querySelector('#clearButton')
    );
  }

  private __toggle(e: Event) {
    e.stopPropagation();
    this.opened = !this.opened;
  }

  private __inputValueChanged() {
    if (this.textField) {
      const inputValue = this.textField.value;
      const yearMonth = VcfMonthPicker.parseValue(inputValue);
      const selectedValue =
        yearMonth !== null ? yearMonthToValue(yearMonth!) : '';
      this.__commitChanges(inputValue, yearMonth!, selectedValue);
    }
    this.__updateOpenedYear();
  }

  private __commitChanges(
    inputValue: string,
    yearMonth: YearMonth,
    selectedValue: string
  ) {
    const isValid = this.checkValidity(inputValue, yearMonth!, selectedValue);
    this.invalid = !isValid;
    this.textField!.invalid = !isValid;

    if (isValid) {
      this.__dispatchChange = true;
      this.__keepInputValue = false;
      if (selectedValue) {
        this.value = selectedValue;
      } else {
        this.textField!.value = '';
        this.value = '';
      }
    } else {
      this.__keepInputValue = true;
      this.textField!.value = inputValue;
      this.value = '';
    }
  }

  checkValidity(
    inputValue: string,
    yearMonth: YearMonth,
    selectedValue: string
  ) {
    const inputValid =
      !inputValue ||
      (!!selectedValue &&
        inputValue === VcfMonthPicker.formatValue(yearMonth!));
    const isMonthValid =
      !selectedValue || monthAllowed(selectedValue, this.minYear, this.maxYear);
    return inputValid && isMonthValid;
  }

  private __overlayOpenedChanged(e: CustomEvent) {
    const opened = e.detail.value;
    this.opened = opened;
    this.textField?.setAttribute(
      'aria-expanded',
      this.opened ? 'true' : 'false'
    );
    this.__updateOpenedYear();
  }

  private __renderOverlay(root: HTMLElement) {
    const content = html` <vcf-month-picker-calendar
      .value=${this.value}
      .minYear=${this.minYear}
      .maxYear=${this.maxYear}
      .i18n=${this.i18n}
      @month-clicked=${(e: CustomEvent) => {
        this._onMonthClicked(e.detail);
      }}
    ></vcf-month-picker-calendar>`;
    render(content, root);
    this.__initializeCalendar();
  }

  private _onMonthClicked(selectedValue: string) {
    this.opened = false;
    this._commitMonthClickedChanges(selectedValue);
  }

  private _commitMonthClickedChanges(selectedValue: string) {
    if (this.value !== selectedValue) {
      const yearMonth = valueToYearMonth(selectedValue);
      const inputValue = VcfMonthPicker.formatValue(yearMonth!);
      this.__commitChanges(inputValue, yearMonth!, selectedValue);
    }
  }

  private __initializeCalendar() {
    this.calendar =
      this.calendar || this.overlay!.querySelector('vcf-month-picker-calendar');
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
          this.minYear
            ? Math.max(year, valueToYearMonth(this.minYear)!.year)
            : year;
        const adjustByMax = (year: number) =>
          this.maxYear
            ? Math.min(year, valueToYearMonth(this.maxYear)!.year)
            : year;

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
