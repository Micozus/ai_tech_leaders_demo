import { expect, userEvent, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ButtonComponent } from '../button/button.component';
import { ErrorStateComponent } from './error-state.component';

const meta: Meta<ErrorStateComponent> = {
  decorators: [
    moduleMetadata({ imports: [ErrorStateComponent, ButtonComponent] }),
  ],
  title: 'Primitives/Error state',
  component: ErrorStateComponent,
  render: (args) => ({
    props: args,
    template: `<div class="max-w-measure p-panel-roomy"><ui-error-state [heading]="heading" [description]="description"><button ui-button>Try again</button></ui-error-state></div>`,
  }),
  args: {
    heading: 'Sessions did not load',
    description: 'Check your connection and try again.',
  },
};
export default meta;

type Story = StoryObj<ErrorStateComponent>;

export const Playground: Story = {};

export const StateMatrix: Story = {
  render: () => ({
    template: `
      <div class="grid max-w-measure gap-groups p-panel-roomy">
        <ui-error-state heading="Sessions did not load" description="Check your connection and try again."><button ui-button>Try again</button></ui-error-state>
        <ui-error-state heading="This page does not exist or you cannot open it" description="The link may be wrong, or the page belongs to another account."><a ui-button variant="quiet" href="#home">Go to your home</a></ui-error-state>
      </div>`,
  }),
};

export const LongText: Story = {
  render: () => ({
    template: `<div class="p-panel-roomy" style="width: 24rem"><ui-error-state heading="We could not load your upcoming sessions and the written answers that belong to them" description="The server did not answer in time. Nothing you wrote was lost. Try again, and if it keeps failing write to the operators with the time of your attempt."><button ui-button>Try again</button></ui-error-state></div>`,
  }),
};

export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    template: `<div class="p-panel" style="width: 20rem"><ui-error-state heading="Sessions did not load" description="Check your connection and try again."><button ui-button [block]="true">Try again</button></ui-error-state></div>`,
  }),
};

export const DoAndDont: Story = {
  render: () => ({
    template: `
      <div class="grid gap-panel-roomy p-panel-roomy md:grid-cols-2">
        <section aria-labelledby="do-h">
          <h3 id="do-h" class="mb-group text-section-title text-success">Do</h3>
          <div class="mb-group"><ui-error-state heading="Sessions did not load" description="Check your connection and try again."><button ui-button>Try again</button></ui-error-state></div>
          <p class="text-body">The error replaces the content that failed and offers the next step.</p>
        </section>
        <section aria-labelledby="dont-h">
          <h3 id="dont-h" class="mb-group text-section-title text-danger">Don't</h3>
          <div class="mb-group"><ui-error-state heading="Something went wrong" /></div>
          <p class="text-body">No reason and no action; an error that needs action must also never be a toast.</p>
        </section>
      </div>`,
  }),
};

export const RetryByKeyboard: Story = {
  render: () => ({
    props: { tries: 0 },
    template: `<div class="max-w-measure p-panel-roomy"><ui-error-state heading="Sessions did not load" description="Check your connection and try again."><button ui-button (click)="tries = tries + 1">Try again ({{ tries }})</button></ui-error-state></div>`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'Sessions did not load',
    );
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('button')).toHaveTextContent('Try again (1)');
  },
};
