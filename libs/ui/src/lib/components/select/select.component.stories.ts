import { expect, userEvent, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { FieldComponent } from '../field/field.component';
import { SelectComponent } from './select.component';

const OPTIONS = `<option value="25">25 minutes · €25.00</option><option value="50">50 minutes · €45.00</option>`;

const meta: Meta<SelectComponent> = {
  decorators: [moduleMetadata({ imports: [SelectComponent, FieldComponent] })],
  title: 'Primitives/Select',
  component: SelectComponent,
  render: (args) => ({
    props: args,
    template: `<div class="max-w-measure p-panel-roomy"><ui-field label="Session length" controlId="length"><select ui-select id="length" [invalid]="invalid">${OPTIONS}</select></ui-field></div>`,
  }),
};
export default meta;

type Story = StoryObj<SelectComponent>;

export const Playground: Story = { args: { invalid: false } };
export const Invalid: Story = { args: { invalid: true } };

export const StateMatrix: Story = {
  render: () => ({
    template: `
      <div class="grid max-w-measure gap-groups p-panel-roomy">
        <ui-field label="Default" controlId="b1"><select ui-select id="b1">${OPTIONS}</select></ui-field>
        <ui-field label="Hover" controlId="b2"><select ui-select id="b2" data-preview-state="hover">${OPTIONS}</select></ui-field>
        <ui-field label="Focus" controlId="b3"><select ui-select id="b3" data-preview-state="focus">${OPTIONS}</select></ui-field>
        <ui-field label="Disabled" controlId="b4" hint="Disabled: this mentor offers only 50-minute sessions."><select ui-select id="b4" disabled>${OPTIONS}</select></ui-field>
        <ui-field label="Invalid" controlId="b5" error="Choose a session length."><select ui-select id="b5" [invalid]="true" aria-describedby="b5-error"><option value="">Choose…</option>${OPTIONS}</select></ui-field>
      </div>`,
  }),
};

export const LongText: Story = {
  render: () => ({
    template: `<div class="p-panel-roomy" style="width: 24rem"><ui-field label="Stack tag" controlId="c"><select ui-select id="c"><option>TypeScript, React and AI agents: architecture review</option></select></ui-field></div>`,
  }),
};

export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    template: `<div class="p-panel" style="width: 20rem"><ui-field label="Session length" controlId="d"><select ui-select id="d">${OPTIONS}</select></ui-field></div>`,
  }),
};

export const ChooseOption: Story = {
  render: () => ({
    template: `<div class="max-w-measure p-panel-roomy"><ui-field label="Session length" controlId="e"><select ui-select id="e">${OPTIONS}</select></ui-field></div>`,
  }),
  play: async ({ canvasElement }) => {
    const select = within(canvasElement).getByLabelText('Session length');
    await userEvent.selectOptions(select, '50');
    await expect(select).toHaveValue('50');
    await userEvent.tab({ shift: true });
    await userEvent.tab();
    await expect(select).toHaveFocus();
  },
};

/** Do and don't, side by side. */
export const DoAndDont: Story = {
  render: () => ({
    template: `
      <div class="grid gap-panel-roomy p-panel-roomy md:grid-cols-2">
        <section aria-labelledby="do-h">
          <h3 id="do-h" class="mb-group text-section-title text-success">Do</h3>
          <div class="mb-group rounded-panel border border-solid border-line bg-surface p-panel"><ui-field label="Time zone" controlId="dd3"><select ui-select id="dd3"><option>Europe/Warsaw</option><option>Europe/London</option><option>America/New_York</option><option>America/Los_Angeles</option><option>Asia/Singapore</option><option>Australia/Sydney</option></select></ui-field></div>
          <p class="text-body">A select suits a longer list the user does not need to compare at a glance.</p>
        </section>
        <section aria-labelledby="dont-h">
          <h3 id="dont-h" class="mb-group text-section-title text-danger">Don't</h3>
          <div class="mb-group rounded-panel border border-solid border-line bg-surface p-panel"><ui-field label="Session length" controlId="dd4"><select ui-select id="dd4"><option>25 minutes</option><option>50 minutes</option></select></ui-field></div>
          <p class="text-body">Two options belong in a radio group: both are visible and one click chooses.</p>
        </section>
      </div>`,
  }),
};
