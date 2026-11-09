import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TabPanelComponent, TabsComponent } from './tabs.component';

@Component({
  imports: [TabsComponent, TabPanelComponent],
  template: `
    <ui-tabs [(value)]="value">
      <ui-tab-panel value="upcoming" label="Upcoming"
        ><p>Thursday 14:00</p></ui-tab-panel
      >
      <ui-tab-panel value="past" label="Past"><p>Tuesday</p></ui-tab-panel>
    </ui-tabs>
  `,
})
class HostComponent {
  readonly value = signal('');
}

describe('TabsComponent', () => {
  async function render() {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const tab = (name: string) =>
      Array.from(root.querySelectorAll('[role="tab"]')).find(
        (t) => t.textContent?.trim() === name,
      ) as HTMLElement;
    return { fixture, root, tab };
  }

  it('selects the first tab when no value is given', async () => {
    const { root, tab } = await render();

    expect(tab('Upcoming').getAttribute('aria-selected')).toBe('true');
    expect(tab('Past').getAttribute('aria-selected')).toBe('false');
    expect(root.querySelector('[role="tabpanel"]')?.textContent).toContain(
      'Thursday 14:00',
    );
  });

  it('switches panel and reports the value when a tab is chosen', async () => {
    const { fixture, root, tab } = await render();
    tab('Past').click();
    await fixture.whenStable();

    expect(fixture.componentInstance.value()).toBe('past');
    const panels = Array.from(root.querySelectorAll('[role="tabpanel"]'));
    expect(
      panels
        .find((p) => p.textContent?.includes('Tuesday'))
        ?.hasAttribute('hidden'),
    ).toBe(false);
    expect(
      panels
        .find((p) => p.textContent?.includes('Thursday'))
        ?.hasAttribute('hidden'),
    ).toBe(true);
  });

  it('honours a value set from outside', async () => {
    const { fixture, tab } = await render();
    fixture.componentInstance.value.set('past');
    await fixture.whenStable();

    expect(tab('Past').getAttribute('aria-selected')).toBe('true');
  });

  it('has no selection when there are no panels', async () => {
    @Component({ imports: [TabsComponent], template: `<ui-tabs />` })
    class EmptyComponent {}
    const fixture = TestBed.createComponent(EmptyComponent);
    await fixture.whenStable();
    const tabs = fixture.debugElement.children[0]
      .componentInstance as TabsComponent;

    expect(tabs.value()).toBe('');
    tabs['toText'](undefined);
    expect(tabs['toText'](undefined)).toBe('');
    expect(tabs['toText'](3)).toBe('3');
  });
});
