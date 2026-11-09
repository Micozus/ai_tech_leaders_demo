import { expect, userEvent, waitFor, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { Component, computed, input, output, signal } from '@angular/core';
import {
  AsyncRegionComponent,
  type AsyncState,
} from '../lib/components/async-region/async-region.component';
import { AvatarComponent } from '../lib/components/avatar/avatar.component';
import { BadgeComponent } from '../lib/components/badge/badge.component';
import { ButtonComponent } from '../lib/components/button/button.component';
import { PageHeaderComponent } from '../lib/components/page-header/page-header.component';
import { AppHeaderComponent } from '../lib/product/accounts/app-header.component';
import { StackTagFilterComponent } from '../lib/product/booking/stack-tag-filter.component';
import type {
  MentorSummary,
  StackTag,
} from '../lib/product/models/product.model';

/**
 * Design-system-sufficiency test screen (not a shipped product screen): "Favorite mentors" for a
 * mentee, filtered by stack tag. Decision log and gap report:
 * .ai/runs/2026-11-09-design-system-test-favorite-mentors.md
 */

// MentorSummary has no professional-headline field (GAP-2, see the run log); the favorites
// concept itself does not exist in the model either (GAP-3). Local, display-only shape, sample
// data only, not wired to a backend.
type FavoriteMentor = Pick<MentorSummary, 'id' | 'name' | 'tags'> & {
  readonly headline: string;
};

const FAVORITES: readonly FavoriteMentor[] = [
  {
    id: 'm1',
    name: 'Ada Lovelace',
    headline: 'Staff engineer, TypeScript and React',
    tags: ['TypeScript', 'React'],
  },
  {
    id: 'm2',
    name: 'Grace Hopper',
    headline: 'AI agents and evaluation pipelines',
    tags: ['Python', 'AI agents'],
  },
  {
    id: 'm3',
    name: 'Linus Torvalds',
    headline: 'Kernel and systems programming',
    tags: ['Python'],
  },
];

@Component({
  selector: 'ui-doc-favorite-mentors',
  imports: [
    AppHeaderComponent,
    AsyncRegionComponent,
    AvatarComponent,
    BadgeComponent,
    ButtonComponent,
    PageHeaderComponent,
    StackTagFilterComponent,
  ],
  template: `
    <ui-app-header userName="Maciej Nowak" userRole="mentee" />
    <main class="mx-auto max-w-page p-panel-roomy">
      <ui-page-header heading="Favorite mentors" />
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
            loadingLabel="Loading your favorite mentors"
            [emptyHeading]="
              selected().length > 0
                ? 'No favorites for these filters'
                : 'No favorite mentors yet'
            "
            [emptyDescription]="
              selected().length > 0
                ? 'Remove a stack tag to see more of your favorites.'
                : 'Save a mentor from their profile to find them here.'
            "
            errorHeading="Favorites did not load"
          >
            <div role="list">
              @for (mentor of visible(); track mentor.id) {
                <div
                  role="listitem"
                  class="flex flex-wrap items-start gap-groups border-t border-solid border-line px-row-x py-row-y"
                >
                  <ui-avatar [name]="mentor.name" />
                  <div class="min-w-0 flex-1">
                    <h3 class="text-section-title">{{ mentor.name }}</h3>
                    <p class="text-body text-muted">{{ mentor.headline }}</p>
                    <div class="my-group flex flex-wrap gap-group">
                      @for (tag of mentor.tags; track tag) {
                        <ui-badge>{{ tag }}</ui-badge>
                      }
                    </div>
                  </div>
                  <div class="flex gap-group">
                    <button
                      ui-button
                      variant="soft"
                      size="sm"
                      type="button"
                      (click)="view.emit(mentor.id)"
                    >
                      View profile
                    </button>
                    <button
                      ui-button
                      variant="quiet"
                      size="sm"
                      type="button"
                      (click)="remove(mentor.id)"
                    >
                      Remove from favorites
                    </button>
                  </div>
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
            <button uiErrorAction ui-button variant="quiet" type="button">
              Try again
            </button>
          </ui-async-region>
        </div>
      </div>
    </main>
  `,
})
class FavoriteMentorsComponent {
  readonly state = input<'loading' | 'error' | 'ready'>('ready');
  readonly mentors = input<readonly FavoriteMentor[]>(FAVORITES);
  readonly view = output<string>();

  readonly selected = signal<readonly StackTag[]>([]);
  readonly #removed = signal<readonly string[]>([]);

  readonly visible = computed(() => {
    const tags = this.selected();
    const removed = this.#removed();
    const list = this.mentors().filter((m) => !removed.includes(m.id));
    return tags.length === 0
      ? list
      : list.filter((m) => m.tags.some((t) => tags.includes(t)));
  });

  readonly region = computed<AsyncState>(() => {
    const state = this.state();
    if (state !== 'ready') return state;
    return this.visible().length === 0 ? 'empty' : 'ready';
  });

  remove(id: string): void {
    this.#removed.update((list) => [...list, id]);
  }

  clear(): void {
    this.selected.set([]);
  }
}

const meta: Meta = {
  decorators: [moduleMetadata({ imports: [FavoriteMentorsComponent] })],
  title: 'Design system sufficiency test/Favorite mentors',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

function screen(
  state: 'ready' | 'loading' | 'error',
  mentors: readonly FavoriteMentor[] = FAVORITES,
): Story {
  return {
    render: () => ({
      props: { state, mentors },
      template: `<ui-doc-favorite-mentors [state]="state" [mentors]="mentors" />`,
    }),
  };
}

/** The screen and its data states. */
export const Ready: Story = screen('ready');
export const Loading: Story = screen('loading');
export const NobodySavedYet: Story = screen('ready', []);
export const FavoritesDidNotLoad: Story = screen('error');

export const FilterNarrowsTheList: Story = {
  render: () => ({ template: `<ui-doc-favorite-mentors />` }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('listitem')).toHaveLength(3);
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Python' }));
    await waitFor(() =>
      expect(canvas.getAllByRole('listitem')).toHaveLength(2),
    );
    await expect(
      canvas.getByRole('button', { name: 'Remove Python filter' }),
    ).toBeVisible();
  },
};

export const NothingForTheFiltersOffersToClearThem: Story = {
  render: () => ({
    props: { mentors: [FAVORITES[0]] },
    template: `<ui-doc-favorite-mentors [mentors]="mentors" />`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Python' }));
    await expect(
      await canvas.findByText('No favorites for these filters'),
    ).toBeVisible();
    const clears = canvas.getAllByRole('button', { name: 'Clear filters' });
    await userEvent.click(clears[clears.length - 1]);
    await waitFor(() =>
      expect(canvas.getAllByRole('listitem')).toHaveLength(1),
    );
  },
};

export const RemovingHidesTheCard: Story = {
  render: () => ({ template: `<ui-doc-favorite-mentors />` }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getAllByRole('button', { name: 'Remove from favorites' })[0],
    );
    await waitFor(() =>
      expect(canvas.getAllByRole('listitem')).toHaveLength(2),
    );
  },
};

export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({ template: `<ui-doc-favorite-mentors />` }),
};
