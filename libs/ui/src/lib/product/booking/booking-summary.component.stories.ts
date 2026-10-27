import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { BookingSummaryComponent } from './booking-summary.component';

const meta: Meta<BookingSummaryComponent> = {
  decorators: [moduleMetadata({ imports: [BookingSummaryComponent] })],
  title: 'Product/E03 Booking and payment/Booking summary',
  component: BookingSummaryComponent,
  render: (args) => ({
    props: args,
    template: `<div class="max-w-measure p-panel-roomy"><ui-booking-summary [mentorName]="mentorName" [when]="when" [length]="length" [price]="price" /></div>`,
  }),
  args: {
    mentorName: 'Ada Lovelace',
    when: 'Thu 5 Nov, 14:00',
    length: 50,
    price: 45,
  },
};
export default meta;

type Story = StoryObj<BookingSummaryComponent>;

export const Playground: Story = {};
export const ShortSession: Story = { args: { length: 25, price: 25 } };
export const StateMatrix: Story = {
  render: () => ({
    template: `<div class="grid max-w-measure gap-groups p-panel-roomy"><ui-booking-summary mentorName="Ada Lovelace" when="Thu 5 Nov, 14:00" [length]="50" [price]="45" /><ui-booking-summary mentorName="Grace Hopper" when="Fri 6 Nov, 09:00" [length]="25" [price]="30" /></div>`,
  }),
};
export const LongText: Story = {
  args: {
    mentorName: 'Maximilian Alexander Konstantinopoulos-Wiśniewski',
    when: 'Thursday 5 November 2026, 14:00 to 14:50 (Europe/Warsaw)',
    price: 1234.5,
  },
};
export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
