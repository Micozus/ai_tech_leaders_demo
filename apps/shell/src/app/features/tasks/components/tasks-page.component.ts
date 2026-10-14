import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormRendererComponent } from '@org/form-engine';
import { CardComponent } from '@org/ui';
import { ADD_TASK_FORM } from '../models/tasks-form.model';
import { TasksViewModelService } from '../services/tasks-view-model.service';

@Component({
  selector: 'app-tasks-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent, FormRendererComponent],
  providers: [TasksViewModelService],
  template: `
    <ui-card heading="Tasks">
      <fe-form-renderer
        [config]="addTaskForm"
        (submitted)="viewModel.add($event)"
      />
      @let vm = viewModel.vm();
      @if (vm.loading) {
        <p data-testid="tasks-loading">Loading…</p>
      }
      @if (vm.errorMessage) {
        <p role="alert" data-testid="tasks-error">{{ vm.errorMessage }}</p>
      }
      @if (vm.isEmpty) {
        <p data-testid="tasks-empty">No tasks yet.</p>
      }
      <ul class="tasks-page__list" data-testid="tasks-list">
        @for (task of vm.tasks; track task.id) {
          <li class="tasks-page__item">{{ task.title }}</li>
        }
      </ul>
    </ui-card>
  `,
  styleUrl: './_tasks-page.scss',
})
export class TasksPageComponent implements OnInit {
  protected readonly viewModel = inject(TasksViewModelService);
  protected readonly addTaskForm = ADD_TASK_FORM;

  ngOnInit(): void {
    this.viewModel.load();
  }
}
