import type { Meta, StoryObj } from '@storybook/angular';
import {
  ColorRolesComponent,
  ContrastTableComponent,
} from '../../../.storybook/blocks/color-blocks.component';
import {
  IconsComponent,
  MotionComponent,
  ShapeDepthComponent,
} from '../../../.storybook/blocks/shape-motion-icon-blocks.component';
import {
  LayoutComponent,
  SpacingComponent,
} from '../../../.storybook/blocks/spacing-blocks.component';
import { TypeRolesComponent } from '../../../.storybook/blocks/type-blocks.component';

/** Documentation blocks used by the Foundations pages. Hidden from the sidebar (`!dev`). */
const meta: Meta = {
  title: 'Foundations/Blocks',
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { story: { iframeHeight: '420px' } },
  },
};
export default meta;

type Story = StoryObj;

export const ColorRoles: Story = {
  render: () => ({
    template: '<ui-doc-color-roles />',
    moduleMetadata: { imports: [ColorRolesComponent] },
  }),
};
export const ContrastTable: Story = {
  render: () => ({
    template: '<ui-doc-contrast-table />',
    moduleMetadata: { imports: [ContrastTableComponent] },
  }),
  parameters: { docs: { story: { iframeHeight: '1500px' } } },
};
export const TypeRoles: Story = {
  render: () => ({
    template: '<ui-doc-type-roles />',
    moduleMetadata: { imports: [TypeRolesComponent] },
  }),
  parameters: { docs: { story: { iframeHeight: '720px' } } },
};
export const Spacing: Story = {
  render: () => ({
    template: '<ui-doc-spacing />',
    moduleMetadata: { imports: [SpacingComponent] },
  }),
  parameters: { docs: { story: { iframeHeight: '460px' } } },
};
export const Layout: Story = {
  render: () => ({
    template: '<ui-doc-layout />',
    moduleMetadata: { imports: [LayoutComponent] },
  }),
  parameters: { docs: { story: { iframeHeight: '320px' } } },
};
export const ShapeDepth: Story = {
  render: () => ({
    template: '<ui-doc-shape-depth />',
    moduleMetadata: { imports: [ShapeDepthComponent] },
  }),
  parameters: { docs: { story: { iframeHeight: '420px' } } },
};
export const Motion: Story = {
  render: () => ({
    template: '<ui-doc-motion />',
    moduleMetadata: { imports: [MotionComponent] },
  }),
  parameters: { docs: { story: { iframeHeight: '420px' } } },
};
export const Icons: Story = {
  render: () => ({
    template: '<ui-doc-icons />',
    moduleMetadata: { imports: [IconsComponent] },
  }),
  parameters: { docs: { story: { iframeHeight: '800px' } } },
};
