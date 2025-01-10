import { Component, effect, inject } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';
import { UtilsService } from '../../services/utils.service';

import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-task-list',
  imports: [TaskFormComponent, TableModule],
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

  onSaveTask(success:boolean) {
    console.log('Task saved', success);
    this.showTaskForm = false;

    if (success) {
      this.utils.toast("Task saved successfully", "success");
    } else {
      this.utils.toast("Task not saved", "error");
    }
  }

  onEditClose(action:string) {
    console.log('Edit window close', action);
    this.showTaskForm = false;
  }

}
