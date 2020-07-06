import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../auth.service';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private authService: AuthService, private modalService: ModalService) {}

  ngOnInit(): void {
    
  }

  async openModal(id: string){
    try {
      console.log(await this.test());
    } catch (error) {
      console.log(error);
    }

    this.modalService.open(id);
    return false;
  }

  createTransaction(form){
    console.log(form);

    for(let i = 0; i < 10; i++){
      if(form[i].value){
        console.log(form[i].value);
      }
    }

    this.modalService.close('transaction-modal');
  }

  async test(){
    try {
      return await this.authService.test();
    } catch (error) {
      return error;
    }
  }
}
