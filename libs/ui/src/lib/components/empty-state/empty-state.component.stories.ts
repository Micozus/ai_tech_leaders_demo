import { expect, userEvent, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ButtonComponent } from '../button/button.component';
import { EmptyStateComponent } from './empty-state.component';

const meta: Meta<EmptyStateComponent> = {
  decorators: [
    moduleMetadata({ imports: [EmptyStateComponent, ButtonComponent] }),
  ],
  title: 'Primitives/Empty state',
  component: EmptyStateComponent,
  render: (args) => ({
    props: args,
    template: `<div class="max-w-measure p-panel-roomy"><ui-empty-state [heading]="heading" [description]="description"><button ui-button>Publish slots</button></ui-empty-state></div>`,
  }),
  args: {
    heading: 'No slots yet',
    description: 'Publish a slot so mentees can book you.',
  },
};
export default meta;

type Story = StoryObj<EmptyStateComponent>;

export const Playground: Story = {};

/** The two different empty states: nothing yet, and nothing for the filters. */
export const StateMatrix: Story = {
  render: () => ({
    template: `
      <div class="grid max-w-measure gap-groups p-panel-roomy">
        <ui-empty-state heading="No sessions yet" description="Book a mentor to get your first written answer."><button ui-button>Find a mentor</button></ui-empty-state>
        <ui-empty-state heading="No mentors for these filters" description="Remove a stack tag to see more mentors."><button ui-button variant="quiet">Clear filters</button></ui-empty-state>
      </div>`,
  }),
};

export const LongText: Story = {
  render: () => ({
    template: `<div class="p-panel-roomy" style="width: 24rem"><ui-empty-state heading="No mentors match TypeScript, React, Python and AI agents together" description="Mentors list the stacks they cover, so a long filter can match nobody. Remove a stack tag to widen the list, or clear all filters."><button ui-button variant="quiet">Clear filters</button></ui-empty-state></div>`,
  }),
};

export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    template: `<div class="p-panel" style="width: 20rem"><ui-empty-state heading="No sessions yet" description="Book a mentor to get your first written answer."><button ui-button [block]="true">Find a mentor</button></ui-empty-state></div>`,
  }),
};

export const DoAndDont: Story = {
  render: () => ({
    template: `
      <div class="grid gap-panel-roomy p-panel-roomy md:grid-cols-2">
        <section aria-labelledby="do-h">
          <h3 id="do-h" class="mb-group text-section-title text-success">Do</h3>
          <div class="mb-group"><ui-empty-state heading="No sessions yet" description="Book a mentor to get your first written answer."><button ui-button>Find a mentor</button></ui-empty-state></div>
          <p class="text-body">Say why it is empty and give the next step.</p>
        </section>
        <section aria-labelledby="dont-h">
          <h3 id="dont-h" class="mb-group text-section-title text-danger">Don't</h3>
          <div class="mb-group"><ui-empty-state heading="Nothing here" /></div>
          <p class="text-body">"Nothing here" gives neither a reason nor a next step.</p>
        </section>
      </div>`,
  }),
};

export const NextStepIsReachable: Story = {
  render: () => ({
    template: `<div class="max-w-measure p-panel-roomy"><ui-empty-state heading="No sessions yet" description="Book a mentor to get your first written answer."><button ui-button>Find a mentor</button></ui-empty-state></div>`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { name: 'No sessions yet' }),
    ).toBeInTheDocument();
    await userEvent.tab();
    await expect(
      canvas.getByRole('button', { name: 'Find a mentor' }),
    ).toHaveFocus();
  },
};
