import { Component, inject, input, output, signal } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { TaskService } from '../../services/task.service';
import { ChatgptService } from '../../services/chatgpt.service';
import { Task } from '../../models/task';

import { FormsModule } from '@angular/forms';

import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

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

  motivationMessage = 'Loading...';
  giveTips:boolean = false;
  chatGptTips = signal<string>('');
  onTipsChange() {
    this.chatGptTips.set('');
    if (this.giveTips) {
      this.chatGptTips.set('Loading...');
      const chatGptMessage = `
        I need specific tips on how to complete the following task:
        "${this.task.title}"
        Give the response in the same language as the task description above, which is either Dutch or English.
        Limit the response to 100 words.
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

  ngOnInit() {
    if (this.task_id() > 0) {
      const foundTask = this.taskService.tasks().find(t => t.id === +this.task_id()); // For some reason this only works when placing the + in front of this.task_id()
      if (foundTask) {
        this.task = { ...foundTask };

        this.motivationMessage = 'Loading...';
        const chatGptMessage = `
          I need specific motivation for the following task:
          "${this.task.title}"
          I rate this task a feeling of ${this.task.feeling} out of 5.
          ${ this.task.deadline ? 'I need to finish this task by ' + this.utils.formatDateForInput(this.task.deadline) : '' }
          Give the response in the same language as the task description above. The language is either Dutch or English (default to English if you are not sure if the task is in Dutch)
          Please give me a short motivational message of 15 words or less for this task.
        `;
        
        this.chatGpt.motivational(chatGptMessage).then().then((response) => {
          this.motivationMessage = response;
        });
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
  
}
