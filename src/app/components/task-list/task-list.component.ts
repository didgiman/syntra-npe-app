import { Component, effect, inject, signal, ViewChild } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';
import { UtilsService } from '../../services/utils.service';

import { Table, TableModule } from 'primeng/table';
import { TaskViewComponent } from '../task-view/task-view.component';
import { Task } from '../../models/task';

import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-task-list',
  imports: [TaskFormComponent, TableModule, TaskViewComponent, DialogModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  private taskService = inject(TaskService);
  tasks = this.taskService.tasks;
  
  utils = inject(UtilsService);

  loading: boolean = true;

  @ViewChild('tasksTable') table!: Table;

  editTaskId:number = 0;
  showTaskForm:boolean = false;

  viewTaskId: number = 27;
  showTaskView:boolean = false;

  inProgressTask = signal<Task[]>([]);

  constructor() {
    this.taskService.loadTasks();
    effect(() => {
      console.log('Tasks updated effect', this.tasks());
      // this.utils.toast("Tasks list updated", "info");
      this.loading = false;

      // Search for a task that has the "in progress" status
      this.inProgressTask.set(this.tasks().filter(task => task.status == "in progress"));

      // Remove tasks that are in progress from the regular tasks list => this causes an infinite loop
      //this.tasks.set(this.tasks().filter(itemA => !this.inProgressTask().some(itemB => itemA.id === itemB.id)));

      console.log(this.inProgressTask());

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

  onEditClose(action:string) {
    console.log('Edit window close', action);
    this.showTaskForm = false;

    if (action === 'save') {
      this.sortTable('id', -1);
    }
  }

  onViewTask(taskId:number) {
    console.log('View task', taskId);
    this.viewTaskId = taskId;
    this.showTaskView = true;
    return;
  }
  onViewClose(action:string) {
    console.log('View window close', action);
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
    this.table.sort({ field, order });
  }

}
