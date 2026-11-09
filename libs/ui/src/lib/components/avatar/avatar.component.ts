import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { initialsOf } from './avatar.helper';
import {
  AVATAR_BASE_CLASSES,
  AVATAR_SIZE_CLASSES,
  type AvatarSize,
} from './avatar.model';

/** Initials avatar. The accessible name is the full `name`; the initials are decorative. */
@Component({
  selector: 'ui-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'img', '[attr.aria-label]': 'name()' },
  template: `<span [class]="classes()" aria-hidden="true">{{
    initials()
  }}</span>`,
})
export class AvatarComponent {
  readonly name = input.required<string>();
  readonly size = input<AvatarSize>('md');

  protected readonly initials = computed(() => initialsOf(this.name()));
  protected readonly classes = computed(
    () => `${AVATAR_BASE_CLASSES} ${AVATAR_SIZE_CLASSES[this.size()]}`,
  );
}
