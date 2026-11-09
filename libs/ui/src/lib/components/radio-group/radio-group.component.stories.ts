import { expect, userEvent, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { RadioComponent, RadioGroupComponent } from './radio-group.component';

const meta: Meta<RadioGroupComponent> = {
  decorators: [
    moduleMetadata({ imports: [RadioGroupComponent, RadioComponent] }),
  ],
  title: 'Primitives/Radio group',
  component: RadioGroupComponent,
  render: () => ({
    template: `
      <div class="p-panel-roomy">
        <fieldset ui-radio-group>
          <legend>Session length</legend>
          <label ui-radio><input type="radio" name="length" value="25" /> 25 minutes · €25.00</label>
          <label ui-radio><input type="radio" name="length" value="50" /> 50 minutes · €45.00</label>
        </fieldset>
      </div>`,
  }),
};
export default meta;

type Story = StoryObj<RadioGroupComponent>;

export const Playground: Story = {};

export const StateMatrix: Story = {
  render: () => ({
    template: `
      <div class="grid w-fit gap-groups p-panel-roomy">
        <fieldset ui-radio-group>
          <legend>States</legend>
          <label ui-radio><input type="radio" name="st" /> Unselected</label>
          <label ui-radio><input type="radio" name="st" checked /> Selected</label>
          <label ui-radio data-preview-state="hover"><input type="radio" name="st" /> Hover</label>
          <label ui-radio data-preview-state="focus"><input type="radio" name="st" /> Focus</label>
          <label ui-radio><input type="radio" name="st" disabled /> Disabled</label>
        </fieldset>
        <p class="text-meta text-muted">A disabled option always says why, in text next to it.</p>
      </div>`,
  }),
};

export const LongText: Story = {
  render: () => ({
    template: `
      <div class="p-panel-roomy" style="width: 22rem">
        <fieldset ui-radio-group>
          <legend>What should happen to the note?</legend>
          <label ui-radio><input type="radio" name="n1" /> Approve the whole note so we both keep it privately</label>
          <label ui-radio><input type="radio" name="n1" /> Decline it and ask the mentor to rewrite it with my comment</label>
        </fieldset>
      </div>`,
  }),
};

export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    template: `
      <div class="p-panel" style="width: 20rem">
        <fieldset ui-radio-group>
          <legend>Session length</legend>
          <label ui-radio><input type="radio" name="nr" /> 25 minutes</label>
          <label ui-radio><input type="radio" name="nr" /> 50 minutes</label>
        </fieldset>
      </div>`,
  }),
};

export const ChooseByClickAndArrowKeys: Story = {
  render: () => ({
    template: `
      <div class="p-panel-roomy">
        <fieldset ui-radio-group>
          <legend>Session length</legend>
          <label ui-radio><input type="radio" name="len" value="25" /> 25 minutes</label>
          <label ui-radio><input type="radio" name="len" value="50" /> 50 minutes</label>
        </fieldset>
      </div>`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('group', { name: 'Session length' }),
    ).toBeInTheDocument();
    await userEvent.click(canvas.getByText('25 minutes'));
    await expect(
      canvas.getByRole('radio', { name: '25 minutes' }),
    ).toBeChecked();
    await userEvent.keyboard('{ArrowDown}');
    await expect(
      canvas.getByRole('radio', { name: '50 minutes' }),
    ).toBeChecked();
  },
};

/** Do and don't, side by side. */
export const DoAndDont: Story = {
  render: () => ({
    template: `
      <div class="grid gap-panel-roomy p-panel-roomy md:grid-cols-2">
        <section aria-labelledby="do-h">
          <h3 id="do-h" class="mb-group text-section-title text-success">Do</h3>
          <div class="mb-group rounded-panel border border-solid border-line bg-surface p-panel"><fieldset ui-radio-group><legend>Session length</legend><label ui-radio><input type="radio" name="dd5" /> 25 minutes</label><label ui-radio><input type="radio" name="dd5" /> 50 minutes</label></fieldset></div>
          <p class="text-body">One answer from a few visible options.</p>
        </section>
        <section aria-labelledby="dont-h">
          <h3 id="dont-h" class="mb-group text-section-title text-danger">Don't</h3>
          <div class="mb-group rounded-panel border border-solid border-line bg-surface p-panel"><fieldset ui-radio-group><legend>Time zone</legend><label ui-radio><input type="radio" name="dd6" /> Europe/Warsaw</label><label ui-radio><input type="radio" name="dd6" /> Europe/London</label><label ui-radio><input type="radio" name="dd6" /> America/New_York</label><label ui-radio><input type="radio" name="dd6" /> America/Los_Angeles</label><label ui-radio><input type="radio" name="dd6" /> Asia/Singapore</label><label ui-radio><input type="radio" name="dd6" /> Australia/Sydney</label></fieldset></div>
          <p class="text-body">Six or more options push the page down: use a select.</p>
        </section>
      </div>`,
  }),
};
