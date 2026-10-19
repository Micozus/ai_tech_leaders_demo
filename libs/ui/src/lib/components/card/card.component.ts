import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="card rounded-xl border border-solid border-line bg-surface p-6 shadow-card"
    >
      <h2 class="card__heading mb-4 text-lg font-bold tracking-tight">
        {{ heading() }}
      </h2>
      <div class="card__body block"><ng-content /></div>
    </section>
  `,
})
export class CardComponent {
  readonly heading = input.required<string>();
}
