import { expect, userEvent, waitFor, within } from 'storybook/test';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TabPanelComponent, TabsComponent } from './tabs.component';

const meta: Meta<TabsComponent> = {
  decorators: [moduleMetadata({ imports: [TabsComponent, TabPanelComponent] })],
  title: 'Primitives/Tabs',
  component: TabsComponent,
  render: () => ({
    template: `
      <div class="max-w-measure p-panel-roomy">
        <ui-tabs>
          <ui-tab-panel value="upcoming" label="Upcoming"><p class="text-body">Thursday 14:00 · Architecture review</p></ui-tab-panel>
          <ui-tab-panel value="past" label="Past"><p class="text-body">Tuesday · Generics error, written answer ready</p></ui-tab-panel>
        </ui-tabs>
      </div>`,
  }),
};
export default meta;

type Story = StoryObj<TabsComponent>;

export const Playground: Story = {};

/** Selected, unselected, and keyboard focus (frozen) on the tab list. */
export const StateMatrix: Story = {
  render: () => ({
    props: { value: 'past' },
    template: `
      <div class="max-w-measure p-panel-roomy">
        <ui-tabs [(value)]="value">
          <ui-tab-panel value="upcoming" label="Upcoming"><p class="text-body">Thursday 14:00 · Architecture review</p></ui-tab-panel>
          <ui-tab-panel value="past" label="Past"><p class="text-body">Tuesday · Generics error, written answer ready</p></ui-tab-panel>
          <ui-tab-panel value="cancelled" label="Cancelled"><p class="text-body">No cancelled sessions.</p></ui-tab-panel>
        </ui-tabs>
      </div>`,
  }),
};

export const LongText: Story = {
  render: () => ({
    template: `
      <div class="p-panel-roomy" style="width: 22rem">
        <ui-tabs>
          <ui-tab-panel value="a" label="Sessions that are waiting for your written answer"><p class="text-body">Two sessions.</p></ui-tab-panel>
          <ui-tab-panel value="b" label="Notes waiting for the mentee"><p class="text-body">One note.</p></ui-tab-panel>
        </ui-tabs>
      </div>`,
  }),
};

export const NarrowScreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    template: `
      <div class="p-panel" style="width: 20rem">
        <ui-tabs>
          <ui-tab-panel value="upcoming" label="Upcoming"><p class="text-body">Thursday 14:00</p></ui-tab-panel>
          <ui-tab-panel value="past" label="Past"><p class="text-body">Tuesday</p></ui-tab-panel>
        </ui-tabs>
      </div>`,
  }),
};

export const DoAndDont: Story = {
  render: () => ({
    template: `
      <div class="grid gap-panel-roomy p-panel-roomy md:grid-cols-2">
        <section aria-labelledby="do-h">
          <h3 id="do-h" class="mb-group text-section-title text-success">Do</h3>
          <div class="mb-group"><ui-tabs><ui-tab-panel value="a" label="Upcoming"><p class="text-body">Thursday 14:00</p></ui-tab-panel><ui-tab-panel value="b" label="Past"><p class="text-body">Tuesday</p></ui-tab-panel></ui-tabs></div>
          <p class="text-body">Tabs switch between views of the same list on one page.</p>
        </section>
        <section aria-labelledby="dont-h">
          <h3 id="dont-h" class="mb-group text-section-title text-danger">Don't</h3>
          <div class="mb-group"><ui-tabs><ui-tab-panel value="a" label="Sign in"><p class="text-body">Form</p></ui-tab-panel><ui-tab-panel value="b" label="Pay"><p class="text-body">Form</p></ui-tab-panel></ui-tabs></div>
          <p class="text-body">Steps of a flow are not tabs: tabs can be visited in any order, steps cannot.</p>
        </section>
      </div>`,
  }),
};

export const SwitchesWithClickAndArrowKeys: Story = {
  render: () => ({
    template: `
      <div class="max-w-measure p-panel-roomy">
        <ui-tabs>
          <ui-tab-panel value="upcoming" label="Upcoming"><p class="text-body">Thursday 14:00 · Architecture review</p></ui-tab-panel>
          <ui-tab-panel value="past" label="Past"><p class="text-body">Tuesday · Generics error</p></ui-tab-panel>
        </ui-tabs>
      </div>`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('tab', { name: 'Upcoming' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await userEvent.click(canvas.getByRole('tab', { name: 'Past' }));
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Tuesday');
    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() =>
      expect(canvas.getByRole('tab', { name: 'Upcoming' })).toHaveFocus(),
    );
  },
};
