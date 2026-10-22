import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="card rounded-panel border border-solid border-line bg-surface p-panel"
    >
      <h2 class="card__heading mb-groups text-section-title">
        {{ heading() }}
      </h2>
      <div class="card__body block"><ng-content /></div>
    </section>
  `,
})
export class CardComponent {
  readonly heading = input.required<string>();
}
