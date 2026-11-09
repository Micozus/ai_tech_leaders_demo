import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { ButtonComponent } from '../../components/button/button.component';
import { FieldComponent } from '../../components/field/field.component';
import { TextFieldComponent } from '../../components/text-field/text-field.component';

/** The mentor's share link with a copy button (E02-S02). Emits `copied` so the page can say so in a toast. */
@Component({
  selector: 'ui-share-link-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, FieldComponent, TextFieldComponent],
  template: `
    <ui-field
      label="Your share link"
      controlId="share-link"
      hint="Share it on your own profile, in a talk or in a newsletter."
    >
      <div class="flex gap-group">
        <input ui-text-field id="share-link" readonly [value]="url()" />
        <button ui-button variant="quiet" type="button" (click)="copy()">
          <i class="pi pi-copy" aria-hidden="true"></i>
          Copy link
        </button>
      </div>
    </ui-field>
  `,
})
export class ShareLinkFieldComponent {
  readonly url = input.required<string>();
  readonly copied = output<void>();

  protected async copy(): Promise<void> {
    await navigator.clipboard.writeText(this.url());
    this.copied.emit();
  }
}
