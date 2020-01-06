import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ModalService {

  constructor() { }

  public show(modal): void {
    modal.visible = true;
    setTimeout(() => {
      modal.visibleAnimate = true;
    }, 100);
  }

  public hide(modal): void {
    modal.visibleAnimate = false;
    setTimeout(() => {
      modal.visible = false;
    }, 300);
  }
}
