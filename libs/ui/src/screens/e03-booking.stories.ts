import { expect, userEvent, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import {
  installApiMock,
  type ApiScenario,
} from '../../.storybook/blocks/api-mock';
import {
  MANY_MENTORS,
  MENTORS,
  NOW,
  SESSIONS,
  SLOTS,
} from '../../.storybook/blocks/sample-data';
import { AsyncRegionComponent } from '../lib/components/async-region/async-region.component';
import { ButtonComponent } from '../lib/components/button/button.component';
import { ConfirmDialogComponent } from '../lib/components/confirm-dialog/confirm-dialog.component';
import { PageHeaderComponent } from '../lib/components/page-header/page-header.component';
import {
  TabPanelComponent,
  TabsComponent,
} from '../lib/components/tabs/tabs.component';
import { postJson } from '../lib/helpers/submit-outcome.helper';
import { AppHeaderComponent } from '../lib/product/accounts/app-header.component';
import { BookingFlowComponent } from '../lib/product/booking/booking-flow.component';
import { MentorDetailComponent } from '../lib/product/booking/mentor-detail.component';
import { MentorListComponent } from '../lib/product/booking/mentor-list.component';
import { SessionRowComponent } from '../lib/product/booking/session-row.component';

const payer = () => postJson('/api/payments', {});

const meta: Meta = {
  decorators: [
    moduleMetadata({
      imports: [
        AppHeaderComponent,
        AsyncRegionComponent,
        BookingFlowComponent,
        ButtonComponent,
        ConfirmDialogComponent,
        MentorDetailComponent,
        MentorListComponent,
        PageHeaderComponent,
        SessionRowComponent,
        TabPanelComponent,
        TabsComponent,
      ],
    }),
  ],
  title: 'Product/E03 Booking and payment/Screens',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

function list(
  mentors: readonly unknown[],
  state: 'ready' | 'loading' | 'error',
): Story {
  return {
    render: () => ({
      props: { mentors, state },
      template: `
        <ui-app-header userName="Maciej Nowak" userRole="mentee" />
        <main class="mx-auto max-w-page p-panel-roomy">
          <ui-page-header heading="Find a mentor" description="Choose by their public work and their stack tags." />
          <ui-mentor-list [mentors]="mentors" [state]="state" />
        </main>`,
    }),
  };
}

/** The mentor list screen and its data states. Nothing for the filters is a story of the pattern. */
export const MentorList: Story = list(MENTORS, 'ready');
export const MentorListMany: Story = list(MANY_MENTORS, 'ready');
export const MentorListLoading: Story = list([], 'loading');
export const MentorListNothingYet: Story = list([], 'ready');
export const MentorListError: Story = list([], 'error');

function mentor(
  state: 'ready' | 'loading' | 'not-found',
  api: ApiScenario = 'success',
): Story {
  return {
    beforeEach: () => installApiMock(api),
    render: () => ({
      props: {
        m: state === 'not-found' ? undefined : MENTORS[0],
        state,
        payer,
        slots: SLOTS,
        now: NOW,
      },
      template: `
        <ui-app-header userName="Maciej Nowak" userRole="mentee" />
        <main class="mx-auto max-w-page p-panel-roomy">
          <ui-mentor-detail [mentor]="m" about="I mentor developers who are blocked on TypeScript generics and React rendering." [state]="state" />
          @if (state === 'ready') {
            <section class="mt-section" aria-labelledby="bk"><h2 id="bk" class="mb-groups text-section-title">Book a session</h2>
              <ui-booking-flow mentorName="Ada Lovelace" [slots]="slots" [now]="now" [price25]="25" [price50]="45" [payer]="payer" /></section>
          }
        </main>`,
    }),
  };
}

/** A mentor's page with booking on it. */
export const MentorPage: Story = mentor('ready');
export const MentorPageLoading: Story = mentor('loading');
export const MentorPageNotFound: Story = mentor('not-found');
export const MentorPagePaymentFails: Story = {
  ...mentor('ready', 'server-error'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: /16:00/ }));
    await userEvent.click(
      canvas.getByRole('button', { name: 'Continue to payment' }),
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Pay €45.00' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent(
      'Payment failed',
    );
  },
};

function sessions(state: 'ready' | 'loading' | 'empty' | 'error'): Story {
  return {
    render: () => ({
      props: {
        state,
        sessions: state === 'ready' ? SESSIONS : [],
        open: false,
      },
      template: `
        <ui-app-header userName="Maciej Nowak" userRole="mentee" />
        <main class="mx-auto max-w-page p-panel-roomy">
          <ui-page-header heading="Your sessions" />
          <ui-async-region [state]="state" loadingLabel="Loading your sessions" emptyHeading="No sessions yet" emptyDescription="Book a mentor to get your first written answer." errorHeading="Sessions did not load">
            @for (s of sessions; track s.id) { <ui-session-row [session]="s" (cancelBooking)="open = true" /> }
            <button uiEmptyAction ui-button>Find a mentor</button>
            <button uiErrorAction ui-button variant="quiet">Try again</button>
          </ui-async-region>
          <ui-confirm-dialog heading="Cancel this booking?" objectName="Architecture review of the billing service with Ada Lovelace, Thu 5 Nov, 14:00"
            description="You can cancel for free until Wed 4 Nov, 14:00." confirmLabel="Cancel booking" cancelLabel="Keep booking" [(open)]="open" />
        </main>`,
    }),
  };
}

/** My sessions: list, loading, empty, error; cancelling opens the confirmation. */
export const MySessions: Story = sessions('ready');
export const MySessionsLoading: Story = sessions('loading');
export const MySessionsEmpty: Story = sessions('empty');
export const MySessionsError: Story = sessions('error');
