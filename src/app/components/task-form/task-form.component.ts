import { Component, inject, output } from '@angular/core';
import { Task } from '../../models/task';
import { ToastService } from '../../services/toast.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  imports: [FormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent {
  toast = inject(ToastService);

  task: Task = {
    id: 0,
    created_at: '',
    user_id: 1,
    title: 'New task',
    feeling: 3,
    estimate: 1,
    deadline: '',
    started_at: '',
    ended_at: ''
  }
  
  save = output<boolean>();

  onTaskSaved() {
    this.save.emit(true);
  }
  onCancel() {
    this.save.emit(false);
  }
}
