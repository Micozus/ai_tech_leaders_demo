import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card">
      <h2 class="card__heading">{{ heading() }}</h2>
      <div class="card__body"><ng-content /></div>
    </section>
  `,
  styleUrl: './_card.scss',
})
export class CardComponent {
  readonly heading = input.required<string>();
}
