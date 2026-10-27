import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
} from '@angular/core';
import { ButtonComponent } from '../../components/button/button.component';
import { CardComponent } from '../../components/card/card.component';
import { FieldComponent } from '../../components/field/field.component';
import { TextFieldComponent } from '../../components/text-field/text-field.component';

export interface PriceBoundsInput {
  readonly min25: number;
  readonly max25: number;
  readonly min50: number;
  readonly max50: number;
  readonly feePercent: number;
}

/** Operator: the bounds mentors set prices within, and the platform fee (E05-S02, R08, R10). */
@Component({
  selector: 'ui-price-bounds-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, CardComponent, FieldComponent, TextFieldComponent],
  template: `
    <ui-card heading="Price bounds and fee" density="roomy">
      <form novalidate (submit)="save($event)">
        @for (f of fields; track f.id) {
          <ui-field
            [label]="f.label"
            [controlId]="f.id"
            [error]="shown() ? (errors()[f.key] ?? '') : ''"
          >
            <input
              ui-text-field
              [id]="f.id"
              inputmode="decimal"
              [invalid]="shown() && !!errors()[f.key]"
              [value]="values()[f.key]"
              (input)="set(f.key, $any($event.target).value)"
            />
          </ui-field>
        }
        <button ui-button type="submit">Save bounds and fee</button>
      </form>
    </ui-card>
  `,
})
export class PriceBoundsFormComponent {
  readonly saved = output<PriceBoundsInput>();

  protected readonly fields = [
    { id: 'pb-min25', key: 'min25', label: 'Lowest price, 25 minutes (EUR)' },
    { id: 'pb-max25', key: 'max25', label: 'Highest price, 25 minutes (EUR)' },
    { id: 'pb-min50', key: 'min50', label: 'Lowest price, 50 minutes (EUR)' },
    { id: 'pb-max50', key: 'max50', label: 'Highest price, 50 minutes (EUR)' },
    { id: 'pb-fee', key: 'feePercent', label: 'Platform fee (percent)' },
  ] as const;
  protected readonly values = signal<Record<string, string>>({
    min25: '',
    max25: '',
    min50: '',
    max50: '',
    feePercent: '',
  });
  protected readonly shown = signal(false);

  protected set(key: string, value: string): void {
    this.values.update((current) => ({ ...current, [key]: value }));
  }

  protected errors(): Record<string, string> {
    const v = this.values();
    const n = (key: string): number => Number(v[key].replace(',', '.'));
    const errors: Record<string, string> = {};
    for (const f of this.fields) {
      if (!v[f.key].trim() || Number.isNaN(n(f.key)) || n(f.key) < 0)
        errors[f.key] = 'Enter a number, zero or more.';
    }
    if (!errors['max25'] && !errors['min25'] && n('max25') < n('min25'))
      errors['max25'] = 'The highest price cannot be below the lowest.';
    if (!errors['max50'] && !errors['min50'] && n('max50') < n('min50'))
      errors['max50'] = 'The highest price cannot be below the lowest.';
    if (!errors['feePercent'] && n('feePercent') > 100)
      errors['feePercent'] = 'The fee is a percentage up to 100.';
    return errors;
  }

  protected save(event: Event): void {
    event.preventDefault();
    this.shown.set(true);
    if (Object.keys(this.errors()).length > 0) return;
    const v = this.values();
    const n = (key: string): number => Number(v[key].replace(',', '.'));
    this.saved.emit({
      min25: n('min25'),
      max25: n('max25'),
      min50: n('min50'),
      max50: n('max50'),
      feePercent: n('feePercent'),
    });
  }
}
