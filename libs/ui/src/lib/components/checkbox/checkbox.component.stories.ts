import { expect, userEvent, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CheckboxComponent } from './checkbox.component';

const meta: Meta<CheckboxComponent> = {
  decorators: [moduleMetadata({ imports: [CheckboxComponent] })],
  title: 'Primitives/Checkbox',
  component: CheckboxComponent,
  render: () => ({
    template: `<div class="p-panel"><label ui-checkbox><input type="checkbox" /> TypeScript</label></div>`,
  }),
};
export default meta;

type Story = StoryObj<CheckboxComponent>;

export const Playground: Story = {};

export const StateMatrix: Story = {
  render: () => ({
    template: `
      <div class="grid w-fit gap-group p-panel">
        <label ui-checkbox><input type="checkbox" /> Unchecked</label>
        <label ui-checkbox><input type="checkbox" checked /> Checked</label>
        <label ui-checkbox data-preview-state="hover"><input type="checkbox" /> Hover</label>
        <label ui-checkbox data-preview-state="focus"><input type="checkbox" /> Focus</label>
        <label ui-checkbox><input type="checkbox" disabled /> Disabled</label>
        <label ui-checkbox><input type="checkbox" checked disabled /> Checked and disabled</label>
        <p class="text-meta text-muted">A disabled option always says why, in text next to it.</p>
      </div>`,
  }),
};

export const LongText: Story = {
  render: () => ({
    template: `<div class="p-panel" style="width: 22rem"><label ui-checkbox><input type="checkbox" /> I agree that the mentor may draft a note after the session, and that nothing is published unless I approve it</label></div>`,
  }),
};

export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    template: `<fieldset class="m-0 border-0 p-panel" style="width: 20rem"><legend class="mb-group text-label">Stack tags</legend><div class="grid gap-group"><label ui-checkbox><input type="checkbox" /> TypeScript</label><label ui-checkbox><input type="checkbox" /> React</label><label ui-checkbox><input type="checkbox" /> Python</label><label ui-checkbox><input type="checkbox" /> AI agents</label></div></fieldset>`,
  }),
};

export const ToggleByClickAndKeyboard: Story = {
  render: () => ({
    template: `<div class="p-panel"><label ui-checkbox><input type="checkbox" /> TypeScript</label></div>`,
  }),
  play: async ({ canvasElement }) => {
    const box = within(canvasElement).getByRole('checkbox', {
      name: 'TypeScript',
    });
    await userEvent.click(within(canvasElement).getByText('TypeScript'));
    await expect(box).toBeChecked();
    await userEvent.tab();
    await userEvent.tab({ shift: true });
    await userEvent.keyboard(' ');
    await expect(box).not.toBeChecked();
  },
};

/** Do and don't, side by side. */
export const DoAndDont: Story = {
  render: () => ({
    template: `
      <div class="grid gap-panel-roomy p-panel-roomy md:grid-cols-2">
        <section aria-labelledby="do-h">
          <h3 id="do-h" class="mb-group text-section-title text-success">Do</h3>
          <div class="mb-group rounded-panel border border-solid border-line bg-surface p-panel"><fieldset class="m-0 border-0 p-0"><legend class="mb-group text-label">Stack tags</legend><label ui-checkbox><input type="checkbox" /> TypeScript</label><label ui-checkbox><input type="checkbox" /> React</label></fieldset></div>
          <p class="text-body">Independent choices: any number can be on.</p>
        </section>
        <section aria-labelledby="dont-h">
          <h3 id="dont-h" class="mb-group text-section-title text-danger">Don't</h3>
          <div class="mb-group rounded-panel border border-solid border-line bg-surface p-panel"><fieldset class="m-0 border-0 p-0"><legend class="mb-group text-label">Session length</legend><label ui-checkbox><input type="checkbox" /> 25 minutes</label><label ui-checkbox><input type="checkbox" /> 50 minutes</label></fieldset></div>
          <p class="text-body">Only one length can be booked: checkboxes suggest several, and a radio group says one.</p>
        </section>
      </div>`,
  }),
};
