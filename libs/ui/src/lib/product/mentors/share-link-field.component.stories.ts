import { expect, userEvent, waitFor, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ShareLinkFieldComponent } from './share-link-field.component';

const meta: Meta<ShareLinkFieldComponent> = {
  decorators: [moduleMetadata({ imports: [ShareLinkFieldComponent] })],
  title: 'Product/E02 Mentors become bookable/Share link field',
  component: ShareLinkFieldComponent,
  render: (args) => ({
    props: { ...args, copiedCount: 0 },
    template: `<div class="max-w-measure p-panel-roomy"><ui-share-link-field [url]="url" (copied)="copiedCount = copiedCount + 1" /><p class="mt-groups text-body" role="status">Copied: {{ copiedCount }}</p></div>`,
  }),
  args: { url: 'https://devmentor.app/m/ada-lovelace' },
};
export default meta;

type Story = StoryObj<ShareLinkFieldComponent>;

export const Playground: Story = {};
export const StateMatrix: Story = {};
export const LongText: Story = {
  args: {
    url: 'https://devmentor.app/m/maximilian-alexander-konstantinopoulos-wisniewski-typescript-react-python',
  },
};
export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const CopiesTheLink: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: async () => undefined },
      configurable: true,
    });
    await userEvent.click(canvas.getByRole('button', { name: /Copy link/ }));
    await waitFor(() =>
      expect(canvas.getByRole('status')).toHaveTextContent('Copied: 1'),
    );
  },
};
