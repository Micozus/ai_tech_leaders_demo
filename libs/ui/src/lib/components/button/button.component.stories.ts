import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';

import { ButtonComponent } from './button.component';

const meta: Meta<ButtonComponent> = {
  decorators: [moduleMetadata({ imports: [ButtonComponent] })],
  title: 'UI/Button',
  component: ButtonComponent,
  render: (args) => ({
    props: args,
    template: `<button ui-button [variant]="variant" [size]="size" [block]="block" [loading]="loading">Book a session</button>`,
  }),
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'soft', 'quiet', 'danger', 'ghost'],
    },
    size: { control: 'inline-radio', options: ['md', 'sm'] },
  },
};
export default meta;

type Story = StoryObj<ButtonComponent>;

export const Primary: Story = { args: { variant: 'primary', size: 'md' } };
export const Soft: Story = { args: { variant: 'soft' } };
export const Quiet: Story = { args: { variant: 'quiet' } };
export const Danger: Story = { args: { variant: 'danger' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Small: Story = { args: { size: 'sm' } };
export const Loading: Story = { args: { loading: true } };
export const Block: Story = { args: { block: true } };
