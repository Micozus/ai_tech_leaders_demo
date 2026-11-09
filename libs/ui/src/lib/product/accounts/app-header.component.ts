import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { AvatarComponent } from '../../components/avatar/avatar.component';
import { BadgeComponent } from '../../components/badge/badge.component';
import { MenuComponent } from '../../components/menu/menu.component';
import type { MenuEntry } from '../../components/menu/menu.model';
import type { Role } from '../models/product.model';

const ROLE_LABELS: Record<Role, string> = {
  mentee: 'Mentee',
  mentor: 'Mentor',
  operator: 'Operator',
};

/** The signed-in header: the product name, who and in which role, and the account menu (E01-S01, E01-S03). */
@Component({
  selector: 'ui-app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarComponent, BadgeComponent, MenuComponent],
  template: `
    <header
      class="flex flex-wrap items-center justify-between gap-groups border-b border-solid border-line bg-surface px-groups py-3"
    >
      <span class="text-section-title">DevMentor</span>
      <div class="flex flex-wrap items-center gap-group">
        <ui-avatar [name]="userName()" size="sm" />
        <span class="text-body">{{ userName() }}</span>
        <ui-badge tone="neutral">{{ roleLabel() }}</ui-badge>
        <ui-menu label="Account" [entries]="entries()" appendTo="self" />
      </div>
    </header>
  `,
})
export class AppHeaderComponent {
  readonly userName = input.required<string>();
  readonly userRole = input.required<Role>();
  readonly entries = input<readonly MenuEntry[]>([
    { label: 'Sign out', icon: 'pi-sign-out' },
  ]);

  protected readonly roleLabel = computed(() => ROLE_LABELS[this.userRole()]);
}
