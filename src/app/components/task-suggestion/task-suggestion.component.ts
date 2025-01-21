import { Component, inject, output, signal } from '@angular/core';
import { Task } from '../../models/task';
import { UtilsService } from '../../services/utils.service';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { TaskSelectionComponent } from '../task-selection/task-selection.component';

import { SliderModule } from 'primeng/slider';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-task-suggestion',
  imports: [FormsModule, SliderModule, RadioButtonModule, TaskSelectionComponent],
  templateUrl: './task-suggestion.component.html',
  styleUrl: './task-suggestion.component.css'
})
export class TaskSuggestionComponent {
  close = output<number>();

  utils = inject(UtilsService);

  private taskService = inject(TaskService);
  tasks = this.taskService.tasks;

  estimateDisplay = signal<string>('15 min');

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

  dueTasks = signal<Task[]>([]);
  suggestionTasks = signal<Task[]>([]);
  mostDueTaskId = signal<number>(0);
  suggestedTaskId = signal<number>(0);

  ngOnInit() {
    this.suggestionRequest.feeling = this.suggestionRequest.feeling.toString(); // Convert feeling to string for radio button
    this.getDueTasks();
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

  // Get due tasks
  getDueTasks() {

    this.dueTasks.set(this.tasks().filter(task => task.deadline !== null && task.deadline.getTime() <= new Date().getTime() + 3 * 24 * 60 * 60 * 1000)// Set tasks that are due in the next 3 days
      .sort((a, b) => a.deadline!.getTime() - b.deadline!.getTime()));

    if (this.dueTasks().length > 0) {
      console.log('Due tasks:', this.dueTasks());
      const mostDueTaskId = this.dueTasks()[0];
      console.log('Nearest due task:', mostDueTaskId);
      // return mostDueTaskId.id;

      this.mostDueTaskId.set(mostDueTaskId.id);
    } else {
      // return 0;
      this.mostDueTaskId.set(0);
    }
  }

  pickRandomTask(): void {
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
        this.suggestedTaskId.set(RT[randomIndex].id);
        return;
        // return RT[randomIndex].id;
      }

      // Adjust the range and try again
      console.log('upping the feels')
      this.minFeeling -= 1;
      this.maxFeeling += 1;
    }

    // If no tasks are found after 4 iterations, return a fallback message
    console.log('No tasks found');
    return;
  }

  // Event handler (if you need to trigger manual actions)
  showMe(): void {
    const suggestedTaskId = this.pickRandomTask();
    // this.close.emit(suggestedTaskId);
    return;
  }

  onTaskSuggestionClose(action: number) {
    console.log('Selection window close', action);
    this.close.emit(action);
  }
};