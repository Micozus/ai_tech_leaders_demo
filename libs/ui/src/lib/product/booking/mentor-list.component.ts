import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from '@angular/core';
import {
  AsyncRegionComponent,
  type AsyncState,
} from '../../components/async-region/async-region.component';
import { ButtonComponent } from '../../components/button/button.component';
import type { MentorSummary, StackTag } from '../models/product.model';
import { MentorListRowComponent } from './mentor-list-row.component';
import { StackTagFilterComponent } from './stack-tag-filter.component';

/**
 * The mentor list (E03-S01): filtered by stack tag, ordered by the most recent published availability,
 * never by a score (R13). It has two different empty states: nothing for the filters (clear them) and
 * nothing yet (the list itself is empty), plus loading and error with a retry.
 */
@Component({
  selector: 'ui-mentor-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncRegionComponent,
    ButtonComponent,
    MentorListRowComponent,
    StackTagFilterComponent,
  ],
  template: `
    <div class="grid gap-panel-roomy md:grid-cols-4">
      <div class="md:col-span-1">
        <ui-stack-tag-filter
          [resultCount]="visible().length"
          [(selected)]="selected"
        />
      </div>
      <div class="md:col-span-3">
        <ui-async-region
          [state]="region()"
          loadingLabel="Loading mentors"
          [emptyHeading]="
            selected().length > 0
              ? 'No mentors for these filters'
              : 'No mentors yet'
          "
          [emptyDescription]="
            selected().length > 0
              ? 'Remove a stack tag to see more mentors.'
              : 'Mentors join by invitation. Check back soon.'
          "
          errorHeading="Mentors did not load"
        >
          <div role="list">
            @for (mentor of visible(); track mentor.id) {
              <div role="listitem">
                <ui-mentor-list-row
                  [mentor]="mentor"
                  (view)="view.emit($event)"
                />
              </div>
            }
          </div>
          <button
            uiEmptyAction
            ui-button
            variant="quiet"
            type="button"
            (click)="clear()"
          >
            Clear filters
          </button>
          <button
            uiErrorAction
            ui-button
            variant="quiet"
            type="button"
            (click)="retry.emit()"
          >
            Try again
          </button>
        </ui-async-region>
      </div>
    </div>
  `,
})
export class MentorListComponent {
  readonly mentors = input<readonly MentorSummary[]>([]);
  readonly state = input<'loading' | 'error' | 'ready'>('ready');
  readonly selected = model<readonly StackTag[]>([]);
  readonly view = output<string>();
  readonly retry = output<void>();

  protected readonly visible = computed(() => {
    const tags = this.selected();
    const list = this.mentors();
    return tags.length === 0
      ? list
      : list.filter((m) => m.tags.some((tag) => tags.includes(tag)));
  });

  protected readonly region = computed<AsyncState>(() => {
    const state = this.state();
    if (state !== 'ready') return state;
    return this.visible().length === 0 ? 'empty' : 'ready';
  });

  protected clear(): void {
    this.selected.set([]);
  }
}
