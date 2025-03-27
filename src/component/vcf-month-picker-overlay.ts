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
import { Overlay } from '@vaadin/overlay/vaadin-overlay';
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
