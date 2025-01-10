import { Component, effect, inject, ViewChild } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';
import { UtilsService } from '../../services/utils.service';

import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Task } from '../../models/task';

@Component({
  selector: 'app-task-list',
  imports: [TaskFormComponent, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  private taskService = inject(TaskService);
  tasks = this.taskService.tasks;
  
  
  utils = inject(UtilsService);


  // Material table features
  displayedColumns: string[] = ['id', 'title', 'deadline', 'estimate', 'feeling'];
  dataSource = new MatTableDataSource(this.tasks());
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  // END Material table features

  editTaskId:number = 0;
  showTaskForm:boolean = false; // When set to true, the new/edit task form is displayed

  constructor() {
    this.taskService.loadTasks();
    effect(() => {
      // console.log('Tasks updated effect', this.tasks());
      // this.utils.toast("Tasks list updated", "info");

      // Reload the datasource for the Material table and re-initialise the sort and the pagination
      this.dataSource = new MatTableDataSource(this.tasks());
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  onEditTask(taskId:number) {
    console.log('Edit task', taskId);
    this.editTaskId = taskId;
    this.showTaskForm = true;
  }

  onEditTaskByTask(task: Task) {
    console.log('Edit task 2', task.id);
    this.editTaskId = task.id;
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
      this.utils.toast("Task saved successfully", "success");
    } else {
      this.utils.toast("Task not saved", "error");
    }
  }

  onEditClose(action:string) {
    console.log('Edit window close', action);
    this.showTaskForm = false;
  }

}
