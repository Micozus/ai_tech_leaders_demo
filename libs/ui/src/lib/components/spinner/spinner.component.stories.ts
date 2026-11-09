import { expect, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ButtonComponent } from '../button/button.component';
import { SpinnerComponent } from './spinner.component';

const meta: Meta<SpinnerComponent> = {
  decorators: [
    moduleMetadata({ imports: [SpinnerComponent, ButtonComponent] }),
  ],
  title: 'Primitives/Spinner',
  component: SpinnerComponent,
  render: () => ({
    template: `<div class="p-panel-roomy"><ui-spinner /></div>`,
  }),
};
export default meta;

type Story = StoryObj<SpinnerComponent>;

export const Playground: Story = {};
export const StateMatrix: Story = {
  render: () => ({
    template: `<div class="flex flex-wrap items-center gap-groups p-panel-roomy"><ui-spinner /><button ui-button [loading]="true">Saving</button><button ui-button variant="quiet" [loading]="true">Loading</button></div>`,
  }),
};
export const LongText: Story = {
  render: () => ({
    template: `<div class="flex items-center gap-group p-panel-roomy" style="width: 20rem"><ui-spinner /><span class="text-body">Waiting for your bank to confirm the payment, this can take a few seconds</span></div>`,
  }),
};
export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    template: `<div class="flex items-center gap-group p-panel" style="width: 20rem"><ui-spinner /><span class="text-body">Saving…</span></div>`,
  }),
};
export const DoAndDont: Story = {
  render: () => ({
    template: `
      <div class="grid gap-panel-roomy p-panel-roomy md:grid-cols-2">
        <section aria-labelledby="do-h"><h3 id="do-h" class="mb-group text-section-title text-success">Do</h3><div class="mb-group flex items-center gap-group"><ui-spinner /><span class="text-body">Saving your prices</span></div><p class="text-body">A spinner next to words that say what is happening.</p></section>
        <section aria-labelledby="dont-h"><h3 id="dont-h" class="mb-group text-section-title text-danger">Don't</h3><div class="mb-group"><ui-spinner /></div><p class="text-body">A lone spinner for a whole list: use a skeleton in the shape of the content.</p></section>
      </div>`,
  }),
};
export const IsAnnouncedAsLoading: Story = {
  render: () => ({
    template: `<div class="p-panel-roomy"><ui-spinner /></div>`,
  }),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('status', { name: 'Loading' }),
    ).toBeInTheDocument();
  },
};
