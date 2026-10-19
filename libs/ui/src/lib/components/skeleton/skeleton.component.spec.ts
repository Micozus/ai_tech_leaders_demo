import { TestBed } from '@angular/core/testing';
import { SkeletonComponent } from './skeleton.component';

describe('SkeletonComponent', () => {
  it('uses full width and a text-line height by default and honours inputs', async () => {
    const fixture = TestBed.createComponent(SkeletonComponent);
    await fixture.whenStable();
    const bar = (fixture.nativeElement as HTMLElement).querySelector(
      'span',
    ) as HTMLElement;

    expect(bar.style.width).toBe('100%');
    expect(bar.style.height).toBe('1.0625rem');

    fixture.componentRef.setInput('width', '8rem');
    fixture.componentRef.setInput('height', '2rem');
    await fixture.whenStable();

    expect(bar.style.width).toBe('8rem');
    expect(bar.style.height).toBe('2rem');
  });
});
