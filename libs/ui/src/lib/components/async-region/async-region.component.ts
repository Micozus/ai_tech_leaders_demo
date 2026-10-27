import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { ErrorStateComponent } from '../error-state/error-state.component';
import { SkeletonComponent } from '../skeleton/skeleton.component';

export type AsyncState = 'loading' | 'empty' | 'error' | 'ready';

/**
 * One place for the four states of data that loads: a loading skeleton with a status text, an
 * empty state, an error state with a retry, and the content. Every list and detail in the product
 * uses it, so they all behave alike. Project the content, and actions with `uiEmptyAction` and
 * `uiErrorAction`.
 */
@Component({
  selector: 'ui-async-region',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EmptyStateComponent, ErrorStateComponent, SkeletonComponent],
  template: `
    @switch (state()) {
      @case ('loading') {
        <div [attr.aria-busy]="true">
          <p class="mb-groups text-meta text-muted" role="status">
            {{ loadingLabel() }}
          </p>
          <div class="grid gap-groups" aria-hidden="true">
            <ui-skeleton width="70%" />
            <ui-skeleton width="50%" />
            <ui-skeleton width="60%" />
          </div>
        </div>
      }
      @case ('empty') {
        <ui-empty-state
          [heading]="emptyHeading()"
          [description]="emptyDescription()"
        >
          <ng-content select="[uiEmptyAction]" />
        </ui-empty-state>
      }
      @case ('error') {
        <ui-error-state
          [heading]="errorHeading()"
          [description]="errorDescription()"
        >
          <ng-content select="[uiErrorAction]" />
        </ui-error-state>
      }
      @default {
        <ng-content />
      }
    }
  `,
})
export class AsyncRegionComponent {
  readonly state = input<AsyncState>('ready');
  readonly loadingLabel = input('Loading');
  readonly emptyHeading = input('Nothing here yet');
  readonly emptyDescription = input('');
  readonly errorHeading = input('This did not load');
  readonly errorDescription = input('Check your connection and try again.');
}
