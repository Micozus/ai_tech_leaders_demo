import type { Meta, StoryObj } from '@storybook/angular';
import { AvatarComponent } from './avatar.component';

const meta: Meta<AvatarComponent> = {
  title: 'UI/Avatar',
  component: AvatarComponent,
  args: { name: 'Ada Lovelace', size: 'md' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
};
export default meta;

type Story = StoryObj<AvatarComponent>;

export const Medium: Story = {};
export const Small: Story = { args: { size: 'sm' } };
export const Large: Story = { args: { size: 'lg' } };
