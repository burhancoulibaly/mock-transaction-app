import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalService } from '../modal.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {
  @Output() open: EventEmitter<any> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();
  
  public isAuthed: boolean;

  constructor( private authService: AuthService){
    this.authService.authChange
      .subscribe((val) => {
        this.isAuthed = val;
        console.log(this.isAuthed);
      })
  };

  ngOnInit(): void {
    
  }

  logOut(){
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

  logIn(){
    this.authService.login("","")
      .then((response) => {
        console.log(response);
        return false;
      })
      .catch((error) => {
        console.log(error);
        return false;
      })
  }

  openToggle(id: string) {
    this.logIn();
    this.open.emit(id);
    return false;
  }
  closeToggle(id: string) {
    this.close.emit(id);
    return false;
  }
}
