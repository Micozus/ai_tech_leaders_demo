import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import {
  installApiMock,
  type ApiScenario,
} from '../../.storybook/blocks/api-mock';
import { SLOTS } from '../../.storybook/blocks/sample-data';
import { PageHeaderComponent } from '../lib/components/page-header/page-header.component';
import { AppHeaderComponent } from '../lib/product/accounts/app-header.component';
import { InvitationAcceptPanelComponent } from '../lib/product/mentors/invitation-accept-panel.component';
import {
  MentorPageFormComponent,
  type MentorPageValue,
} from '../lib/product/mentors/mentor-page-form.component';
import { PriceFormComponent } from '../lib/product/mentors/price-form.component';
import { ShareLinkFieldComponent } from '../lib/product/mentors/share-link-field.component';
import { SlotPublisherComponent } from '../lib/product/mentors/slot-publisher.component';
import { postJson } from '../lib/helpers/submit-outcome.helper';

const submitter = (value: MentorPageValue) =>
  postJson('/api/mentor-page', value);

const meta: Meta = {
  decorators: [
    moduleMetadata({
      imports: [
        AppHeaderComponent,
        InvitationAcceptPanelComponent,
        MentorPageFormComponent,
        PageHeaderComponent,
        PriceFormComponent,
        ShareLinkFieldComponent,
        SlotPublisherComponent,
      ],
    }),
  ],
  title: 'Product/E02 Mentors become bookable/Screens',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

function invitation(state: 'ready' | 'loading' | 'invalid'): Story {
  return {
    render: () => ({
      props: { state },
      template: `<main class="grid min-h-screen place-items-center bg-canvas p-panel-roomy"><div class="w-full max-w-xl"><ui-invitation-accept-panel [state]="state" /></div></main>`,
    }),
  };
}

/** Accept the invitation: ready, checking, and a link that cannot be used. */
export const Invitation: Story = invitation('ready');
export const InvitationLoading: Story = invitation('loading');
export const InvitationInvalid: Story = invitation('invalid');

function setup(
  api: ApiScenario,
  slots: 'some' | 'none' | 'error' = 'some',
): Story {
  return {
    beforeEach: () => installApiMock(api),
    render: () => ({
      props: {
        submitter,
        bounds: { min25: 15, max25: 150, min50: 25, max50: 300 },
        slots: slots === 'some' ? SLOTS : [],
        slotState:
          slots === 'some' ? 'ready' : slots === 'none' ? 'empty' : 'error',
      },
      template: `
        <ui-app-header userName="Ada Lovelace" userRole="mentor" />
        <main class="mx-auto max-w-page p-panel-roomy">
          <ui-page-header eyebrow="Mentor" heading="Set up your mentor page" description="Publish at least one bookable session within two weeks of accepting." />
          <div class="grid gap-panel-roomy md:grid-cols-2">
            <div class="grid content-start gap-groups"><ui-mentor-page-form [submitter]="submitter" /><ui-share-link-field url="https://devmentor.app/m/ada-lovelace" /></div>
            <div class="grid content-start gap-groups"><ui-price-form [bounds]="bounds" /><ui-slot-publisher [slots]="slots" [state]="slotState" timeZone="Europe/Warsaw" /></div>
          </div>
        </main>`,
    }),
  };
}

/** Mentor set-up: the whole screen, then the states of its parts. */
export const MentorSetup: Story = setup('success');
export const MentorSetupSaveFails: Story = setup('server-error');
export const MentorSetupNoSlotsYet: Story = setup('success', 'none');
export const MentorSetupSlotsFailedToLoad: Story = setup('success', 'error');
