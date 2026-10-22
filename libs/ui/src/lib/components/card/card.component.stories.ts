import { expect, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { BadgeComponent } from '../badge/badge.component';
import { ButtonComponent } from '../button/button.component';
import { CardComponent } from './card.component';

const meta: Meta<CardComponent> = {
  decorators: [
    moduleMetadata({
      imports: [CardComponent, BadgeComponent, ButtonComponent],
    }),
  ],
  title: 'Primitives/Card',
  component: CardComponent,
  render: (args) => ({
    props: args,
    template: `<div class="max-w-measure p-panel-roomy"><ui-card [heading]="heading" [density]="density" [headingLevel]="headingLevel"><p class="text-body">Booked for Thursday 14:00. Written answer after the session.</p></ui-card></div>`,
  }),
  args: { heading: 'Architecture review', density: 'dense', headingLevel: 2 },
  argTypes: {
    density: { control: 'inline-radio', options: ['dense', 'roomy'] },
    headingLevel: { control: 'inline-radio', options: [2, 3, 4] },
  },
};
export default meta;

type Story = StoryObj<CardComponent>;

export const Playground: Story = {};
export const Roomy: Story = { args: { density: 'roomy' } };

export const StateMatrix: Story = {
  render: () => ({
    template: `
      <div class="grid max-w-measure gap-groups p-panel-roomy">
        <ui-card heading="Dense: a row of data"><div class="flex items-center justify-between gap-groups"><span class="text-body">Review my pull request</span><ui-badge tone="success">Booked</ui-badge></div></ui-card>
        <ui-card heading="Roomy: a form or a detail view" density="roomy"><p class="mb-groups text-body">Prices are set per session length, within the limits the operator sets.</p><button ui-button>Save prices</button></ui-card>
      </div>`,
  }),
};

export const LongText: Story = {
  render: () => ({
    template: `<div class="p-panel-roomy" style="width: 22rem"><ui-card heading="Review the failing generics error in the billing service and the pull request that introduced it"><p class="text-body">A long heading wraps; the panel grows with its content.</p></ui-card></div>`,
  }),
};

export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    template: `<div class="p-panel" style="width: 20rem"><ui-card heading="Architecture review" density="roomy"><p class="text-body">Booked for Thursday 14:00.</p></ui-card></div>`,
  }),
};

export const DoAndDont: Story = {
  render: () => ({
    template: `
      <div class="grid gap-panel-roomy p-panel-roomy md:grid-cols-2">
        <section aria-labelledby="do-h">
          <h3 id="do-h" class="mb-group text-section-title text-success">Do</h3>
          <div class="mb-group"><ui-card heading="Upcoming sessions"><p class="text-body">Thursday 14:00 · Architecture review</p></ui-card></div>
          <p class="text-body">One panel groups related content under one heading.</p>
        </section>
        <section aria-labelledby="dont-h">
          <h3 id="dont-h" class="mb-group text-section-title text-danger">Don't</h3>
          <div class="mb-group"><ui-card heading="Upcoming sessions"><ui-card heading="Thursday 14:00" headingLevel="3"><p class="text-body">Architecture review</p></ui-card></ui-card></div>
          <p class="text-body">A panel inside a panel: split the screen or use a row with a line instead.</p>
        </section>
      </div>`,
  }),
};

export const HeadingOutline: Story = {
  render: () => ({
    template: `<div class="max-w-measure p-panel-roomy"><ui-card heading="Architecture review" [headingLevel]="3"><p class="text-body">Booked.</p></ui-card></div>`,
  }),
  play: async ({ canvasElement }) => {
    const heading = within(canvasElement).getByRole('heading', {
      name: 'Architecture review',
    });
    await expect(heading).toHaveAttribute('aria-level', '3');
  },
};
