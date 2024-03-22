import { Overlay } from '@vaadin/overlay';
import '@vaadin/overlay';
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin';

window.customElements.whenDefined('vaadin-overlay').then(() => {
  /*
   * PositionMixin has not yet been released as part of <vaadin-overlay>.
   * Including it here enables aligning the overlay below the field.
   */
  class MonthPickerOverlay extends PositionMixin(Overlay) {
    static get is() {
      return 'vcf-month-picker-overlay';
    }

    constructor() {
      super();
      // Hack to make the overlay itself not focusable:
      this.addEventListener('opened-changed', () => {
        if (this.opened) {
          (this.shadowRoot!.querySelector('#overlay') as any).tabIndex = -1;
        }
      });
    }
  }
  window.customElements.define(MonthPickerOverlay.is, MonthPickerOverlay);
});
