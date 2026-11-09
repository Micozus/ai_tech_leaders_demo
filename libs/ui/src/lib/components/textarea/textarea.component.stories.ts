import { expect, userEvent, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { FieldComponent } from '../field/field.component';
import { TextareaComponent } from './textarea.component';

const meta: Meta<TextareaComponent> = {
  decorators: [
    moduleMetadata({ imports: [TextareaComponent, FieldComponent] }),
  ],
  title: 'Primitives/Textarea',
  component: TextareaComponent,
  render: (args) => ({
    props: args,
    template: `<div class="max-w-measure p-panel-roomy"><ui-field label="About you" controlId="about" hint="Plain text. What you mentor on and how you work."><textarea ui-textarea id="about" rows="4" [invalid]="invalid"></textarea></ui-field></div>`,
  }),
};
export default meta;

type Story = StoryObj<TextareaComponent>;

export const Playground: Story = { args: { invalid: false } };
export const Invalid: Story = { args: { invalid: true } };

export const StateMatrix: Story = {
  render: () => ({
    template: `
      <div class="grid max-w-measure gap-groups p-panel-roomy">
        <ui-field label="Default" controlId="a1"><textarea ui-textarea id="a1" rows="2">Ten years of TypeScript and React in production.</textarea></ui-field>
        <ui-field label="Hover" controlId="a2"><textarea ui-textarea id="a2" rows="2" data-preview-state="hover">Ten years of TypeScript and React in production.</textarea></ui-field>
        <ui-field label="Focus" controlId="a3"><textarea ui-textarea id="a3" rows="2" data-preview-state="focus">Ten years of TypeScript and React in production.</textarea></ui-field>
        <ui-field label="Disabled" controlId="a4" hint="Disabled while the invitation is being checked."><textarea ui-textarea id="a4" rows="2" disabled>Ten years of TypeScript and React in production.</textarea></ui-field>
        <ui-field label="Invalid" controlId="a5" error="Write at least one sentence."><textarea ui-textarea id="a5" rows="2" [invalid]="true" aria-describedby="a5-error"></textarea></ui-field>
      </div>`,
  }),
};

export const LongText: Story = {
  render: () => ({
    template: `<div class="max-w-measure p-panel-roomy"><ui-field label="About you" controlId="l"><textarea ui-textarea id="l" rows="3">I mentor developers who are blocked on TypeScript generics, React rendering performance and AI-agent configuration. I read the code first, then answer in writing: what is wrong, why, and what to do next. I do not review whole codebases in one session; I pick the one problem that blocks you. Sessions are text only, 25 or 50 minutes.</textarea></ui-field></div>`,
  }),
};

export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    template: `<div class="p-panel" style="width: 20rem"><ui-field label="About you" controlId="n"><textarea ui-textarea id="n" rows="3"></textarea></ui-field></div>`,
  }),
};

export const TypeMultipleLines: Story = {
  render: () => ({
    template: `<div class="max-w-measure p-panel-roomy"><ui-field label="About you" controlId="m"><textarea ui-textarea id="m" rows="3"></textarea></ui-field></div>`,
  }),
  play: async ({ canvasElement }) => {
    const field = within(canvasElement).getByLabelText('About you');
    await userEvent.type(field, 'First line{Enter}Second line');
    await expect(field).toHaveValue('First line\nSecond line');
  },
};

/** Do and don't, side by side. */
export const DoAndDont: Story = {
  render: () => ({
    template: `
      <div class="grid gap-panel-roomy p-panel-roomy md:grid-cols-2">
        <section aria-labelledby="do-h">
          <h3 id="do-h" class="mb-group text-section-title text-success">Do</h3>
          <div class="mb-group rounded-panel border border-solid border-line bg-surface p-panel"><ui-field label="About you" controlId="dd2" hint="What you mentor on and how you work."><textarea ui-textarea id="dd2" rows="3"></textarea></ui-field></div>
          <p class="text-body">Label plus a hint that says what to write.</p>
        </section>
        <section aria-labelledby="dont-h">
          <h3 id="dont-h" class="mb-group text-section-title text-danger">Don't</h3>
          <div class="mb-group rounded-panel border border-solid border-line bg-surface p-panel"><textarea ui-textarea aria-label="About you" rows="3" placeholder="Tell us about yourself"></textarea></div>
          <p class="text-body">No visible label, and the placeholder gives no guidance once you start typing.</p>
        </section>
      </div>`,
  }),
};
