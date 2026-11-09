import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  contentChildren,
  input,
  model,
  viewChild,
} from '@angular/core';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';

/** One panel of `ui-tabs`: `<ui-tab-panel value="upcoming" label="Upcoming">…</ui-tab-panel>`. */
@Component({
  selector: 'ui-tab-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-template><ng-content /></ng-template>`,
})
export class TabPanelComponent {
  readonly value = input.required<string>();
  readonly label = input.required<string>();
  readonly content = viewChild.required(TemplateRef);
}

/**
 * Tabs switch between views of the same page without leaving it (PrimeNG `p-tabs`): arrow keys
 * move between tabs, Tab enters the panel. Views that have their own address are pages, not tabs.
 */
@Component({
  selector: 'ui-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, Tabs, TabList, Tab, TabPanels, TabPanel],
  template: `
    <p-tabs [value]="active()" (valueChange)="value.set(toText($event))">
      <p-tablist>
        @for (panel of panels(); track panel.value()) {
          <p-tab [value]="panel.value()">{{ panel.label() }}</p-tab>
        }
      </p-tablist>
      <p-tabpanels>
        @for (panel of panels(); track panel.value()) {
          <p-tabpanel [value]="panel.value()">
            <ng-container [ngTemplateOutlet]="panel.content()" />
          </p-tabpanel>
        }
      </p-tabpanels>
    </p-tabs>
  `,
})
export class TabsComponent {
  /** The selected tab; the first tab when empty. */
  readonly value = model('');
  protected readonly panels = contentChildren(TabPanelComponent);
  protected readonly active = computed(
    () => this.value() || this.panels()[0]?.value() || '',
  );

  protected toText(value: string | number | undefined): string {
    return String(value ?? '');
  }
}
