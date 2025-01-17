import { Component, effect, inject, input, output, signal, computed } from '@angular/core';
import { Task } from '../../models/task';
import { UtilsService } from '../../services/utils.service';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { min } from 'rxjs';
import { TaskListComponent } from '../task-list/task-list.component';

import { SliderModule } from 'primeng/slider';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-task-suggestion',
  imports: [FormsModule, SliderModule, RadioButtonModule, TaskListComponent],
  templateUrl: './task-suggestion.component.html',
  styleUrl: './task-suggestion.component.css'
})
export class TaskSuggestionComponent {
  task_id = input<number>(0);
  close = output<number>();

  utils = inject(UtilsService);

  private taskService = inject(TaskService);
  tasks = this.taskService.tasks;

  estimateDisplay = signal<string>('15 min');

  viewTaskId: number = 27;
  showTaskView:boolean = false;
  showTaskSuggestion:boolean = false;

  suggestionRequest: Task = {
    id: 0,
    created_at: null,
    user_id: 1,
    title: '',
    feeling: 3,
    estimate: 0.25,
    deadline: null,
    started_at: null,
    ended_at: null
  }

  suggestionTasks = signal<Task[]>([]);
  randomTask = signal<Task[]>([]);

  ngOnInit() {
    if (this.task_id() > 0) {
      const foundTask = this.taskService.tasks().find(t => t.id === +this.task_id()); // For some reason this only works when placing the + in front of this.task_id()
      if (foundTask) {
        this.suggestionRequest = { ...foundTask };
        this.onEstimateChange();
      }
    }

    this.suggestionRequest.feeling = this.suggestionRequest.feeling.toString(); // Convert feeling to string for radio button
  }

  onCancel() {
    this.close.emit(0);
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

  minFeeling = 5;
  maxFeeling = 7;

  // Filtered array
  filteredSuggestionTasks() {
    this.suggestionTasks.set(this.tasks().filter(item =>
      (Number(item.feeling) >= (this.minFeeling - +this.suggestionRequest.feeling)) &&
      (Number(item.feeling) <= (this.maxFeeling - +this.suggestionRequest.feeling)) &&
      (item.estimate <= +this.suggestionRequest.estimate))
    );
  }

  pickRandomTask(): number {
    for (let i = 0; i < 4; i++) {
      // Filter tasks based on the current range
      const RT = (this.tasks().filter(item =>
        (Number(item.feeling) >= (this.minFeeling - +this.suggestionRequest.feeling)) &&
        (Number(item.feeling) <= (this.maxFeeling - +this.suggestionRequest.feeling)) &&
        (item.estimate <= +this.suggestionRequest.estimate))
      );
      console.log('Filtered tasks:', RT);

      if (RT.length > 0) {
        // If tasks are found, pick one randomly
        const randomIndex = Math.floor(Math.random() * RT.length);
        console.log('Random task:', RT[randomIndex]);
        return RT[randomIndex].id;
      }

      // Adjust the range and try again
      console.log('upping the feels')
      this.minFeeling -= 1;
      this.maxFeeling += 1;
    }

    // If no tasks are found after 4 iterations, return a fallback message
    console.log('No tasks found');
    return 0;
  }

  // Event handler (if you need to trigger manual actions)
  showMe(): void {
    const suggestedTaskId = this.pickRandomTask();
    this.close.emit(suggestedTaskId);
    return;
  }

  onViewTask(taskId:number) {
    console.log('View task', taskId);
    this.viewTaskId = taskId;
    this.showTaskView = true;
    return;
  }
};