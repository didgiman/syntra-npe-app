import { Component, effect, inject } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';
import { UtilsService } from '../../services/utils.service';
import { TaskSuggestionComponent } from '../task-suggestion/task-suggestion.component';

import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-task-list',
  imports: [TaskFormComponent, TaskSuggestionComponent, TableModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  
  loading: boolean = true;

  private taskService = inject(TaskService);
  tasks = this.taskService.tasks;
  
  utils = inject(UtilsService);

  editTaskId:number = 0;
  showTaskForm:boolean = false;
  showTaskSuggestion:boolean = false;

  constructor() {
    this.taskService.loadTasks();
    effect(() => {
      console.log('Tasks updated effect', this.tasks());
      // this.utils.toast("Tasks list updated", "info");
      this.loading = false;
    });
  }

  onEditTask(taskId:number) {
    console.log('Edit task', taskId);
    this.editTaskId = taskId;
    this.showTaskForm = true;
  }

  newTask() {
    console.log('New task');
    this.editTaskId = 0;
    this.showTaskForm = true;
  }

  onEditClose(action:string) {
    console.log('Edit window close', action);
    this.showTaskForm = false;
  }

  taskSuggestion() {
    console.log('What\'s next?');
    this.showTaskSuggestion = true;
  }

  onTaskSuggestionClose(action:string) {
    console.log('What\'s next close', action);
    this.showTaskSuggestion = false;
  }
}
