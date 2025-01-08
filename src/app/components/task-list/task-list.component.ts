import { Component, effect, inject } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-task-list',
  imports: [TaskFormComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  private taskService = inject(TaskService);
  tasks = this.taskService.tasks;
  
  toast = inject(ToastService);

  createNewTask:boolean = true;

  constructor() {
    this.taskService.loadTasks();
    effect(() => {
      console.log('Tasks updated', this.tasks());
    });
  }

  newTask() {
    console.log('New task');
    this.createNewTask = true;
  }

  onSaveTask(success:boolean) {
    console.log('Task saved', success);
    this.createNewTask = false;

    if (success) {
      this.toast.show("Task saved successfully", "success");
    } else {
      this.toast.show("Task not saved", "error");
    }
  }

}
