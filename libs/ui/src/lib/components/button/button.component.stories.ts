import { expect, userEvent, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';

const meta: Meta<ButtonComponent> = {
  decorators: [moduleMetadata({ imports: [ButtonComponent] })],
  title: 'Primitives/Button',
  component: ButtonComponent,
  render: (args) => ({
    props: args,
    template: `<button ui-button [variant]="variant" [size]="size" [block]="block" [loading]="loading">Book a session</button>`,
  }),
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'soft', 'quiet', 'danger', 'ghost'],
    },
    size: { control: 'inline-radio', options: ['md', 'sm'] },
  },
};
export default meta;

type Story = StoryObj<ButtonComponent>;

export const Playground: Story = {
  args: { variant: 'primary', size: 'md', block: false, loading: false },
};
export const Primary: Story = { args: { variant: 'primary' } };
export const Soft: Story = { args: { variant: 'soft' } };
export const Quiet: Story = { args: { variant: 'quiet' } };
export const Danger: Story = { args: { variant: 'danger' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Small: Story = { args: { size: 'sm' } };
export const Loading: Story = { args: { loading: true } };
export const Block: Story = { args: { block: true } };

/** Hover, focus and pressed are frozen previews of the real states (`data-preview-state`). */
export const StateMatrix: Story = {
  render: () => ({
    template: `
      <div class="grid gap-groups p-panel">
        @for (variant of ['primary', 'soft', 'quiet', 'danger', 'ghost']; track variant) {
          <div class="flex flex-wrap items-center gap-groups">
            <span class="w-24 text-label">{{ variant }}</span>
            <button ui-button [variant]="variant">Default</button>
            <button ui-button [variant]="variant" data-preview-state="hover">Hover</button>
            <button ui-button [variant]="variant" data-preview-state="focus">Focus</button>
            <button ui-button [variant]="variant" data-preview-state="pressed">Pressed</button>
            <button ui-button [variant]="variant" disabled>Disabled</button>
            <button ui-button [variant]="variant" [loading]="true">Loading</button>
          </div>
        }
        <p class="text-meta text-muted">A disabled button always has the reason in text next to it.</p>
      </div>`,
  }),
};

export const LongText: Story = {
  render: () => ({
    template: `<div class="p-panel"><button ui-button>Request a written review of my pull request and the failing generics error</button></div>`,
  }),
};

export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    template: `<div class="grid gap-group p-panel" style="width: 20rem"><button ui-button [block]="true">Book a session</button><button ui-button variant="quiet" [block]="true">Cancel booking</button></div>`,
  }),
};

export const ClickAndKeyboard: Story = {
  render: () => ({
    props: { count: 0 },
    template: `<div class="p-panel"><button ui-button (click)="count = count + 1">Clicked {{ count }} times</button></div>`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
    await expect(button).toHaveTextContent('Clicked 1 times');
    await userEvent.tab();
    await userEvent.tab({ shift: true });
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(button).toHaveTextContent('Clicked 3 times');
  },
};

/** Do and don't, side by side. */
export const DoAndDont: Story = {
  render: () => ({
    template: `
      <div class="grid gap-panel-roomy p-panel-roomy md:grid-cols-2">
        <section aria-labelledby="do-h">
          <h3 id="do-h" class="mb-group text-section-title text-success">Do</h3>
          <div class="mb-group rounded-panel border border-solid border-line bg-surface p-panel"><div class="flex gap-group"><button ui-button>Book a session</button><button ui-button variant="quiet">Cancel</button></div></div>
          <p class="text-body">One main action per area; the label is a verb and an object.</p>
        </section>
        <section aria-labelledby="dont-h">
          <h3 id="dont-h" class="mb-group text-section-title text-danger">Don't</h3>
          <div class="mb-group rounded-panel border border-solid border-line bg-surface p-panel"><div class="flex gap-group"><button ui-button>OK</button><button ui-button>Cancel</button></div></div>
          <p class="text-body">Two main actions compete, and "OK" says nothing about what happens.</p>
        </section>
      </div>`,
  }),
};
