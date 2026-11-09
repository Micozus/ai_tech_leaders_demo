import { TestBed } from '@angular/core/testing';
import { ShareLinkFieldComponent } from './share-link-field.component';

describe('ShareLinkFieldComponent', () => {
  it('shows the link read-only and copies it', async () => {
    const writeText = vi.fn(async () => undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
    const fixture = TestBed.createComponent(ShareLinkFieldComponent);
    fixture.componentRef.setInput('url', 'https://devmentor.app/m/ada');
    const copied = vi.fn();
    fixture.componentInstance.copied.subscribe(copied);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const input = root.querySelector('input') as HTMLInputElement;
    (root.querySelector('button') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(input.readOnly).toBe(true);
    expect(input.value).toBe('https://devmentor.app/m/ada');
    expect(writeText).toHaveBeenCalledWith('https://devmentor.app/m/ada');
    expect(copied).toHaveBeenCalledTimes(1);
  });
});
