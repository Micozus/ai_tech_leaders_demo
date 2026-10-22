import { ChangeDetectionStrategy, Component } from '@angular/core';

/** A link inside a sentence or a list of related links. The host `<a>` keeps its own semantics. */
@Component({
  selector: 'a[ui-link]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'text-accent underline underline-offset-2 transition-colors duration-fast ease-standard hover:text-accent-strong',
  },
  template: `<ng-content />`,
})
export class LinkComponent {}
