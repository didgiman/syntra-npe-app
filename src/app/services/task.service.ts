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
    const response = await fetch(this.apiUrl + '/tasks?userId=1'); // This should be replaced by /usertasks/:userId
    const data = await response.json();
    console.log(data);
    if (data) {
      this.tasks.set(data);
    }
  }

  async saveTask(task: Task) {
    if (task.id) {
      return this.editTask(task);
    } else {
      return this.addTask(task);  
    }
  }

  async addTask(task: Task) {
    const response = await fetch(this.apiUrl + '/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    });
    const data = await response.json();
    if (data) {
      this.loadTasks(); // Improved by adding the new task to the list instead of reloading all tasks
      //this.tasks.update(tasks => [...tasks, data]); // TO DO: this should be set to the task as it is returned from the API
      return true;
    }
    return false;
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
      this.tasks.update(tasks => tasks.map(t => t.id === task.id ? task : t));
      return true;
    }
    return false;
  }

  async deleteTask(taskId: number) {
    const response = await fetch(this.apiUrl + '/tasks/' + taskId, {
      method: 'DELETE'
    });
    const data = await response.json();
    if (data) {
      //this.loadTasks(); // Improved by removing the task from the list instead of reloading all tasks
      this.tasks.update(tasks => tasks.filter(t => t.id !== taskId));
      return true;
    }
    return false;
  }
}
