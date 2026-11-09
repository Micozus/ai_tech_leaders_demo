import { expect, userEvent, waitFor, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import {
  installApiMock,
  type ApiScenario,
} from '../../../../.storybook/blocks/api-mock';
import { postJson } from '../../helpers/submit-outcome.helper';
import {
  SignInPanelComponent,
  type Credentials,
} from './sign-in-panel.component';

const submitter = (value: Credentials) => postJson('/api/auth/sign-in', value);

function story(
  scenario: ApiScenario,
  githubFailed = false,
): StoryObj<SignInPanelComponent> {
  return {
    beforeEach: () => installApiMock(scenario),
    render: () => ({
      props: { submitter, githubFailed, signedInCount: 0 },
      template: `<div class="max-w-measure p-panel-roomy"><ui-sign-in-panel [submitter]="submitter" [githubFailed]="githubFailed" (signedIn)="signedInCount = signedInCount + 1" /><p class="mt-groups text-body" role="status">Signed in: {{ signedInCount }}</p></div>`,
    }),
  };
}

const meta: Meta<SignInPanelComponent> = {
  decorators: [moduleMetadata({ imports: [SignInPanelComponent] })],
  title: 'Product/E01 Accounts and roles/Sign-in panel',
  component: SignInPanelComponent,
};
export default meta;

type Story = StoryObj<SignInPanelComponent>;

export const Playground: Story = story('success');
export const GithubFailed: Story = story('success', true);
export const WrongPassword: Story = story('wrong-password');
export const ServerError: Story = story('server-error');
export const Offline: Story = story('offline');
export const Submitting: Story = story('pending');
export const StateMatrix: Story = story('success');

export const LongText: Story = {
  ...story('wrong-password', true),
};

export const NarrowScreen: Story = {
  ...story('success'),
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const SignsInAfterTheServerConfirms: Story = {
  ...story('success'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Sign in' }));
    await expect(canvas.getByLabelText('Email')).toHaveFocus();
    await expect(canvas.getByText('Enter your email.')).toBeVisible();
    await userEvent.type(canvas.getByLabelText('Email'), 'ada@example.com');
    await userEvent.type(canvas.getByLabelText('Password'), 'secret');
    await userEvent.click(canvas.getByRole('button', { name: 'Sign in' }));
    await waitFor(() =>
      expect(canvas.getByRole('status')).toHaveTextContent('Signed in: 1'),
    );
  },
};
