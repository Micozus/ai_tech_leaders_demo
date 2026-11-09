import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SCREENS, SCREEN_NOTES, type ScreenId } from './prototype.model';

/** One screen of the prototype: the `.screen` > `.frame` structure the review engine expects. */
@Component({
  selector: 'proto-screen',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'screen', '[attr.id]': 'sid()' },
  template: `
    <p class="screen-meta">
      <strong>{{ sid() }}</strong> · {{ info().title }} · <code>{{ info().route }}</code> ·
      {{ info().stories }}
    </p>
    <div class="frame"><ng-content /></div>
    <aside class="notes" [attr.aria-label]="'Notatka do ekranu ' + sid()">
      <p><strong>Historie:</strong> {{ note().stories }}</p>
      <p><strong>Symulacja:</strong> {{ note().simulated }}</p>
      <p><strong>Nie rozstrzyga:</strong> {{ note().open }}</p>
    </aside>
  `,
})
export class ScreenFrameComponent {
  readonly sid = input.required<ScreenId>();
  protected readonly note = computed(() => SCREEN_NOTES[this.sid()]);
  protected readonly info = computed(
    () => SCREENS.find((screen) => screen.id === this.sid()) ?? SCREENS[0],
  );
}
