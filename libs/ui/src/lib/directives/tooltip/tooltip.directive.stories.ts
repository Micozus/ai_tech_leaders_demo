import { expect, userEvent, waitFor, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ButtonComponent } from '../../components/button/button.component';
import { TooltipDirective } from './tooltip.directive';

const meta: Meta = {
  decorators: [
    moduleMetadata({ imports: [TooltipDirective, ButtonComponent] }),
  ],
  title: 'Primitives/Tooltip',
  render: () => ({
    template: `<div class="flex items-center gap-groups p-panel-roomy"><button ui-button variant="quiet" uiTooltip="Copy the share link" aria-label="Copy the share link"><i class="pi pi-copy" aria-hidden="true"></i></button></div>`,
  }),
};
export default meta;

type Story = StoryObj;

export const Playground: Story = {};

/** A tooltip shows on hover and on keyboard focus. Here: the trigger default, focused and disabled with its reason in text. */
export const StateMatrix: Story = {
  render: () => ({
    template: `
      <div class="grid gap-groups p-panel-roomy">
        <div class="flex flex-wrap items-center gap-groups">
          <button ui-button variant="quiet" uiTooltip="Copy the share link" aria-label="Copy the share link"><i class="pi pi-copy" aria-hidden="true"></i></button>
          <button ui-button variant="quiet" uiTooltip="Copy the share link" aria-label="Copy the share link" data-preview-state="focus"><i class="pi pi-copy" aria-hidden="true"></i></button>
        </div>
        <div class="flex flex-wrap items-center gap-groups">
          <button ui-button disabled>Pay €45.00</button>
          <span class="text-body text-muted">Pick a slot first.</span>
        </div>
      </div>`,
  }),
};

export const LongText: Story = {
  render: () => ({
    template: `<div class="p-panel-roomy" style="width: 22rem"><button ui-button variant="quiet" uiTooltip="Copy the link to your mentor page so that you can share it on your own profile, in a talk or in a newsletter">Copy link</button></div>`,
  }),
};

export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    template: `<div class="p-panel-roomy" style="width: 20rem"><button ui-button variant="quiet" uiTooltip="Copy the share link"><i class="pi pi-copy" aria-hidden="true"></i> Copy link</button></div>`,
  }),
};

export const DoAndDont: Story = {
  render: () => ({
    template: `
      <div class="grid gap-panel-roomy p-panel-roomy md:grid-cols-2">
        <section aria-labelledby="do-h">
          <h3 id="do-h" class="mb-group text-section-title text-success">Do</h3>
          <div class="mb-group"><div class="flex items-center gap-group"><button ui-button variant="quiet" aria-label="Copy the share link"><i class="pi pi-copy" aria-hidden="true"></i></button><span class="text-body">Copy the share link (tooltip repeats the name)</span></div></div>
          <p class="text-body">The tooltip repeats the name of an icon-only button; the name is also the aria-label.</p>
        </section>
        <section aria-labelledby="dont-h">
          <h3 id="dont-h" class="mb-group text-section-title text-danger">Don't</h3>
          <div class="mb-group"><div class="flex items-center gap-group"><button ui-button disabled>Pay €45.00</button><span class="text-body text-muted">(tooltip: pick a slot first)</span></div></div>
          <p class="text-body">The reason a button is disabled must be text on the page, not only a tooltip.</p>
        </section>
      </div>`,
  }),
};

export const ShowsOnKeyboardFocus: Story = {
  render: () => ({
    template: `<div class="p-panel-roomy"><button ui-button variant="quiet" uiTooltip="Copy the share link">Copy link</button></div>`,
  }),
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.tab();
    await expect(within(canvasElement).getByRole('button')).toHaveFocus();
    await waitFor(() =>
      expect(page.getByRole('tooltip')).toHaveTextContent(
        'Copy the share link',
      ),
    );
  },
};
