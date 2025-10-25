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

    [part='header'] {
      padding-bottom: var(--lumo-space-s);
      font-size: var(--lumo-font-size-l);
      font-weight: 500;
      line-height: 1;
    }

    [part='month-grid'] {
      gap: var(--lumo-space-xs);
    }

    [part~='month'] {
      border-radius: var(--lumo-border-radius-m);
      --_month-button-height: var(--lumo-size-m);
    }

    [part~='month']:hover {
      background-color: var(--lumo-primary-color-10pct);
    }

    [part~='month']:focus {
      box-shadow: 0 0 0 1px var(--lumo-base-color),
        0 0 0 calc(var(--_focus-ring-width) + 1px) var(--_focus-ring-color);
    }

    [part~='selected-month'] {
      color: var(--lumo-base-color);
      font-weight: 600;
      background-color: var(--lumo-primary-color);
    }

    [part~='disabled-month'] {
      color: var(--lumo-disabled-text-color);
    }
  `
);

registerStyles(
  'vaadin-button',
  css`
    :host([theme='vcf-month-picker']) {
      margin: 0;
      padding: 0;
      min-width: auto;
      background-color: transparent;
      font-size: var(--lumo-font-size-s);
      height: var(--lumo-size-m);
      width: var(--lumo-size-m);
    }

    :host([theme='vcf-month-picker']:hover) {
      background-color: var(--lumo-primary-color-10pct);
    }

    :host([theme='vcf-month-picker']) [part='label'] {
      padding: 0;
      font-family: var(--vcf-month-picker-calendar-icons-font-family);
      font-size: calc(var(--vcf-month-picker-calendar-icon-size) * 1.25);
    }

    :host([theme='vcf-month-picker']) [part='label']::before {
      cursor: var(--lumo-clickable-cursor);
    }

    :host([theme='vcf-month-picker'][slot^='prev']) [part='label']::before {
      content: var(--vcf-month-picker-calendar-prev-year-icon);
    }

    :host([theme='vcf-month-picker'][slot^='next']) [part='label']::before {
      content: var(--vcf-month-picker-calendar-next-year-icon);
    }
  `
);
