import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  @Output() open: EventEmitter<any> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();

  constructor() { }

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
