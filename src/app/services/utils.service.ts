import { Injectable } from '@angular/core';
import Toastify from 'toastify-js';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  formatHoursToReadableTime(hours: number): string {
    // Extract the integer part as hours
    const wholeHours = Math.floor(hours);

    // Extract the decimal part and convert it to minutes
    const decimalPart = hours - wholeHours;
    const minutes = Math.round(decimalPart * 60);

    // Format the result as "H:MM"
    return `${wholeHours}:${minutes.toString().padStart(2, '0')}`;
}

  // Show a toast message
  toast(message: string, type: string = 'default') {
  
      let style = { };
  
      switch (type) {
        case 'error':
          style = {
            background: "linear-gradient(to right, #FF0000, #FF6347)",
            color: "white"
          };
          break;
        case 'success':
          style = {
            background: "linear-gradient(to right, #4cb43a, #45fc68)",
            color: "black"
          };
          break;
        case 'warning':
          style = {
            background: "linear-gradient(to right, #FFA500, #FFD700)",
            color: "black"
          };
          break;
        case 'info':
          style = {
            background: "linear-gradient(to right, #FFFFFF, #00FFFF)",
            color: "black"
          };
          break;
        default:
          style = {
            background: "linear-gradient(to right, #FFFFFF, #FFFF00)",
            color: "black"
          };
          break;
      }
  
      Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        className: "rounded shadow-xl !text-blue", // Add any Tailwind css class here (hmmmm, doesn't seem to be working. Why?)
        style: style, // Custom style as calculated above
        stopOnFocus: true, // Prevents dismissing of toast on hover
      }).showToast();
    }

    // get the emoji to show for a specific feeling
    getFeelingEmoji(feeling: number) {
      switch (feeling) {
        case (1):
          return '😭';
        case (2):
          return '😞';
        case (3):
          return '😐';
        case (4):
          return '😊';
        case (5):
          return '🤩';
        default:
          return '';
      }
    }

    formatDateForScreen(date: Date | null) {
      if (!date) {
        return '';
      }
      return date.toLocaleString('nl-BE', {dateStyle: 'medium', timeStyle: 'short'});
    }
    formatDateForInput(date: Date | null): string {
      if (!date) return '';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
}
