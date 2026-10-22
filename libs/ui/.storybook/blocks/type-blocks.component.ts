import { ChangeDetectionStrategy, Component } from '@angular/core';

interface TypeRole {
  readonly role: string;
  readonly utility: string;
  readonly spec: string;
  readonly use: string;
  readonly sample: string;
  readonly extraClasses: string;
}

const TYPE_ROLES: readonly TypeRole[] = [
  {
    role: 'Page title',
    utility: 'text-page-title',
    spec: '27px / 1.25, 800, tight',
    use: 'One per page',
    sample: 'Find a mentor',
    extraClasses: '',
  },
  {
    role: 'Section title',
    utility: 'text-section-title',
    spec: '19px / 1.4, 700',
    use: 'A group of related content',
    sample: 'Upcoming sessions',
    extraClasses: '',
  },
  {
    role: 'Body',
    utility: 'text-body',
    spec: '14px / 1.6',
    use: 'Interface text, rows, fields',
    sample: 'Review my pull request for a TypeScript generics error.',
    extraClasses: '',
  },
  {
    role: 'Body, long',
    utility: 'text-body-long',
    spec: '16px / 1.65, max 65ch',
    use: 'Running text: written answers, notes',
    sample:
      'The mentor writes the answer after the session. You keep it privately, and nothing is published unless you approve the note.',
    extraClasses: 'max-w-measure',
  },
  {
    role: 'Label',
    utility: 'text-label',
    spec: '12px / 1.5, 700',
    use: 'Field labels, badges, small buttons',
    sample: 'Session length',
    extraClasses: '',
  },
  {
    role: 'Meta',
    utility: 'text-meta text-muted',
    spec: '12px / 1.5, muted',
    use: 'Dates, authors, counts',
    sample: 'Published 2 days ago',
    extraClasses: '',
  },
  {
    role: 'Number',
    utility: 'text-body tabular-nums',
    spec: '14px, tabular figures',
    use: 'Prices, durations, counts that line up',
    sample: '€45.00 · 50 min',
    extraClasses: '',
  },
  {
    role: 'Code',
    utility: 'font-mono text-code',
    spec: 'mono 13px / 1.6',
    use: 'Repository links, identifiers, code',
    sample: 'github.com/acme/billing-service/pull/412',
    extraClasses: '',
  },
];

/** The typography roles, rendered with the real utilities. */
@Component({
  selector: 'ui-doc-type-roles',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-panel-roomy">
      @for (role of roles; track role.role) {
        <div
          class="grid gap-group border-t border-solid border-line py-groups first:border-t-0 md:grid-cols-4"
        >
          <div class="md:col-span-1">
            <p class="text-label">{{ role.role }}</p>
            <p class="font-mono text-code text-muted">{{ role.utility }}</p>
            <p class="text-meta text-muted">{{ role.spec }}</p>
            <p class="text-meta text-muted">{{ role.use }}</p>
          </div>
          <p
            class="md:col-span-3"
            [class]="role.utility + ' ' + role.extraClasses"
          >
            {{ role.sample }}
          </p>
        </div>
      }
    </div>
  `,
})
export class TypeRolesComponent {
  protected readonly roles = TYPE_ROLES;
}
