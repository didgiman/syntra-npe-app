import { Component, inject, input, output } from '@angular/core';
import { Task } from '../../models/task';
import { UtilsService } from '../../services/utils.service';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { TaskViewComponent } from '../task-view/task-view.component';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-task-selection',
  imports: [FormsModule, TaskViewComponent, ButtonModule, DialogModule],
  templateUrl: './task-selection.component.html',
  styleUrl: './task-selection.component.css'
})
export class TaskSelectionComponent {
  taskId = input<number>(0);
  close = output<string>();


  scenarioId = input<number>(0);

  utils = inject(UtilsService);

  private taskService = inject(TaskService);
  tasks = this.taskService.tasks;

  showTaskView: boolean = false;
  showTaskSuggestion: boolean = false;
  showTaskSelection: boolean = false;

  selectedTask: Task = {
    id: 0,
    created_at: null,
    user_id: 1,
    title: '',
    feeling: 3,
    estimate: 0.25,
    deadline: null,
    started_at: null,
    ended_at: null
  };

  ngOnInit() {
    if (this.taskId() > 0) {
      const theTask = this.taskService.tasks().find(t => t.id === +this.taskId()); // For some reason this only works when placing the + in front of this.task_id()
      if (theTask) {
        this.selectedTask = { ...theTask };
      }
    }
  }

  startTask() {
    this.onTaskAction()
      .then(() => {
        this.showTaskView = true;
      }
      )
  }

  onViewClose(action: string) {
    console.log('View window close', action);
    this.showTaskView = false;
    this.close.emit('view');
  }

  onTaskSuggestionClose(action: string) {
    console.log('Selection window close', action);
    this.showTaskSelection = false;
  }

  async onTaskAction() {
    this.selectedTask.started_at = new Date();

    const saveResponse = await this.taskService.saveTask(this.selectedTask);
    console.log('onTaskAction', saveResponse);
    if (saveResponse) {
      this.utils.toast(saveResponse.message, saveResponse.success ? 'success' : 'error');
    } else {
      this.utils.toast(": Task could not be updated. Please try again.", "error");
    }
  }

  onCancel() {
    this.close.emit('cancel');
  }

  showUrgentList() {
    this.close.emit('due')
  }
}