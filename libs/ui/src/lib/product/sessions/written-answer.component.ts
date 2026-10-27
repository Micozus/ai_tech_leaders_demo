import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  AsyncRegionComponent,
  type AsyncState,
} from '../../components/async-region/async-region.component';
import { CardComponent } from '../../components/card/card.component';

/** The mentor's written answer, shown to the mentee after the session (E04-S02). Running text at the reading measure. */
@Component({
  selector: 'ui-written-answer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncRegionComponent, CardComponent],
  template: `
    <ui-card heading="Written answer" density="roomy">
      <ui-async-region
        [state]="state()"
        loadingLabel="Loading the answer"
        emptyHeading="The answer is not ready yet"
        emptyDescription="The mentor writes it after the session. You will be told when it is here."
        errorHeading="The answer did not load"
      >
        <p class="mb-groups text-meta text-muted">
          <span class="font-bold text-ink">{{ author() }}</span> · {{ at() }}
        </p>
        <p class="max-w-measure whitespace-pre-line text-body-long">
          {{ body() }}
        </p>
        <p class="mt-groups text-meta text-muted">
          Only you and the mentor can read this.
        </p>
      </ui-async-region>
    </ui-card>
  `,
})
export class WrittenAnswerComponent {
  readonly author = input('Ada Lovelace');
  readonly at = input('Thu 5 Nov, 15:02');
  readonly body = input('');
  readonly state = input<AsyncState>('ready');
}
