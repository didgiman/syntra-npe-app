import { Component, effect, inject, input, output, signal } from '@angular/core';
import { Task } from '../../models/task';
import { UtilsService } from '../../services/utils.service';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-suggestion',
  imports: [FormsModule],
  templateUrl: './task-suggestion.component.html',
  styleUrl: './task-suggestion.component.css'
})
export class TaskSuggestionComponent {
  task_id = input<number>(0);

  close = output<string>();

  utils = inject(UtilsService);

  private taskService = inject(TaskService);
  tasks = this.taskService.tasks;

  estimateDisplay = signal<string>('1 hour');
  formattedDeadline = '';

  suggestionRequest: Task = {
    id: 0,
    created_at: null,
    user_id: 1,
    title: '',
    feeling: 3,
    estimate: 1,
    deadline: null,
    started_at: null,
    ended_at: null
  }

  suggestionTasks = signal<Task[]>([]);

  ngOnInit() {
    if (this.task_id() > 0) {
      const foundTask = this.taskService.tasks().find(t => t.id === +this.task_id()); // For some reason this only works when placing the + in front of this.task_id()
      if (foundTask) {
        this.suggestionRequest = { ...foundTask };
        this.onEstimateChange();

        this.formattedDeadline = this.utils.formatDateForInput(this.suggestionRequest.deadline!);
      }
    }

    this.suggestionRequest.feeling = this.suggestionRequest.feeling.toString(); // Convert feeling to string for radio button
  }

  onCancel() {
    this.close.emit('cancel');
  }

  // non-linear steps for estimate
  get estimateStepSize(): number {
    if (this.suggestionRequest.estimate < 2) {
      return 0.25;
    } else if (this.suggestionRequest.estimate < 5) {
      return 0.5;
    } else {
      return 1;
    }
  }

  onEstimateChange() {

    // Don't let estimate go below 0.25
    // I did it this way, because when setting the min value of the estimate input to 0.25, the step size gets messed up
    if (this.suggestionRequest.estimate < 0.25) {
      this.suggestionRequest.estimate = 0.25;
    }

    this.estimateDisplay.set(this.utils.formatHoursToReadableTime(this.suggestionRequest.estimate));
  }

  // constructor() { 
  //   this.taskService.loadTasks();
  //   effect(() => {
  //     console.log('Tasks updated effect', this.tasks());
  //     this.suggestionTasks.set(
  //       this.tasks()
  //         .filter(task => task.deadline !== undefined && task.deadline !== null && task.deadline.getTime() <= new Date().getTime() + 3 * 24 * 60 * 60 * 1000)
  //         .sort((a, b) => a.deadline!.getTime() - b.deadline!.getTime())
  //     );
  //     if (this.suggestionTasks()) {
  //         return this.suggestionTasks()[0]
  //       }
  //     else {
  //       this.suggestionTasks.set([]);
  //       return null;
  //     }
  //   });
  // }
}