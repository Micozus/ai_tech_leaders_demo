import { TestBed } from '@angular/core/testing';
import { InvitationAcceptPanelComponent } from './invitation-accept-panel.component';

describe('InvitationAcceptPanelComponent', () => {
  async function render(state?: 'loading' | 'ready' | 'invalid') {
    const fixture = TestBed.createComponent(InvitationAcceptPanelComponent);
    if (state) fixture.componentRef.setInput('state', state);
    await fixture.whenStable();
    return { fixture, root: fixture.nativeElement as HTMLElement };
  }

  it('invites, explains the two-week ask and accepts', async () => {
    const { fixture, root } = await render();
    const accepted = vi.fn();
    fixture.componentInstance.accept.subscribe(accepted);
    (root.querySelector('button') as HTMLButtonElement).click();

    expect(root.textContent).toContain(
      'publish at least one bookable session within two weeks',
    );
    expect(accepted).toHaveBeenCalledTimes(1);
  });

  it('shows a busy region while the invitation is checked', async () => {
    const { root } = await render('loading');

    expect(root.querySelector('[aria-busy="true"]')).not.toBeNull();
    expect(root.querySelector('button')).toBeNull();
  });

  it('says an invalid invitation cannot be used, without a retry', async () => {
    const { root } = await render('invalid');

    expect(root.querySelector('[role="alert"]')?.textContent).toContain(
      'This invitation cannot be used',
    );
    expect(root.querySelector('button')).toBeNull();
  });
});
