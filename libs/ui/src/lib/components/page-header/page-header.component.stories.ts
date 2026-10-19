import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ButtonComponent } from '../button/button.component';
import { PageHeaderComponent } from './page-header.component';

const meta: Meta<PageHeaderComponent> = {
  decorators: [moduleMetadata({ imports: [ButtonComponent] })],
  title: 'UI/Page header',
  component: PageHeaderComponent,
  render: (args) => ({
    props: args,
    template: `<ui-page-header [heading]="heading" [eyebrow]="eyebrow" [description]="description"><button ui-button size="sm">Save</button></ui-page-header>`,
  }),
  args: {
    heading: 'Availability',
    eyebrow: 'Mentor',
    description: 'Publish the slots people can book.',
  },
};
export default meta;

export const Default: StoryObj<PageHeaderComponent> = {};
