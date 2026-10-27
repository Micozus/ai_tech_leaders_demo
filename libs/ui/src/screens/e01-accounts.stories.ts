import { expect, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import {
  installApiMock,
  type ApiScenario,
} from '../../.storybook/blocks/api-mock';
import { SESSIONS } from '../../.storybook/blocks/sample-data';
import { postJson } from '../lib/helpers/submit-outcome.helper';
import { AccessDeniedComponent } from '../lib/product/accounts/access-denied.component';
import { AppHeaderComponent } from '../lib/product/accounts/app-header.component';
import {
  SignInPanelComponent,
  type Credentials,
} from '../lib/product/accounts/sign-in-panel.component';
import { PageHeaderComponent } from '../lib/components/page-header/page-header.component';
import { AsyncRegionComponent } from '../lib/components/async-region/async-region.component';
import { ButtonComponent } from '../lib/components/button/button.component';
import {
  TabPanelComponent,
  TabsComponent,
} from '../lib/components/tabs/tabs.component';
import { SessionRowComponent } from '../lib/product/booking/session-row.component';

const submitter = (value: Credentials) => postJson('/api/auth/sign-in', value);

const meta: Meta = {
  decorators: [
    moduleMetadata({
      imports: [
        AccessDeniedComponent,
        AppHeaderComponent,
        SignInPanelComponent,
        PageHeaderComponent,
        AsyncRegionComponent,
        ButtonComponent,
        TabsComponent,
        TabPanelComponent,
        SessionRowComponent,
      ],
    }),
  ],
  title: 'Product/E01 Accounts and roles/Screens',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

function signIn(api: ApiScenario, githubFailed = false): Story {
  return {
    beforeEach: () => installApiMock(api),
    render: () => ({
      props: { submitter, githubFailed },
      template: `<main class="grid min-h-screen place-items-center bg-canvas p-panel-roomy"><div class="w-full max-w-md"><ui-sign-in-panel [submitter]="submitter" [githubFailed]="githubFailed" /></div></main>`,
    }),
  };
}

/** Sign in: the idle screen. */
export const SignIn: Story = signIn('success');
export const SignInGithubFailed: Story = signIn('success', true);
export const SignInWrongPassword: Story = signIn('wrong-password');
export const SignInOffline: Story = signIn('offline');

function home(state: 'ready' | 'loading' | 'empty' | 'error'): Story {
  return {
    render: () => ({
      props: { state, sessions: state === 'ready' ? SESSIONS : [] },
      template: `
        <ui-app-header userName="Maciej Nowak" userRole="mentee" />
        <main class="mx-auto max-w-page p-panel-roomy">
          <ui-page-header heading="Your sessions" description="Written answers arrive here after each session."><button ui-button>Find a mentor</button></ui-page-header>
          <ui-tabs>
            <ui-tab-panel value="upcoming" label="Upcoming">
              <ui-async-region [state]="state" loadingLabel="Loading your sessions" emptyHeading="No sessions yet" emptyDescription="Book a mentor to get your first written answer." errorHeading="Sessions did not load">
                @for (s of sessions; track s.id) { <ui-session-row [session]="s" /> }
                <button uiEmptyAction ui-button>Find a mentor</button>
                <button uiErrorAction ui-button variant="quiet">Try again</button>
              </ui-async-region>
            </ui-tab-panel>
            <ui-tab-panel value="past" label="Past"><p class="text-body">Completed sessions and their written answers.</p></ui-tab-panel>
          </ui-tabs>
        </main>`,
    }),
  };
}

/** Mentee home. The four data states of the sessions list. */
export const MenteeHome: Story = home('ready');
export const MenteeHomeLoading: Story = home('loading');
export const MenteeHomeEmpty: Story = home('empty');
export const MenteeHomeError: Story = home('error');

export const AccessDenied: Story = {
  render: () => ({
    template: `<ui-app-header userName="Maciej Nowak" userRole="mentee" /><main class="mx-auto max-w-page p-panel-roomy"><ui-access-denied reason="no-access" /></main>`,
  }),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('You do not have access to this page'),
    ).toBeVisible();
  },
};

export const SignedOutVisitorSentToSignIn: Story = {
  render: () => ({
    template: `<main class="mx-auto max-w-page p-panel-roomy"><ui-access-denied reason="signed-out" /></main>`,
  }),
};
