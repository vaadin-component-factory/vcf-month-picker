import { html } from 'lit';
import {
  fixture,
  expect,
  nextFrame,
  oneEvent,
  waitUntil,
} from '@open-wc/testing';
import { resetMouse, sendMouse } from '@web/test-runner-commands';
import { VcfMonthPicker } from '../src/index.js';
import '../src/vcf-month-picker.js';

describe('VcfMonthPicker', () => {
  it('has a default header "Hey there" and counter 5', async () => {
    // const el = await fixture<VcfMonthPicker>(html`<vcf-month-picker label="Month"></vcf-month-picker>`);
  });

  it('increases the counter on button click', async () => {
    //  const el = await fixture<VcfMonthPicker>(html`<vcf-month-picker label="Month"></vcf-month-picker>`);
    //  el.shadowRoot!.querySelector('button')!.click();
  });

  it('can override the header via attribute', async () => {
    //  const el = await fixture<VcfMonthPicker>(html`<vcf-month-picker header="attribute header"></vcf-month-picker>`);
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<VcfMonthPicker>(
      html`<vcf-month-picker label="Month"></vcf-month-picker>`
    );

    await expect(el).shadowDom.to.be.accessible();
  });

  // https://github.com/vaadin-component-factory/vcf-month-picker/issues/21
  describe('month click while the field becomes invalid', () => {
    afterEach(async () => {
      await resetMouse();
    });

    it('selects the clicked month', async () => {
      const el = await fixture<VcfMonthPicker>(
        html`<vcf-month-picker label="Month"></vcf-month-picker>`
      );
      el.opened = true;
      const calendar = el.querySelector('vcf-month-picker-calendar')!;
      const month = () =>
        calendar.shadowRoot!.querySelectorAll<HTMLElement>(
          '[part~="month"]'
        )[2];
      await waitUntil(
        () => month()?.getBoundingClientRect().height,
        'calendar did not open'
      );
      await nextFrame();

      const rect = month().getBoundingClientRect();
      await sendMouse({
        type: 'move',
        position: [
          Math.round(rect.left + rect.width / 2),
          Math.round(rect.top + rect.height / 2),
        ],
      });
      await sendMouse({ type: 'down' });

      // As a form validating on blur does, before the click completes
      el.invalid = true;
      el.errorMessage = 'Month is required';
      await el.updateComplete;
      await nextFrame();

      await sendMouse({ type: 'up' });

      expect(el.value).to.equal(month().dataset.value);
    });
  });

  // https://github.com/vaadin-component-factory/vcf-month-picker/issues/27
  it('includes the new value in the value-changed event detail', async () => {
    const el = await fixture<VcfMonthPicker>(
      html`<vcf-month-picker label="Month"></vcf-month-picker>`
    );
    const textField = el.querySelector('vaadin-text-field')!;

    const eventPromise = oneEvent(el, 'value-changed');
    textField.value = '03.2026';
    textField.dispatchEvent(new Event('change'));
    const event = await eventPromise;

    expect(el.value).to.equal('2026-03');
    expect(event.detail).to.deep.equal({ value: '2026-03' });
  });
});
