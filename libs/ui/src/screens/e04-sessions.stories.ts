import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { PageHeaderComponent } from '../lib/components/page-header/page-header.component';
import { AppHeaderComponent } from '../lib/product/accounts/app-header.component';
import { NoteApprovalComponent } from '../lib/product/sessions/note-approval.component';
import {
  SessionPanelComponent,
  type SessionMessage,
} from '../lib/product/sessions/session-panel.component';
import { WrittenAnswerComponent } from '../lib/product/sessions/written-answer.component';

const MESSAGES: readonly SessionMessage[] = [
  {
    id: '1',
    author: 'Maciej Nowak',
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
const ANSWER =
  'The error comes from the recursive conditional type in `Query<T>`.\n\nConstrain the parameter first: `T extends Record<string, unknown>`. Then narrow with a helper type instead of recursing on the whole object.\n\nAdd the type test from the repository, so a regression shows up in CI.';
const NOTE =
  'Constrain the type parameter first.\nUse a helper type to narrow instead of recursing on the whole object.\nAdd the type test to CI.';

const meta: Meta = {
  decorators: [
    moduleMetadata({
      imports: [
        AppHeaderComponent,
        NoteApprovalComponent,
        PageHeaderComponent,
        SessionPanelComponent,
        WrittenAnswerComponent,
      ],
    }),
  ],
  title: 'Product/E04 Session, written answer and note/Screens',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

function session(
  state: 'ready' | 'loading' | 'empty' | 'error',
  canWrite = true,
): Story {
  return {
    render: () => ({
      props: { state, messages: state === 'ready' ? MESSAGES : [], canWrite },
      template: `<ui-app-header userName="Maciej Nowak" userRole="mentee" /><main class="mx-auto max-w-page p-panel-roomy"><ui-session-panel [messages]="messages" [state]="state" [canWrite]="canWrite" /></main>`,
    }),
  };
}

/** The text session, and its states. */
export const Session: Story = session('ready');
export const SessionLoading: Story = session('loading');
export const SessionNoMessagesYet: Story = session('empty');
export const SessionConversationFailed: Story = session('error');
export const SessionEnded: Story = session('ready', false);

function answer(state: 'ready' | 'loading' | 'empty' | 'error'): Story {
  return {
    render: () => ({
      props: { state, body: state === 'ready' ? ANSWER : '' },
      template: `<ui-app-header userName="Maciej Nowak" userRole="mentee" /><main class="mx-auto max-w-page p-panel-roomy"><ui-page-header heading="Architecture review" description="Thu 5 Nov, 14:00 · 50 minutes" /><ui-written-answer [state]="state" [body]="body" /></main>`,
    }),
  };
}

/** The written answer after the session. */
export const WrittenAnswer: Story = answer('ready');
export const WrittenAnswerLoading: Story = answer('loading');
export const WrittenAnswerNotReady: Story = answer('empty');
export const WrittenAnswerFailed: Story = answer('error');

/** The mentee approves or declines the note. */
export const NoteForApproval: Story = {
  render: () => ({
    props: { note: NOTE },
    template: `<ui-app-header userName="Maciej Nowak" userRole="mentee" /><main class="mx-auto max-w-page p-panel-roomy"><ui-note-approval [note]="note" /></main>`,
  }),
};
