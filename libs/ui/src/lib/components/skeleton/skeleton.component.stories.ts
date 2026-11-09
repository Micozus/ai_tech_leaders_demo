import { expect, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { SkeletonComponent } from './skeleton.component';

const meta: Meta<SkeletonComponent> = {
  decorators: [moduleMetadata({ imports: [SkeletonComponent] })],
  title: 'Primitives/Skeleton',
  component: SkeletonComponent,
  render: (args) => ({
    props: args,
    template: `<div class="p-panel"><ui-skeleton [width]="width" [height]="height" /></div>`,
  }),
  args: { width: '16rem', height: '1.0625rem' },
};
export default meta;

type Story = StoryObj<SkeletonComponent>;

export const Playground: Story = {};

/** A loading list: the region is busy and says what is loading in text. */
export const StateMatrix: Story = {
  render: () => ({
    template: `
      <section class="max-w-measure p-panel-roomy" aria-busy="true" aria-labelledby="ls">
        <h3 id="ls" class="mb-groups text-section-title">Upcoming sessions</h3>
        <p class="mb-groups text-meta text-muted" role="status">Loading sessions</p>
        <div class="grid gap-groups">
          <div class="flex items-center gap-groups"><ui-skeleton width="2.5rem" height="2.5rem" /><div class="grid flex-1 gap-group"><ui-skeleton width="60%" /><ui-skeleton width="40%" /></div></div>
          <div class="flex items-center gap-groups"><ui-skeleton width="2.5rem" height="2.5rem" /><div class="grid flex-1 gap-group"><ui-skeleton width="70%" /><ui-skeleton width="30%" /></div></div>
        </div>
      </section>`,
  }),
};

export const LongText: Story = {
  render: () => ({
    template: `<div class="p-panel-roomy" style="width: 24rem"><div class="grid gap-group" aria-busy="true"><ui-skeleton /><ui-skeleton /><ui-skeleton width="80%" /></div></div>`,
  }),
};

export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    template: `<div class="p-panel" style="width: 20rem"><div class="grid gap-group" aria-busy="true"><ui-skeleton /><ui-skeleton width="70%" /></div></div>`,
  }),
};

export const DoAndDont: Story = {
  render: () => ({
    template: `
      <div class="grid gap-panel-roomy p-panel-roomy md:grid-cols-2">
        <section aria-labelledby="do-h">
          <h3 id="do-h" class="mb-group text-section-title text-success">Do</h3>
          <div class="mb-group rounded-panel border border-solid border-line bg-surface p-panel" aria-busy="true"><p class="mb-group text-meta text-muted" role="status">Loading mentors</p><ui-skeleton /></div>
          <p class="text-body">Skeletons in the shape of the content, with a text that says what loads.</p>
        </section>
        <section aria-labelledby="dont-h">
          <h3 id="dont-h" class="mb-group text-section-title text-danger">Don't</h3>
          <div class="mb-group rounded-panel border border-solid border-line bg-surface p-panel"><ui-skeleton width="100%" height="6rem" /></div>
          <p class="text-body">A big block that does not match the content, and nothing says what is loading.</p>
        </section>
      </div>`,
  }),
};

export const HiddenFromAssistiveTech: Story = {
  render: () => ({ template: `<div class="p-panel"><ui-skeleton /></div>` }),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('ui-skeleton')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  },
};
