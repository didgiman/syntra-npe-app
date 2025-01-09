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

  showTaskForm:boolean = false;
  editTaskId:number = 0;

  constructor() {
    this.taskService.loadTasks();
    effect(() => {
      console.log('Tasks updated', this.tasks());
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
      this.toast.show("Task saved successfully", "success");
    } else {
      this.toast.show("Task not saved", "error");
    }
  }

}
