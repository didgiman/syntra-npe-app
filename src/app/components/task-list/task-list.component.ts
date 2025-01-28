import { Component, effect, inject, signal, ViewChild } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';
import { UtilsService } from '../../services/utils.service';
import { TaskSuggestionComponent } from '../task-suggestion/task-suggestion.component';

import { Table, TableModule } from 'primeng/table';
import { TaskViewComponent } from '../task-view/task-view.component';
import { Task } from '../../models/task';

import { DialogModule } from 'primeng/dialog';
import { NgClass } from '@angular/common';

import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-task-list',
  imports: [TaskFormComponent, TableModule, TaskViewComponent, DialogModule, NgClass, InputTextModule, FormsModule, ToggleSwitchModule, TaskSuggestionComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  private taskService = inject(TaskService);
  tasks = this.taskService.tasks;

  utils = inject(UtilsService);

  loading: boolean = true;

  searchString = '';

  @ViewChild('tasksTable') table!: Table;

  editTaskId: number = 0;
  showTaskForm: boolean = false;
  showTaskSuggestion: boolean = false;

  viewTaskId: number = 0;
  showTaskView: boolean = false;

  inProgressTask = signal<Task[]>([]);

  showFinishedTasks: boolean = false;

  dueTasks = signal<Task[]>([]);
  showDueTasks: boolean = false;

  now = new Date();
  threeDaysFromNow = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate() + 4);

  constructor() {
    this.loadTasks();
    effect(() => {
      // Search for task(s) that have the "in progress" status
      this.inProgressTask.set(this.tasks().filter(task => task.status == "in progress"));

      this.dueTasks.set(this.tasks().filter(task => task.deadline !== null && task.deadline <= this.threeDaysFromNow));
    });
  }

  loadTasks(finishedOnly: boolean = false) {
    try {
      const response = this.taskService.loadTasks(finishedOnly).then((res) => {
        if (res.success) {
          this.loading = false;
        } else {
          this.utils.toast(res.message, "error");
        }
      });
    } catch (e: any) {
      this.utils.toast(e.message, "error");
    }
  }

  onEditTask(taskId: number) {
    this.editTaskId = taskId;
    this.showTaskForm = true;
  }

  newTask() {
    this.editTaskId = 0;
    this.showTaskForm = true;
  }

  onEditClose(action: string) {
    this.showTaskForm = false;

    if (action === 'create') {
      // When a new task is created, sort the table so that the new task is shown at the top
      this.sortTable('id', -1);
    }
  }

  onViewTask(taskId: number) {
    this.viewTaskId = taskId;
    this.showTaskView = true;
    return;
  }
  onViewClose(action: string) {
    this.showTaskView = false;
  }

  customSort(event: any) {
    const order = event.order; // 1 for ascending, -1 for descending
    const field = event.field;

    event.data.sort((data1: any, data2: any) => {
      const value1 = data1[field] || null;
      const value2 = data2[field] || null;

      // Custom logic for the "deadline" column
      if (field === 'deadline') {
        if (!value1 && value2) return order; // Empty value comes last in ascending, first in descending
        if (value1 && !value2) return -order; // Non-empty comes first in ascending, last in descending
        if (!value1 && !value2) return 0; // Both are empty, no change
      }

      // Default behavior for other columns (handle null/undefined safely)
      if (value1 == null && value2 != null) return order;
      if (value1 != null && value2 == null) return -order;
      if (value1 == null && value2 == null) return 0;

      const result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
      return order * result;
    });
  }

  sortTable(field: string, order: number) {
    this.table.sortField = field;
    this.table.sortOrder = order;
  }

  toggleFinishedTasks(event: any) {
    this.loading = true;
    this.loadTasks(this.showFinishedTasks);
  }

  taskSuggestion() {
    console.log('What\'s next?');
    this.showTaskSuggestion = true;
  }

  onTaskSuggestionClose(action: string) {
    console.log('What\'s next close');
    this.showTaskSuggestion = false;
    if (action === 'due') {
      // When a new task is created, sort the table so that the new task is shown at the top
      this.showDueTasks = true;
      this.toggleDueTasks(true);
    }
  }

  toggleDueTasks(event: any) {
    if (this.showDueTasks) {
      this.dueTasks.set(this.tasks().filter(task => task.deadline !== null && task.deadline <= this.threeDaysFromNow));
      this.sortTable('deadline', 1);
    } else {
      this.dueTasks.set(this.tasks());
    }
  }
}