import { expect, userEvent, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { LinkComponent } from './link.component';

const meta: Meta<LinkComponent> = {
  decorators: [moduleMetadata({ imports: [LinkComponent] })],
  title: 'Primitives/Link',
  component: LinkComponent,
  render: () => ({
    template: `<p class="p-panel text-body">Read the <a ui-link href="#rules">cancellation rules</a> before you book.</p>`,
  }),
};
export default meta;

type Story = StoryObj<LinkComponent>;

export const Playground: Story = {};

export const StateMatrix: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-groups p-panel text-body">
        <a ui-link href="#a">Default</a>
        <a ui-link href="#a" data-preview-state="hover">Hover</a>
        <a ui-link href="#a" data-preview-state="focus">Focus</a>
      </div>`,
  }),
};

export const LongText: Story = {
  render: () => ({
    template: `<p class="max-w-measure p-panel text-body">See <a ui-link href="#a">the full terms for cancelling a booked session inside the first twenty-four hours before it starts</a> for the details.</p>`,
  }),
};

export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    template: `<p class="p-panel text-body" style="width: 20rem">Public work: <a ui-link href="#a">github.com/acme/billing-service/pull/412</a></p>`,
  }),
};

export const KeyboardFocus: Story = {
  render: () => ({
    template: `<p class="p-panel text-body"><a ui-link href="#a">Cancellation rules</a></p>`,
  }),
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link');
    await userEvent.tab();
    await expect(link).toHaveFocus();
  },
};

/** Do and don't, side by side. */
export const DoAndDont: Story = {
  render: () => ({
    template: `
      <div class="grid gap-panel-roomy p-panel-roomy md:grid-cols-2">
        <section aria-labelledby="do-h">
          <h3 id="do-h" class="mb-group text-section-title text-success">Do</h3>
          <div class="mb-group rounded-panel border border-solid border-line bg-surface p-panel"><p class="text-body">Read the <a ui-link href="#a">cancellation rules</a> before you book.</p></div>
          <p class="text-body">The link text says where it goes.</p>
        </section>
        <section aria-labelledby="dont-h">
          <h3 id="dont-h" class="mb-group text-section-title text-danger">Don't</h3>
          <div class="mb-group rounded-panel border border-solid border-line bg-surface p-panel"><p class="text-body">To read the cancellation rules, <a ui-link href="#a">click here</a>.</p></div>
          <p class="text-body">"Click here" means nothing out of context, for example in a list of links read aloud.</p>
        </section>
      </div>`,
  }),
};
