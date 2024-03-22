import { html, TemplateResult } from 'lit';
import '../src/vcf-month-picker.js';
import {property} from "lit/decorators";

export default {
  title: 'VcfMonthPicker',
  component: 'vcf-month-picker',
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    min: { control: 'text' },
    max: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    invalid: { control: 'boolean' }
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  label?: string;
  value?: string;
  min: string | null;
  max: string | null;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  invalid?: boolean;
  required?: boolean;
  errorMessage?: string;
}

const Template: Story<ArgTypes> = ({
  label = 'Hello world',
  value = '2024-03',
  placeholder = '',
  min = null,
  max = null,
  invalid = false,
  readonly = false,
  disabled = false,
  required = false,
  errorMessage = ''
}: ArgTypes) => html`
  <vcf-month-picker
    .label=${label}
    .value=${value}
    .placeholder=${placeholder}
    .min=${min}
    .max=${max}
    .errorMessage=${errorMessage}
    ?readonly=${readonly}
    ?disabled=${disabled}
    ?invalid=${invalid}
    ?required=${required}
  >
  </vcf-month-picker>
`;

export const Regular = Template.bind({});

export const CustomLabel = Template.bind({});
CustomLabel.args = {
  label: 'My label',
};

export const CustomValue = Template.bind({});
CustomValue.args = {
  value: '2019-06',
};

