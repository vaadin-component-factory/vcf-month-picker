import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { VcfMonthPicker } from '../src/index.js';
import '../src/vcf-month-picker.js';

describe('VcfMonthPicker', () => {
  it('has a default header "Hey there" and counter 5', async () => {
    // const el = await fixture<VcfMonthPicker>(html`<vcf-month-picker></vcf-month-picker>`);
  });

  it('increases the counter on button click', async () => {
    //  const el = await fixture<VcfMonthPicker>(html`<vcf-month-picker></vcf-month-picker>`);
    //  el.shadowRoot!.querySelector('button')!.click();
  });

  it('can override the header via attribute', async () => {
    //  const el = await fixture<VcfMonthPicker>(html`<vcf-month-picker header="attribute header"></vcf-month-picker>`);
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<VcfMonthPicker>(
      html`<vcf-month-picker></vcf-month-picker>`
    );

    await expect(el).shadowDom.to.be.accessible();
  });
});
