import { expect, userEvent, waitFor, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { PopoverComponent } from './popover.component';

const meta: Meta<PopoverComponent> = {
  decorators: [moduleMetadata({ imports: [PopoverComponent] })],
  title: 'Primitives/Popover',
  component: PopoverComponent,
  render: (args) => ({
    props: args,
    template: `<div class="p-panel" style="min-height: 14rem"><ui-popover [label]="label"><p class="max-w-measure text-body">A slot must start at least two hours after it is booked. Free cancellation ends 24 hours before the session.</p></ui-popover></div>`,
  }),
  args: { label: 'How booking works' },
};
export default meta;

type Story = StoryObj<PopoverComponent>;

export const Playground: Story = {};

/** The closed trigger. The open panel is shown in the interaction story. */
export const StateMatrix: Story = {};

export const LongText: Story = {
  render: () => ({
    template: `<div class="p-panel" style="min-height: 18rem; width: 22rem"><ui-popover label="Why the first slot you can book is two hours from now"><p class="text-body">Mentors need time to read your problem before the session. A slot that starts sooner than two hours after booking cannot be booked. The time from booking to the start of a session is recorded, so we can see whether two hours is the right number.</p></ui-popover></div>`,
  }),
};

export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    template: `<div class="p-panel" style="min-height: 14rem; width: 20rem"><ui-popover label="How booking works"><p class="text-body">Free cancellation ends 24 hours before the session.</p></ui-popover></div>`,
  }),
};

export const DoAndDont: Story = {
  render: () => ({
    template: `
      <div class="grid gap-panel-roomy p-panel-roomy md:grid-cols-2">
        <section aria-labelledby="do-h">
          <h3 id="do-h" class="mb-group text-section-title text-success">Do</h3>
          <div class="mb-group"><p class="text-body">Free cancellation ends 24 hours before the session. <span class="text-muted">(More in the rules.)</span></p></div>
          <p class="text-body">What the person needs to book is in the page; the popover only adds background.</p>
        </section>
        <section aria-labelledby="dont-h">
          <h3 id="dont-h" class="mb-group text-section-title text-danger">Don't</h3>
          <div class="mb-group"><p class="text-body">Price: <span class="text-muted">(hover for the price)</span></p></div>
          <p class="text-body">The price is needed to decide: it cannot live only in a popover.</p>
        </section>
      </div>`,
  }),
};

export const OpensAndClosesWithEscape: Story = {
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const trigger = within(canvasElement).getByRole('button', {
      name: 'How booking works',
    });
    await userEvent.click(trigger);
    const panel = await page.findByRole('dialog');
    await expect(panel).toHaveTextContent('two hours after it is booked');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(page.queryByRole('dialog')).toBeNull());
  },
};
