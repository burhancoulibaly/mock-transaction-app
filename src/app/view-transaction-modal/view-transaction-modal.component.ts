import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TransactionView } from '../transaction-view';

@Component({
  selector: 'view-transaction-modal',
  templateUrl: './view-transaction-modal.component.html',
  styleUrls: ['./view-transaction-modal.component.css']
})
export class ViewTransactionModalComponent implements OnInit {
  @Input() transactionView: TransactionView;

  constructor() { }

  ngOnInit(): void {
  }

  
}
