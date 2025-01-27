import { Component, inject, input, output, signal } from '@angular/core';
import { Task } from '../../models/task';
import { UtilsService } from '../../services/utils.service';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { TaskService } from '../../services/task.service';

import { ConfirmationService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { SliderModule } from 'primeng/slider';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';

import { SelectButtonModule } from 'primeng/selectbutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-task-form',
  imports: [FormsModule, ConfirmPopupModule, NgClass, InputTextModule, DatePickerModule, SliderModule, RadioButtonModule, ButtonModule, SelectButtonModule, ToggleSwitchModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
  providers: [ConfirmationService]
})
export class TaskFormComponent {
  task_id = input<number>(0);
  
  close = output<string>();

  taskService = inject(TaskService);
  utils = inject(UtilsService);
  confirmationService = inject(ConfirmationService);
  userService = inject(UserService);
  
  loading = signal<boolean>(false);

  now = new Date();

  estimateDisplay = signal<string>('1:00');
  formattedDeadline = '';
  deadlineRequired = signal<boolean>(false);
  deadlineShowTime = false;

  task: Task = {
    id: 0,
    created_at: null,
    user_id: this.userService.user().id,
    title: '',
    feeling: 3,
    estimate: 1,
    deadline: null,
    started_at: null,
    ended_at: null,
    recurring: ''
  }

  ngOnInit() {
    if (this.task_id() > 0) {
      // Find the task with the given id
      const foundTask = this.taskService.tasks().find(t => t.id === +this.task_id()); // For some reason this only works when placing the + in front of this.task_id()
      if (foundTask) {
        this.task = { ...foundTask };
        
        this.onEstimateChange();

        this.formattedDeadline = this.utils.formatDateForInput(this.task.deadline!);
        if (!this.task.recurring) {
          this.task.recurring = ''; // Initialize recurring to an empty string
        }
        this.deadlineRequired.set(this.task.recurring !== ''); // For recurring tasks, deadline is required

        if (this.task.deadline && !(this.utils.isTimeExactly(this.task.deadline, 23, 59, 59))) {
          this.deadlineShowTime = true;
        }
      }
    }

    this.task.feeling = this.task.feeling.toString(); // Convert feeling to string for radio button
  }

  async onTaskSave() {
    this.loading.set(true);

    const saveResponse = await this.taskService.saveTask(this.task);

    if (saveResponse) {
      this.utils.toast(saveResponse.message, saveResponse.success ? 'success' : 'error');
      if (saveResponse.success) {
        this.close.emit(this.task_id() === 0 ? 'create' : 'edit');
      }
    } else {
      this.utils.toast("Task could not be saved. Please try again.", "error");
    }

    this.loading.set(false);
  }
  
  // Show confimation message before actually deleting a task
  confirmDelete(event: Event) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Do you want to delete this task?',
        icon: 'pi pi-info-circle',
        rejectButtonProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptButtonProps: {
            label: 'Delete',
            severity: 'danger'
        },
        accept: () => {
          this.onTaskDelete();
        },
        reject: () => {
            // Do nothing
        }
    });
  }
  async onTaskDelete() {
    const deleteResponse = await this.taskService.deleteTask(this.task.id);

    if (deleteResponse) {
      this.utils.toast(deleteResponse.message, deleteResponse.success ? 'success' : 'error');
      if (deleteResponse.success) {
        this.close.emit('delete');
      }
    } else {
      this.utils.toast("Task could not be deleted. Please try again.", "error");
    }
  }
  onCancel() {
    this.close.emit('cancel');
  }

  // non-linear steps for estimate
  get estimateStepSize(): number {
    if (this.task.estimate < 2) {
      return 0.25;
    } else if (this.task.estimate < 5) {
      return 0.5;
    } else {
      return 1;
    }
  }

  onEstimateChange() {

    // Don't let estimate go below 0.25
    // I did it this way, because when setting the min value of the estimate input to 0.25, the step size gets messed up
    if (this.task.estimate < 0.25) {
      this.task.estimate = 0.25;
    }

     this.estimateDisplay.set(this.utils.formatHoursToReadableTime(this.task.estimate));
  }

  // Recurring tasks
  recurringOptions: any[] = [
    { label: 'No', value: '' },
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: '2-Weekly', value: '2-weekly' },
    { label: 'Monthly', value: 'monthly' }
  ];

  onRecurringChange(event: any) {
    // this.task.recurring = event.value; 
    if (event.value === '') {
      this.deadlineRequired.set(false);
    } else {
      this.deadlineRequired.set(true);
    }
  }

  onDeadlineBlur() {
    if (this.task.deadline && !this.deadlineShowTime) {
      // Set deadline to the end of the selected day
      this.task.deadline.setHours(23);
      this.task.deadline.setMinutes(59);
      this.task.deadline.setSeconds(59);
    }
  }
  onDeadlineToggleTime(event: any) {
    this.deadlineShowTime = event.checked;
    this.onDeadlineBlur(); // Recalculate deadline
  }

}
