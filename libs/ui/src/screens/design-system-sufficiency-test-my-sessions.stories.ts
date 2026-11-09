import { expect, userEvent, waitFor, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { Component, computed, input, signal } from '@angular/core';
import { SESSIONS } from '../../.storybook/blocks/sample-data';
import {
  AsyncRegionComponent,
  type AsyncState,
} from '../lib/components/async-region/async-region.component';
import { BadgeComponent } from '../lib/components/badge/badge.component';
import { ButtonComponent } from '../lib/components/button/button.component';
import { CheckboxComponent } from '../lib/components/checkbox/checkbox.component';
import { PageHeaderComponent } from '../lib/components/page-header/page-header.component';
import { AppHeaderComponent } from '../lib/product/accounts/app-header.component';
import { SessionRowComponent } from '../lib/product/booking/session-row.component';
import type {
  SessionStatus,
  SessionSummary,
} from '../lib/product/models/product.model';

/**
 * Design-system-sufficiency test screen (not a shipped product screen): can "My sessions" grow a
 * status filter using only what already exists? Decision log and gap report:
 * .ai/runs/2026-11-09-design-system-test-my-sessions.md
 */

// No shared list of SessionStatus values, and no exported status-to-label map: session-row.component.ts
// keeps its own copy as a module-private constant. Duplicated here (see the run log, GAP-1).
const STATUSES: readonly SessionStatus[] = [
  'awaiting-payment',
  'booked',
  'completed',
  'cancelled',
];
const STATUS_LABEL: Record<SessionStatus, string> = {
  'awaiting-payment': 'Awaiting payment',
  booked: 'Booked',
  cancelled: 'Cancelled',
  completed: 'Completed',
};

@Component({
  selector: 'ui-doc-my-sessions',
  imports: [
    AppHeaderComponent,
    AsyncRegionComponent,
    BadgeComponent,
    ButtonComponent,
    CheckboxComponent,
    PageHeaderComponent,
    SessionRowComponent,
  ],
  template: `
    <ui-app-header userName="Maciej Nowak" userRole="mentee" />
    <main class="mx-auto max-w-page p-panel-roomy">
      <ui-page-header heading="My sessions" />
      <div class="grid gap-panel-roomy md:grid-cols-4">
        <div class="md:col-span-1">
          <fieldset class="m-0 min-w-0 border-0 p-0">
            <legend class="mb-group p-0 text-label text-ink">Status</legend>
            <div class="grid gap-group">
              @for (s of statuses; track s) {
                <label ui-checkbox>
                  <input
                    type="checkbox"
                    [checked]="selected().includes(s)"
                    (change)="toggle(s)"
                  />
                  {{ statusLabel[s] }}
                </label>
              }
            </div>
          </fieldset>
          @if (selected().length > 0) {
            <div class="mt-group flex flex-wrap items-center gap-group">
              @for (s of selected(); track s) {
                <span class="inline-flex items-center gap-group">
                  <ui-badge tone="accent">{{ statusLabel[s] }}</ui-badge>
                  <button
                    ui-button
                    variant="ghost"
                    size="sm"
                    type="button"
                    [attr.aria-label]="'Remove ' + statusLabel[s] + ' filter'"
                    (click)="toggle(s)"
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
                (click)="clear()"
              >
                Clear filters
              </button>
            </div>
          }
        </div>
        <div class="md:col-span-3">
          <ui-async-region
            [state]="region()"
            loadingLabel="Loading your sessions"
            [emptyHeading]="
              selected().length > 0
                ? 'No sessions for these filters'
                : 'No sessions yet'
            "
            [emptyDescription]="
              selected().length > 0
                ? 'Remove a status filter to see more sessions.'
                : 'Book a mentor to get your first written answer.'
            "
            errorHeading="Sessions did not load"
          >
            @for (s of visible(); track s.id) {
              <ui-session-row [session]="s" />
            }
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
class MySessionsComponent {
  readonly state = input<'loading' | 'error' | 'ready'>('ready');
  readonly sessions = input<readonly SessionSummary[]>(SESSIONS);
  readonly statuses = STATUSES;
  readonly statusLabel = STATUS_LABEL;

  readonly selected = signal<readonly SessionStatus[]>([]);

  readonly visible = computed(() => {
    const statuses = this.selected();
    const list = this.sessions();
    return statuses.length === 0
      ? list
      : list.filter((s) => statuses.includes(s.status));
  });

  readonly region = computed<AsyncState>(() => {
    const state = this.state();
    if (state !== 'ready') return state;
    return this.visible().length === 0 ? 'empty' : 'ready';
  });

  toggle(status: SessionStatus): void {
    this.selected.update((list) =>
      list.includes(status)
        ? list.filter((s) => s !== status)
        : [...list, status],
    );
  }

  clear(): void {
    this.selected.set([]);
  }
}

const meta: Meta = {
  decorators: [moduleMetadata({ imports: [MySessionsComponent] })],
  title: 'Design system sufficiency test/My sessions',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

function screen(
  state: 'ready' | 'loading' | 'error',
  sessions: readonly SessionSummary[] = SESSIONS,
): Story {
  return {
    render: () => ({
      props: { state, sessions },
      template: `<ui-doc-my-sessions [state]="state" [sessions]="sessions" />`,
    }),
  };
}

/** The screen and its data states. */
export const Ready: Story = screen('ready');
export const Loading: Story = screen('loading');
export const NothingYet: Story = screen('ready', []);
export const SessionsDidNotLoad: Story = screen('error');

export const FilterNarrowsTheList: Story = {
  render: () => ({ template: `<ui-doc-my-sessions />` }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('article')).toHaveLength(3);
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Booked' }));
    await waitFor(() => expect(canvas.getAllByRole('article')).toHaveLength(1));
    await expect(
      canvas.getByRole('button', { name: 'Remove Booked filter' }),
    ).toBeVisible();
  },
};

export const NothingForTheFilterOffersToClearIt: Story = {
  render: () => ({ template: `<ui-doc-my-sessions />` }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Cancelled' }));
    await expect(
      await canvas.findByText('No sessions for these filters'),
    ).toBeVisible();
    const clears = canvas.getAllByRole('button', { name: 'Clear filters' });
    await userEvent.click(clears[clears.length - 1]);
    await waitFor(() => expect(canvas.getAllByRole('article')).toHaveLength(3));
  },
};

export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({ template: `<ui-doc-my-sessions />` }),
};
