import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalService } from '../modal.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {
  public isAuthed: boolean;

  constructor( private authService: AuthService, private modalService: ModalService){
    this.authService.authChange
      .subscribe((val) => {
        this.isAuthed = val;
        console.log(this.isAuthed);
      })
  };

  ngOnInit(): void {
    
  }

  logout(){
    this.authService.logOut()
      .then((response) => {
        console.log(response);
        return false;
      })
      .catch((error) => {
        console.log(error);
        return false;
      })
  }

  login(form){
    let email = form[0].value;
    let password = form[1].value;

    this.authService.login(email, password)
      .then((response) => {
        console.log(response);
        this.closeModal(`login-modal`);
        return false;
      })
      .catch((error) => {
        console.log(error);
        return false;
      })
  }

  signup(form){
    //signup function
    console.log(form);
    return false;
  }

  openModal(id: string){
    this.modalService.open(id);
  }
  closeModal(id: string){
    this.modalService.close(id);
  }
}
