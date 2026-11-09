import { expect, userEvent, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { MENTORS } from '../../../../.storybook/blocks/sample-data';
import { MentorListRowComponent } from './mentor-list-row.component';

const meta: Meta<MentorListRowComponent> = {
  decorators: [moduleMetadata({ imports: [MentorListRowComponent] })],
  title: 'Product/E03 Booking and payment/Mentor list row',
  component: MentorListRowComponent,
  render: (args) => ({
    props: { ...args, opened: '' },
    template: `<div class="max-w-measure p-panel-roomy"><ui-mentor-list-row [mentor]="mentor" (view)="opened = $event" /><p class="mt-groups text-body" role="status">Opened: {{ opened }}</p></div>`,
  }),
  args: { mentor: MENTORS[0] },
};
export default meta;

type Story = StoryObj<MentorListRowComponent>;

export const Playground: Story = {};
export const NoFreeSlot: Story = { args: { mentor: MENTORS[2] } };
export const StateMatrix: Story = {
  render: () => ({
    props: { mentors: MENTORS },
    template: `<div class="max-w-measure p-panel-roomy">@for (m of mentors; track m.id) {<ui-mentor-list-row [mentor]="m" />}</div>`,
  }),
};
export const LongText: Story = {
  args: {
    mentor: {
      ...MENTORS[0],
      name: 'Maximilian Alexander Konstantinopoulos-Wiśniewski',
      publicWorkUrl:
        'https://github.com/maximilian-konstantinopoulos-wisniewski/a-very-long-repository-name-for-typed-queries',
      tags: ['TypeScript', 'React', 'Python', 'AI agents'],
    },
  },
};
export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const OpensTheMentor: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'View mentor' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Opened: m1');
  },
};
