import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { ToastService, provideToast } from '../../services/toast/toast.service';
import { ToastComponent } from './toast.component';

describe('ToastComponent and ToastService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideToast()] });
  });

  it('registers the message service', () => {
    expect(provideToast()).toEqual([MessageService]);
  });

  it('shows a message sent through the service, as an alert', async () => {
    const fixture = TestBed.createComponent(ToastComponent);
    await fixture.whenStable();
    TestBed.inject(ToastService).show({
      tone: 'success',
      summary: 'Share link copied',
      detail: 'Paste it anywhere.',
    });
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.textContent).toContain('Share link copied');
    expect(root.textContent).toContain('Paste it anywhere.');
    expect(root.querySelector('[role="alert"]')).not.toBeNull();
  });

  it('accepts a message without a detail', async () => {
    const fixture = TestBed.createComponent(ToastComponent);
    await fixture.whenStable();
    TestBed.inject(ToastService).show({
      tone: 'info',
      summary: 'Slots saved as a draft',
    });
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Slots saved as a draft',
    );
  });
});
