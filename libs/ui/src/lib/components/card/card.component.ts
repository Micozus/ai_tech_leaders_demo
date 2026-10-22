import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

export type CardDensity = 'dense' | 'roomy';
export type CardHeadingLevel = 2 | 3 | 4;

/**
 * A panel: a 1px line, no shadow, no panel inside a panel (A01). `dense` is for lists and data,
 * `roomy` for sessions, forms and detail views (P10). The heading level keeps the page outline
 * in order (WCAG 1.3.1).
 */
@Component({
  selector: 'ui-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [class]="classes()">
      <div
        role="heading"
        class="card__heading mb-groups text-section-title"
        [attr.aria-level]="headingLevel()"
      >
        {{ heading() }}
      </div>
      <div class="card__body block"><ng-content /></div>
    </section>
  `,
})
export class CardComponent {
  readonly heading = input.required<string>();
  readonly density = input<CardDensity>('dense');
  readonly headingLevel = input<CardHeadingLevel>(2);

  protected readonly classes = computed(
    () =>
      `card rounded-panel border border-solid border-line bg-surface ${
        this.density() === 'roomy' ? 'p-panel-roomy' : 'p-panel'
      }`,
  );
}
