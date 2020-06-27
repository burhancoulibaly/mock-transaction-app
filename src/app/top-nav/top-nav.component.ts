import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {
  @Output() open: EventEmitter<any> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();
  isAuthed: Boolean = false;

  ngOnInit(): void {
  }

  logOut(){
    console.log("logged out");
    return false;
  }

  openToggle(id: string) {
    this.open.emit(id);
    return false;
  }
  closeToggle(id: string) {
    this.close.emit(id);
    return false;
  }
}
