import { expect, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { AvatarComponent } from './avatar.component';

const meta: Meta<AvatarComponent> = {
  decorators: [moduleMetadata({ imports: [AvatarComponent] })],
  title: 'Primitives/Avatar',
  component: AvatarComponent,
  render: (args) => ({
    props: args,
    template: `<div class="p-panel"><ui-avatar [name]="name" [size]="size" /></div>`,
  }),
  args: { name: 'Ada Lovelace', size: 'md' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
};
export default meta;

type Story = StoryObj<AvatarComponent>;

export const Playground: Story = {};
export const Small: Story = { args: { size: 'sm' } };
export const Large: Story = { args: { size: 'lg' } };

export const StateMatrix: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-groups p-panel">
        <ui-avatar name="Ada Lovelace" size="sm" />
        <ui-avatar name="Ada Lovelace" size="md" />
        <ui-avatar name="Ada Lovelace" size="lg" />
        <ui-avatar name="Linus" size="md" />
        <ui-avatar name="Grace Brewster Hopper" size="md" />
      </div>`,
  }),
};

export const LongText: Story = {
  render: () => ({
    template: `<div class="flex items-center gap-groups p-panel" style="width: 22rem"><ui-avatar name="Maximilian Alexander Konstantinopoulos-Wiśniewski" /><span class="text-body">Maximilian Alexander Konstantinopoulos-Wiśniewski</span></div>`,
  }),
};

export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    template: `<div class="flex items-center gap-groups p-panel" style="width: 20rem"><ui-avatar name="Ada Lovelace" /><div><p class="text-label">Ada Lovelace</p><p class="text-meta text-muted">TypeScript · React</p></div></div>`,
  }),
};

export const DoAndDont: Story = {
  render: () => ({
    template: `
      <div class="grid gap-panel-roomy p-panel-roomy md:grid-cols-2">
        <section aria-labelledby="do-h">
          <h3 id="do-h" class="mb-group text-section-title text-success">Do</h3>
          <div class="mb-group flex items-center gap-groups rounded-panel border border-solid border-line bg-surface p-panel"><ui-avatar name="Ada Lovelace" /><span class="text-body">Ada Lovelace</span></div>
          <p class="text-body">A flat avatar next to the name it stands for.</p>
        </section>
        <section aria-labelledby="dont-h">
          <h3 id="dont-h" class="mb-group text-section-title text-danger">Don't</h3>
          <div class="mb-group flex items-center gap-groups rounded-panel border border-solid border-line bg-surface p-panel"><span class="grid size-avatar-md place-items-center rounded-full bg-linear-to-br from-accent to-danger text-on-accent" aria-hidden="true">AL</span><span class="text-body">Ada Lovelace</span></div>
          <p class="text-body">A gradient and a full circle: both are ruled out (A01).</p>
        </section>
      </div>`,
  }),
};

export const NamedForAssistiveTech: Story = {
  render: () => ({
    template: `<div class="p-panel"><ui-avatar name="Ada Lovelace" /></div>`,
  }),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('img', { name: 'Ada Lovelace' }),
    ).toBeInTheDocument();
  },
};
