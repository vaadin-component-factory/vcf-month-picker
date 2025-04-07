[![npm version](https://badgen.net/npm/v/@vaadin-component-factory/vcf-month-picker)](https://www.npmjs.com/package/@vaadin-component-factory/vcf-month-picker)

# \<vcf-month-picker>

`<vcf-month-picker>` is a web component for selecting a year and month, based on LitElement. It provides an easy-to-use interface for choosing months within a specified range, supporting localization, validation, and customization.

This web component follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

This component is part of [Vaadin Component Factory](https://github.com/vaadin-component-factory).

## Features
* Month & Year Selection: Allows users to pick a month and year in YYYY-MM format.
* Configurable Range: Set minimum and maximum selectable years.
* Customizable Labels & Placeholders: Supports custom text for better user experience.
* Disabled & Read-only Modes: Component can be set as non-interactive when needed.
* Clear Button Support: Option to reset the selection.
* Theming & Styling: Uses CSS custom properties for easy styling.
* Localization: Supports custom month names, months labels and formats.
* Validation & Error Handling: Marks invalid states with an error message.
* ARIA & Accessibility: Proper attributes for screen reader support.

### Custom Month Names and Labels
By default, month names and labels are in English language but it can be customized through the `i18n` property.
Please note that the object expects month names, labels and formats to be specified on customization.

Example:
``` 
<vcf-month-picker 
  label="Month Picker"  
  .i18n=${{
	monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
		'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
	monthLabels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
	formats: ["MM/YYYY"]  
  }} >
</vcf-month-picker>
```

### Custom Year-Month Formats
The component allows users to define custom formats for displaying and parsing year-month values.

#### Defining Custom Formats
You can specify an array of formats through the `i18n` property. The first format in the array is used for display, while all listed formats are used for parsing user input.

Example:

```js
monthPicker.i18n = {
  monthNames: monthPicker.i18n.monthNames,
  monthLabels: monthPicker.i18n.monthLabels,
  formats: ['MM.YYYY', 'MM/YYYY', 'MMYYYY', 'MM-YYYY', 'YYYY.MM', 'MYYYY', 'YYYY/MM', 'MM YYYY']
};
```
The displayed value will use "MM.YYYY".

Users can enter values using "MM.YYYY", "MM/YYYY", "MM-YYYY" or "MMYYYY".

#### Format Rules
* The year must always be four digits (YYYY).
* The month must be one or two digits (M or MM).
* Only common date separators are supported: 
    - Dot (.)
    - Slash (/)
    - Hyphen (-)
    - Space ( ) 
* Not separator is also supported (e.g. "MMYYYY" or "YYYYMM")   
* Month position matters:
    - MM/YYYY and YYYY/MM are treated differently.
    - The component determines whether the month appears before or after the year based on the format.

## Installation

```bash
npm i @vaadin-component-factory/vcf-month-picker
```

## Usage

Once installed, import it in your application:

```js
import '@vaadin-component-factory/vcf-month-picker';
```

### Example
```html
<vcf-month-picker label="Month Picker" placeholder="Select a month" clear-button-visible></vcf-month-picker>
```

## Linting and formatting

To scan the project for linting and formatting errors, run

```bash
npm run lint
```

To automatically fix linting and formatting errors, run

```bash
npm run format
```

## Running demo

1. Fork the `vcf-month-picker` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vcf-month-picker` directory, run `npm install` to install dependencies.

1. Run `npm start` to open the demo.

## Contributing

To contribute to the component, please read [the guideline](https://github.com/vaadin/vaadin-core/blob/master/CONTRIBUTING.md) first.

## License
Distributed under Apache Licence 2.0. 

### Sponsored development
Major pieces of development of this add-on has been sponsored by multiple customers of Vaadin. Read more about Expert on Demand at: [Support](https://vaadin.com/support) and [Pricing](https://vaadin.com/pricing).