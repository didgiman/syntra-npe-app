import { Injectable, signal } from '@angular/core';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  tasks = signal<Task[]>([]);

  constructor() { }

  async loadTasks() {
    const response = await fetch(this.apiUrl + '/usertasks/1'); // This should be replaced by /usertasks/:userId
    const data = await response.json();
    console.log(data);
    if (data) {
      this.tasks.set(data.tasks);
      return {
        success: data.success,
        message: data.message,
      }
    }
    return {
      success: false,
      message: "Tasks could not be loaded. Please refresh page to try again.",
    }
  }

  async saveTask(task: Task) {
    try {
      if (task.id) {
        return this.editTask(task);
      } else {
        return this.addTask(task);  
      }
    } catch(e:any) {
      return {
        success: false,
        message: e.message,
      }
    }
  }

  async addTask(task: Task) {
    try {
      const response = await fetch(this.apiUrl + '/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
      });

console.log("POST TASK RESPONSE: ", response);

      const data = await response.json();

      console.log("POST TASK DATA: ", data);

      if (data) {
        if (data.success) {
          // this.loadTasks(); // Improved by adding the new task to the list instead of reloading all tasks
          this.tasks.update(tasks => [...tasks, data.task]); // TO DO: this should be set to the task as it is returned from the API
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

  async editTask(task: Task) {
    const response = await fetch(this.apiUrl + '/tasks/' + task.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    });
    const data = await response.json();
    if (data) {
      //this.loadTasks(); // Improved by updating the task in the list instead of reloading all tasks
      // this.tasks.update(tasks => tasks.map(t => t.id === task.id ? task : t));
      if (data.success) {
        this.tasks.update(tasks => tasks.map(t => t.id === task.id ? data.task : t));
        // return true;
      }
      return {
        success: data.success,
        message: data.message,
      }
    }
    
    return {
      success: false,
      message: "Task could not be updated. Please try again later.",
    }
  }

  async deleteTask(taskId: number) {
    const response = await fetch(this.apiUrl + '/tasks/' + taskId, {
      method: 'DELETE'
    });
    const data = await response.json();
    if (data) {
      //this.loadTasks(); // Improved by removing the task from the list instead of reloading all tasks
      if (data.success) {
        this.tasks.update(tasks => tasks.filter(t => t.id !== taskId));
        // return true;
      }
      return {
        success: data.success,
        message: data.message,
      }
    }
    return {
      success: false,
      message: "Task could not be deleted. Please try again later.",
    }
  }
}
