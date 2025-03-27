[![npm version](https://badgen.net/npm/v/@vaadin-component-factory/vcf-month-picker)](https://www.npmjs.com/package/@vaadin-component-factory/vcf-month-picker)

# \<vcf-month-picker>

`<vcf-month-picker>` is a web component for selecting a year and month, based on LitElement. It provides an easy-to-use interface for choosing months within a specified range, supporting localization, validation, and customization.

This web component follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

This component is part of [Vaadin Component Factory](https://github.com/vaadin-component-factory).

## Features
* Month & Year Selection: Allows users to pick a month and year in YYYY-MM format.
* Configurable Range: Set minimum and maximum selectable years.
* Customizable Labels & Placeholders: Supports custom text for better user experience.
* Disabled & Read-only Modes: Can be set as non-interactive when needed.
* Clear Button Support: Option to reset the selection.
* Theming & Styling: Uses CSS custom properties for easy styling.
* Localization: Supports custom month names and labels.
* Validation & Error Handling: Marks invalid states with an error message.
* ARIA & Accessibility: Proper attributes for screen reader support.

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
## Demoing with Storybook

To run a local instance of Storybook for your component, run

```bash
npm run storybook
```

To build a production version of Storybook, run

```bash
npm run storybook:build
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