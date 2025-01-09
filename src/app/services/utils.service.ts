import { Injectable } from '@angular/core';
import Toastify from 'toastify-js';

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
}
