import { expect, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { MENTORS } from '../../.storybook/blocks/sample-data';
import { MentorDetailComponent } from '../lib/product/booking/mentor-detail.component';

const ABOUT =
  'I mentor developers who are blocked on TypeScript generics and React rendering. I read the code first, then answer in writing: what is wrong, why, and what to do next.';

const meta: Meta<MentorDetailComponent> = {
  decorators: [moduleMetadata({ imports: [MentorDetailComponent] })],
  title: 'Patterns/Detail view',
  component: MentorDetailComponent,
  render: (args) => ({
    props: args,
    template: `<div class="max-w-measure p-panel-roomy"><ui-mentor-detail [mentor]="mentor" [about]="about" [state]="state" /></div>`,
  }),
  args: { mentor: MENTORS[0], about: ABOUT, state: 'ready' },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: ['loading', 'ready', 'not-found'],
    },
  },
};
export default meta;

type Story = StoryObj<MentorDetailComponent>;

export const Ready: Story = {};
export const Loading: Story = { args: { state: 'loading' } };
export const DoesNotExistOrNoAccess: Story = {
  args: { state: 'not-found', mentor: undefined },
};
export const LongTexts: Story = {
  args: {
    mentor: {
      ...MENTORS[0],
      name: 'Maximilian Alexander Konstantinopoulos-Wiśniewski',
      publicWorkUrl:
        'https://github.com/maximilian-konstantinopoulos-wisniewski/a-very-long-repository-name-for-typed-queries',
    },
    about: ABOUT.repeat(6),
  },
};
export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const MainActionIsVisibleWithoutScrolling: Story = {
  args: { about: ABOUT.repeat(20) },
  play: async ({ canvasElement }) => {
    const book = within(canvasElement).getByRole('button', {
      name: 'Book a session',
    });
    const box = book.getBoundingClientRect();
    await expect(box.bottom).toBeLessThanOrEqual(window.innerHeight);
  },
};
