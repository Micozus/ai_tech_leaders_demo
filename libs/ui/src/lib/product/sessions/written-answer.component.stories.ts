import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { WrittenAnswerComponent } from './written-answer.component';

const ANSWER =
  'The error comes from the recursive conditional type in `Query<T>`.\n\nConstrain the parameter first: `T extends Record<string, unknown>`. Then narrow with a helper type instead of recursing on the whole object.\n\nI would also add the type test from the repository, so a regression shows up in CI.';

const meta: Meta<WrittenAnswerComponent> = {
  decorators: [moduleMetadata({ imports: [WrittenAnswerComponent] })],
  title: 'Product/E04 Session, written answer and note/Written answer',
  component: WrittenAnswerComponent,
  render: (args) => ({
    props: args,
    template: `<div class="max-w-measure p-panel-roomy"><ui-written-answer [author]="author" [at]="at" [body]="body" [state]="state" /></div>`,
  }),
  args: {
    author: 'Ada Lovelace',
    at: 'Thu 5 Nov, 15:02',
    body: ANSWER,
    state: 'ready',
  },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: ['loading', 'empty', 'error', 'ready'],
    },
  },
};
export default meta;

type Story = StoryObj<WrittenAnswerComponent>;

export const Playground: Story = {};
export const Loading: Story = { args: { state: 'loading' } };
export const NotReady: Story = { args: { body: '', state: 'empty' } };
export const ErrorState: Story = { args: { state: 'error' } };
export const StateMatrix: Story = {
  render: () => ({
    template: `<div class="grid max-w-measure gap-groups p-panel-roomy"><ui-written-answer body="Short answer." /><ui-written-answer state="empty" /><ui-written-answer state="loading" /><ui-written-answer state="error" /></div>`,
  }),
};
export const LongText: Story = { args: { body: ANSWER.repeat(6) } };
export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
