import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { ButtonComponent } from '../../components/button/button.component';
import { CardComponent } from '../../components/card/card.component';
import { FieldComponent } from '../../components/field/field.component';
import { TextFieldComponent } from '../../components/text-field/text-field.component';
import { formatMoney } from '../models/format.helper';
import type { PriceBounds } from '../models/product.model';

export interface Prices {
  readonly price25: number;
  readonly price50: number;
}

function check(
  value: string,
  min: number,
  max: number,
  minutes: number,
): string {
  const amount = Number(value.replace(',', '.'));
  if (!value.trim() || Number.isNaN(amount))
    return `Enter the price for ${minutes} minutes.`;
  if (amount < min || amount > max)
    return `The price for ${minutes} minutes must be between ${formatMoney(min)} and ${formatMoney(max)}.`;
  return '';
}

/** 25- and 50-minute prices within the operator's bounds (E02-S04, R08). */
@Component({
  selector: 'ui-price-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, CardComponent, FieldComponent, TextFieldComponent],
  template: `
    <ui-card heading="Your prices" density="roomy">
      <form novalidate (submit)="save($event)">
        <ui-field
          label="25 minutes (EUR)"
          controlId="pf-25"
          [error]="shown() ? error25() : ''"
          [hint]="range(bounds().min25, bounds().max25)"
        >
          <input
            ui-text-field
            id="pf-25"
            inputmode="decimal"
            [invalid]="shown() && !!error25()"
            [value]="value25()"
            (input)="value25.set($any($event.target).value)"
          />
        </ui-field>
        <ui-field
          label="50 minutes (EUR)"
          controlId="pf-50"
          [error]="shown() ? error50() : ''"
          [hint]="range(bounds().min50, bounds().max50)"
        >
          <input
            ui-text-field
            id="pf-50"
            inputmode="decimal"
            [invalid]="shown() && !!error50()"
            [value]="value50()"
            (input)="value50.set($any($event.target).value)"
          />
        </ui-field>
        <button ui-button type="submit">Save prices</button>
      </form>
    </ui-card>
  `,
})
export class PriceFormComponent {
  readonly bounds = input.required<PriceBounds>();
  readonly saved = output<Prices>();

  protected readonly value25 = signal('');
  protected readonly value50 = signal('');
  protected readonly shown = signal(false);
  protected readonly error25 = computed(() =>
    check(this.value25(), this.bounds().min25, this.bounds().max25, 25),
  );
  protected readonly error50 = computed(() =>
    check(this.value50(), this.bounds().min50, this.bounds().max50, 50),
  );

  protected range(min: number, max: number): string {
    return `Between ${formatMoney(min)} and ${formatMoney(max)}.`;
  }

  protected save(event: Event): void {
    event.preventDefault();
    this.shown.set(true);
    if (this.error25() || this.error50()) return;
    this.saved.emit({
      price25: Number(this.value25().replace(',', '.')),
      price50: Number(this.value50().replace(',', '.')),
    });
  }
}
