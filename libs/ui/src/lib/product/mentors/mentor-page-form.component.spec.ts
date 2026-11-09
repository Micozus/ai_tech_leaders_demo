import { TestBed } from '@angular/core/testing';
import type { SubmitOutcome } from '../../helpers/submit-outcome.helper';
import {
  MentorPageFormComponent,
  validateMentorPage,
} from './mentor-page-form.component';

function setValue(root: HTMLElement, id: string, value: string): void {
  const el = root.querySelector<HTMLInputElement | HTMLTextAreaElement>(
    `#${id}`,
  ) as HTMLInputElement;
  el.value = value;
  el.dispatchEvent(new Event('input'));
}

describe('validateMentorPage', () => {
  it('needs an https link and at least one tag', () => {
    expect(
      validateMentorPage({ publicWorkUrl: '', description: '', tags: [] }),
    ).toEqual({
      publicWorkUrl: 'Add a link to your public work.',
      tags: 'Choose at least one stack tag.',
    });
    expect(
      validateMentorPage({
        publicWorkUrl: 'http://x.dev',
        description: '',
        tags: ['React'],
      }),
    ).toEqual({
      publicWorkUrl: 'Use a link that starts with https://',
    });
    expect(
      validateMentorPage({
        publicWorkUrl: 'https://x.dev',
        description: '',
        tags: ['React'],
      }),
    ).toEqual({});
  });
});

describe('MentorPageFormComponent', () => {
  async function render(outcome: SubmitOutcome = { kind: 'ok' }) {
    const fixture = TestBed.createComponent(MentorPageFormComponent);
    const submitter = vi.fn(async () => outcome);
    fixture.componentRef.setInput('submitter', submitter);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const submit = async () => {
      (root.querySelector('form') as HTMLFormElement).dispatchEvent(
        new Event('submit', { cancelable: true }),
      );
      await fixture.whenStable();
    };
    const choose = async (tag: string) => {
      const box = Array.from(root.querySelectorAll('label'))
        .find((l) => l.textContent?.includes(tag))
        ?.querySelector('input') as HTMLInputElement;
      box.click();
      await fixture.whenStable();
    };
    return { fixture, root, submitter, submit, choose };
  }

  it('lists the four stack tags and marks only the description optional', async () => {
    const { root } = await render();

    expect(
      Array.from(root.querySelectorAll('input[type="checkbox"]')),
    ).toHaveLength(4);
    expect(root.textContent).toContain('(Optional)');
    expect(root.querySelectorAll('label[for]')).toHaveLength(2);
  });

  it('does not submit an invalid page and shows what to fix', async () => {
    const { fixture, root, submitter, submit } = await render();
    (root.querySelector('#mp-work') as HTMLInputElement).dispatchEvent(
      new Event('blur'),
    );
    await fixture.whenStable();
    expect(root.querySelector('#mp-work-error')?.textContent).toContain(
      'Add a link to your public work.',
    );

    await submit();
    expect(root.querySelector('#mp-tags-error')?.textContent).toContain(
      'Choose at least one stack tag.',
    );
    expect(submitter).not.toHaveBeenCalled();
  });

  it('saves a valid page, toggling a tag on and off, and reports it', async () => {
    const { fixture, root, submitter, submit, choose } = await render();
    const saved = vi.fn();
    fixture.componentInstance.saved.subscribe(saved);
    setValue(root, 'mp-work', 'https://github.com/ada');
    setValue(root, 'mp-about', 'I mentor TypeScript.');
    await choose('React');
    await choose('React');
    await choose('TypeScript');
    await submit();

    expect(submitter).toHaveBeenCalledWith({
      publicWorkUrl: 'https://github.com/ada',
      description: 'I mentor TypeScript.',
      tags: ['TypeScript'],
    });
    expect(saved).toHaveBeenCalledTimes(1);
    expect(root.textContent).toContain('Mentor page saved');
  });

  it('keeps the values and explains a failed save', async () => {
    const { root, submit, choose } = await render({ kind: 'server-error' });
    setValue(root, 'mp-work', 'https://github.com/ada');
    await choose('Python');
    await submit();

    expect(root.textContent).toContain('Something went wrong on our side');
    expect((root.querySelector('#mp-work') as HTMLInputElement).value).toBe(
      'https://github.com/ada',
    );
  });

  it('shows a field error from the server', async () => {
    const { root, submit, choose } = await render({
      kind: 'field-errors',
      errors: { publicWorkUrl: 'We could not open that link.' },
    });
    setValue(root, 'mp-work', 'https://nope.invalid');
    await choose('Python');
    await submit();

    expect(root.querySelector('#mp-work-error')?.textContent).toContain(
      'We could not open that link.',
    );
  });
});
