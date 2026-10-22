import { expect, userEvent, waitFor, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { MenuComponent } from './menu.component';
import type { MenuEntry } from './menu.model';

const ACCOUNT: readonly MenuEntry[] = [
  { label: 'Your profile', icon: 'pi-user' },
  { label: 'Copy share link', icon: 'pi-copy' },
  { label: 'Sign out', icon: 'pi-sign-out' },
];

const meta: Meta<MenuComponent> = {
  decorators: [moduleMetadata({ imports: [MenuComponent] })],
  title: 'Primitives/Menu',
  component: MenuComponent,
  render: (args) => ({
    props: args,
    template: `<div class="p-panel" style="min-height: 14rem"><ui-menu [label]="label" [entries]="entries" /></div>`,
  }),
  args: { label: 'Account', entries: ACCOUNT },
};
export default meta;

type Story = StoryObj<MenuComponent>;

export const Playground: Story = {};

/** The closed trigger, and a disabled entry. The open menu is shown in the interaction story. */
export const StateMatrix: Story = {
  render: () => ({
    props: {
      entries: [
        ...ACCOUNT,
        { label: 'Delete account', icon: 'pi-times', disabled: true },
      ],
    },
    template: `<div class="grid gap-groups p-panel"><ui-menu label="Account" [entries]="entries" /><p class="text-meta text-muted">A disabled entry says why in text where it matters: a menu entry that is unavailable is better left out.</p></div>`,
  }),
};

export const LongText: Story = {
  args: {
    label: 'Account of Maximilian Konstantinopoulos-Wiśniewski',
    entries: [
      {
        label:
          'Your public profile and the page that mentees see when they find you',
      },
    ],
  },
};

export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const DoAndDont: Story = {
  render: () => ({
    template: `
      <div class="grid gap-panel-roomy p-panel-roomy md:grid-cols-2">
        <section aria-labelledby="do-h">
          <h3 id="do-h" class="mb-group text-section-title text-success">Do</h3>
          <div class="mb-group"><ui-menu label="Account" [entries]="[{ label: 'Your profile' }, { label: 'Sign out' }]" /></div>
          <p class="text-body">A menu for a few related actions, opened by a button with a visible label.</p>
        </section>
        <section aria-labelledby="dont-h">
          <h3 id="dont-h" class="mb-group text-section-title text-danger">Don't</h3>
          <div class="mb-group"><ui-menu label="Session length" [entries]="[{ label: '25 minutes' }, { label: '50 minutes' }]" /></div>
          <p class="text-body">A menu is not a way to choose a value: use a radio group or a select.</p>
        </section>
      </div>`,
  }),
};

export const OpensWithKeyboardAndRunsEntry: Story = {
  render: () => ({
    props: { entries: [{ label: 'Copy share link', icon: 'pi-copy' }] },
    template: `<div class="p-panel" style="min-height: 14rem"><ui-menu label="Account" [entries]="entries" /></div>`,
  }),
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const trigger = within(canvasElement).getByRole('button', {
      name: /Account/,
    });
    await userEvent.click(trigger);
    const menu = await page.findByRole('menu');
    await waitFor(() =>
      expect(trigger).toHaveAttribute('aria-expanded', 'true'),
    );
    await waitFor(() =>
      expect(
        within(menu).getByRole('menuitem', { name: 'Copy share link' }),
      ).toBeVisible(),
    );
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(page.queryByRole('menu')).toBeNull());
    await waitFor(() =>
      expect(trigger).toHaveAttribute('aria-expanded', 'false'),
    );
  },
};
