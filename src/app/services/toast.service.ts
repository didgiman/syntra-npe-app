import { Injectable } from '@angular/core';
import Toastify from 'toastify-js';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  show(message: string, type: string = 'default') {

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
      className: "rounded",
      style: style, // Custom style as calculated above
      stopOnFocus: true, // Prevents dismissing of toast on hover
    }).showToast();
  }
}
