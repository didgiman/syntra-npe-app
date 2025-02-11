import { Component, inject, output, signal } from '@angular/core';
import { Task } from '../../models/task';
import { UtilsService } from '../../services/utils.service';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { TaskSelectionComponent } from '../task-selection/task-selection.component';

import { SliderModule } from 'primeng/slider';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-task-suggestion',
  imports: [FormsModule, SliderModule, RadioButtonModule, TaskSelectionComponent, ButtonModule],
  templateUrl: './task-suggestion.component.html',
  styleUrl: './task-suggestion.component.css'
})
export class TaskSuggestionComponent {
  close = output<string>();

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
  suggestedTaskId = signal<number>(0);

  scenarioId = signal<number>(0);

  now = new Date();
  tomorrow = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate() + 1); // Set the time to 0:00:00 of the next day
  threeDaysFromNow = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate() + 4);

  ngOnInit() {
    this.suggestionRequest.feeling = this.suggestionRequest.feeling.toString(); // Convert feeling to string for radio button
    this.getDueTasks();
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

  // Get due tasks
  getDueTasks() {
    this.dueTasks.set(
      this.tasks().filter(
        task => !(task.recurring === 'daily' && task.deadline !== null && task.deadline.getTime() > this.tomorrow.getTime()) &&
          (task.status === 'new' && task.deadline !== null && task.deadline.getTime() <= this.threeDaysFromNow.getTime()))// Set tasks that are due in the next 3 days
    );
  }

  // Algorithm to select a task, taking into consideration feeling and time
  pickRandomTask(): void {
    let minFeeling = 5;
    let maxFeeling = 7;

    for (let i = 0; i < 4; i++) {
      // Filter tasks based on the current range
      const RT = (this.tasks().filter(task =>
        !(task.recurring === 'daily' && task.deadline !== null && task.deadline.getTime() > this.tomorrow.getTime()) &&
        (Number(task.feeling) >= (minFeeling - +this.suggestionRequest.feeling)) &&
        (Number(task.feeling) <= (maxFeeling - +this.suggestionRequest.feeling)) &&
        (task.estimate <= +this.suggestionRequest.estimate) &&
        task.status === 'new')
      );
      console.log('Filtered tasks:', RT);

      if (RT.length > 0) {
        // If tasks are found, pick one randomly
        const randomIndex = Math.floor(Math.random() * RT.length);
        console.log('Random task:', RT[randomIndex]);
        this.suggestedTaskId.set(RT[randomIndex].id);
        return;
      }

      // Adjust the feelings range and try again
      console.log('upping the feels')
      minFeeling -= 1;
      maxFeeling += 1;
    }

    // If no tasks are found after 4 iterations, return a fallback message
    console.log('No tasks found');
    this.suggestedTaskId.set(-1);
    return;
  }

  // Button to show suggested task
  showMe(): void {
    const suggestedTaskId = this.pickRandomTask();
    return;
  }

  onTaskSuggestionClose(action: string) {
    console.log('Suggestion window close', action);
    this.close.emit(action);
  }
};