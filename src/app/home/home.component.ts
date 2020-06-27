import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Output() open: EventEmitter<any> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
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
