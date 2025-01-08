import { Injectable, signal } from '@angular/core';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apipUrl = 'http://127.0.0.1:8000/api/tasks';
  tasks = signal<Task[]>([]);

  constructor() { }

  async loadTasks() {
    const response = await fetch(this.apipUrl);
    const data = await response.json();
    if (data) {
      this.tasks.set(data);
    }
  }
}
