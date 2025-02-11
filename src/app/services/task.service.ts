import { effect, inject, Injectable, signal } from '@angular/core';
import type { Task, RawTask } from '../models/task';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  tasks = signal<Task[]>([]);

  userService = inject(UserService);
  user = this.userService.user;
  userId = this.user().id;

  finishedOnly: boolean = false;

  constructor() {
    effect(() => {
      const user = this.user(); // Read the signal value

      // Whenever the user changes, reload tasks
      if (this.user().id != this.userId) {
        this.userId = this.user().id;

        this.loadTasks();
      }
    });
  }

  async loadTasks(finishedOnly: boolean = this.finishedOnly) {
    do {
      console.log("Waiting for user to be loaded...");
      await new Promise(resolve => setTimeout(resolve, 200)); // Wait for 200ms before retrying
    } while (!this.user().id); // Wait until the user is loaded
    
    try {
      this.finishedOnly = finishedOnly; // Store the value for the next call (only needed when switching user, regular calls to loadTasks always have the finishedOnly parameter set)

      let url = this.apiUrl + '/usertasks/' + this.userId; // TO DO: This should be replaced by /usertasks/:userId
      if (finishedOnly) {
        url += '?finishedOnly=true';
      }
      const response = await fetch(url);
      const data = await response.json();
      if (data) {
        // this.tasks.set(data.tasks);

        // Convert the tasks from the API to a format that is usable in our JS application
        const JSTasks = data.tasks.map((task: RawTask) => (this.convertAPITaskToJSTask(task)));

        this.tasks.set(JSTasks);

        return {
          success: data.success,
          message: data.message,
        }
      }
    } catch (e) {
      console.error(e);
    }
    return {
      success: false,
      message: "Tasks could not be loaded. Please refresh page to try again.",
    }
  }

  async saveTask(task: Task) {
    try {

      // Before using the task, first convert in into something that can be used by the API
      const taskForApi: RawTask = this.convertJSTaskToAPITask(task);

      if (task.id) {
        return this.editTask(taskForApi);
      } else {
        return this.addTask(taskForApi);  
      }
    } catch(e: any) {
      return {
        success: false,
        message: e.message,
      }
    }
  }

  private async addTask(task: RawTask) {
    try {
      const response = await fetch(this.apiUrl + '/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
      });

      const data = await response.json();

      if (data) {
        if (data.success) {
          // this.loadTasks(); // Improved by adding the new task to the list instead of reloading all tasks
          this.tasks.update(tasks => [...tasks, this.convertAPITaskToJSTask(data.task)]);
        }
        return {
          success: data.success,
          message: data.message,
        }
      }
    } catch (e) {
      console.log(e);
    }
    return {
      success: false,
      message: "Task could not be created. Please try again later.",
    }
  }

  private async editTask(task: RawTask) {
    try {
      const response = await fetch(this.apiUrl + '/tasks/' + task.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
      });
      const data = await response.json();
      if (data) {
        if (data.success) {
          // this.loadTasks(); // Improved by updating the task in the list instead of reloading all tasks
          // this.tasks.update(tasks => tasks.map(t => t.id === task.id ? task : t));
          this.tasks.update(tasks => tasks.map(t => t.id === task.id ? this.convertAPITaskToJSTask(data.task) : t));
        }
        return {
          success: data.success,
          message: data.message,
        }
      }
    } catch (e) {
      console.log(e);
    }
    
    return {
      success: false,
      message: "Task could not be updated. Please try again later.",
    }
  }

  async deleteTask(taskId: number) {
    try {
      const response = await fetch(this.apiUrl + '/tasks/' + taskId, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data) {
        if (data.success) {
          //this.loadTasks(); // Improved by removing the task from the list instead of reloading all tasks
          this.tasks.update(tasks => tasks.filter(t => t.id !== taskId));
        }
        return {
          success: data.success,
          message: data.message,
        }
      }
    } catch (e) {
      console.log(e);
    }
    return {
      success: false,
      message: "Task could not be deleted. Please try again later.",
    }
  }

  
  // Convert a task that was retrieved by the API to a proper JS object, with actual JS dates
  private convertAPITaskToJSTask(task:RawTask): Task {
    return {
      ...task,
      deadline: this.mysqlDatetimeToJSDate(task.deadline),
      created_at: this.mysqlDatetimeToJSDate(task.created_at),
      started_at: this.mysqlDatetimeToJSDate(task.started_at),
      ended_at: this.mysqlDatetimeToJSDate(task.ended_at),
      status: this.calculateStatus(task),
      recurring: task.recurring ? task.recurring : '',
    }
  }

  // Convert a JS task to a format that is understood by the API, with text strings as dates
  private convertJSTaskToAPITask(task:Task): RawTask {
    return {
      ...task,
      feeling: +task.feeling,
      deadline: this.jsDateToMysqlDatetime(task.deadline),
      created_at: this.jsDateToMysqlDatetime(task.created_at),
      started_at: this.jsDateToMysqlDatetime(task.started_at),
      ended_at: this.jsDateToMysqlDatetime(task.ended_at),
    }
  }

  // Helper function to convert a single MySQL date to a JS format
  mysqlDatetimeToJSDate(mysqlDatetime: string | null) {

    if (!mysqlDatetime) {
      return null;
    }

    // Split the MySQL DATETIME into date and time components
    const [date, time] = mysqlDatetime.split(' ');
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes, seconds] = time.split(':').map(Number);
  
    // Create a Date object in the local timezone
    return new Date(year, month - 1, day, hours, minutes, seconds);
  }

  // Helper function to convert a single JS date to a MySQL format
  jsDateToMysqlDatetime(date: Date | null): string {

    if (!date) {
      return '';
    }

    const pad = (n: number): string => (n < 10 ? '0' + n : n.toString());
  
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // Months are zero-based
    const day = pad(date.getDate());
  
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  calculateStatus(task: Task | RawTask) {
    if (task.ended_at) {
      return 'finished';
    } else if (task.started_at && !task.ended_at) {
      return 'in progress'
    } else if (!task.started_at && !task.ended_at) {
      return 'new'
    } else {
      return 'error';
    }
  }
}
