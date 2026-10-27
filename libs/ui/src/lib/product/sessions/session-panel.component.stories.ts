import { expect, userEvent, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import {
  SessionPanelComponent,
  type SessionMessage,
} from './session-panel.component';

const MESSAGES: readonly SessionMessage[] = [
  {
    id: '1',
    author: 'Maciej',
    at: '14:03',
    text: 'My generics error:\nType instantiation is excessively deep and possibly infinite.\nRepo: github.com/acme/billing-service/pull/412',
  },
  {
    id: '2',
    author: 'Ada Lovelace',
    at: '14:11',
    text: 'Constrain the type parameter before you recurse. I will write the full answer after we are done.',
  },
];
const MANY: readonly SessionMessage[] = Array.from({ length: 30 }, (_, i) => ({
  id: String(i),
  author: i % 2 ? 'Ada Lovelace' : 'Maciej',
  at: `14:${String(10 + i).padStart(2, '0')}`,
  text: `Message ${i + 1} in a long exchange about the generics error.`,
}));

const meta: Meta<SessionPanelComponent> = {
  decorators: [moduleMetadata({ imports: [SessionPanelComponent] })],
  title: 'Product/E04 Session, written answer and note/Session panel',
  component: SessionPanelComponent,
  render: (args) => ({
    props: { ...args, log: '' },
    template: `<div class="p-panel-roomy"><ui-session-panel [messages]="messages" [state]="state" [canWrite]="canWrite" (sent)="log = $event" /><p class="mt-groups text-body" role="log">{{ log }}</p></div>`,
  }),
  args: { messages: MESSAGES, state: 'ready', canWrite: true },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: ['loading', 'empty', 'error', 'ready'],
    },
  },
};
export default meta;

type Story = StoryObj<SessionPanelComponent>;

export const Playground: Story = {};
export const Loading: Story = { args: { state: 'loading' } };
export const Empty: Story = { args: { messages: [], state: 'empty' } };
export const ErrorState: Story = { args: { state: 'error' } };
export const SessionEnded: Story = { args: { canWrite: false } };
export const ManyMessages: Story = { args: { messages: MANY } };
export const PartialData: Story = { args: { messages: [MESSAGES[0]] } };
export const StateMatrix: Story = {};
export const LongText: Story = {
  args: {
    messages: [
      {
        id: 'l',
        author: 'Maximilian Alexander Konstantinopoulos-Wiśniewski',
        at: '14:03',
        text:
          'x'.repeat(10) +
          ' A very long unbroken line: ' +
          'verylongidentifier'.repeat(8),
      },
    ],
  },
};
export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const SendsWithCtrlEnter: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      canvas.getByLabelText('Your message'),
      'It works now{Control>}{Enter}{/Control}',
    );
    await expect(canvas.getByRole('log')).toHaveTextContent('It works now');
  },
};
