import { expect, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ButtonComponent } from '../button/button.component';
import { AsyncRegionComponent } from './async-region.component';

const meta: Meta<AsyncRegionComponent> = {
  decorators: [
    moduleMetadata({ imports: [AsyncRegionComponent, ButtonComponent] }),
  ],
  title: 'Primitives/Async region',
  component: AsyncRegionComponent,
  render: (args) => ({
    props: args,
    template: `<div class="max-w-measure p-panel-roomy"><ui-async-region [state]="state" loadingLabel="Loading sessions" emptyHeading="No sessions yet" emptyDescription="Book a mentor to get your first written answer." errorHeading="Sessions did not load"><p class="text-body">Thursday 14:00 · Architecture review</p><button uiEmptyAction ui-button>Find a mentor</button><button uiErrorAction ui-button variant="quiet">Try again</button></ui-async-region></div>`,
  }),
  args: { state: 'ready' },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: ['loading', 'empty', 'error', 'ready'],
    },
  },
};
export default meta;

type Story = StoryObj<AsyncRegionComponent>;

export const Playground: Story = {};
export const Loading: Story = { args: { state: 'loading' } };
export const Empty: Story = { args: { state: 'empty' } };
export const ErrorState: Story = { args: { state: 'error' } };

export const StateMatrix: Story = {
  render: () => ({
    template: `
      <div class="grid max-w-measure gap-groups p-panel-roomy">
        <ui-async-region state="ready"><p class="text-body">Thursday 14:00 · Architecture review</p></ui-async-region>
        <ui-async-region state="loading" loadingLabel="Loading sessions" />
        <ui-async-region state="empty" emptyHeading="No sessions yet" emptyDescription="Book a mentor to get your first written answer."><button uiEmptyAction ui-button>Find a mentor</button></ui-async-region>
        <ui-async-region state="error" errorHeading="Sessions did not load"><button uiErrorAction ui-button variant="quiet">Try again</button></ui-async-region>
      </div>`,
  }),
};

export const LongText: Story = {
  render: () => ({
    template: `<div class="p-panel-roomy" style="width: 24rem"><ui-async-region state="empty" emptyHeading="No mentors match TypeScript, React, Python and AI agents together" emptyDescription="Mentors list the stacks they cover, so a long filter can match nobody. Remove a stack tag to widen the list."><button uiEmptyAction ui-button variant="quiet">Clear filters</button></ui-async-region></div>`,
  }),
};

export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    template: `<div class="p-panel" style="width: 20rem"><ui-async-region state="error" errorHeading="Sessions did not load"><button uiErrorAction ui-button [block]="true">Try again</button></ui-async-region></div>`,
  }),
};

export const DoAndDont: Story = {
  render: () => ({
    template: `
      <div class="grid gap-panel-roomy p-panel-roomy md:grid-cols-2">
        <section aria-labelledby="do-h">
          <h3 id="do-h" class="mb-group text-section-title text-success">Do</h3>
          <div class="mb-group"><ui-async-region state="error" errorHeading="Sessions did not load"><button uiErrorAction ui-button variant="quiet">Try again</button></ui-async-region></div>
          <p class="text-body">One place for loading, empty and error, so every list behaves alike.</p>
        </section>
        <section aria-labelledby="dont-h">
          <h3 id="dont-h" class="mb-group text-section-title text-danger">Don't</h3>
          <div class="mb-group rounded-panel border border-solid border-line bg-surface p-panel"><p class="text-body">Loading…</p></div>
          <p class="text-body">A bare "Loading…" in one list and a different empty design in the next.</p>
        </section>
      </div>`,
  }),
};

export const ShowsTheRightStateForTheData: Story = {
  args: { state: 'loading' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('status')).toHaveTextContent(
      'Loading sessions',
    );
  },
};
