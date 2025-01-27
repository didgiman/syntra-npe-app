import { Component, inject, input, output, signal } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { TaskService } from '../../services/task.service';
import { ChatgptService } from '../../services/chatgpt.service';
import { Task } from '../../models/task';

import { FormsModule } from '@angular/forms';

import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-task-view',
  imports: [TooltipModule, ButtonModule, FormsModule, ToggleSwitchModule],
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.css',
})
export class TaskViewComponent {
  task_id = input<number>(0);
  close = output<string>();

  utils = inject(UtilsService);
  taskService = inject(TaskService);
  chatGpt = inject(ChatgptService);
  userService = inject(UserService);
  user = this.userService.user;
  
  motivationMessage = signal<string>('Loading...');

  task: Task = {
    id: 0,
    created_at: null,
    user_id: 0,
    title: '',
    feeling: '',
    estimate: 0,
    deadline: null,
    started_at: null,
    ended_at: null
  }

  ngOnInit() {
    if (this.task_id() > 0) {
      const foundTask = this.taskService.tasks().find(t => t.id === +this.task_id()); // For some reason this only works when placing the + in front of this.task_id()
      if (foundTask) {
        this.task = { ...foundTask };

        if (this.user().settings.chatgpt.motivational) {
          this.setMotivationalMessage();
        }
      }
    }
  }

  async onTaskAction(action: string) {
    switch (action) {
      case ('start'):
        this.task.started_at = new Date();
        break;
      case ('stop'):
        this.task.started_at = null;
        break;
      case ('finish'):
        this.task.ended_at = new Date();
        break;
      case ('restore'):
        this.task.started_at = null;
        this.task.ended_at = null;
        break;
      default:
        this.utils.toast(action + ": Task could not be updated. Please try again.", "error");
        return;
    }
    const saveResponse = await this.taskService.saveTask(this.task);

    if (saveResponse) {
      this.utils.toast(saveResponse.message, saveResponse.success ? 'success' : 'error');

      if (action === 'finish' && this.task.recurring !== '') {
        // When a recurring task is finished, a new task will be created with the same properties but a new deadline

        const recurringTask = { ...this.task, id: 0, status: 'new', started_at: null, ended_at: null };

        if (recurringTask.deadline === null) {
          // This should never happen, because in the task form, deadline is required for recurring tasks. But anyway, just in case
          recurringTask.deadline = new Date();
        } else if (recurringTask.deadline.getTime() < new Date().getTime()) {
          // If deadline is the past, set it to the current date (but keep the time)
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          recurringTask.deadline.setFullYear(today.getFullYear());
          recurringTask.deadline.setMonth(today.getMonth());
          recurringTask.deadline.setDate(today.getDate());
        }

        // Now calculate new deadline
        switch (this.task.recurring) {
          case 'daily':
            recurringTask.deadline.setDate(recurringTask.deadline.getDate() + 1);
            break;
          case 'weekly':
            recurringTask.deadline.setDate(recurringTask.deadline.getDate() + 7);
            break;
          case '2-weekly':
            recurringTask.deadline.setDate(recurringTask.deadline.getDate() + 14);
            break;
          case 'monthly':
            recurringTask.deadline.setMonth(recurringTask.deadline.getMonth() + 1);
            break;
        }

        // Create new task
        const createResponse = await this.taskService.saveTask(recurringTask);
        if (saveResponse) {
          this.utils.toast(saveResponse.success ? 'Recurring task created' : 'Recurring task could not be created', saveResponse.success ? 'success' : 'error');
        } else {
          this.utils.toast(action + ": New recurring task could not be created. Please create it manually.", "error");
        }
      }

      if (saveResponse.success) {
        this.close.emit(action);
      }
    } else {
      this.utils.toast(action + ": Task could not be updated. Please try again.", "error");
    }
  }
  
  onCancel() {
    this.close.emit('cancel');
  }

  // ChatGPT stuff
  giveTips:boolean = false;
  chatGptTips = signal<string>('');
  onTipsChange() { // Happens when the "give me tips" switch is toggled
    this.chatGptTips.set('');
    if (this.giveTips) {
      this.chatGptTips.set('Loading...');
      const chatGptMessage = `
        I need specific tips on how to complete the following task: \n\n<<user_input>>${this.task.title}<</user_input>>
        \nGive the response in the same language as the task description above, which is either Dutch or English.
        \nLimit the response to 150 words.
      `;

      this.chatGpt.functional(chatGptMessage).then().then((response) => {

        const lines = response.split('\n').filter((line: string) => line.trim() !== ''); // Split and remove empty lines
        const html = `
          ${lines.map((line: string) => `<p>${line}</p>`).join('')}
        `;

        this.chatGptTips.set(html);
      });
    }
  }

  setMotivationalMessage() {
    this.motivationMessage.set('Loading...');
    const chatGptMessage = `
      I need specific motivation for the following task: \n\n<<user_input>>${this.task.title}<</user_input>>
      \nOn a scale of 1 to 5, how motivated am I to complete this task? ${this.task.feeling}
      ${ this.task.deadline ? '\nI need to finish this task by ' + this.utils.formatDateForScreen(this.task.deadline) : '' }
      \nGive the response in the same language as the task description above, which is either Dutch or English.
      \n${ this.task.status === 'in progress' ? 'I am currently working on this task.' : 'I have not started working on this task yet and need the final motivation.' }
      Please give me a short motivational message of 25 words or less for this task.
    `;
    
    this.chatGpt.motivational(chatGptMessage).then().then((response) => {
      this.motivationMessage.set(response);
    });
  }
  
}
