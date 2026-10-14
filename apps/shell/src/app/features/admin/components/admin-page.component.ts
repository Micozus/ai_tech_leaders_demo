import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CardComponent } from '@org/ui';
import { AdminViewModelService } from '../services/admin-view-model.service';

@Component({
  selector: 'app-admin-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent],
  providers: [AdminViewModelService],
  template: `
    <ui-card heading="Admin">
      @let vm = viewModel.vm();
      <p class="font-medium" data-testid="admin-total">
        Total tasks: {{ vm.total }}
      </p>
      @if (vm.loading) {
        <p data-testid="admin-loading">Loading…</p>
      }
      @if (vm.errorMessage) {
        <p role="alert" data-testid="admin-error">{{ vm.errorMessage }}</p>
      }
      @if (vm.isEmpty) {
        <p data-testid="admin-empty">No tasks stored.</p>
      }
      <ul class="mt-4 list-disc pl-5" data-testid="admin-tasks-list">
        @for (task of vm.tasks; track task.id) {
          <li class="py-1">
            <span class="text-slate-500">#{{ task.id }}</span>
            {{ task.title }}
          </li>
        }
      </ul>
    </ui-card>
  `,
})
export class AdminPageComponent implements OnInit {
  protected readonly viewModel = inject(AdminViewModelService);

  ngOnInit(): void {
    this.viewModel.load();
  }
}
