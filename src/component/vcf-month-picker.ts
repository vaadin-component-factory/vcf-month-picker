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
import {ElementMixin} from '@vaadin/component-base/src/element-mixin.js';
import {PolylitMixin} from '@vaadin/component-base/src/polylit-mixin.js';
import {TooltipController} from '@vaadin/component-base/src/tooltip-controller.js';
import {Overlay, OverlayCloseEvent} from '@vaadin/overlay/vaadin-overlay';
import '@vaadin/text-field';
import {TextField} from '@vaadin/text-field/vaadin-text-field';
import {ThemableMixin} from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import {css, html, LitElement, PropertyValues, render} from 'lit';
import {property, query} from 'lit/decorators.js';
import './vcf-month-picker-calendar.js';
import {MonthPickerCalendar} from './vcf-month-picker-calendar.js';
import './vcf-month-picker-overlay.js';
import {
  applyRefCentury,
  monthAllowed,
  toRefCentury,
  valueToYearMonth,
  YearMonth,
  yearMonthToValue,
} from './vcf-month-picker-util.js';

// we assume here, that the browser will not be open till the next century ;)
const REF_CENTURY_DEFAULT = toRefCentury(new Date().getFullYear());

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
  @property({ type: Boolean, reflect: true }) readonly = false;

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
   * The object used to localize compoment.
   * Months names, months labels and month-year formats can be definded here.
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
    // used for MMM interpretion
    shortMonthNames: [
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
    // First is primary format. The rest are allowed valid formats for entering Year-Month values.
    // Defaul format 'MM.YYYY'
    formats: ['MM.YYYY'],
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

  /**
   * For short year formats, this will be the reference century, that shall be applied on top.
   * It will be updated, when the user picks a different century.
   * @private
   */
  private _referenceCentury = REF_CENTURY_DEFAULT;

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

  private _tooltipController: TooltipController | undefined;

  private _closedByEscape = false;

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
      this.dispatchEvent(new CustomEvent('value-changed', { bubbles: true }));
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
    (this.textField! as any)._onKeyDown = this._onKeyDown.bind(this);
  }

  protected firstUpdated() {
    this._tooltipController = new TooltipController(this, 'tooltip');
    this._tooltipController.setPosition('top');
    this.addController(this._tooltipController);
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
        @change=${this.__boundInputValueChanged}
        @blur=${this._onBlur}
        @focus=${this._onFocus}
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
      </vaadin-text-field>

      <slot name="tooltip"></slot>

      <vcf-month-picker-overlay
        id="overlay"
        .positionTarget=${this.textField?.shadowRoot?.querySelector(
          '[part="input-field"]'
        ) as HTMLInputElement}
        no-vertical-overlap
        restore-focus-on-close
        .restoreFocusNode=${this.textField?.inputElement}
        .opened=${this.opened}
        @opened-changed=${this.__boundOverlayOpenedChanged}
        .renderer=${this.__boundRenderOverlay}
        @vaadin-overlay-escape-press="${this._onOverlayEscapePress}"
        @vaadin-overlay-close="${this._onVaadinOverlayClose}"
        @vaadin-overlay-closing="${this._onOverlayClosed}"
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

  _onOverlayEscapePress() {
    this._closedByEscape = true;
    this.opened = false;
  }

  _onOverlayClosed() {
    if (this._closedByEscape) {
      this.textField!.value = this.inputValue!;
      this._closedByEscape = false;
    } else {
      this.opened = false;
    }
  }

  _onBlur() {
    this.dispatchEvent(new FocusEvent('blur'));
  }

  _onFocus() {
    this.dispatchEvent(new FocusEvent('focus'));
  }

  /**
   * Formats a given YearMonth object into a string based on the defined format.
   * Uses the first format in the `i18n.formats` array as the display format.
   * Falls back to "MM/YYYY" if no formats are defined.
   */
  static formatValue({ year, month }: YearMonth, i18n: any) {
    if (!i18n.formats?.length) return `${month}/${year}`; // Default format if no custom formats are provided

    const format = i18n.formats[0]; // Use the first format to display

    let result: string;

    if(format.includes("MMMM")){
      result = format.replace(/MMMM/, i18n.monthNames[month - 1].padStart(2, '0'));

    } else if(!format.includes("MMMM") && format.includes("MMM")){
      result = format.replace(/MMM/, i18n.shortMonthNames[month - 1].padStart(2, '0'));

    } else {
      result = format
          .replace(/MM/, String(month).padStart(2, '0'))
          .replace(/M/, String(month)); // Match month (1 or 2 digits)
    }

    return result
      .replace(/YYYY/, String(year))
      .replace(/YY/, String(year - parseInt("" + (year / 100)) * 100).padStart(2, '0'));
  }

  /**
   * Parses a given string into a YearMonth object based on the available formats.
   * Accepts multiple formats from `i18n.formats` and normalizes different separators.
   */
  static parseValue(inputValue: string, i18n: any): YearMonth | null {
    if (!i18n?.formats?.length) return null;

    const { formats } = i18n;

    // Iterate over each format
    for (const format of formats) {
      // Handle no separator (i.e., continuous format like MMYYYY)
      const separator = format.includes('.')
        ? '.'
        : format.includes('/')
        ? '/'
        : format.includes('-')
        ? '-'
        : format.includes(' ')
        ? ' '
        : ''; // Handle common separators and space

      let formatUsesLongMonthName = format.includes("MMMM");
      let formatUsesShortMonthName = !formatUsesLongMonthName && format.includes("MMM");

      // Adjust the regex based on the presence of the separator
      let regex: string;

      // we have to explicitly separate the patterns, otherwise replacing /M/ could lead to issues
      // in month names, like "March".
      if(formatUsesLongMonthName){
        regex = format.replace(/MMMM/, `(${i18n.monthNames.join('|')})`);

      } else if(formatUsesShortMonthName){
        regex = format.replace(/MMM/, `(${i18n.shortMonthNames.join('|')})`);

      } else {
        regex = format
            .replace(/MM/, '(\\d{1,2})')
            .replace(/M/, '(\\d{1})') // Match month (1 or 2 digits)
      }

      // applying year pattern
      regex = regex
          .replace(/YYYY/, '(\\d{4})')
          .replace(/YY/, '(\\d{2})');

      if (separator) {
        // Escape the separator for regex if present
        regex = regex.replace(
          new RegExp(`\\${separator}`, 'g'),
          `\\${separator}`
        );
      }

      // Check if the input matches the format with the correct separator (if any)
      const match = inputValue.match(new RegExp(`^${regex}$`, 'i'));

      if (match) {
        // Get month and year indexes based on format
        const monthIndex =
          format.indexOf('M') < format.indexOf('YY') ? 1 : 2;
        const yearIndex = monthIndex === 1 ? 2 : 1;

        let month: number;

        if(formatUsesLongMonthName) {
          month = i18n.monthLabels.map((s: string) => s.toLowerCase()).indexOf(match[monthIndex]) + 1;
        } else if(formatUsesShortMonthName) {
          month = i18n.shortMonthNames.map((s: string) => s.toLowerCase()).indexOf(match[monthIndex]) + 1;
        } else {
          month = parseInt(match[monthIndex], 10);
        }

        const year = parseInt(match[yearIndex], 10);
        // Validate that the parsed month is within the valid range (1-12)
        if (month >= 1 && month <= 12) {
          return { month, year };
        }
      }
    }

    return null;
  }

  get formattedValue() {
    return this.yearMonth
      ? VcfMonthPicker.formatValue(this.yearMonth, this.i18n)
      : '';
  }

  get yearMonth(): YearMonth | null {
    return valueToYearMonth(this.value);
  }

  get inputValue() {
    return this.__keepInputValue && this.invalid
      ? this.textField?.value
      : this.formattedValue;
  }

  private _onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Enter':
        this._onEnter();
        break;
      case 'Escape':
        this._onEscape();
        break;
      case 'ArrowDown':
      case ' ':
        this._onArrowDown(event);
        break;
      case 'Tab':
        this._onTab(event);
        break;
      default:
        break;
    }
  }

  /* eslint no-empty: 0 */
  private _onEscape() {
    if (this.opened) {
    }
  }

  private _onEnter() {
    if (this.opened) {
      this.opened = false;
    } else {
      this.__boundInputValueChanged();
    }
  }

  private _onArrowDown(event: KeyboardEvent) {
    if (event.target instanceof HTMLElement) {
      if (!this.opened) {
        event.target.click();
      }
    }
  }

  private _onTab(event: KeyboardEvent) {
    if (this.opened) {
      event.preventDefault();
      event.stopPropagation();
      this.calendar?.focusedMonth!.focus();
    }
  }

  private __inputClicked(event: Event) {
    if (!this.__isClearButton(event)) {
      if (!this.autoOpenDisabled) {
        if (!this.disabled && !this.readonly) {
          event.preventDefault();
          this.opened = true;
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
      let enteredInputValue = inputValue;
      const parsedYearMonth = VcfMonthPicker.parseValue(inputValue, this.i18n);

      if(parsedYearMonth?.year) {
        if (parsedYearMonth.year < 100) {
          parsedYearMonth.year = applyRefCentury(parsedYearMonth.year, this._referenceCentury);
        } else {
          this._referenceCentury = toRefCentury(parsedYearMonth.year);
        }
      } else {
        // reset the reference century, when the text field is cleared
        this._referenceCentury = REF_CENTURY_DEFAULT;
      }

      if (parsedYearMonth) {
        enteredInputValue = VcfMonthPicker.formatValue(
          parsedYearMonth!,
          this.i18n
        );
      }
      const selectedValue =
        parsedYearMonth !== null ? yearMonthToValue(parsedYearMonth!) : '';
      this.__commitChanges(enteredInputValue, parsedYearMonth!, selectedValue);
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
        inputValue === VcfMonthPicker.formatValue(yearMonth!, this.i18n));
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
    if (opened) {
      this.textField?.focus();
    }
    this.__updateOpenedYear();
    this.dispatchEvent(new CustomEvent('vcf-month-picker-opened-changed', {
      bubbles: true,
      detail: {
        value: opened,
      }
    }));
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
      if (yearMonth?.year) {
        this._referenceCentury = toRefCentury(yearMonth.year);
      }
      const inputValue = VcfMonthPicker.formatValue(yearMonth!, this.i18n);
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
