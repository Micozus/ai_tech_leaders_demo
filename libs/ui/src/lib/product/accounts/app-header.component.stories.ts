import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { AppHeaderComponent } from './app-header.component';

const meta: Meta<AppHeaderComponent> = {
  decorators: [moduleMetadata({ imports: [AppHeaderComponent] })],
  title: 'Product/E01 Accounts and roles/App header',
  component: AppHeaderComponent,
  parameters: { layout: 'fullscreen' },
  render: (args) => ({
    props: args,
    template: `<ui-app-header [userName]="userName" [userRole]="userRole" />`,
  }),
  args: { userName: 'Ada Lovelace', userRole: 'mentee' },
  argTypes: {
    userRole: {
      control: 'inline-radio',
      options: ['mentee', 'mentor', 'operator'],
    },
  },
};
export default meta;

type Story = StoryObj<AppHeaderComponent>;

export const Playground: Story = {};

export const StateMatrix: Story = {
  render: () => ({
    template: `<div class="grid gap-groups"><ui-app-header userName="Ada Lovelace" userRole="mentee" /><ui-app-header userName="Grace Hopper" userRole="mentor" /><ui-app-header userName="Oliwia" userRole="operator" /></div>`,
  }),
};

export const LongText: Story = {
  args: {
    userName: 'Maximilian Alexander Konstantinopoulos-Wiśniewski',
    userRole: 'mentor',
  },
};

export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
