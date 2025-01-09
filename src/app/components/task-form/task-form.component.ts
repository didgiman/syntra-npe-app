import { Component, inject, input, output, signal } from '@angular/core';
import { Task } from '../../models/task';
import { ToastService } from '../../services/toast.service';
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
  
  save = output<boolean>();

  toast = inject(ToastService);
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
  }

  onTaskSave() {
    console.log('Save task', this.task);
    this.taskService.saveTask(this.task);
    this.save.emit(true);
  }
  onCancel() {
    this.save.emit(false);
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

    // Calculate a readable text for the estimate
    const hours = this.task.estimate;

    if (typeof hours !== 'number' || isNaN(hours) || hours < 0) {
      this.estimateDisplay.set("Invalid input");
    }

    const totalMinutes = Math.round(hours * 60);
    const fullHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    let readableText = "";

    if (fullHours > 0) {
        readableText += `${fullHours} hour${fullHours > 1 ? "s" : ""}`;
    }

    if (remainingMinutes > 0) {
        if (remainingMinutes === 30) {
            readableText += fullHours > 0 ? " and a half" : "Half an hour";
        } else {
            readableText += ` ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`;
        }
    }

    if (readableText === "") {
        readableText = "0 hours";
    }

    this.estimateDisplay.set(readableText);
    // END: Calculate a readable text for the estimate
  }

}
