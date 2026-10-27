import { expect, userEvent, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { InvitationAcceptPanelComponent } from './invitation-accept-panel.component';

const meta: Meta<InvitationAcceptPanelComponent> = {
  decorators: [moduleMetadata({ imports: [InvitationAcceptPanelComponent] })],
  title: 'Product/E02 Mentors become bookable/Invitation accept panel',
  component: InvitationAcceptPanelComponent,
  render: (args) => ({
    props: { ...args, accepted: 0 },
    template: `<div class="max-w-measure p-panel-roomy"><ui-invitation-accept-panel [state]="state" [inviter]="inviter" (accept)="accepted = accepted + 1" /><p class="mt-groups text-body" role="status">Accepted: {{ accepted }}</p></div>`,
  }),
  args: { state: 'ready', inviter: 'The DevMentor operators' },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: ['loading', 'ready', 'invalid'],
    },
  },
};
export default meta;

type Story = StoryObj<InvitationAcceptPanelComponent>;

export const Playground: Story = {};
export const Loading: Story = { args: { state: 'loading' } };
export const Invalid: Story = { args: { state: 'invalid' } };

export const StateMatrix: Story = {
  render: () => ({
    template: `<div class="grid max-w-measure gap-groups p-panel-roomy"><ui-invitation-accept-panel state="ready" /><ui-invitation-accept-panel state="loading" /><ui-invitation-accept-panel state="invalid" /></div>`,
  }),
};

export const LongText: Story = {
  args: {
    inviter:
      'Maximilian Alexander Konstantinopoulos-Wiśniewski and the DevMentor operators',
  },
};
export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const AcceptsWithTheKeyboard: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(
      canvas.getByRole('button', { name: 'Accept the invitation' }),
    ).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('status')).toHaveTextContent('Accepted: 1');
  },
};
