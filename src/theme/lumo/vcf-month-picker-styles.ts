import {
  css,
  registerStyles,
} from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vcf-month-picker',
  css`
    :host {
      --vcf-month-picker-font-family: var(--lumo-font-family);
      --vcf-month-picker-font-size: var(--lumo-font-size-m);
      --vcf-month-picker-icons-font-family: 'lumo-icons';
      --vcf-month-picker-toggle-calendar-icon: var(--lumo-icons-calendar);
      --vcf-month-picker-icon-size: var(--lumo-icon-size-m);

      box-sizing: border-box;
      font-family: var(--vcf-month-picker-font-family);
      font-size: var(--vcf-month-picker-font-size);
      -webkit-tap-highlight-color: transparent;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    :host([readonly]) {
      pointer-events: none;
    }
  `
);

registerStyles(
  'vcf-month-picker-calendar',
  css`
    :host {
      --vcf-month-picker-calendar-font-family: var(--lumo-font-family);
      --vcf-month-picker-calendar-font-size: var(--lumo-font-size-m);
      --vcf-month-picker-calendar-icons-font-family: 'lumo-icons';
      --vcf-month-picker-calendar-prev-year-icon: var(
        --lumo-icons-chevron-left
      );
      --vcf-month-picker-calendar-next-year-icon: var(
        --lumo-icons-chevron-right
      );
      --vcf-month-picker-calendar-icon-size: var(--lumo-icon-size-m);

      box-sizing: border-box;
      font-family: var(--vcf-month-picker-calendar-font-family);
      font-size: var(--vcf-month-picker-calendar-font-size);
      -webkit-tap-highlight-color: transparent;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;

      --_focus-ring-color: var(
        --vaadin-focus-ring-color,
        var(--lumo-primary-color-50pct)
      );
      --_focus-ring-width: var(--vaadin-focus-ring-width, 2px);
    }

    .header {
      padding-bottom: var(--lumo-space-s);
      font-size: var(--lumo-font-size-l);
      font-weight: 500;
      line-height: 1;
    }

    .yearButton {
      outline: none;
      border: none;
      border-radius: var(--lumo-border-radius-s);
      background: none;
      padding: 0;
      height: var(--lumo-button-size, var(--lumo-size-m));
      width: var(--lumo-button-size, var(--lumo-size-m));
      color: var(--lumo-primary-color);
    }

    .yearButton:hover {
      background: var(--lumo-primary-color-10pct);
    }

    .yearButton:focus {
      box-shadow: 0 0 0 1px var(--lumo-base-color),
        0 0 0 calc(var(--_focus-ring-width) + 1px) var(--_focus-ring-color);
    }

    .yearButton[disabled] {
      color: var(--lumo-disabled-color);
    }

    .yearButton::before {
      font-family: var(--vcf-month-picker-calendar-icons-font-family);
      font-size: calc(var(--vcf-month-picker-calendar-icon-size) * 1.25);
      text-align: center;
      cursor: var(--lumo-clickable-cursor);
    }

    .prevYear::before {
      content: var(--vcf-month-picker-calendar-prev-year-icon);
    }

    .nextYear::before {
      content: var(--vcf-month-picker-calendar-next-year-icon);
    }

    .month-grid {
      gap: var(--lumo-space-xs);
    }

    .month-button {
      border-radius: var(--lumo-border-radius-m);
      --_month-button-height: var(--lumo-size-m);
    }

    .month-button:hover {
      background-color: var(--lumo-primary-color-10pct);
    }

    .month-button:focus {
      box-shadow: 0 0 0 1px var(--lumo-base-color),
        0 0 0 calc(var(--_focus-ring-width) + 1px) var(--_focus-ring-color);
    }

    .month-button[selected] {
      color: var(--lumo-base-color);
      font-weight: 600;
      background-color: var(--lumo-primary-color);
    }

    .month-button[disabled] {
      color: var(--lumo-disabled-text-color);
    }
  `
);
