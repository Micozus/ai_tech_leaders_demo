import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { AccessDeniedComponent } from './access-denied.component';

const meta: Meta<AccessDeniedComponent> = {
  decorators: [moduleMetadata({ imports: [AccessDeniedComponent] })],
  title: 'Product/E01 Accounts and roles/Access denied',
  component: AccessDeniedComponent,
  render: (args) => ({
    props: args,
    template: `<div class="max-w-measure p-panel-roomy"><ui-access-denied [reason]="reason" /></div>`,
  }),
  args: { reason: 'no-access' },
  argTypes: {
    reason: { control: 'inline-radio', options: ['no-access', 'signed-out'] },
  },
};
export default meta;

type Story = StoryObj<AccessDeniedComponent>;

export const Playground: Story = {};
export const SignedOut: Story = { args: { reason: 'signed-out' } };

export const StateMatrix: Story = {
  render: () => ({
    template: `<div class="grid max-w-measure gap-groups p-panel-roomy"><ui-access-denied reason="no-access" /><ui-access-denied reason="signed-out" /></div>`,
  }),
};

export const LongText: Story = {
  render: () => ({
    template: `<div class="p-panel-roomy" style="width: 22rem"><ui-access-denied reason="no-access" homeHref="/mentee" /></div>`,
  }),
};

export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    template: `<div class="p-panel" style="width: 20rem"><ui-access-denied reason="signed-out" /></div>`,
  }),
};
