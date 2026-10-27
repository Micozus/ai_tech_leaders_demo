import { expect, userEvent, waitFor, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import {
  installApiMock,
  type ApiScenario,
} from '../../../../.storybook/blocks/api-mock';
import { postJson } from '../../helpers/submit-outcome.helper';
import {
  MentorPageFormComponent,
  type MentorPageValue,
} from './mentor-page-form.component';

const submitter = (value: MentorPageValue) =>
  postJson('/api/mentor-page', value);

function story(
  scenario: ApiScenario,
  fieldErrors: Record<string, string> = {},
): StoryObj<MentorPageFormComponent> {
  return {
    beforeEach: () => installApiMock(scenario, fieldErrors),
    render: () => ({
      props: { submitter },
      template: `<div class="max-w-measure p-panel-roomy"><ui-mentor-page-form [submitter]="submitter" /></div>`,
    }),
  };
}

const meta: Meta<MentorPageFormComponent> = {
  decorators: [moduleMetadata({ imports: [MentorPageFormComponent] })],
  title: 'Product/E02 Mentors become bookable/Mentor page form',
  component: MentorPageFormComponent,
};
export default meta;

type Story = StoryObj<MentorPageFormComponent>;

export const Playground: Story = story('success');
export const FieldError: Story = story('field-error', {
  publicWorkUrl: 'We could not open that link.',
});
export const ServerError: Story = story('server-error');
export const Offline: Story = story('offline');
export const Submitting: Story = story('pending');
export const StateMatrix: Story = story('success');
export const LongText: Story = story('field-error', {
  publicWorkUrl:
    'We could not open the link you gave us. Check that the page is public and does not need a sign-in, then try again.',
});
export const NarrowScreen: Story = {
  ...story('success'),
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const SavesAfterValidationAndConfirmation: Story = {
  ...story('success'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Save mentor page' }),
    );
    await expect(
      canvas.getByLabelText('Link to your public work'),
    ).toHaveFocus();
    await userEvent.type(
      canvas.getByLabelText('Link to your public work'),
      'https://github.com/ada',
    );
    await userEvent.click(canvas.getByRole('checkbox', { name: 'TypeScript' }));
    await userEvent.click(
      canvas.getByRole('button', { name: 'Save mentor page' }),
    );
    await waitFor(() =>
      expect(canvas.getByText('Mentor page saved')).toBeVisible(),
    );
  },
};
