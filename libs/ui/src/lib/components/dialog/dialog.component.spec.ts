import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DialogComponent } from './dialog.component';

@Component({
  imports: [DialogComponent],
  template: `
    <ui-dialog heading="Publish these slots?" appendTo="self" [(open)]="open">
      <p>Mentees can book them.</p>
      <div uiDialogFooter><button>Not now</button></div>
    </ui-dialog>
  `,
})
class HostComponent {
  readonly open = signal(true);
}

describe('DialogComponent', () => {
  it('shows the heading, the content and the footer when open', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('[role="dialog"]')).not.toBeNull();
    expect(root.textContent).toContain('Publish these slots?');
    expect(root.textContent).toContain('Mentees can book them.');
    expect(root.textContent).toContain('Not now');
  });

  it('renders nothing while closed', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.open.set(false);
    await fixture.whenStable();

    expect(
      (fixture.nativeElement as HTMLElement).querySelector('[role="dialog"]'),
    ).toBeNull();
  });

  it('tells when it is shown', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const dialog = fixture.debugElement.children[0]
      .componentInstance as DialogComponent;
    let shown = 0;
    dialog.shown.subscribe(() => (shown += 1));
    const inner = fixture.debugElement.query((d) => d.name === 'p-dialog')
      .componentInstance as { onShow: { emit(): void } };
    inner.onShow.emit();

    expect(shown).toBe(1);
  });

  it('reports closing through the two-way binding', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const dialog = fixture.debugElement.children[0]
      .componentInstance as DialogComponent;
    dialog.open.set(false);
    await fixture.whenStable();

    expect(fixture.componentInstance.open()).toBe(false);
  });
});
