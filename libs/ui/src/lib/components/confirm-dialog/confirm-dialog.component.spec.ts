import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DialogComponent } from '../dialog/dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Component({
  imports: [ConfirmDialogComponent],
  template: `
    <ui-confirm-dialog
      heading="Cancel this booking?"
      objectName="Architecture review, Thursday 14:00"
      [description]="description()"
      confirmLabel="Cancel booking"
      appendTo="self"
      [(open)]="open"
      (confirmed)="confirmed.set(confirmed() + 1)"
      (cancelled)="cancelled.set(cancelled() + 1)"
    />
  `,
})
class HostComponent {
  readonly open = signal(true);
  readonly description = signal('');
  readonly confirmed = signal(0);
  readonly cancelled = signal(0);
}

describe('ConfirmDialogComponent', () => {
  async function render() {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const button = (name: string) =>
      Array.from(root.querySelectorAll('button')).find(
        (b) => b.textContent?.trim() === name,
      ) as HTMLButtonElement;
    return { fixture, root, button };
  }

  it('names the object and offers the way out first, then the verb that confirms', async () => {
    const { root, button } = await render();

    expect(root.textContent).toContain('Architecture review, Thursday 14:00');
    expect(button('Keep it')).toBeDefined();
    expect(button('Cancel booking').className).toContain('text-danger');
    expect(root.querySelector('p.text-muted')).toBeNull();
  });

  it('shows the consequence when given', async () => {
    const { fixture, root } = await render();
    fixture.componentInstance.description.set('The fee is not refunded.');
    await fixture.whenStable();

    expect(root.querySelector('p.text-muted')?.textContent).toBe(
      'The fee is not refunded.',
    );
  });

  it('confirms and closes', async () => {
    const { fixture, button } = await render();
    button('Cancel booking').click();
    await fixture.whenStable();

    expect(fixture.componentInstance.confirmed()).toBe(1);
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('keeps the booking and closes when the person backs out', async () => {
    const { fixture, button } = await render();
    button('Keep it').click();
    await fixture.whenStable();

    expect(fixture.componentInstance.cancelled()).toBe(1);
    expect(fixture.componentInstance.confirmed()).toBe(0);
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('moves focus to the way out when the dialog is shown', async () => {
    const { fixture, button } = await render();
    const wayOut = button('Keep it');
    const focus = vi.spyOn(wayOut, 'focus');
    const dialog = fixture.debugElement.query(
      (d) => d.componentInstance instanceof DialogComponent,
    ).componentInstance as DialogComponent;
    dialog.shown.emit();

    expect(focus).toHaveBeenCalledTimes(1);
  });
});
