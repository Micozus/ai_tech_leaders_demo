import { expect, userEvent, waitFor, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { MANY_MENTORS, MENTORS } from '../../.storybook/blocks/sample-data';
import { MentorListComponent } from '../lib/product/booking/mentor-list.component';

const meta: Meta<MentorListComponent> = {
  decorators: [moduleMetadata({ imports: [MentorListComponent] })],
  title: 'Patterns/List with filters',
  component: MentorListComponent,
  render: (args) => ({
    props: { ...args, opened: '', retried: 0 },
    template: `<div class="p-panel-roomy"><ui-mentor-list [mentors]="mentors" [state]="state" (view)="opened = $event" (retry)="retried = retried + 1" /><p class="mt-groups text-body" role="log">Opened: {{ opened }} · Retried: {{ retried }}</p></div>`,
  }),
  args: { mentors: MENTORS, state: 'ready' },
  argTypes: {
    state: { control: 'inline-radio', options: ['loading', 'error', 'ready'] },
  },
};
export default meta;

type Story = StoryObj<MentorListComponent>;

export const Results: Story = {};
export const Loading: Story = { args: { state: 'loading' } };
export const NothingYet: Story = { args: { mentors: [] } };
export const ErrorWithRetry: Story = { args: { state: 'error' } };
export const ManyResults: Story = { args: { mentors: MANY_MENTORS } };
export const LongTexts: Story = {
  args: {
    mentors: [
      {
        ...MENTORS[0],
        name: 'Maximilian Alexander Konstantinopoulos-Wiśniewski',
        publicWorkUrl:
          'https://github.com/maximilian-konstantinopoulos-wisniewski/a-very-long-repository-name',
        tags: ['TypeScript', 'React', 'Python', 'AI agents'],
      },
    ],
  },
};
export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const FilterNarrowsTheListAndShowsTheCount: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('article')).toHaveLength(3);
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Python' }));
    await waitFor(() => expect(canvas.getAllByRole('article')).toHaveLength(2));
    await expect(canvas.getAllByRole('status')[0]).toHaveTextContent(
      '2 mentors',
    );
    await expect(
      canvas.getByRole('button', { name: 'Remove Python filter' }),
    ).toBeVisible();
  },
};

export const NothingForTheFiltersOffersToClearThem: Story = {
  args: { mentors: [MENTORS[0]] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Python' }));
    await expect(
      await canvas.findByText('No mentors for these filters'),
    ).toBeVisible();
    const clears = canvas.getAllByRole('button', { name: 'Clear filters' });
    await userEvent.click(clears[clears.length - 1]);
    await waitFor(() => expect(canvas.getAllByRole('article')).toHaveLength(1));
  },
};
