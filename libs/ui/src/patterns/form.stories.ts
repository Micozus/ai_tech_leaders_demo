import { expect, userEvent, waitFor, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import {
  installApiMock,
  type ApiScenario,
} from '../../.storybook/blocks/api-mock';
import { postJson } from '../lib/helpers/submit-outcome.helper';
import {
  MentorPageFormComponent,
  type MentorPageValue,
} from '../lib/product/mentors/mentor-page-form.component';

const submitter = (value: MentorPageValue) =>
  postJson('/api/mentor-page', value);

function scenario(
  api: ApiScenario,
  fieldErrors: Record<string, string> = {},
): StoryObj<MentorPageFormComponent> {
  return {
    beforeEach: () => installApiMock(api, fieldErrors),
    render: () => ({
      props: { submitter },
      template: `<div class="max-w-measure p-panel-roomy"><ui-mentor-page-form [submitter]="submitter" /></div>`,
    }),
  };
}

const meta: Meta<MentorPageFormComponent> = {
  decorators: [moduleMetadata({ imports: [MentorPageFormComponent] })],
  title: 'Patterns/Form',
  component: MentorPageFormComponent,
};
export default meta;

type Story = StoryObj<MentorPageFormComponent>;

async function fillValid(canvas: ReturnType<typeof within>): Promise<void> {
  await userEvent.type(
    canvas.getByLabelText('Link to your public work'),
    'https://github.com/ada',
  );
  await userEvent.click(canvas.getByRole('checkbox', { name: 'TypeScript' }));
}

/** The idle form: every label visible, optional fields marked, nothing is invalid yet. */
export const Idle: Story = scenario('success');

export const ValidationOnBlurAndSubmit: Story = {
  ...scenario('success'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByLabelText('Link to your public work');
    await userEvent.click(link);
    await userEvent.tab();
    await expect(
      canvas.getByText('Add a link to your public work.'),
    ).toBeVisible();
    await userEvent.click(
      canvas.getByRole('button', { name: 'Save mentor page' }),
    );
    await expect(link).toHaveFocus();
    await expect(
      canvas.getByText('Choose at least one stack tag.'),
    ).toBeVisible();
  },
};

export const SubmittingBlocksASecondSubmit: Story = {
  ...scenario('pending'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await fillValid(canvas);
    const save = canvas.getByRole('button', { name: 'Save mentor page' });
    await userEvent.click(save);
    await waitFor(() => expect(save).toHaveAttribute('aria-busy', 'true'));
    // The mouse is ignored while busy; the keyboard still reaches the button, so the state must block it.
    save.focus();
    await userEvent.keyboard('{Enter}{Enter}');
    await expect(window.__apiCalls).toBe(1);
  },
};

export const FieldErrorFromTheServer: Story = {
  ...scenario('field-error', { publicWorkUrl: 'We could not open that link.' }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await fillValid(canvas);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Save mentor page' }),
    );
    await waitFor(() =>
      expect(canvas.getByText('We could not open that link.')).toBeVisible(),
    );
    await expect(
      canvas.getByLabelText('Link to your public work'),
    ).toHaveFocus();
    await expect(canvas.getByLabelText('Link to your public work')).toHaveValue(
      'https://github.com/ada',
    );
  },
};

export const ServerErrorKeepsTheData: Story = {
  ...scenario('server-error'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await fillValid(canvas);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Save mentor page' }),
    );
    await waitFor(() =>
      expect(
        canvas.getByText(/Something went wrong on our side/),
      ).toBeVisible(),
    );
    await expect(canvas.getByLabelText('Link to your public work')).toHaveValue(
      'https://github.com/ada',
    );
    await expect(
      canvas.getByRole('checkbox', { name: 'TypeScript' }),
    ).toBeChecked();
  },
};

export const OfflineKeepsTheData: Story = {
  ...scenario('offline'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await fillValid(canvas);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Save mentor page' }),
    );
    await waitFor(() =>
      expect(canvas.getByText(/You seem to be offline/)).toBeVisible(),
    );
    await expect(canvas.getByLabelText('Link to your public work')).toHaveValue(
      'https://github.com/ada',
    );
  },
};

export const SuccessOnlyAfterTheServerConfirms: Story = {
  ...scenario('success'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await fillValid(canvas);
    await expect(canvas.queryByText('Mentor page saved')).toBeNull();
    await userEvent.click(
      canvas.getByRole('button', { name: 'Save mentor page' }),
    );
    await waitFor(() =>
      expect(canvas.getByText('Mentor page saved')).toBeVisible(),
    );
  },
};
