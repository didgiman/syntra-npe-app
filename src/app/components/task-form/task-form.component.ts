import { Component, inject, input, output, signal } from '@angular/core';
import { Task } from '../../models/task';
import { UtilsService } from '../../services/utils.service';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  imports: [FormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent {
  task_id = input<number>(0);
  
  close = output<string>()

  utils = inject(UtilsService);

  taskService = inject(TaskService);

  estimateDisplay = signal<string>('1 hour');

  task: Task = {
    id: 0,
    created_at: '',
    user_id: 1,
    title: '',
    feeling: 3,
    estimate: 1,
    deadline: '',
    started_at: '',
    ended_at: ''
  }

  ngOnInit() {
    if (this.task_id() > 0) {
      const foundTask = this.taskService.tasks().find(t => t.id === +this.task_id()); // For some reason this only works when placing the + in front of this.task_id()
      if (foundTask) {
        this.task = { ...foundTask };
        this.onEstimateChange();
      }
    }

    this.task.feeling = this.task.feeling.toString(); // Convert feeling to string for radio button
  }

  async onTaskSave() {
    console.log('Save task', this.task);
    const saveResponse = await this.taskService.saveTask(this.task);

    console.log(saveResponse);

    if (saveResponse) {
      this.utils.toast(saveResponse.message, saveResponse.success ? 'success' : 'error');
      if (saveResponse.success) {
        this.close.emit('save');
      }
    } else {
      this.utils.toast("Task could not be saved. Please try again.", "error");
    }
  }
  async onTaskDelete() {
    console.log('Delete task', this.task.id);

    if (confirm('Are you sure you want to delete this task?')) {
      const deleteResponse = await this.taskService.deleteTask(this.task.id);

      if (deleteResponse) {
        this.utils.toast(deleteResponse.message, deleteResponse.success ? 'success' : 'error');
        if (deleteResponse.success) {
          this.close.emit('delete');
        }
      } else {
        this.utils.toast("Task could not be deleted. Please try again.", "error");
      }
    }
  }
  onCancel() {
    this.close.emit('cancel');
  }

  // non-linear steps for estimate
  get estimateStepSize(): number {
    if (this.task.estimate < 2) {
      return 0.25;
    } else if (this.task.estimate < 5) {
      return 0.5;
    } else {
      return 1;
    }
  }

  onEstimateChange() {

    // Don't let estimate go below 0.25
    // I did it this way, because when setting the min value of the estimate input to 0.25, the step size gets messed up
    if (this.task.estimate < 0.25) {
      this.task.estimate = 0.25;
    }

     this.estimateDisplay.set(this.utils.formatHoursToReadableTime(this.task.estimate));
  }

}
