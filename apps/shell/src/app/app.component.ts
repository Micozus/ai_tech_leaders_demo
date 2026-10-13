import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  template: `
    <main class="app">
      <h1 class="app__title">Angular Nx Monorepo</h1>
      <router-outlet />
    </main>
  `,
  styleUrl: './_app.scss',
})
export class AppComponent {}
