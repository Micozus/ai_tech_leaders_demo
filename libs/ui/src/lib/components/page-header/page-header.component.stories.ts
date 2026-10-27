import { expect, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ButtonComponent } from '../button/button.component';
import { PageHeaderComponent } from './page-header.component';

const meta: Meta<PageHeaderComponent> = {
  decorators: [
    moduleMetadata({ imports: [PageHeaderComponent, ButtonComponent] }),
  ],
  title: 'Primitives/Page header',
  component: PageHeaderComponent,
  render: (args) => ({
    props: args,
    template: `<div class="p-panel-roomy"><ui-page-header [heading]="heading" [eyebrow]="eyebrow" [description]="description"><button ui-button size="sm">Save</button></ui-page-header></div>`,
  }),
  args: {
    heading: 'Availability',
    eyebrow: 'Mentor',
    description: 'Publish the slots people can book.',
  },
};
export default meta;

type Story = StoryObj<PageHeaderComponent>;

export const Playground: Story = {};
export const StateMatrix: Story = {
  render: () => ({
    template: `<div class="grid gap-panel-roomy p-panel-roomy"><ui-page-header heading="Your sessions" /><ui-page-header heading="Availability" description="Publish the slots people can book." /><ui-page-header eyebrow="Mentor" heading="Set up your mentor page" description="Publish a slot within two weeks."><button ui-button size="sm">Save</button></ui-page-header></div>`,
  }),
};
export const LongText: Story = {
  args: {
    heading:
      'Architecture review of the billing service, the invoice export and the retry logic of the payment webhook',
    description:
      'A long description wraps under the title and stays at the reading width, with the actions beside it on wide screens and under it on narrow ones.',
  },
};
export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
export const DoAndDont: Story = {
  render: () => ({
    template: `
      <div class="grid gap-panel-roomy p-panel-roomy md:grid-cols-2">
        <section aria-labelledby="do-h"><h3 id="do-h" class="mb-group text-section-title text-success">Do</h3><div class="mb-group"><ui-page-header heading="Your sessions" description="Written answers arrive here." /></div><p class="text-body">One page title, left aligned, with a short description.</p></section>
        <section aria-labelledby="dont-h"><h3 id="dont-h" class="mb-group text-section-title text-danger">Don't</h3><div class="mb-group text-center"><p class="text-page-title">Welcome back!</p><p class="text-body text-muted">We are so glad you are here.</p></div><p class="text-body">A centered greeting that is not a heading and says nothing about the page.</p></section>
      </div>`,
  }),
};
export const HasOneLevelOneHeading: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('heading', {
        level: 1,
        name: 'Availability',
      }),
    ).toBeVisible();
  },
};
