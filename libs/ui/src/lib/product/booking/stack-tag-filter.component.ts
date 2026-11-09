import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { BadgeComponent } from '../../components/badge/badge.component';
import { ButtonComponent } from '../../components/button/button.component';
import { CheckboxComponent } from '../../components/checkbox/checkbox.component';
import { STACK_TAGS, type StackTag } from '../models/product.model';

/**
 * The only filter of the mentor list (R13): the four stack tags, the number of results, the active
 * filters you can remove, and a way to clear them all. No search, no sort by score.
 */
@Component({
  selector: 'ui-stack-tag-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeComponent, ButtonComponent, CheckboxComponent],
  template: `
    <fieldset class="m-0 min-w-0 border-0 p-0">
      <legend class="mb-group p-0 text-label text-ink">Stack tags</legend>
      <div class="grid gap-group">
        @for (tag of tags(); track tag) {
          <label ui-checkbox>
            <input
              type="checkbox"
              [checked]="selected().includes(tag)"
              (change)="toggle(tag)"
            />
            {{ tag }}
          </label>
        }
      </div>
    </fieldset>
    <p class="mt-groups text-body" role="status">
      {{ resultCount() }} {{ resultCount() === 1 ? 'mentor' : 'mentors' }}
    </p>
    @if (selected().length > 0) {
      <div class="mt-group flex flex-wrap items-center gap-group">
        @for (tag of selected(); track tag) {
          <span class="inline-flex items-center gap-group">
            <ui-badge tone="accent">{{ tag }}</ui-badge>
            <button
              ui-button
              variant="ghost"
              size="sm"
              type="button"
              [attr.aria-label]="'Remove ' + tag + ' filter'"
              (click)="toggle(tag)"
            >
              <i class="pi pi-times" aria-hidden="true"></i>
            </button>
          </span>
        }
        <button
          ui-button
          variant="ghost"
          size="sm"
          type="button"
          (click)="selected.set([])"
        >
          Clear filters
        </button>
      </div>
    }
  `,
})
export class StackTagFilterComponent {
  readonly tags = input<readonly StackTag[]>(STACK_TAGS);
  readonly resultCount = input.required<number>();
  readonly selected = model<readonly StackTag[]>([]);

  protected toggle(tag: StackTag): void {
    this.selected.update((list) =>
      list.includes(tag) ? list.filter((t) => t !== tag) : [...list, tag],
    );
  }
}
