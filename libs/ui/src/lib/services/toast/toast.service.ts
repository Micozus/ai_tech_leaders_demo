import { Injectable, Provider, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

/** Only calm tones exist: an error that needs action is never a toast. */
export type ToastTone = 'success' | 'info';

export interface ToastMessage {
  readonly tone: ToastTone;
  readonly summary: string;
  readonly detail?: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly #messages = inject(MessageService);

  show({ tone, summary, detail }: ToastMessage): void {
    this.#messages.add({ severity: tone, summary, detail });
  }
}

/** Register once in the application providers. */
export function provideToast(): Provider[] {
  return [MessageService];
}
