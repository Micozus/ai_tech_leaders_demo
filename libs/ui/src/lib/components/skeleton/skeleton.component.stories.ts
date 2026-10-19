import type { Meta, StoryObj } from '@storybook/angular';
import { SkeletonComponent } from './skeleton.component';

const meta: Meta<SkeletonComponent> = {
  title: 'UI/Skeleton',
  component: SkeletonComponent,
  args: { width: '16rem', height: '1.0625rem' },
};
export default meta;

export const Line: StoryObj<SkeletonComponent> = {};
