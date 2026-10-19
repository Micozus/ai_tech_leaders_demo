import { TestBed } from '@angular/core/testing';
import { AvatarComponent } from './avatar.component';

describe('AvatarComponent', () => {
  it('labels itself with the full name, shows initials and resizes', async () => {
    const fixture = TestBed.createComponent(AvatarComponent);
    fixture.componentRef.setInput('name', 'Ada Lovelace');
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    const circle = host.querySelector('span') as HTMLElement;

    expect(host.getAttribute('aria-label')).toBe('Ada Lovelace');
    expect(circle.textContent?.trim()).toBe('AL');
    expect(circle.className).toContain('size-14');

    fixture.componentRef.setInput('size', 'lg');
    await fixture.whenStable();

    expect(circle.className).toContain('size-20');
  });
});
