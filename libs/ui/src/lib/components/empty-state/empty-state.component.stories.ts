import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ButtonComponent } from '../button/button.component';
import { EmptyStateComponent } from './empty-state.component';

const meta: Meta<EmptyStateComponent> = {
  decorators: [moduleMetadata({ imports: [ButtonComponent] })],
  title: 'UI/Empty state',
  component: EmptyStateComponent,
  render: (args) => ({
    props: args,
    template: `<ui-empty-state [heading]="heading" [description]="description"><button ui-button>Find a mentor</button></ui-empty-state>`,
  }),
  args: {
    heading: 'No sessions yet',
    description: 'Book your first session with a mentor.',
  },
};
export default meta;

export const Default: StoryObj<EmptyStateComponent> = {};
