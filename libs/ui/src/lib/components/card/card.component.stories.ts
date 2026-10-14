import type { Meta, StoryObj } from '@storybook/angular';
import { CardComponent } from './card.component';

const meta: Meta<CardComponent> = {
  title: 'UI/Card',
  component: CardComponent,
  render: (args) => ({
    props: args,
    template: `<ui-card [heading]="heading">Card content</ui-card>`,
  }),
};
export default meta;

type Story = StoryObj<CardComponent>;

export const Default: Story = {
  args: { heading: 'Card heading' },
};
