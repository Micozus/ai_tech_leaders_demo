import { ChangeDetectionStrategy, Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';

interface TokenGroup {
  readonly title: string;
  readonly names: readonly string[];
}

const SCALE_STEPS = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
];

const COLOR_GROUPS: readonly TokenGroup[] = [
  {
    title: 'Accent scale',
    names: SCALE_STEPS.map((s) => `--color-accent-${s}`),
  },
  {
    title: 'Neutral scale',
    names: [...SCALE_STEPS, '950'].map((s) => `--color-neutral-${s}`),
  },
  {
    title: 'Semantic roles',
    names: [
      '--color-ink',
      '--color-muted',
      '--color-subtle',
      '--color-line',
      '--color-canvas',
      '--color-surface',
      '--color-inverse',
      '--color-accent',
      '--color-accent-strong',
      '--color-accent-tint',
      '--color-success',
      '--color-success-tint',
      '--color-danger',
      '--color-danger-tint',
      '--color-warning',
      '--color-warning-tint',
      '--color-focus',
    ],
  },
];

const RADII = [
  '--radius-sm',
  '--radius-md',
  '--radius-lg',
  '--radius-xl',
  '--radius-2xl',
];
const SHADOWS = [
  '--shadow-card',
  '--shadow-float',
  '--shadow-toast',
  '--shadow-dialog',
];
const TEXT_SIZES = [
  '--text-xs',
  '--text-sm',
  '--text-base',
  '--text-lg',
  '--text-xl',
  '--text-2xl',
];

/** Style guide page: every swatch reads its value from the live CSS variable. */
@Component({
  selector: 'ui-token-gallery',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid gap-10 p-6">
      @for (group of groups; track group.title) {
        <section>
          <h2 class="mb-3 text-lg font-bold">{{ group.title }}</h2>
          <div
            class="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-3"
          >
            @for (name of group.names; track name) {
              <div
                class="overflow-hidden rounded-md border border-solid border-line bg-surface"
              >
                <div
                  class="h-14 border-b border-solid border-line"
                  [style.background]="'var(' + name + ')'"
                ></div>
                <p class="p-2 font-mono text-xs break-all">
                  {{ name }}<br /><span class="text-muted">{{
                    value(name)
                  }}</span>
                </p>
              </div>
            }
          </div>
        </section>
      }
      <section>
        <h2 class="mb-3 text-lg font-bold">Radius</h2>
        <div class="flex flex-wrap gap-4">
          @for (name of radii; track name) {
            <div
              class="size-20 border-2 border-solid border-accent bg-accent-tint p-2 font-mono text-xs"
              [style.border-radius]="'var(' + name + ')'"
            >
              {{ name }}
            </div>
          }
        </div>
      </section>
      <section>
        <h2 class="mb-3 text-lg font-bold">Elevation</h2>
        <div class="flex flex-wrap gap-6">
          @for (name of shadows; track name) {
            <div
              class="grid size-28 place-items-center rounded-lg bg-surface p-2 text-center font-mono text-xs"
              [style.box-shadow]="'var(' + name + ')'"
            >
              {{ name }}
            </div>
          }
        </div>
      </section>
      <section>
        <h2 class="mb-3 text-lg font-bold">Type scale</h2>
        @for (name of textSizes; track name) {
          <p class="mb-2" [style.font-size]="'var(' + name + ')'">
            {{ name }} — Book a 25-minute session
          </p>
        }
      </section>
    </div>
  `,
})
class TokenGalleryComponent {
  protected readonly groups = COLOR_GROUPS;
  protected readonly radii = RADII;
  protected readonly shadows = SHADOWS;
  protected readonly textSizes = TEXT_SIZES;

  protected value(name: string): string {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
  }
}

const meta: Meta<TokenGalleryComponent> = {
  title: 'Foundations/Design tokens',
  component: TokenGalleryComponent,
};
export default meta;

export const Gallery: StoryObj<TokenGalleryComponent> = {};
