import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChatgptService {
  private apiUrl = 'http://localhost:8000/api/chatgpt';
  private model = 'gpt-3.5-turbo';
  private temperature = 1;

  constructor() {}

  async motivational(message: string) {
    try {

      const messageBody = [
          {
            role: 'system',
            content:
              'You are a motivating assistant that aims to boost my moral',
          },
          {
            role: 'user',
            content: message,
          },
        ];

      const response = await this.sendMessage(messageBody);

      return response;

    } catch (error:any) {
      console.error(error);
      return 'An error occurred while processing your request. Please try again later.';
    }
  }

  async functional(message: string) {
    try {

      const messageBody = [
          {
            role: 'system',
            content:
              'You are an assistant with hands-on experience in a lot of tasks and you want to help me to accomplish my next task',
          },
          {
            role: 'user',
            content: message,
          },
        ];

      const response = await this.sendMessage(messageBody);

      return response;
      
    } catch (error) {
      console.error(error);
      return 'An error occurred while processing your request. Please try again later.';
    }
  }

  private async sendMessage(messageList: any) {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: messageList,
          temperature: this.temperature,
        }),
      });

      const data = await response.json();

      console.log("chatGPT response: ", data);

      return data.response;
    } catch (error:any) {
      console.error(error);
      return error.message;
    }
  }
}
