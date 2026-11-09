import { TestBed } from '@angular/core/testing';
import type { SubmitOutcome } from '../../helpers/submit-outcome.helper';
import {
  SignInPanelComponent,
  validateCredentials,
} from './sign-in-panel.component';

function type(root: HTMLElement, id: string, value: string): void {
  const input = root.querySelector<HTMLInputElement>(
    `#${id}`,
  ) as HTMLInputElement;
  input.value = value;
  input.dispatchEvent(new Event('input'));
}

describe('validateCredentials', () => {
  it('asks for an email and a password, and checks the email shape', () => {
    expect(validateCredentials({ email: '', password: '' })).toEqual({
      email: 'Enter your email.',
      password: 'Enter your password.',
    });
    expect(validateCredentials({ email: 'ada', password: 'x' })).toEqual({
      email: 'Enter an email like name@example.com.',
    });
    expect(
      validateCredentials({ email: 'ada@example.com', password: 'x' }),
    ).toEqual({});
  });
});

describe('SignInPanelComponent', () => {
  async function render(
    outcome: SubmitOutcome = { kind: 'ok' },
    githubFailed = false,
  ) {
    const fixture = TestBed.createComponent(SignInPanelComponent);
    const submitter = vi.fn(async () => outcome);
    fixture.componentRef.setInput('submitter', submitter);
    fixture.componentRef.setInput('githubFailed', githubFailed);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const submit = async () => {
      (root.querySelector('form') as HTMLFormElement).dispatchEvent(
        new Event('submit', { cancelable: true }),
      );
      await fixture.whenStable();
    };
    return { fixture, root, submitter, submit };
  }

  it('offers GitHub and tells when GitHub sign-in failed', async () => {
    const { fixture, root } = await render({ kind: 'ok' }, true);
    const emitted = vi.fn();
    fixture.componentInstance.githubSignIn.subscribe(emitted);
    const github = Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Sign in with GitHub'),
    ) as HTMLButtonElement;
    github.click();

    expect(emitted).toHaveBeenCalledTimes(1);
    expect(root.querySelector('[role="alert"]')?.textContent).toContain(
      'GitHub sign-in did not complete',
    );
  });

  it('shows errors after a field is left, and does not submit an invalid form', async () => {
    const { fixture, root, submitter, submit } = await render();
    const email = root.querySelector('#si-email') as HTMLInputElement;
    expect(root.querySelector('#si-email-error')).toBeNull();
    email.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(root.querySelector('#si-email-error')?.textContent).toContain(
      'Enter your email.',
    );

    await submit();
    expect(root.querySelector('#si-password-error')?.textContent).toContain(
      'Enter your password.',
    );
    expect(submitter).not.toHaveBeenCalled();
    expect(document.activeElement).not.toBeNull();
  });

  it('submits valid credentials and reports success', async () => {
    const { fixture, root, submitter, submit } = await render();
    const signedIn = vi.fn();
    fixture.componentInstance.signedIn.subscribe(signedIn);
    type(root, 'si-email', ' ada@example.com ');
    type(root, 'si-password', 'secret');
    await submit();

    expect(submitter).toHaveBeenCalledWith({
      email: 'ada@example.com',
      password: 'secret',
    });
    expect(signedIn).toHaveBeenCalledTimes(1);
  });

  it('shows the same generic message for a wrong password and keeps the values', async () => {
    const { root, submit } = await render({
      kind: 'field-errors',
      errors: { form: 'Invalid email or password.' },
    });
    type(root, 'si-email', 'ada@example.com');
    type(root, 'si-password', 'wrong');
    await submit();

    expect(root.querySelector('[role="alert"]')?.textContent).toContain(
      'Invalid email or password.',
    );
    expect((root.querySelector('#si-email') as HTMLInputElement).value).toBe(
      'ada@example.com',
    );
  });

  it('shows a field error from the server under its field', async () => {
    const { root, submit } = await render({
      kind: 'field-errors',
      errors: { email: 'This email is blocked.' },
    });
    type(root, 'si-email', 'ada@example.com');
    type(root, 'si-password', 'x');
    await submit();

    expect(root.querySelector('#si-email-error')?.textContent).toContain(
      'This email is blocked.',
    );
  });

  it('explains a server failure and an offline failure', async () => {
    const server = await render({ kind: 'server-error' });
    type(server.root, 'si-email', 'ada@example.com');
    type(server.root, 'si-password', 'x');
    await server.submit();
    expect(server.root.textContent).toContain(
      'Something went wrong on our side',
    );

    const offline = await render({ kind: 'offline' });
    type(offline.root, 'si-email', 'ada@example.com');
    type(offline.root, 'si-password', 'x');
    await offline.submit();
    expect(offline.root.textContent).toContain('You seem to be offline');
  });
});
