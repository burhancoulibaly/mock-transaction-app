import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalsObject: Object = {};

  constructor() { }

  add(modal: any){
    //adds modal to hashtable
    this.modalsObject[modal.id] = modal;
  }

  remove(id: string){
    //removes modal
    delete this.modalsObject[id];
  }

  open(id: string){
    const modal = this.modalsObject[id];
    modal.open();
  }

  close(id: string){
    const modal = this.modalsObject[id];
    modal.close();
  }
}
