import { TestBed } from '@angular/core/testing';
import { StackTagFilterComponent } from './stack-tag-filter.component';

describe('StackTagFilterComponent', () => {
  async function render(count = 12) {
    const fixture = TestBed.createComponent(StackTagFilterComponent);
    fixture.componentRef.setInput('resultCount', count);
    await fixture.whenStable();
    return { fixture, root: fixture.nativeElement as HTMLElement };
  }
  const box = (root: HTMLElement, tag: string) =>
    Array.from(root.querySelectorAll('label'))
      .find((l) => l.textContent?.includes(tag))
      ?.querySelector('input') as HTMLInputElement;

  it('offers the four tags and the result count, with no active filters', async () => {
    const { root } = await render();

    expect(root.querySelectorAll('input[type="checkbox"]')).toHaveLength(4);
    expect(root.querySelector('[role="status"]')?.textContent?.trim()).toBe(
      '12 mentors',
    );
    expect(root.textContent).not.toContain('Clear filters');
  });

  it('says "1 mentor" for one result', async () => {
    const { root } = await render(1);

    expect(root.querySelector('[role="status"]')?.textContent?.trim()).toBe(
      '1 mentor',
    );
  });

  it('shows active filters that can be removed one by one or all at once', async () => {
    const { fixture, root } = await render();
    box(root, 'TypeScript').click();
    box(root, 'Python').click();
    await fixture.whenStable();
    expect(fixture.componentInstance.selected()).toEqual([
      'TypeScript',
      'Python',
    ]);
    expect(root.textContent).toContain('Clear filters');

    (
      root.querySelector(
        '[aria-label="Remove TypeScript filter"]',
      ) as HTMLButtonElement
    ).click();
    await fixture.whenStable();
    expect(fixture.componentInstance.selected()).toEqual(['Python']);

    box(root, 'Python').click();
    await fixture.whenStable();
    expect(fixture.componentInstance.selected()).toEqual([]);

    box(root, 'React').click();
    await fixture.whenStable();
    (
      Array.from(root.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Clear filters'),
      ) as HTMLButtonElement
    ).click();
    await fixture.whenStable();
    expect(fixture.componentInstance.selected()).toEqual([]);
  });
});
