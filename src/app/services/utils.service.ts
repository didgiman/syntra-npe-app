import { Injectable } from '@angular/core';
import Toastify from 'toastify-js';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  readableHours(hours: number): string {

    if (typeof hours !== 'number' || isNaN(hours) || hours < 0) {
      return 'Invalid input';
    }

    const totalMinutes = Math.round(hours * 60);
    const fullHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    let readableText = "";

    if (fullHours > 0) {
        readableText += `${fullHours} hour${fullHours > 1 ? "s" : ""}`;
    }

    if (remainingMinutes > 0) {
        if (remainingMinutes === 30) {
            readableText += fullHours > 0 ? " and a half" : "Half an hour";
        } else {
            readableText += ` ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`;
        }
    }

    if (readableText === "") {
        readableText = "0 hours";
    }

    return readableText;
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
        className: "rounded", // Add any Tailwind css class here (hmmmm, doesn't seem to be working. Why?)
        style: style, // Custom style as calculated above
        stopOnFocus: true, // Prevents dismissing of toast on hover
      }).showToast();
    }
}
