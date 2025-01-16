import { Component, inject, input, output } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';

import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-task-view',
  imports: [TooltipModule, ButtonModule],
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.css',
})
export class TaskViewComponent {
  task_id = input<number>(0);
  close = output<string>();

  utils = inject(UtilsService);
  taskService = inject(TaskService);

  task: Task = {
    id: 0,
    created_at: null,
    user_id: 0,
    title: '',
    feeling: '',
    estimate: 0,
    deadline: null,
    started_at: null,
    ended_at: null
  }

  ngOnInit() {
    if (this.task_id() > 0) {
      const foundTask = this.taskService.tasks().find(t => t.id === +this.task_id()); // For some reason this only works when placing the + in front of this.task_id()
      if (foundTask) {
        this.task = { ...foundTask };
      }
    }
  }

  async onTaskAction(action: string) {
    switch (action) {
      case ('start'):
        this.task.started_at = new Date();
        break;
      case ('stop'):
        this.task.started_at = null;
        break;
      case ('finish'):
        this.task.ended_at = new Date();
        break;
      case ('restore'):
        this.task.started_at = null;
        this.task.ended_at = null;
        break;
      default:
        this.utils.toast(action + ": Task could not be updated. Please try again.", "error");
        return;
    }
    const saveResponse = await this.taskService.saveTask(this.task);

    if (saveResponse) {
      this.utils.toast(saveResponse.message, saveResponse.success ? 'success' : 'error');
      if (saveResponse.success) {
        this.close.emit(action);
      }
    } else {
      this.utils.toast(action + ": Task could not be updated. Please try again.", "error");
    }
  }
  
  onCancel() {
    this.close.emit('cancel');
  }
  
}
